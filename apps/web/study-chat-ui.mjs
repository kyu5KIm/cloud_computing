export function createStudyChat({catalog,api,getContext}){
 const host=document.createElement('div');host.id='study-chat';document.body.append(host);
 const escape=text=>String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 let opened=false,draft='',messages=[],busy=false,jobId=null,error='',connection=null,scope='auto',lastRequest=null,composing=false;
 const chapters=catalog.courses.flatMap(c=>c.chapters),sources=new Map(catalog.sources.map(s=>[s.id,s]));
 const selectedChapter=()=>scope==='all'?null:scope==='auto'?getContext():scope;
 const scopeLabel=()=>chapters.find(ch=>ch.id===selectedChapter())?.title??'전체 7개 강의';
 function render(){
  document.body.classList.toggle('study-chat-open',opened);
  host.innerHTML=`<button class="chat-toggle" aria-expanded="${opened}" aria-controls="study-chat-panel" ${opened?'hidden':''}>✦ 학습 질문</button><aside id="study-chat-panel" class="chat-panel" aria-label="클라우드 학습 질문" ${opened?'':'hidden'}><header class="chat-header"><div><span class="chat-eyebrow">CLOUD STUDY ASSISTANT</span><h2>궁금한 개념, 바로 질문</h2><p>GPT‑6.1 Sol · Light</p></div><button class="chat-close" aria-label="학습 챗봇 닫기">×</button></header><div class="chat-context"><label for="chat-scope">질문 범위</label><select id="chat-scope"><option value="auto" ${scope==='auto'?'selected':''}>현재 화면 우선 · 전체 강의 검색</option><option value="all" ${scope==='all'?'selected':''}>전체 7개 강의</option>${chapters.map(ch=>`<option value="${ch.id}" ${scope===ch.id?'selected':''}>${ch.id} ${escape(ch.title)}</option>`).join('')}</select><p>우선 참고: ${escape(scopeLabel())} · 전체 강의도 찾아봐요</p></div><div class="chat-messages" role="log" aria-label="학습 질문 대화" aria-live="polite">${messages.length?messages.map(message=>`<article class="chat-message ${message.role==='user'?'from-user':'from-tutor'}"><strong>${message.role==='user'?'나의 질문':'학습 도우미'}</strong><p>${escape(message.text)}</p>${message.sourceIds?.length?`<div class="chat-sources">${message.sourceIds.map(id=>sources.get(id)).filter(Boolean).map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`).join('')}</div>`:''}</article>`).join(''):`<div class="chat-welcome"><span aria-hidden="true">✦</span><h3>개념이 연결되지 않을 때</h3><p>페이지에 있는 클라우드 수업 내용을 근거로 설명해 드려요. 일상 대화는 받지 않습니다.</p><button class="chat-example" data-example="수직 확장과 수평 확장의 차이를 쉽게 설명해줘">수직·수평 확장의 차이는?</button><button class="chat-example" data-example="IaaS, PaaS, SaaS를 관리 책임으로 비교해줘">서비스 모델을 어떻게 비교하지?</button></div>`}${busy?'<p class="chat-progress" role="status">Codex가 수업 근거를 확인하고 있습니다…</p>':''}</div><div class="chat-feedback" role="status">${escape(error)}</div><form class="chat-form"><label class="sr-only" for="chat-question">클라우드 공부 질문</label><textarea id="chat-question" maxlength="4000" rows="3" placeholder="공부 질문을 입력하세요 (Enter 전송 / Shift+Enter 줄바꿈)">${escape(draft)}</textarea><div class="chat-form-actions"><button type="button" class="btn small chat-reset" ${busy?'disabled':''}>새 대화</button><span class="chat-count">${draft.length} / 4,000</span>${busy?'<button type="button" class="btn small chat-cancel">중지</button>':'<button type="submit" class="btn primary" '+(!draft.trim()?'disabled':'')+'>질문 보내기 ↑</button>'}</div><p class="chat-privacy">전송할 때 질문·최근 대화·관련 학습 근거가 OpenAI로 전달되고 계정의 Codex 사용량을 이용합니다. API 키 호출은 하지 않습니다. 새로고침하면 대화가 초기화됩니다.</p><p class="chat-connection">${connection?(connection.ready?'ChatGPT 계정 · Codex 연결':escape(connection.reason)):'연결 상태 확인 중…'} · 실제 채점은 별도 기능입니다.</p></form></aside>`;
  const log=host.querySelector('.chat-messages');if(opened)log.scrollTop=log.scrollHeight;
 }
 function addReply(result){messages.push({role:'assistant',text:result.text,sourceIds:result.sourceIds});messages=messages.slice(-20);}
 async function poll(id){
  let job;
  for(;;){
   job=await api('/api/chat/jobs/'+id);
   if(job.status!=='running')break;
   await new Promise(resolve=>setTimeout(resolve,900));
  }
  if(job.status==='succeeded'){addReply(job.result);draft='';lastRequest=null;error='';}
  else if(job.status==='cancelled')error='요청을 중지했습니다. 이미 사용한 계정 사용량은 복원되지 않습니다.';
  else error=job.error?.message??'답변을 받지 못했습니다. 질문을 남겨 두었습니다.';
 }
 async function send(){
  if(busy||!draft.trim())return;
  const text=draft.trim(),chapterId=selectedChapter(),signature=JSON.stringify([text,chapterId]);
  if(lastRequest?.signature!==signature){
   lastRequest={signature,payload:{requestId:crypto.randomUUID(),text,chapterId,history:messages.slice(-6).map(m=>({role:m.role,text:m.text.slice(0,4000)}))}};
   messages.push({role:'user',text});
  }
  busy=true;error='';render();
  try{
   const job=await api('/api/chat/jobs',{method:'POST',data:lastRequest.payload});
   if(job.status==='rejected'){addReply(job.result);draft='';lastRequest=null;}
   else{jobId=job.id;await poll(job.id);}
  }catch(e){error=e.message+' 질문은 보존했습니다. 자동 재시도하지 않습니다.';}
  finally{busy=false;jobId=null;render();if(opened)host.querySelector('#chat-question').focus();}
 }
 host.addEventListener('input',event=>{if(event.target.id==='chat-question'){draft=event.target.value;host.querySelector('.chat-count').textContent=draft.length+' / 4,000';const sendButton=host.querySelector('[type="submit"]');if(sendButton)sendButton.disabled=!draft.trim();}});
 host.addEventListener('change',event=>{if(event.target.id==='chat-scope'){scope=event.target.value;render();}});
 host.addEventListener('submit',event=>{event.preventDefault();void send();});
 host.addEventListener('click',async event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.classList.contains('chat-toggle')){opened=true;render();host.querySelector('#chat-question').focus();}
  if(button.classList.contains('chat-close')){opened=false;render();host.querySelector('.chat-toggle').focus();}
  if(button.dataset.example){draft=button.dataset.example;render();host.querySelector('#chat-question').focus();}
  if(button.classList.contains('chat-reset')&&!busy){messages=[];draft='';lastRequest=null;error='';render();}
  if(button.classList.contains('chat-cancel')&&jobId){try{await api('/api/chat/jobs/'+jobId+'/cancel',{method:'POST',data:{}});}catch(e){error=e.message;render();}}
 });
 host.addEventListener('compositionstart',()=>{composing=true;});
 host.addEventListener('compositionend',()=>{composing=false;});
 host.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&event.target.id==='chat-question'&&!event.shiftKey&&!event.isComposing&&!composing&&event.keyCode!==229){event.preventDefault();void send();}
  if(event.key==='Escape'&&opened){opened=false;render();host.querySelector('.chat-toggle').focus();}
 });
 render();api('/api/chat/status').then(status=>{connection=status;render();}).catch(()=>{connection={ready:false,reason:'연결 상태를 확인하지 못했습니다.'};render();});
 return {open(text='',chapterId=null){opened=true;if(text)draft=text;if(chapterId)scope=chapterId;render();host.querySelector('#chat-question').focus();},updateContext(){if(opened&&!busy){const input=host.querySelector('#chat-question');if(input)draft=input.value;render();}}};
}
