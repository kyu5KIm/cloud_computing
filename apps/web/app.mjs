import {createStudyChat} from './study-chat-ui.mjs';
let chatPanel=null;
import {examHTML} from './exam-ui.mjs';
import {guideHTML,practicePrintHTML} from './lesson-ui.mjs';
const root=document.querySelector('#app');
let examData=null,examAttempt=null,examReview=null,examBusy=false,examError='',examRequest=null;
const examsView=()=>examHTML({data:examData,state,attempt:examAttempt,review:examReview,busy:examBusy,error:examError,esc,refs,button});
async function loadExams(){examData=await api('/api/exams');}
async function showAttempt(id){examAttempt=await api('/api/exams/'+id);examReview=null;await loadExams();render();}
async function pollExam(){
 const id=examAttempt?.id;
 while(examAttempt?.id===id&&examAttempt.status==='grading'){
  await new Promise(resolve=>setTimeout(resolve,1200));
  try{examAttempt=await api('/api/exams/'+id);if(view.type==='exams')render();}catch(e){examError=e.message;break;}
 }
 await loadExams();if(view.type==='exams')render();
}
async function submitExam(){
 if(examBusy)return;examBusy=true;examError='';
 try{
  await save();if(pendingSave||storageWarning)throw Error('초안 저장을 확인한 뒤 제출하세요. 답안 백업을 먼저 내보낼 수 있습니다.');
  const signature=JSON.stringify([examData.exam.version,state.examDrafts]);
  if(examRequest?.signature!==signature)examRequest={signature,id:crypto.randomUUID()};
  examAttempt=await api('/api/exams/submit',{method:'POST',data:{version:examData.exam.version,requestId:examRequest.id,answers:state.examDrafts}});
  examReview=null;await loadExams();
 }catch(e){examError=e.message;}finally{examBusy=false;render();}
 if(examAttempt?.status==='grading')await pollExam();
}
let catalog,state,csrf,ai,storageWarning=null;
let view={type:'home',courseId:'C01',chapterId:'C01-1',tab:'study',questionId:'Q-scale'},search='';
let pendingSave=false,saveTimer,savePromise=null,saveStatus='저장됨',currentJob=null,jobResult=null,requestKey=null;
const printed=new Set(),askDrafts={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=id=>document.getElementById(id);
const courses=()=>catalog.courses;
const allChapters=()=>courses().flatMap(c=>c.chapters);
const course=()=>courses().find(c=>c.id===view.courseId)??courses()[0];
const chapter=()=>allChapters().find(c=>c.id===view.chapterId)??courses()[0].chapters[0];
const question=()=>chapter().lesson?.questions.find(q=>q.id===view.questionId)??chapter().lesson?.questions[0];
const source=id=>catalog.sources.find(s=>s.id===id);
const progressLabels={new:'미시작',studying:'학습 중',review:'복습 필요',done:'학습 완료'};
const badge=(text,verified=false)=>`<span class="tag ${verified?'verified':''}">${esc(text)}</span>`;
const button=(label,action,extra='',primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}" ${extra}>${esc(label)}</button>`;
const lessonHelpers={esc,refs,table,badge,button};
async function api(url,{method='GET',data}={}){
  const res=await fetch(url,{method,headers:method==='GET'?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:data===undefined?undefined:JSON.stringify(data)});
  const result=await res.json();if(!res.ok)throw new Error(result.error??'요청을 처리하지 못했습니다.');return result;
}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.textContent='',6000);}
function refs(ids,locator=''){
  return `<div class="source-ref">${ids.map(id=>{const s=source(id);return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`;}).join(' · ')}${locator?' · '+esc(locator):''}</div>`;
}
function groupClass(c){return c.group.toLowerCase();}
function countDone(c){return c.chapters.filter(ch=>state.progress[ch.id]==='done').length;}
function sidebar(){return `<aside class="sidebar"><button class="brand" data-action="home"><span class="brand-icon">☁</span> CLOUD NOTES</button><p class="brand-sub">클라우드 컴퓨팅 · 서술형 학습실</p><nav aria-label="강의 탐색"><button class="nav home ${view.type==='home'?'active':''}" data-action="home"><span>▦</span> 학습 대시보드</button><div class="side-label">YOUR COURSES / 07</div>${courses().map(c=>`<button class="nav ${['course','chapter'].includes(view.type)&&view.courseId===c.id?'active':''}" data-action="course" data-id="${c.id}"><span class="nav-number">${c.id.slice(1)}</span><span>${esc(c.title)}</span></button>`).join('')}<div class="side-label">EXAMS / 시험</div><button class="nav ${view.type==='exams'?'active':''}" data-action="exams">✎ 서술형 시험</button><div class="side-label">STUDY TOOLS</div><button class="nav ${view.type==='sources'?'active':''}" data-action="sources">↗ 자료와 검증 범위</button><button class="nav ${view.type==='print'?'active':''}" data-action="print-view">▤ 인쇄용 학습 노트</button><button class="nav ${view.type==='connection'?'active':''}" data-action="connection">○ Codex 연결 상태</button></nav><div class="side-foot"><strong>이해하고, 써 보고, 보완하기</strong>개인 로컬 학습용 · 초기 개발 버전<br>DataCamp 공식 사이트와 연결된 별도 학습 도구입니다. DataCamp 제품이 아닙니다.</div></aside>`;}
function render(){
  const labels={home:'학습 대시보드',course:course().title,chapter:course().title+' / Chapter '+chapter().number,sources:'자료와 검증 범위',print:'인쇄용 학습 노트',connection:'Codex 연결 상태',exams:'서술형 시험'};
  root.innerHTML=`<div class="layout">${sidebar()}<div class="workspace"><header class="topbar"><div class="breadcrumb">학습실 &nbsp; / &nbsp; ${esc(labels[view.type])}</div><div class="top-actions"><span id="save-status" role="status">${esc(saveStatus)}</span><button class="btn small" data-action="connection"><span class="status-dot"></span>${ai.mode==='mock'?'모의 연동':'AI 연결 준비'}</button></div></header><main id="main" class="main" tabindex="-1">${body()}<footer class="view-foot">출처 확인 ${catalog.checkedAt} · ${esc(catalog.version)} · 학습용 예상문제는 자체 작성 자료입니다.</footer></main></div></div>`;
  if(byId('ask-text'))byId('ask-text').value=askDrafts[view.chapterId]??'';
  chatPanel?.updateContext();
}
function body(){return ({home:homeView,course:courseView,chapter:chapterView,sources:sourcesView,print:printView,connection:connectionView,exams:examsView}[view.type])();}
function homeView(){
  const done=allChapters().filter(ch=>state.progress[ch.id]==='done').length;
  const draftCount=Object.values(state.drafts).filter(v=>v.trim()).length;
  return `<section class="hero"><div><div class="eyebrow">CLOUD COMPUTING / OPEN-BOOK STUDY</div><h1>개념에서 답안까지,<br>나만의 클라우드 학습 노트.</h1><p>강의의 흐름을 이해하고, 내 언어로 설명해 보세요.<br>DataCamp 자료를 바탕으로 종이 오픈북 시험을 준비합니다.</p>${button('첫 챕터 학습하기 →','chapter','data-id="C01-1"',true)}</div><div class="hero-graphic" aria-hidden="true"><div class="orbit"></div><div class="cloud"></div><span class="cloud-label">LEARN · WRITE</span></div></section>
  <section class="stats" aria-label="학습 현황"><div class="stat"><span>시험범위 강의</span><strong>7 <small>courses</small></strong></div><div class="stat"><span>학습 완료 챕터</span><strong>${done} <small>/ 21</small></strong></div><div class="stat"><span>작성한 서술형 답안</span><strong>${draftCount} <small>answers</small></strong></div></section>
  <div class="section-heading"><div><h2>시험범위 학습하기</h2><p class="muted">21개 챕터의 개념·비교·사례와 서술형 연습을 공부하세요.</p></div><input class="search" id="search" aria-label="강의 검색" placeholder="강의 검색" value="${esc(search)}"></div><div class="courses" id="course-cards">${courseCards()}</div>
  <div class="notice info">21개 챕터에 학습 목표·개념·작동 흐름·비교표·사례·오답 보완을 추가했습니다. 챕터별 자체 작성 서술형 연습은 총 63문제입니다. 수업·문제를 직접 진행한 ${allChapters().reduce((n,ch)=>n+(ch.studyEvidence?.length??0),0)}개 항목의 확인 상태와 자체 작성 해설을 챕터에 제공합니다. 실제 콘솔 실습 미완료는 따로 표시하며 사용자 진도와 구분합니다. 별도 서술형 시험 메뉴에서 21개 챕터의 자체 작성 예상문제를 풀 수 있습니다.</div>`;
}
function courseCards(){const found=courses().filter(c=>(c.title+' '+c.englishTitle).toLowerCase().includes(search.toLowerCase()));return found.length?found.map(c=>`<button class="course-card" data-action="course" data-id="${c.id}"><div class="course-meta"><span class="group-badge ${groupClass(c)}">${c.group}</span><span>${c.id} &nbsp; ↗</span></div><div><h3>${esc(c.title)}</h3><div class="english">${esc(c.englishTitle)}</div></div><progress value="${countDone(c)}" max="3" aria-label="${esc(c.title)} 학습 진도"></progress><div class="course-meta"><span>3개 챕터 · ${countDone(c)}/3 학습 완료</span><span>${c.chapters.every(ch=>ch.studyGuide)?'개념·사례·서술형 9문제':'수업·풀이 확인 기록'}</span></div></button>`).join(''):`<div class="empty">검색한 강의가 없습니다.</div>`;}
function courseView(){const c=course();return `<div class="eyebrow">${c.group} / COURSE ${c.id.slice(1)}</div><h1>${esc(c.title)}</h1><p class="muted">${esc(c.englishTitle)}</p><div class="button-row">${badge('공식 챕터 목차 확인',true)}${button('DataCamp 출처 보기','sources')}${button('강의 인쇄 준비','print-course',`data-id="${c.id}"`)}</div><div class="chapter-list">${c.chapters.map(ch=>`<button class="chapter-row" data-action="chapter" data-id="${ch.id}"><span class="chapter-num">0${ch.number}</span><div class="chapter-info"><h3>${esc(ch.title)}</h3><div class="muted">${esc(ch.englishTitle)}</div><p>${esc(ch.summary)}</p>${badge(progressLabels[state.progress[ch.id]??'new'])}</div><span class="tag ${ch.lesson?'verified':''}">${ch.studyGuide?'학습안 · 연습 3문제':ch.studyEvidence?.length?'수업·풀이 확인 '+ch.studyEvidence.length+'개':ch.lesson?'핵심 요약·연습':ch.materials?.length?'대본 핵심 요약':'목차·범위 확인'}</span><span>→</span></button>`).join('')}</div><article class="paper"><div class="kicker">COURSE REVIEW</div><h2>세 챕터를 연결해 복습하기</h2><p class="muted">각 챕터의 핵심을 이어 설명하고, 비교·적용은 챕터별 서술형 연습에서 확인하세요.</p>${table({headers:['챕터','핵심 연결','답안 점검'],rows:c.chapters.map(ch=>[ch.title,ch.studyGuide.recap.join(' '),ch.studyGuide.objectives.join(' ')])})}</article>${refs(c.sourceIds,'Course outline')}`;}
function chapterView(){const ch=chapter();return `<div class="eyebrow">CHAPTER 0${ch.number} / ${course().group}</div><h1>${esc(ch.title)}</h1><p class="muted">${esc(ch.englishTitle)}</p><div class="button-row">${badge(ch.studyEvidence?.length?'수업·문제 직접 확인':ch.lesson?'현재 수업 대본 · 일부 확인':ch.materials?.length?'공식 수업 대본 확인':'소개·목차 확인',Boolean(ch.studyEvidence?.length||ch.lesson||ch.materials?.length))}<select id="progress" aria-label="챕터 학습 상태">${Object.entries(progressLabels).map(([key,val])=>`<option value="${key}" ${key===(state.progress[ch.id]??'new')?'selected':''}>${val}</option>`).join('')}</select>${button('챕터 인쇄','print-chapter',`data-id="${ch.id}"`)}</div><div class="tabs" role="tablist">${[['study','개념과 흐름'],['practice','서술형 연습'],['source','근거 자료']].map(([key,label])=>`<button class="tab ${view.tab===key?'active':''}" role="tab" aria-selected="${view.tab===key}" data-action="tab" data-id="${key}">${label}</button>`).join('')}</div><div class="study-grid"><section>${view.tab==='source'?sourceCards(ch.sourceIds):view.tab==='practice'?practiceView(ch):studyContent(ch)}</section><aside class="study-aside"><div class="aside-card"><h3>이 챕터의 키워드</h3>${ch.terms.map(t=>`<span class="term-pill">${esc(t)}</span>`).join('')}<hr><h3>내 학습 메모</h3><textarea class="note" id="note" maxlength="4000" aria-label="챕터 메모" placeholder="비교 기준, 헷갈린 개념을 적어두세요.">${esc(state.notes[ch.id]??'')}</textarea><div class="draft-meta">자동 저장 · AI 호출 없음</div></div><div class="aside-card"><h3>다음 학습 단계</h3><p class="muted">개념 확인 → 내 언어로 서술 → 논점 비교 → 다시 작성</p>${button('서술형 연습하기','tab','data-id="practice"',true)}<p class="muted">${ch.lesson?'모범답안은 자체 작성한 학습 자료입니다.':'확인한 대본을 바탕으로 챕터별 서술형 연습을 작성할 예정입니다.'}</p></div></aside></div>`;}
function table(data){return `<div class="table-wrap"><table><thead><tr>${data.headers.map(v=>`<th>${esc(v)}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function materialView(ch){
  return `<div class="notice info">초기 자료 조사에서 공식 영어 대본 ${ch.materials.length}개를 읽고 재서술한 요약입니다. 현재 한국어 수업·문제의 직접 진행 결과는 아래 별도 기록에서 확인하세요.</div><article class="paper"><div class="kicker">DATACAMP / VERIFIED MATERIALS</div><h2>확인한 개념과 흐름</h2>${ch.materials.map(m=>`<div class="concept">${badge(m.contentType,true)}<h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p>${refs(m.sourceIds,m.locator)}</div>`).join('')}</article>${ch.supplements?.length?`<article class="paper"><div class="kicker">SUPPLEMENT / OFFICIAL DOCUMENTS</div><h2>수업 설명과 함께 검토할 내용</h2>${ch.supplements.map(n=>`<div class="concept">${badge(n.contentType)}<h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>${refs(n.sourceIds,n.locator)}</div>`).join('')}</article>`:''}<div class="notice">챕터별 비교표·서술형 문제·모범답안·채점 기준은 추가 작성이 필요합니다. 초기 영어 대본 요약과 현재 한국어 수업의 확인 범위를 각 출처와 직접 진행 기록으로 구분합니다.</div>`;
}
function evidenceView(ch){
  if(!ch.studyEvidence?.length)return '';
  return `<article class="paper"><div class="kicker">LESSONS & EXERCISES / VERIFIED RUN</div><h2>수업·문제 진행에서 확인한 내용</h2><div class="notice info">DataCamp 대본·지침·문제·피드백을 직접 확인한 기록입니다. 실제 실습은 사용자 요청에 따라 선택 생략하며, 공식 해설 사용과 독립 정답을 구분합니다. 사용자 진도·숙달도와 별개이고 해설은 자체 작성입니다.</div>${ch.studyEvidence.map(r=>`<div class="concept">${badge(r.statusLabel,['transcript-reviewed','correct-feedback-verified','correct-after-correction','lab-completed-verified','calculator-completed-verified','submitted-existing-response'].includes(r.status))}<h3>${esc(r.title)}</h3><p>${esc(r.takeaway)}</p>${r.limitation?`<p class="muted">${esc(r.limitation)}</p>`:''}${refs(r.sourceIds,'현재 수업 / ex='+r.ex)}</div>`).join('')}</article>`;
}
function studyContent(ch){if(ch.studyGuide)return studyView(ch)+`<details class="paper evidence-details"><summary>수업·문제 직접 확인 기록 ${ch.studyEvidence.length}개 보기</summary>${evidenceView(ch)}</details>`;return (ch.studyEvidence?.length&&!ch.lesson&&!ch.materials?.length?'':studyView(ch))+evidenceView(ch);}
function studyView(ch){
  if(ch.studyGuide)return guideHTML(ch,lessonHelpers)+`<article class="paper"><h2>개념에 대해 질문하기</h2><p class="muted">오른쪽 학습 챗봇에서 이 챕터의 내용을 질문할 수 있습니다. 질문을 적고 챗봇에서 전송하세요.</p><textarea id="ask-text" maxlength="12000" placeholder="어떤 개념이 헷갈리나요?" aria-label="개념 질문"></textarea><div class="button-row">${button('학습 챗봇에서 이어가기','open-study-chat')}</div>${jobResult?`<div class="result" role="status">${esc(jobResult)}</div>`:''}</article>`;
  if(!ch.lesson)return ch.materials?.length?materialView(ch):`<article class="paper"><div class="kicker">DATACAMP / COURSE OUTLINE</div><h2>이번 챕터에서 다루는 범위</h2><p>${esc(ch.summary)}</p>${refs(ch.sourceIds,ch.englishTitle)}<div class="notice">수업 상세 자료는 추가 확인이 필요합니다.</div></article>`;
  const l=ch.lesson;
  return `<div class="notice info">${esc(l.notice)}</div><article class="paper"><div class="kicker">01 / CONCEPTS</div><h2>먼저, 핵심 개념</h2>${l.concepts.map(c=>`<div class="concept"><h3>${esc(c.term)}<span class="english">${esc(c.english)}</span></h3><p>${esc(c.text)}</p>${refs(c.sourceIds,c.locator)}</div>`).join('')}</article><article class="paper"><div class="kicker">02 / HOW IT WORKS</div><h2>자원과 수요를 연결해 보기</h2>${badge(l.stepType)}<ol class="step-list">${l.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${refs(l.stepSources,l.stepLocator)}</article><article class="paper"><div class="kicker">03 / COMPARISON</div><h2>같은 기준으로 비교하기</h2>${table(l.compare)}${refs(l.compare.sourceIds,l.compare.locator)}<h3>서비스 모델</h3>${table(l.models)}<p class="muted">${esc(l.models.note)}</p>${refs(l.models.sourceIds,l.models.locator)}</article><article class="paper"><div class="kicker">04 / APPLY & EXPLAIN</div><h2>상황에 적용해 보기</h2>${badge(l.scenario.type)}<p>${esc(l.scenario.text)}</p>${refs(l.scenario.sourceIds,l.scenario.locator)}<div class="notice">${esc(l.caution)}</div>${refs(l.cautionSources,l.cautionLocator)}${button('내 답안 작성하기 →','tab','data-id="practice"',true)}</article>${l.exerciseNotes?`<article class="paper"><div class="kicker">DATACAMP EXERCISE / VERIFIED SCOPE</div><h2>${esc(l.exerciseNotes.title)}</h2>${badge(l.exerciseNotes.type)}<p>${esc(l.exerciseNotes.text)}</p>${refs(l.exerciseNotes.sourceIds,l.exerciseNotes.locator)}<p>${esc(l.exerciseNotes.explanation)}</p>${refs(l.exerciseNotes.explanationSources)}<p class="muted">${esc(l.exerciseNotes.notice)}</p></article>`:""}<article class="paper"><h2>개념에 대해 질문하기</h2><p class="muted">확인한 자료 범위로 질문을 보냅니다. 현재 실제 AI 연결은 준비 중입니다.</p><textarea id="ask-text" maxlength="12000" placeholder="어떤 개념이 헷갈리나요?" aria-label="개념 질문"></textarea><div class="button-row">${button('Codex에 질문 제출','ask')}${currentJob?button('요청 취소','cancel'):''}</div>${jobResult?`<div class="result" role="status">${esc(jobResult)}</div>`:''}</article>`;
}
function practiceView(ch){
  if(!ch.lesson)return `<div class="empty"><h2>챕터별 서술형 연습은 작성 전입니다.</h2><p>${ch.materials?.length?'공식 대본의 핵심 개념을 확인했습니다. 이를 바탕으로 자체 작성 문제와 모범답안을 준비할 예정입니다.':'현재는 챕터 목차와 범위를 확인했습니다.'} 공식 정답·해설을 확인한 상태와 구분합니다.</p></div>`;
  const q=question(),draft=state.drafts[q.id]??'',checks=state.checks[q.id]??[false,false,false,false];
  return `<div class="question-nav">${ch.lesson.questions.map((item,i)=>`<button class="btn ${q.id===item.id?'primary':''}" data-action="question" data-id="${item.id}">문제 0${i+1}</button>`).join('')}</div><article class="paper"><div class="kicker">WRITE IN YOUR OWN WORDS</div>${badge(q.type)}<h2>${esc(q.title)}</h2><p>${esc(q.text)}</p><div class="rubric">${q.rubric.map(r=>badge(`${r.label} ${r.max}점`)).join('')}</div>${refs(q.sourceIds,q.sourceLocator)}<p class="muted">${esc(q.expectedLength??'핵심 논점 중심으로 작성')} · 문제 버전 ${esc(q.version??'1')}</p><label class="form-label" for="answer">나의 서술형 답안</label><textarea id="answer" maxlength="12000" placeholder="정의 → 작동 원리 → 비교 또는 근거 순서로 써 보세요.">${esc(draft)}</textarea><div class="draft-meta"><span>자동 저장 · 입력 중 AI 호출 없음</span><span id="answer-count">${draft.length} / 12,000자</span></div><div class="button-row">${button('Codex 평가 요청','grade','',true)}${button('답안 내보내기','export')}${currentJob?button('요청 취소','cancel'):''}</div><div class="notice">AI 평가는 현재 연결 준비 중입니다. 아래 자기 점검과 모범답안 비교를 먼저 사용할 수 있습니다. 자기 점검을 AI 점수로 환산하지 않습니다.</div>${jobResult?`<div class="result" role="status">${esc(jobResult)}</div>`:''}<details><summary>모범답안과 필수 논점 보기</summary><p>${esc(q.modelAnswer)}</p><small class="muted">자체 작성 모범답안 · ${esc(q.acceptedAlternatives??'같은 뜻의 다른 표현도 가능합니다.')}</small>${q.commonMistakes?.length?`<div class="notice"><strong>자주 빠지는 오개념</strong><ul>${q.commonMistakes.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}<div class="checklist">${q.points.map((p,i)=>`<label><input type="checkbox" data-check="${i}" ${checks[i]?'checked':''}>${esc(p)}</label>`).join('')}</div><p class="muted">빠진 논점을 메모하고 답안을 다시 써 보세요. 체크한 항목은 본인의 판단이며 자동 채점 결과가 아닙니다.</p></details></article>`;
}
function sourceCards(ids=catalog.sources.map(s=>s.id)){return ids.map(id=>{const s=source(id);return `<article class="source-card"><div class="button-row">${badge(s.verificationStatus==='verified'?'직접 열람':'확인 필요',s.verificationStatus==='verified')}${badge(s.accessScope)}</div><h3>${esc(s.title)}</h3><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">공식 원문 열기 ↗</a><dl><dt>발행처</dt><dd>${esc(s.publisher)}</dd><dt>확인일</dt><dd>${esc(s.checkedAt)}</dd><dt>확인 위치</dt><dd>${esc(s.locator)}</dd><dt>자료 ID</dt><dd>${esc(s.id)}</dd><dt>이용 범위</dt><dd>${esc(s.rightsNote)}</dd></dl></article>`;}).join('');}
function sourcesView(){return `<div class="eyebrow">SOURCES & PROVENANCE</div><h1>학습 자료의 근거를 확인하세요.</h1><p class="muted">강의 내용, 공개 목차, 자체 작성 연습을 구분합니다.</p><div class="notice">공개 소개 페이지는 전체 수업을 확인한 근거가 아닙니다. 현재 계정의 수업 버전과 공개 자료가 다를 수 있습니다.</div>${sourceCards()}`;}
function printView(){return `<div class="eyebrow">PAPER OPEN-BOOK</div><h1>필요한 개념을 종이 위에.</h1><p class="muted">강의 요약, 용어 색인, 확인된 모범답안을 흑백 인쇄에 맞춰 정리합니다.</p><article class="paper"><h2>인쇄할 강의 선택</h2><div class="button-row">${button('모두 선택','select-all')}${button('선택 해제','select-none')}</div><div class="print-controls">${courses().map(c=>`<label><input type="checkbox" data-print="${c.id}" ${printed.has(c.id)?'checked':''}>${esc(c.title)} · 3개 챕터</label>`).join('')}</div>${button('인쇄 미리보기 열기','print-selected','',true)}<div class="notice info">현재 자료는 초안 인쇄본입니다. 목차와 색인은 강의·챕터 ID 기준입니다. 최종 PDF의 페이지 번호 색인과 전체 레이아웃 검증은 다음 개발 단계입니다.</div><p class="muted">21개 챕터의 확장 학습안과 63개 자체 작성 연습·모범답안을 선택하여 인쇄합니다. 인쇄 준비는 Codex를 호출하지 않습니다.</p></article>`;}
function connectionView(){return `<div class="eyebrow">LOCAL CODEX CONNECTION</div><h1>내 계정으로 연결하는 학습 도구.</h1><article class="paper"><h2>${ai.mode==='mock'?'개발용 모의 모드':'실제 AI 연결 준비 중'}</h2><p>${esc(ai.reason)}</p><div class="notice">현재 질문·답안 입력과 자료 저장은 가능합니다. 기존 답안 자동 채점은 활성화되지 않았습니다. 학습 질문은 오른쪽 GPT‑6.1 Sol · Light 챗봇에서 별도로 보낼 수 있습니다.</div>${button('ChatGPT 로그인 상태 확인','check-login')}<div id="login-result" class="result" hidden></div><p class="muted">인증 확인은 로그인 상태만 확인하며 질문·채점을 실행하지 않습니다.</p><h3>사용량 안내</h3><p>${esc(ai.usage)}</p><a href="${esc(ai.usageUrl)}" target="_blank" rel="noopener noreferrer">공식 사용량·요금 안내 ↗</a><h3>개인 로컬 실행</h3><p>웹페이지는 같은 컴퓨터의 로컬 서버를 이용합니다. 계정 비밀번호나 인증 파일을 웹페이지에 입력하지 마세요.</p><h3>다음 연결 단계</h3><ol><li>평가용 실행 영역과 네트워크·파일 경계 검증</li><li>도구·플러그인·전역 설정 상속 차단 검증</li><li>ChatGPT 인증으로 작은 실제 호출과 결과 검증</li></ol></article>`;}
function markDirty(){pendingSave=true;saveStatus='저장 중…';if(byId('save-status'))byId('save-status').textContent=saveStatus;clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(),550);}
async function save(){
  clearTimeout(saveTimer);if(savePromise){await savePromise;return;}if(!pendingSave)return;
  if(storageWarning){saveStatus='저장 중단';toast(storageWarning);return;}
  pendingSave=false;const snapshot=structuredClone(state);
  let failed=false;
  savePromise=api('/api/state',{method:'PUT',data:snapshot}).then(result=>{state.revision=result.revision;saveStatus='저장됨';}).catch(error=>{failed=true;pendingSave=true;saveStatus='저장 실패 · 내보내기 가능';toast(error.message);}).finally(()=>{savePromise=null;if(byId('save-status'))byId('save-status').textContent=saveStatus;if(pendingSave&&!failed)saveTimer=setTimeout(()=>save(),550);});
  await savePromise;
}
async function navigate(next){await save();view={...view,...next};if(next.type)history.replaceState(null,'',next.type==='exams'?'#exams':location.pathname);jobResult=null;requestKey=null;render();window.scrollTo({top:0});}
async function submitAI(operation){
  const ch=chapter(),q=question(),text=operation==='grade'?(state.drafts[q.id]??''):byId('ask-text').value;
  if(!text.trim()){toast('질문이나 답안을 먼저 작성하세요.');return;}
  const key=JSON.stringify([operation,ch.id,q?.id,text]);
  if(requestKey?.key!==key)requestKey={key,id:crypto.randomUUID()};
  try{
    const job=await api('/api/ai/jobs',{method:'POST',data:{requestId:requestKey.id,operation,chapterId:ch.id,questionId:q?.id,text}});
    currentJob=job.id;jobResult='요청을 처리하고 있습니다…';render();
    while(currentJob===job.id){
      const stateJob=await api('/api/ai/jobs/'+job.id);
      if(['succeeded','failed','cancelled'].includes(stateJob.status)){
        currentJob=null;jobResult=stateJob.result?.text??stateJob.error?.message??'요청을 취소했습니다.';render();return;
      }
      await new Promise(resolve=>setTimeout(resolve,400));
    }
  }catch(error){currentJob=null;jobResult=error.message;toast(error.message);render();}
}
function printChapter(ch){if(ch.studyGuide){const c=courses().find(c=>c.chapters.includes(ch));return `<section class="print-sheet"><div>${esc(c.title)} · ${esc(ch.id)}</div><h1>${esc(ch.title)}</h1><p>학습안 ${esc(ch.studyGuide.version)} · 출처 확인 ${catalog.checkedAt}</p>${guideHTML(ch,lessonHelpers,true)}${practicePrintHTML(ch,lessonHelpers)}${state.notes[ch.id]?`<h2>내 메모</h2><p>${esc(state.notes[ch.id])}</p>`:''}</section>`;}const c=courses().find(c=>c.chapters.includes(ch));return `<section class="print-sheet"><div>${esc(c.title)} · ${ch.id}</div><h1>${esc(ch.title)}</h1>${badge(ch.lesson?'현재 수업 대본 · 일부 요약':ch.materials?.length?'공식 대본 · 핵심 요약':'공식 소개·목차 범위')}<p>${esc(ch.summary)}</p>${refs(ch.sourceIds,ch.englishTitle)}${ch.lesson?`<h2>핵심 개념</h2>${ch.lesson.concepts.map(con=>`<div class="concept"><strong>${esc(con.term)} · ${esc(con.english)}</strong><p>${esc(con.text)}</p>${refs(con.sourceIds,con.locator)}</div>`).join('')}<h2>작동 흐름</h2><p>학습용 재구성: ${ch.lesson.steps.map(esc).join(' → ')}</p><h2>비교표</h2>${table(ch.lesson.compare)}${refs(ch.lesson.compare.sourceIds,ch.lesson.compare.locator)}${table(ch.lesson.models)}${refs(ch.lesson.models.sourceIds,ch.lesson.models.locator)}<h2>가상 사례</h2><p>${esc(ch.lesson.scenario.text)}</p>${refs(ch.lesson.scenario.sourceIds,ch.lesson.scenario.locator)}<p>${esc(ch.lesson.caution)}</p>${refs(ch.lesson.cautionSources,ch.lesson.cautionLocator)}<h2>자체 작성 예상문제와 모범답안</h2>${ch.lesson.questions.map(q=>`<div class="q-block"><h3>${esc(q.title)}</h3><p>${esc(q.text)}</p><p><strong>작성 모범답안:</strong> ${esc(q.modelAnswer)}</p><p>필수 논점: ${q.points.map(esc).join(' / ')}</p>${refs(q.sourceIds,q.sourceLocator)}</div>`).join('')}`:(ch.materials?.length?materialView(ch):`<p>${ch.studyEvidence?.length?'직접 확인한 수업·풀이 기록은 아래에 있습니다.':'상세 수업 자료 확인 전입니다.'}</p>`)}${evidenceView(ch)}${state.notes[ch.id]?`<h2>내 메모</h2><p>${esc(state.notes[ch.id])}</p>`:''}</section>`;}
function preparePrint(chapters){
  if(!chapters.length){toast('인쇄할 강의를 선택하세요.');return;}
  document.querySelector('.print-only')?.remove();
  const el=document.createElement('div');el.className='print-only';
  const sourceIds=[...new Set(chapters.flatMap(ch=>ch.sourceIds))];
  const terms=chapters.flatMap(ch=>ch.terms.map(term=>({term,chapter:ch.id}))).sort((a,b)=>a.term.localeCompare(b.term,'ko'));
  el.innerHTML=`<section class="print-sheet print-cover"><div>CLOUD NOTES / PAPER OPEN-BOOK</div><h1>클라우드 컴퓨팅<br>서술형 학습 노트</h1><p>자료 버전 ${esc(catalog.version)} · 확인일 ${catalog.checkedAt}</p><p>선택한 ${chapters.length}개 챕터 · 개인 학습용 초안</p><div class="notice">직접 확인한 DataCamp 개념을 바탕으로 보완한 21개 챕터 학습안입니다. 흐름·사례·예상문제·모범답안은 자체 작성이며 외부 공식 보충설명은 별도 표시합니다. 학교 시험의 출제·성적을 보장하지 않습니다.</div></section><section class="print-sheet"><h1>목차와 용어 색인</h1><p>페이지 색인은 최종 PDF 단계에서 추가합니다. 현재는 챕터 ID로 찾아보세요.</p><h2>목차</h2><ul>${chapters.map(ch=>`<li>${ch.id} — ${esc(ch.title)}</li>`).join('')}</ul><h2>용어 색인</h2><table><thead><tr><th>용어</th><th>챕터 ID</th></tr></thead><tbody>${terms.map(t=>`<tr><td>${esc(t.term)}</td><td>${t.chapter}</td></tr>`).join('')}</tbody></table></section>${chapters.map(printChapter).join('')}<section class="print-sheet"><h1>출처 목록</h1>${sourceIds.map(id=>{const s=source(id);return `<div class="source-card"><strong>${esc(s.title)} [${esc(id)}]</strong><p>${esc(s.accessScope)} · ${esc(s.locator)}</p><p class="source-ref">${esc(s.url)} · 확인일 ${s.checkedAt}</p></div>`;}).join('')}</section>`;
  document.body.append(el);window.print();
}
root.addEventListener('input',event=>{
  const el=event.target;
  if(el.dataset.examAnswer){state.examDrafts??={};state.examDrafts[el.dataset.examAnswer]=el.value;markDirty();const n=examData.exam.questions.filter(q=>state.examDrafts[q.id]?.trim()).length;byId('exam-count').textContent=n+' / 21문항';byId('exam-ready').textContent=n===21?'21개 답안을 모두 작성했습니다.':'남은 '+(21-n)+'개 문항을 작성하세요.';root.querySelector('[data-action="exam-submit"]').disabled=n!==21||examBusy;}
  if(el.id==='search'){search=el.value;byId('course-cards').innerHTML=courseCards();}
  if(el.id==='answer'){state.drafts[question().id]=el.value;byId('answer-count').textContent=el.value.length+' / 12,000자';markDirty();}
  if(el.id==='note'){state.notes[chapter().id]=el.value;markDirty();}
  if(el.id==='ask-text'){askDrafts[chapter().id]=el.value;}
});
root.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='progress'){state.progress[chapter().id]=el.value;markDirty();}
  if(el.dataset.check!==undefined){const q=question();state.checks[q.id]??=[false,false,false,false];state.checks[q.id][Number(el.dataset.check)]=el.checked;markDirty();}
  if(el.dataset.print){if(el.checked)printed.add(el.dataset.print);else printed.delete(el.dataset.print);}
});
root.addEventListener('click',async event=>{
  const el=event.target.closest('[data-action]');if(!el)return;
  const action=el.dataset.action,id=el.dataset.id;
  try{
    if(action==='exams'){await loadExams();return navigate({type:'exams'});}
    if(action==='exam-compose'){examAttempt=null;examReview=null;examError='';return render();}
    if(action==='exam-submit')return submitExam();
    if(action==='exam-history')return showAttempt(id);
    if(action==='exam-refresh'){await showAttempt(examAttempt.id);if(examAttempt.status==='grading')await pollExam();return;}
    if(action==='exam-review'){examReview=await api('/api/exams/'+examAttempt.id+'/review');return render();}
    if(action==='exam-grade'){
      if(examBusy)return;examBusy=true;examError='';el.disabled=true;
      try{examAttempt=await api('/api/exams/'+examAttempt.id+'/grade',{method:'POST',data:{}});}catch(e){examError=e.message;}finally{examBusy=false;render();}
      if(examAttempt.status==='grading')await pollExam();return;
    }
    if(action==='home')return navigate({type:'home'});
    if(action==='course')return navigate({type:'course',courseId:id});
    if(action==='chapter'){const c=courses().find(c=>c.chapters.some(ch=>ch.id===id));return navigate({type:'chapter',courseId:c.id,chapterId:id,tab:'study',questionId:allChapters().find(ch=>ch.id===id).lesson?.questions[0].id});}
    if(action==='tab')return navigate({tab:id});
    if(action==='question')return navigate({questionId:id});
    if(action==='sources')return navigate({type:'sources'});
    if(action==='connection')return navigate({type:'connection'});
    if(action==='print-view')return navigate({type:'print'});
    if(action==='print-course'){printed.clear();printed.add(id);return navigate({type:'print'});}
    if(action==='select-all'){courses().forEach(c=>printed.add(c.id));return render();}
    if(action==='select-none'){printed.clear();return render();}
    if(action==='print-selected'){await save();return preparePrint(courses().filter(c=>printed.has(c.id)).flatMap(c=>c.chapters));}
    if(action==='print-chapter'){await save();return preparePrint(allChapters().filter(ch=>ch.id===id));}
    if(action==='open-study-chat')return chatPanel.open(byId('ask-text')?.value??'',view.chapterId);
    if(action==='ask'||action==='grade')return submitAI(action);
    if(action==='cancel'&&currentJob){await api('/api/ai/jobs/'+currentJob+'/cancel',{method:'POST',data:{}});currentJob=null;jobResult='요청을 취소했습니다.';return render();}
    if(action==='export'){
      const blob=new Blob([JSON.stringify({version:catalog.version,...state,submittedExam:examAttempt},null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='cloud-notes-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
    }
    if(action==='check-login'){
      el.disabled=true;const result=await api('/api/ai/check-login',{method:'POST',data:{}});const box=byId('login-result');box.hidden=false;box.textContent=result.message;el.disabled=false;
    }
  }catch(error){toast(error.message);el.disabled=false;}
});
window.addEventListener('beforeunload',event=>{if(pendingSave||savePromise){event.preventDefault();event.returnValue='';}});
try{
  const session=await api('/api/session');csrf=session.csrf;storageWarning=session.storageWarning;
  [catalog,state,ai]=await Promise.all([api('/api/catalog'),api('/api/state'),api('/api/ai/status')]);
  if(location.hash==='#exams'){await loadExams();view.type='exams';}
  chatPanel=createStudyChat({catalog,api,getContext:()=>view.type==='chapter'?view.chapterId:null});
  printed.add('C01');render();if(storageWarning)toast(storageWarning);
}catch(error){root.innerHTML=`<main class="loading"><h1>학습실을 열지 못했습니다.</h1><p>${esc(error.message)}</p><p>로컬 서버가 켜져 있는지 확인하고 새로고침하세요.</p></main>`;}
