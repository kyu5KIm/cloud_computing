import {catalog} from '../content/catalog.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {examQuestions,publicExam,examModel} from '../content/exams.mjs';
const ids=new Set(catalog.sources.map(s=>s.id));
assert.equal(ids.size,catalog.sources.length,'중복 출처 ID');
assert.equal(catalog.courses.flatMap(c=>c.chapters).filter(ch=>ch.materials?.length).length,18);
assert.equal(catalog.courses.flatMap(c=>c.chapters).flatMap(ch=>ch.materials??[]).length,76);
const evidence=catalog.courses.flatMap(c=>c.chapters).flatMap(ch=>ch.studyEvidence??[]);
assert.equal(evidence.length,300);
assert.equal(evidence.filter(r=>r.course==='C07').length,53);
assert.equal(examQuestions.length,21);
assert.equal(new Set(examQuestions.map(q=>q.chapterId)).size,21);
assert.equal(examModel.id,'gpt-6.1-sol');assert.equal(examModel.effort,'low');
for(const q of examQuestions){assert(q.sourceIds.length&&q.sourceIds.every(id=>ids.has(id)));assert(q.evidence.length);assert(q.points.length>=3&&q.modelAnswer);assert.equal(q.rubric.reduce((n,r)=>n+r.max,0),10);}
assert(publicExam().questions.every(q=>!q.modelAnswer&&!q.points&&!q.evidence));
assert.equal(evidence.filter(r=>r.course==='C01').length,32);
assert.equal(evidence.filter(r=>r.course==='C02').length,31);
assert.equal(evidence.filter(r=>r.course==='C03').length,36);
assert.equal(evidence.filter(r=>r.course==='C04').length,48);
assert.equal(evidence.filter(r=>r.course==='C05').length,46);
assert.equal(evidence.filter(r=>r.course==='C06').length,54);
assert.equal(new Set(evidence.map(r=>`${r.course}/${r.chapter}/${r.ex}`)).size,evidence.length,'중복 수업 확인 기록');
for(const r of evidence){
  assert(Number.isInteger(r.chapter)&&r.chapter>=1&&r.chapter<=3);
  assert(Number.isInteger(r.ex)&&r.ex>=1);
  if(r.kind==='lab'&&r.status!=='lab-completed-verified')assert(r.statusLabel.includes('미완료'));
}
for(const r of evidence){assert(r.statusLabel&&r.takeaway);for(const id of r.sourceIds)assert(ids.has(id));if(r.status.includes('lab-blocked'))assert(r.statusLabel.includes('미완료'));}
assert.equal(catalog.courses.length,7);
const chapters=catalog.courses.flatMap(c=>c.chapters);
assert.equal(chapters.length,21);
assert(chapters.every(ch=>ch.studyGuide&&ch.contentStatus==='expanded-lesson'));
assert.equal(chapters.flatMap(ch=>ch.lesson.questions).length,63);
assert.equal(new Set(chapters.flatMap(ch=>ch.lesson.questions.map(q=>q.id))).size,63);
for(const chapter of chapters){
  assert(chapter.englishTitle&&chapter.claims.length);
  for(const id of chapter.sourceIds)assert(ids.has(id));
  for(const claim of chapter.claims){assert.equal(claim.reviewStatus,'verified');assert(claim.supportLocator);for(const id of claim.sourceIds)assert(ids.has(id));}
  if(chapter.lesson){
    for(const concept of chapter.lesson.concepts){assert(concept.locator);for(const id of concept.sourceIds)assert(ids.has(id));}
    for(const question of chapter.lesson.questions){assert.equal(question.rubric.reduce((n,r)=>n+r.max,0),10);assert(question.sourceLocator);assert(question.type.includes('자체 작성'));for(const id of question.sourceIds)assert(ids.has(id));}
  }else assert.equal(chapter.contentStatus,chapter.materials?.length?'materials-verified':'outline-only');
  for(const m of [...(chapter.materials??[]),...(chapter.supplements??[])]){
    assert(m.locator&&m.contentType);assert.equal(new URL(m.url).protocol,'https:');
    for(const id of m.sourceIds)assert(ids.has(id));
  }
}
for(const file of ['apps/web/index.html','apps/web/style.css','apps/web/app.mjs','apps/web/exam-ui.mjs','apps/web/lesson-ui.mjs']){
  const text=await readFile(new URL('../'+file,import.meta.url),'utf8');assert(!text.includes('\ufffd'));assert(text.length>0);
}
console.log('검증 완료: 7개 강의, 21개 확장 학습안, 서술형 연습 63문제, 시험 21문제, 출처 연결과 10점 루브릭.');
