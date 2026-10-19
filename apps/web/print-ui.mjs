import {printEdition} from './print-edition.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Only the authored bold tags survive; notes and catalog text are always escaped.
const prose=value=>esc(value).replace(/&lt;(\/?)b&gt;/g,'<$1strong>');
const heading=text=>`<h2>${esc(text)}</h2>`;
const paragraph=text=>`<p>${text}</p>`;
const grid=({headers,rows})=>`<table><colgroup>${headers.map((_,i)=>`<col style="width:${headers.length===4?[19,24,27,30][i]:100/headers.length}%">`).join('')}</colgroup><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

export function printGroups(chapters,{notes={},includeNotes=false}={}){
 const groups=chapters.map(original=>{
  const ch=structuredClone(original),patch=printEdition.overrides[ch.id];
  if(patch){Object.assign(ch.studyGuide,{concepts:patch.concepts,comparisons:patch.comparisons});ch.lesson.questions=patch.questions;}
  const g=ch.studyGuide;if(!g)throw Error('이 챕터의 인쇄 학습안이 준비되지 않았습니다.');
  const blocks=[heading('핵심 개념 · '+ch.title),...g.concepts.map(c=>paragraph(`<strong>${esc(c.term)}</strong> <span class="print-english">(${esc(c.english)})</span> ${esc(c.text)}`)),heading('비교 · 선택 기준'),...g.comparisons.map(grid),heading('작동 흐름'),paragraph(g.flow.steps.map((s,i)=>`<strong>${i+1}.</strong> ${esc(s)}`).join(' → ')),heading('서술형 문제 · 답안 예시'),...ch.lesson.questions.map((q,i)=>`<div class="print-answer">${paragraph(`<strong>${printEdition.priorityQuestions?.[ch.id]?.includes(i)?'★ ':''}문제 ${i+1}.</strong> ${esc(q.text)}`)}${paragraph(`<strong>답안 예:</strong> ${esc(q.answer??q.modelAnswer)}`)}</div>`)];
  if(includeNotes&&notes[ch.id]?.trim())blocks.push(heading('내 메모'),paragraph(esc(notes[ch.id]).replace(/\n/g,'<br>')));
  return {id:ch.id,title:ch.title,terms:g.concepts.map(c=>c.term),blocks};
 });
 const selected=new Set(chapters.map(ch=>ch.id));
 for(const supplement of printEdition.supplements){
  if(supplement.allCourses?chapters.length<2:!supplement.chapterIds.some(id=>selected.has(id)))continue;
  groups.push({id:supplement.id,title:supplement.title,terms:[],blocks:supplement.blocks.map(block=>block.type==='heading'?heading(block.text):block.type==='table'?grid(block):paragraph(prose(block.text)))});
 }
 return groups;
}

export async function openPrintPreview(chapters,options={}){
 if(!chapters.length)throw Error('인쇄할 강의를 선택하세요.');
 document.querySelector('#print-preview')?.remove();
 const previousFocus=document.activeElement;
 const el=document.createElement('section');el.id='print-preview';el.className='print-only';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','인쇄 미리보기');
 el.innerHTML='<div class="print-toolbar"><div><strong>인쇄 미리보기</strong><span id="print-summary" role="status">페이지를 정리하고 있습니다…</span></div><div><button class="btn primary" data-print-command="print" disabled>인쇄 / PDF 저장</button><button class="btn" data-print-command="close">닫기</button></div><p>A4 · 여백 1cm · 실제 크기 100% · 양면 긴 쪽 넘김. 머리글·바닥글은 인쇄 설정에서 꺼주세요.</p></div><div class="print-pages"></div>';
 document.body.append(el);document.body.classList.add('print-preview-open');
 const app=document.querySelector('#app'),chat=document.querySelector('#study-chat');
 const priorInert=[app,chat].map(node=>[node,node?.inert]);
 for(const [node] of priorInert)if(node)node.inert=true;
 const close=()=>{document.body.classList.remove('print-preview-open');for(const [node,value] of priorInert)if(node)node.inert=value;el.remove();document.removeEventListener('keydown',onKey);previousFocus?.focus();};
 const onKey=event=>{
  if(event.key==='Escape'){event.preventDefault();close();}
  if(event.key==='Tab'){const buttons=[...el.querySelectorAll('.print-toolbar button:not(:disabled)')];if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}else if(!event.shiftKey&&document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}}
 };
 document.addEventListener('keydown',onKey);
 el.addEventListener('click',event=>{const command=event.target.closest('[data-print-command]')?.dataset.printCommand;if(command==='close')close();if(command==='print')window.print();});
 try{
  await document.fonts.ready;
  const groups=printGroups(chapters,options),pages=el.querySelector('.print-pages'),locations=new Map();
  let page,content,density=10;
  const newPage=()=>{page=document.createElement('section');page.className='print-sheet';page.style.setProperty('--print-font',density+'pt');page.style.setProperty('--print-table-font',(density-.5)+'pt');page.innerHTML='<div class="print-content"></div><footer class="print-page-number"></footer>';pages.append(page);content=page.firstElementChild;};
  const fits=()=>content.scrollHeight<=content.clientHeight+1;
  const fromHTML=html=>{const template=document.createElement('template');template.innerHTML=html;return template.content.firstElementChild;};
  const append=node=>{
   content.append(node);if(fits())return;
   node.remove();
   // Avoid orphan headings when moving the next block to a continuation page.
   let title;if(content.lastElementChild?.tagName==='H2'){title=content.lastElementChild;title.remove();}
   if(content.childElementCount){newPage();if(title)content.append(title);content.append(node);if(fits())return;node.remove();}
   else if(title)content.append(title);
   if(node.tagName==='TABLE'){
    let table=node.cloneNode(true);table.tBodies[0].replaceChildren();content.append(table);
    for(const row of [...node.tBodies[0].rows]){
     table.tBodies[0].append(row);
     if(fits())continue;row.remove();
     if(!table.tBodies[0].rows.length)throw Error('표의 한 행이 인쇄 영역보다 큽니다. 내용을 줄여 주세요.');
     newPage();table=node.cloneNode(true);table.tBodies[0].replaceChildren(row);content.append(table);
     if(!fits())throw Error('표의 한 행이 인쇄 영역보다 큽니다.');
    }
   }else if(node.classList.contains('print-answer')){
    for(const child of [...node.children])append(child);
   }else{
    // Long notes or paragraphs split at word boundaries, never hidden or clipped.
    const words=node.textContent.split(/(?<=\s)/u);let part=document.createElement('p');content.append(part);
    for(const word of words){const old=part.textContent;part.textContent+=word;if(fits())continue;part.textContent=old;if(!old)throw Error('인쇄할 수 없는 긴 단어가 있습니다.');newPage();part=document.createElement('p');part.textContent=word;content.append(part);}
   }
  };
  for(const group of groups){
   density=10;newPage();locations.set(group.id,pages.children.length);
   for(const html of group.blocks)content.append(fromHTML(html));
   if(!fits())for(const size of [9.8,9.6,9.5]){density=size;page.style.setProperty('--print-font',size+'pt');page.style.setProperty('--print-table-font',(size-.5)+'pt');if(fits())break;}
   content.replaceChildren();for(const html of group.blocks)append(fromHTML(html));
  }
  density=10;
  if(groups.length>1){
   newPage();append(fromHTML(heading('용어 · 내용 색인')));
   append(fromHTML(grid({headers:['내용','찾을 곳'],rows:groups.map(group=>[group.title+(group.terms.length?'\n'+group.terms.join(' · '):''),locations.get(group.id)+'쪽'])})));
  }
  [...pages.children].forEach((sheet,i)=>sheet.lastElementChild.innerHTML=(i===0?'<span style="float:left">★ 우선 복습</span>':'')+String(i+1).padStart(2,'0'));
  const total=pages.children.length;el.querySelector('#print-summary').textContent=`${chapters.length}개 챕터 · ${total}페이지 · 양면 ${Math.ceil(total/2)}장`;
  el.querySelector('[data-print-command="print"]').disabled=false;el.querySelector('[data-print-command="print"]').focus();
  return {pages:total,close};
 }catch(error){close();throw error;}
}
