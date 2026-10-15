import {readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {examQuestions,examVersion,examModel,publicExam} from '../../content/exams.mjs';
import {validateExamResult} from '../codex-adapter/exam-grader.mjs';
const error=(status,message)=>Object.assign(Error(message),{status});
export function validateAnswers(answers){
 if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.keys(answers).length!==examQuestions.length)throw error(400,'21개 문항의 답안을 모두 작성하세요.');
 const result={};for(const q of examQuestions){const a=answers[q.id];if(typeof a!=='string'||!a.trim()||a.length>4000)throw error(400,'각 문항에 1~4,000자의 답안이 필요합니다.');result[q.id]=a;}
 return result;
}
export async function createExamService(stateDir,grader){
 const file=path.join(stateDir,'exams.json');let attempts=[],warning=null,active=null,queue=Promise.resolve();
 try{const stored=JSON.parse(await readFile(file,'utf8'));if(!Array.isArray(stored)||stored.some(a=>!a.id||a.version!==examVersion))throw Error('invalid');attempts=stored;for(const a of attempts)if(a.status==='grading'){a.status='unknown';a.error='이전 채점이 중단되었습니다. 사용량 발생 여부는 알 수 없습니다. 재요청은 추가 사용량을 만들 수 있습니다.';}}catch(e){if(e.code!=='ENOENT')warning='시험 저장 자료 오류: 원본을 보존하고 새 제출을 중단했습니다.';}
 async function persist(){const temp=file+'.tmp';await writeFile(temp,JSON.stringify(attempts,null,2),'utf8');await rename(temp,file);}
 function locked(fn){const task=queue.catch(()=>{}).then(fn);queue=task;return task;}
 function publicAttempt(a){return a?{...a,requestId:undefined,signature:undefined}:null;}
 return {
  catalog:publicExam,
  status:()=>({...grader.status(),warning}),
  list:()=>attempts.map(a=>({id:a.id,createdAt:a.createdAt,status:a.status,total:a.result?.total??null})),
  get(id){const a=attempts.find(a=>a.id===id);if(!a)throw error(404,'시험 기록을 찾지 못했습니다.');return publicAttempt(a);},
  review(id){const a=attempts.find(a=>a.id===id);if(!a)throw error(404,'먼저 전체 답안을 제출하세요.');return {questions:examQuestions.map(({evidence,...q})=>q)};},
  async submit(input){return locked(async()=>{
   if(warning)throw error(503,warning);if(input.version!==examVersion)throw error(409,'시험 버전이 변경되었습니다. 초안을 보관하고 새로고침하세요.');
   if(typeof input.requestId!=='string'||!/^[-a-zA-Z0-9]{8,80}$/.test(input.requestId))throw error(400,'시험 요청 ID 오류');
   const answers=validateAnswers(input.answers);const signature=createHash('sha256').update(JSON.stringify([examVersion,answers])).digest('hex');
   const old=attempts.find(a=>a.requestId===input.requestId);if(old){if(old.signature!==signature)throw error(409,'동일 요청 ID의 답안이 변경되었습니다.');return publicAttempt(old);}
   if(attempts.length>=20)throw error(429,'보관 가능한 시험 20회에 도달했습니다. 기존 기록을 내보내 보관하세요.');
   const a={id:randomUUID(),requestId:input.requestId,signature,version:examVersion,model:examModel,answers,createdAt:new Date().toISOString(),status:'submitted',result:null};attempts.push(a);try{await persist();}catch(e){attempts.pop();throw e;}return publicAttempt(a);
  });},
  async grade(id){return locked(async()=>{
   if(warning)throw error(503,warning);const a=attempts.find(a=>a.id===id);if(!a)throw error(404,'시험 기록이 없습니다.');
   if(a.status==='graded'||a.status==='grading')return publicAttempt(a);
   if(!grader.status().ready){a.status='awaiting-connection';a.error=grader.status().reason;await persist();return publicAttempt(a);}
   if(active)throw error(429,'다른 시험을 채점 중입니다.');
   if(a.status==='unknown')throw error(409,'이전 요청의 사용량과 완료 여부가 불명확합니다. 새 요청 전 기록을 확인하세요.');
   active=id;a.status='grading';a.error=null;await persist();
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),180000);
   // 자동 재시도 없음. 검증된 결과만 저장하고 확정 총점은 서버에서 계산.
   grader.grade({questions:examQuestions,answers:a.answers,signal:controller.signal}).then(raw=>locked(async()=>{a.result=validateExamResult(raw,examQuestions,a.answers);a.status=a.result.status;await persist();})).catch(e=>locked(async()=>{a.status=controller.signal.aborted?'unknown':'failed';a.error=controller.signal.aborted?'채점 시간이 초과되었습니다. 사용량 여부는 알 수 없으며 자동 재시도하지 않습니다.':'채점 결과를 확정하지 못했습니다. 답안은 보존했습니다. '+String(e.message).slice(0,500);await persist();})).finally(()=>{clearTimeout(timer);active=null;});
   return publicAttempt(a);
  });}
 };
}
