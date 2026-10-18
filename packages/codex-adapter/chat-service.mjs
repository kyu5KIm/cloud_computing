import {randomBytes} from 'node:crypto';
import {chatModel} from './study-chat.mjs';
export const scopeNotice='이 챗봇은 이 페이지의 클라우드 수업·개념·서술형 공부 질문만 답합니다. 일상 대화와 학습 범위 밖 요청은 처리하지 않습니다.';
const fail=(status,message)=>Object.assign(new Error(message),{status});
const normalize=text=>text.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const core=/클라우드|datacamp|데이터캠프|aws|azure|애저|iaas|paas|saas|ec2|s3|rds|dynamodb|lambda|람다|vpc|vnet|entra|rbac|iam|arm|서버|가상화|확장|스토리지|데이터베이스|리전|가용|네트워크|서브넷|보안|암호화|권한|인증|마이그레이션|거버넌스|종량제|온프레미스|컨테이너|kubernetes|쿠버네티스|메트릭|로그|모니터링|policy|purview|자동화|컴퓨팅|데이터 처리|비용 관리|tco|sagemaker|fargate|부하 분산|공동 책임|최소 권한/i;
const learning=/이 (페이지|사이트|수업|챕터|강의)|공부|서술형|시험|모범답안|채점 기준|수업 내용|학습 내용/;
const courseTerms=/신뢰성|성능|운영|지속가능|기밀성|무결성|탄력|디렉터리|가상|컴플라이언스|준수|프레임워크|전용|공유|종속|아키텍처|컴퓨트|sqs|sns|eventbridge|cloudfront|route.?53|kinesis|glue|athena|redshift|quicksight|rekognition|macie|dms|snowball|ebs|efs|캐시|백업|복제|데이터|정책|태그|잠금|etl|blob|files|queue|큐|메시지|테이블|디스크|스케일|cpu|메모리|lrs|zrs|grs|gzrs|mfa|sso|key.?vault|zero.?trust|제로.?트러스트|심층.?방어|app.?service|functions|bicep|ia.?c|caf|well.?architected|defender|sentinel|advisor|calculator|계산기|cost.?explorer|budgets|예산|관계형|nosql/i;
const followup=/^(그럼|그러면|왜|어떻게|좀 ?더|더 |쉽게|예시|예를|다시|요약|비교|차이|방금|이것|이게|그것|그게|이어서|관련|한 ?줄|짧게|자세히|표로)/;
const daily=/날씨|점심.{0,10}(추천|메뉴|뭐)|저녁.{0,10}(추천|메뉴|뭐)|맛집|연애|운세|로또|주식.{0,8}(추천|매수|종목)|농담|끝말잇기|노래.{0,8}(불러|추천)|여행.{0,8}(추천|일정)|오늘.{0,8}(기분|뭐해)|심심|대통령|정치|\b(jokes?|weather|lunch|dinner|dating|horoscope|politics)\b|비밀번호.{0,8}(알려|찾아)|api.?key.{0,8}(출력|알려)|시스템.{0,6}(프롬프트|지시).{0,6}(공개|출력|알려)/i;
export function isStudyQuestion(text,history=[]){
 if(daily.test(text))return false;
 if(core.test(text)||courseTerms.test(text)||learning.test(text))return true;
 return followup.test(text)&&history.some(item=>item.role==='user'&&(core.test(item.text)||courseTerms.test(item.text)||learning.test(item.text))&&!daily.test(item.text));
}

export function studyPacket(catalog,{text,chapterId,history=[]}){
 const chapters=catalog.courses.flatMap(course=>course.chapters);
 const evidence=new Map(catalog.sources.map(source=>[source.id,source]));
 const queries=[text,...history.filter(item=>item.role==='user').slice(-2).map(item=>item.text)];
 const tokens=[...new Set(queries.join(' ').toLowerCase().match(/[a-z0-9]+|[가-힣]{2,}/g)??[])];
 const aliases={caf:'cloudadoptionframework',iac:'infrastructureascode',lb:'loadbalancing',az:'availabilityzone',파스:'paas',사스:'saas',아이아스:'iaas'};
 const ranked=chapters.flatMap(ch=>ch.studyGuide.concepts.map(concept=>{
  const names=[concept.term,...concept.english.split(/ · | \/ /)].map(normalize);
  const score=tokens.reduce((sum,token)=>{const term=aliases[normalize(token)]??normalize(token);return sum+(names.some(name=>name.includes(term)||(name.length>=3&&term.includes(name)))?5:normalize(concept.text).includes(term)?1:0);},0);
  return {ch,concept,score:score+(score>0&&ch.id===chapterId?0.25:0)};
 })).sort((a,b)=>b.score-a.score);
 const chosen=ranked.filter(item=>item.score>0).slice(0,10);
 if(!chosen.length)chosen.push(...ranked.filter(item=>!chapterId||item.ch.id===chapterId).slice(0,chapterId?6:4));
 const materials=chosen.map(({ch,concept})=>({chapterId:ch.id,title:ch.title,kind:concept.contentType,text:concept.term+' / '+concept.english+'：'+concept.text,sourceIds:concept.sourceIds}));
 for(const ch of [...new Set(chosen.map(item=>item.ch))].slice(0,3)){
  materials.push({chapterId:ch.id,title:ch.title,kind:'학습용 재구성',text:ch.studyGuide.flow.steps.join('\n'),sourceIds:ch.studyGuide.flow.sourceIds});
  for(const note of ch.supplements??[])materials.push({chapterId:ch.id,title:note.title,kind:'보충설명 — 공식 외부 문서',text:note.text,sourceIds:note.sourceIds});
 }
 const sourceIds=[...new Set(materials.flatMap(item=>item.sourceIds))].filter(id=>evidence.get(id)?.verificationStatus==='verified');
 return {question:text,chapterId:chapterId??null,sourceVersion:catalog.version,history,courseScope:chapters.map(ch=>({id:ch.id,title:ch.title,summary:ch.summary})),materials,sourceIds};
}

export function createChatService(catalog,adapter){
 const jobs=new Map(),requests=new Map();let active=null;
 const expose=job=>({id:job.id,status:job.status,result:job.result??null,error:job.error??null});
 return {
  status:()=>({...adapter.status(),scopeNotice,maxInput:4000,historyNotice:'대화는 이 탭에만 유지되며 새로고침하면 초기화됩니다.'}),
  async submit(input){
   if(!input||typeof input.text!=='string'||!input.text.trim()||input.text.length>4000)throw fail(400,'1~4,000자의 질문을 입력하세요.');
   if(typeof input.requestId!=='string'||!/^[-a-zA-Z0-9]{8,80}$/.test(input.requestId))throw fail(400,'질문 요청 ID 오류');
   if(input.chapterId!=null&&!catalog.courses.some(c=>c.chapters.some(ch=>ch.id===input.chapterId)))throw fail(400,'챕터 범위 오류');
   const history=input.history??[];
   if(!Array.isArray(history)||history.length>6||history.some(item=>!item||!['user','assistant'].includes(item.role)||typeof item.text!=='string'||item.text.length>4000))throw fail(400,'대화 범위 오류');
   const signature=JSON.stringify([input.text,input.chapterId??null,history]);
   const old=requests.get(input.requestId);if(old){if(old.signature!==signature)throw fail(409,'같은 요청 ID의 질문이 다릅니다.');return expose(jobs.get(old.id));}
   if(!isStudyQuestion(input.text,history))return {status:'rejected',result:{text:scopeNotice,sourceIds:[],scope:'off-topic',model:chatModel}};
   if(!adapter.status().ready)throw fail(503,adapter.status().reason);
   if(active)throw fail(429,'이전 질문이 끝난 뒤 보내세요.');
   if(jobs.size>=30)throw fail(429,'이 서버의 질문 실행 상한에 도달했습니다. 계정 전체 사용 한도와는 별도입니다.');
   const packet=studyPacket(catalog,{...input,history}),controller=new AbortController();
   const job={id:randomBytes(12).toString('hex'),status:'running',controller};jobs.set(job.id,job);requests.set(input.requestId,{signature,id:job.id});active=job.id;
   Promise.resolve().then(()=>adapter.run({packet,signal:controller.signal})).then(result=>{
    if(job.status!=='running')return;
    if(!result||typeof result.text!=='string'||!result.text.trim()||result.text.length>12000||!['grounded','insufficient','off-topic'].includes(result.scope)||!Array.isArray(result.sourceIds)||result.sourceIds.some(id=>!packet.sourceIds.includes(id))||(result.scope==='grounded'&&!result.sourceIds.length))throw Error('답변 출처 검증 실패');
    job.result=result.scope==='off-topic'?{...result,text:scopeNotice,sourceIds:[]}:result;job.status='succeeded';
   }).catch(error=>{if(job.status==='running'){job.status='failed';job.error={code:error.code??'unknown',message:error.code?error.message:'답변 검증에 실패했습니다. 질문을 보존하고 자동 재시도하지 않습니다.'};}}).finally(()=>{if(active===job.id)active=null;});
   return expose(job);
  },
  get(id){const job=jobs.get(id);if(!job)throw fail(404,'질문을 찾지 못했습니다.');return expose(job);},
  cancel(id){const job=jobs.get(id);if(!job)throw fail(404,'질문을 찾지 못했습니다.');if(job.status==='running'){job.status='cancelled';job.controller.abort();}return expose(job);},
  close(){for(const job of jobs.values())job.controller.abort();}
 };
}
