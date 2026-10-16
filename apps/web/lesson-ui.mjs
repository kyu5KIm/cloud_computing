// 화면과 종이 노트가 같은 학습안을 사용한다. 모든 콘텐츠는 이 경계에서 이스케이프한다.
export function guideHTML(ch,{esc,refs,table,badge,button},print=false){
  const g=ch.studyGuide;
  const article=(number,title,body)=>`<article class="paper guide-section"><div class="kicker">${number} / CHAPTER GUIDE</div><h2>${esc(title)}</h2>${body}</article>`;
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  const label=block=>badge(block.contentType,block.contentType==='DataCamp 강의 확인 내용');
  const reference=block=>refs(block.sourceIds,block.locator);
  const caseLabels={situation:'상황',requirements:'요구사항',choice:'선택과 근거',process:'작동 과정',tradeoff:'대안·제약과 판단'};
  return `<div class="notice info">${esc(g.notice)}</div>`+
    article('01','이번 챕터의 학습 목표',`<h3>먼저 연결할 개념</h3>${list(g.prerequisites)}<h3>공부 후 설명할 수 있어야 할 것</h3>${list(g.objectives)}`)+
    article('02','이 내용이 필요한 이유',`${label(g.why)}<p>${esc(g.why.text)}</p>${reference(g.why)}`)+
    article('03','핵심 개념을 연결해 이해하기',g.concepts.map(c=>`<div class="concept">${label(c)}<h3>${esc(c.term)}<span class="english">${esc(c.english)}</span></h3><p>${esc(c.text)}</p>${reference(c)}</div>`).join(''))+
    article('04',g.flow.title,`${label(g.flow)}<ol class="step-list">${g.flow.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>${reference(g.flow)}`)+
    article('05','같은 기준으로 비교하기',g.comparisons.map(comparison=>`<div class="concept">${label(comparison)}<h3>${esc(comparison.title)}</h3>${table(comparison)}${reference(comparison)}</div>`).join(''))+
    article('06','요구에서 선택과 결과까지 풀이하기',`${label(g.scenario)}<p class="muted">수업 개념을 적용한 자체 작성 사례입니다. 실제 기관의 운영 실적이나 DataCamp 원문 문제가 아닙니다.</p><dl class="case-flow">${Object.entries(caseLabels).map(([key,title])=>`<div><dt>${esc(title)}</dt><dd>${esc(g.scenario[key])}</dd></div>`).join('')}</dl>${reference(g.scenario)}`)+
    article('07','헷갈리는 설명을 바로잡기',g.misconceptions.map(m=>`<div class="concept">${label(m)}<p><strong>흔한 오답</strong> ${esc(m.wrong)}</p><p><strong>바로잡기</strong> ${esc(m.right)}</p><p class="rewrite-prompt"><strong>짧게 다시 쓰기</strong> ${esc(m.rewrite)}</p>${reference(m)}</div>`).join(''))+
    (ch.supplements?.length?article('08','보충설명 — 공식 외부 문서',`<p class="muted">아래 내용은 DataCamp 강의 확인 내용과 구분한 외부 공식 문서 설명입니다.</p>${ch.supplements.map(note=>`<div class="concept">${badge(note.contentType)}<h3>${esc(note.title)}</h3><p>${esc(note.text)}</p>${refs(note.sourceIds,note.locator)}</div>`).join('')}`):'')+
    article('REVIEW','핵심 흐름과 용어 총정리',`${list(g.recap)}${refs(g.sourceIds,'이 챕터 학습안의 근거 위치')}<h3>용어 색인</h3>${table({headers:['한국어 개념','영어·약어'],rows:g.concepts.map(c=>[c.term,c.english])})}<div class="notice">서술형 작성 순서: 정의 → 원리·인과관계 → 비교·선택 근거 → 적용 → 필요한 한계. 이 틀의 모든 항목을 억지로 넣기보다 문제의 요구에 맞춰 설명하세요.</div>${print?'':button('서술형 3문제 연습하기 →','tab','data-id="practice"',true)}`);
}

export function practicePrintHTML(ch,{esc,refs,table}){
  return `<article class="paper"><h2>자체 작성 서술형 연습 · 모범답안</h2>${ch.lesson.questions.map((q,i)=>`<div class="q-block"><h3>${i+1}. ${esc(q.title)}</h3><p>${esc(q.text)}</p><p class="muted">${esc(q.expectedLength)} · 답안 버전 ${esc(q.version)}</p>${table({headers:['채점 관점','배점'],rows:q.rubric.map(r=>[r.label,r.max+'점'])})}<p><strong>모범답안</strong> ${esc(q.modelAnswer)}</p><ol>${q.points.map(point=>`<li>${esc(point)}</li>`).join('')}</ol><p>${esc(q.acceptedAlternatives)}</p>${refs(q.sourceIds,q.sourceLocator)}</div>`).join('')}</article>`;
}
