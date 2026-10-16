import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog,findChapter} from '../content/catalog.mjs';
import {attachExpandedLessons,lessonVersion} from '../content/expanded-lessons.mjs';
import {guideHTML,practicePrintHTML} from '../apps/web/lesson-ui.mjs';
import {createApp} from '../apps/local-server/server.mjs';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const chapters=catalog.courses.flatMap(course=>course.chapters);
const esc=text=>String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const helpers={esc,refs:(ids,locator)=>`<small>${ids.map(esc).join(' ')} ${esc(locator)}</small>`,badge:text=>`<span>${esc(text)}</span>`,button:label=>`<button>${esc(label)}</button>`,table:data=>`<table>${[data.headers,...data.rows].map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</table>`};

test('all 21 guides contain connected instruction, worked cases, provenance and 63 distinct exercises',()=>{
 const sourceMap=new Map(catalog.sources.map(source=>[source.id,source]));
 assert.equal(chapters.length,21);
 const questions=chapters.flatMap(chapter=>chapter.lesson.questions);
 assert.equal(questions.length,63);assert.equal(new Set(questions.map(q=>q.id)).size,63);
 assert.deepEqual(findChapter('C01-1').lesson.questions.map(q=>q.id),['Q-scale','Q-models','Q-virtualization']);
 for(const chapter of chapters){
  const g=chapter.studyGuide;
  assert.equal(g.version,lessonVersion);assert.equal(g.objectives.length,3);assert(g.prerequisites.length);
  assert(g.concepts.length>=5);assert(g.flow.steps.length>=5);assert(g.recap.length>=3);assert(g.misconceptions.length>=2);
  assert(g.comparisons.every(c=>c.rows.length>=3&&c.rows.every(row=>row.length===c.headers.length)));
  assert(['situation','requirements','choice','process','tradeoff'].every(key=>g.scenario[key]));
  for(const block of [g.why,...g.concepts,g.flow,...g.comparisons,g.scenario,...g.misconceptions,...chapter.lesson.questions]){
   assert(block.claimId&&block.locator&&block.sourceIds.length);
   assert(block.sourceIds.every(id=>sourceMap.get(id)?.verificationStatus==='verified'&&sourceMap.get(id)?.chapterId===chapter.id));
   assert(chapter.claims.some(claim=>claim.id===block.claimId&&claim.supportLocator===block.locator));
  }
  for(const q of chapter.lesson.questions){
   assert.equal(q.points.length,4);assert.equal(q.rubric.reduce((sum,r)=>sum+r.max,0),10);
   assert(q.objective&&q.expectedLength&&q.acceptedAlternatives&&q.modelAnswer);
   assert(q.conceptIds.length&&q.conceptIds.every(id=>g.concepts.some(c=>c.id===id)));
  }
 }
});

test('unverified, blocked or missing lesson evidence fails closed',()=>{
 const inputs=()=>structuredClone(catalog.courses);
 const cases=[{status:'blocked-loading-error'}, {status:'solution-reviewed-lab-skipped'}, {ex:999}];
 for(const changes of cases){const courses=inputs();Object.assign(courses[0].chapters[0].studyEvidence.find(r=>r.ex===1),changes);assert.throws(()=>attachExpandedLessons(courses,catalog.sources),/미확인 근거/);}
 const sources=structuredClone(catalog.sources);sources.find(s=>s.id==='DC-run-C01-1-ex1').verificationStatus='unverified';
 assert.throws(()=>attachExpandedLessons(inputs(),sources),/미확인 근거/);
});

test('screen and print share concepts, case, correction and glossary; escape authored content',()=>{
 for(const chapter of chapters){
  const screen=guideHTML(chapter,helpers);const print=guideHTML(chapter,helpers,true)+practicePrintHTML(chapter,helpers);
  for(const text of [chapter.studyGuide.flow.title,chapter.studyGuide.scenario.choice,chapter.studyGuide.misconceptions[0].right,...chapter.studyGuide.recap]){assert(screen.includes(esc(text)));assert(print.includes(esc(text)));}
  for(const q of chapter.lesson.questions){assert(print.includes(esc(q.modelAnswer)));assert(!screen.includes(esc(q.modelAnswer)));}
  assert(screen.includes('<button>'));assert(!print.includes('<button>'));
  for(const note of chapter.supplements??[])assert(screen.includes(esc(note.text))&&print.includes(esc(note.text)));
 }
 const hostile=structuredClone(chapters[0]);hostile.studyGuide.scenario.choice='<img src=x onerror=alert(1)>';
 assert(!guideHTML(hostile,helpers).includes('<img'));assert(guideHTML(hostile,helpers).includes('&lt;img'));
});

test('new practice drafts persist across restart alongside legacy drafts without inference',async t=>{
 const stateDir=await mkdtemp(path.join(tmpdir(),'cloud-expanded-'));let calls=0;
 const adapter={status:()=>({mode:'mock'}),run:async()=>{calls++;throw Error('unexpected inference');}};
 const app=await createApp({stateDir,adapter});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await app.close();await rm(stateDir,{recursive:true,force:true});});
 const origin='http://127.0.0.1:'+app.server.address().port;
 const session=await fetch(origin+'/api/session');const cookie=session.headers.get('set-cookie').split(';')[0];const {csrf}=await session.json();
 const state=await (await fetch(origin+'/api/state',{headers:{cookie}})).json();
 state.drafts['Q-scale']='기존 답안';state.drafts['Q-C07-3-3']='여유 메모리가 기준 아래로 내려가면 알림을 검토한다.';state.checks['Q-C07-3-3']=[true,false,true,false];
 const response=await fetch(origin+'/api/state',{method:'PUT',headers:{cookie,origin,'content-type':'application/json','x-csrf-token':csrf},body:JSON.stringify(state)});
 assert.equal(response.status,200);assert.equal(calls,0);
 const restored=await createApp({stateDir,adapter});t.after(()=>restored.close());
 assert.equal(restored.getState().drafts['Q-C07-3-3'],state.drafts['Q-C07-3-3']);assert.equal(restored.getState().drafts['Q-scale'],'기존 답안');
 assert.equal((await fetch(origin+'/lesson-ui.mjs')).status,200);assert.equal((await fetch(origin+'/content/lessons/c07.mjs')).status,404);
});
