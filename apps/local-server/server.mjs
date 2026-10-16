import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,writeFile,mkdir,rename,stat,readdir} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {catalog,findChapter} from '../../content/catalog.mjs';
import {createAdapter,checkLogin} from '../../packages/codex-adapter/adapter.mjs';
import {examQuestions} from '../../content/exams.mjs';
import {createExamGrader} from '../../packages/codex-adapter/exam-grader.mjs';
import {createExamService} from '../../packages/exams/service.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const webRoot=path.join(ROOT,'apps/web');
const chapterIds=new Set(catalog.courses.flatMap(c=>c.chapters.map(ch=>ch.id)));
const questionIds=new Set(catalog.courses.flatMap(c=>c.chapters.flatMap(ch=>ch.lesson?.questions.map(q=>q.id)??[])));
const MAX_BODY=1000000;
class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
const emptyState=()=>({revision:0,progress:{},drafts:{},checks:{},notes:{},examDrafts:{}});
export function validateState(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new HttpError(400,'저장 형식 오류');
  const result=emptyState();
  if(!Number.isSafeInteger(value.revision)||value.revision<0)throw new HttpError(400,'버전 오류');
  result.revision=value.revision;
  const examIds=new Set(examQuestions.map(q=>q.id));
  if(value.examDrafts!==undefined){
    if(!value.examDrafts||typeof value.examDrafts!=='object'||Array.isArray(value.examDrafts))throw new HttpError(400,'시험 초안 오류');
    for(const [id,text]of Object.entries(value.examDrafts)){if(!examIds.has(id)||typeof text!=='string'||text.length>4000)throw new HttpError(400,'시험 초안 범위 오류');result.examDrafts[id]=text;}
  }
  for(const [name,allowed,max] of [['drafts',questionIds,12000],['notes',chapterIds,4000]]){
    if(!value[name]||typeof value[name]!=='object'||Array.isArray(value[name]))throw new HttpError(400,'저장 항목 오류');
    for(const [key,text] of Object.entries(value[name])){
      if(!allowed.has(key)||typeof text!=='string'||text.length>max)throw new HttpError(400,'저장 범위 오류');
      result[name][key]=text;
    }
  }
  if(!value.progress||typeof value.progress!=='object'||Array.isArray(value.progress))throw new HttpError(400,'진도 오류');
  for(const [key,val]of Object.entries(value.progress)){
    if(!chapterIds.has(key)||!['new','studying','review','done'].includes(val))throw new HttpError(400,'진도 범위 오류');
    result.progress[key]=val;
  }
  if(!value.checks||typeof value.checks!=='object'||Array.isArray(value.checks))throw new HttpError(400,'자기 점검 오류');
  for(const [key,val]of Object.entries(value.checks)){
    if(!questionIds.has(key)||!Array.isArray(val)||val.length!==4||val.some(v=>typeof v!=='boolean'))throw new HttpError(400,'자기 점검 범위 오류');
    result.checks[key]=val;
  }
  return result;
}
async function body(req){
  let data='',size=0;
  for await(const chunk of req){size+=chunk.length;if(size>MAX_BODY)throw new HttpError(413,'입력 용량을 초과했습니다.');data+=chunk;}
  try{return JSON.parse(data);}catch{throw new HttpError(400,'JSON 형식 오류');}
}
const equal=(a,b)=>{if(typeof a!=='string'||typeof b!=='string')return false;const first=Buffer.from(a),second=Buffer.from(b);return first.length===second.length&&timingSafeEqual(first,second);};
async function findExecutable(){
  if(process.platform!=='win32')return null;
  const base=process.env.APPDATA;
  if(!base)return null;
  const file=path.join(base,'npm/node_modules/@openai/codex/node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/bin/codex.exe');
  try{await stat(file);return file;}catch{}
  const appBin=path.join(process.env.LOCALAPPDATA??'', 'OpenAI/Codex/bin');
  try{for(const version of (await readdir(appBin)).sort().reverse()){const candidate=path.join(appBin,version,'codex.exe');try{await stat(candidate);return candidate;}catch{}}}catch{}
  return null;
}
export async function createApp({stateDir=path.join(ROOT,'.runtime'),adapter=createAdapter(),examGrader=createExamGrader(),executable=null}={}){
  await mkdir(stateDir,{recursive:true});
  const exams=await createExamService(stateDir,examGrader);
  const statePath=path.join(stateDir,'state.json');
  let state=emptyState(),storageWarning=null;
  try{state=validateState(JSON.parse(await readFile(statePath,'utf8')));}catch(e){if(e.code!=='ENOENT')storageWarning='저장 자료를 읽지 못했습니다. 원본은 보존했습니다. 복구 전 새 저장을 중단합니다.';}
  let saving=Promise.resolve();
  const session=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
  const jobs=new Map(),requests=new Map();let active=null;
  function send(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}
  function publicJob(job){return {id:job.id,status:job.status,operation:job.operation,chapterId:job.chapterId,result:job.result??null,error:job.error??null};}
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    try{
      const port=server.address()?.port;
      const expected=`127.0.0.1:${port}`,origin=`http://${expected}`;
      if(req.headers.host!==expected)throw new HttpError(403,'허용되지 않은 호스트');
      if(req.headers.origin&&req.headers.origin!==origin)throw new HttpError(403,'외부 요청 차단');
      if(['cross-site','same-site'].includes(req.headers['sec-fetch-site']))throw new HttpError(403,'외부 페이지 요청 차단');
      const url=new URL(req.url,origin),route=url.pathname;
      if(req.method==='GET'&&route==='/api/session'){
        res.setHeader('Set-Cookie',`cloud_session=${session}; Path=/; HttpOnly; SameSite=Strict`);
        return send(res,200,{csrf,storageWarning,version:catalog.version});
      }
      if(route.startsWith('/api/')){
        const cookie=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('cloud_session='))?.slice(14);
        if(!equal(cookie,session))throw new HttpError(401,'로컬 세션을 다시 시작하세요.');
        if(req.method!=='GET'){
          if(req.headers.origin!==origin||!equal(req.headers['x-csrf-token'],csrf))throw new HttpError(403,'요청 검증 실패');
          if(!(req.headers['content-type']??'').startsWith('application/json'))throw new HttpError(415,'JSON 요청만 허용');
        }
        if(req.method==='GET'&&route==='/api/catalog')return send(res,200,catalog);
        if(req.method==='GET'&&route==='/api/state')return send(res,200,state);
        if(req.method==='GET'&&route==='/api/ai/status')return send(res,200,adapter.status());
        if(req.method==='GET'&&route==='/api/exams')return send(res,200,{exam:exams.catalog(),connection:exams.status(),attempts:exams.list()});
        if(req.method==='POST'&&route==='/api/exams/submit'){
          const attempt=await exams.submit(await body(req));
          return send(res,201,await exams.grade(attempt.id));
        }
        const examMatch=route.match(/^\/api\/exams\/([a-f0-9-]{36})(\/(grade|review))?$/);
        if(examMatch){
          if(req.method==='GET'&&!examMatch[2])return send(res,200,exams.get(examMatch[1]));
          if(req.method==='GET'&&examMatch[3]==='review')return send(res,200,exams.review(examMatch[1]));
          if(req.method==='POST'&&examMatch[3]==='grade')return send(res,200,await exams.grade(examMatch[1]));
        }
        if(req.method==='POST'&&route==='/api/ai/check-login')return send(res,200,await checkLogin(executable));
        if(req.method==='PUT'&&route==='/api/state'){
          const next=validateState(await body(req));
          const task=saving.catch(()=>{}).then(async()=>{
            if(storageWarning)throw new HttpError(503,storageWarning);
            if(next.revision!==state.revision)throw new HttpError(409,'다른 탭에서 저장했습니다. 새로고침 후 다시 작성하세요. 현재 초안은 내보내기로 보관할 수 있습니다.');
            next.revision++;
            const temp=statePath+'.tmp';await writeFile(temp,JSON.stringify(next),'utf8');await rename(temp,statePath);state=next;
          });saving=task;await task;return send(res,200,{revision:state.revision});
        }
        if(req.method==='POST'&&route==='/api/ai/jobs'){
          const input=await body(req);
          if(typeof input.requestId!=='string'||!/^[-a-zA-Z0-9]{8,80}$/.test(input.requestId))throw new HttpError(400,'요청 ID 오류');
          if(!['ask','grade'].includes(input.operation))throw new HttpError(400,'지원하지 않는 작업');
          const chapter=findChapter(input.chapterId);
          if(!chapter?.lesson)throw new HttpError(400,'확인된 수업 자료가 있는 챕터에서만 요청할 수 있습니다.');
          if(typeof input.text!=='string'||!input.text.trim()||input.text.length>12000)throw new HttpError(400,'1~12,000자의 입력이 필요합니다.');
          const question=chapter.lesson.questions.find(q=>q.id===input.questionId);
          if(input.operation==='grade'&&!question)throw new HttpError(400,'문제 범위 오류');
          const signature=JSON.stringify([input.operation,input.chapterId,input.questionId??null,input.text]);
          if(requests.has(input.requestId)){
            const old=requests.get(input.requestId);if(old.signature!==signature)throw new HttpError(409,'같은 요청 ID의 내용이 다릅니다.');
            return send(res,200,publicJob(jobs.get(old.id)));
          }
          if(adapter.status().mode==='blocked')throw new HttpError(503,adapter.status().reason);
          if(active)throw new HttpError(429,'현재 요청이 끝난 뒤 다시 요청하세요.');
          if(jobs.size>=30)throw new HttpError(429,'앱의 실행 상한에 도달했습니다.');
          const id=randomBytes(12).toString('hex'),controller=new AbortController();
          const job={id,status:'running',operation:input.operation,chapterId:chapter.id,controller};
          jobs.set(id,job);requests.set(input.requestId,{id,signature});active=id;
          adapter.run({operation:input.operation,chapter,question,text:input.text,signal:controller.signal}).then(result=>{
            if(job.status==='cancelled')return;job.result=result;job.status='succeeded';
          }).catch(error=>{if(job.status!=='cancelled'){job.status='failed';job.error={code:error.code??'unknown',message:error.message};}}).finally(()=>{if(active===id)active=null;});
          return send(res,202,publicJob(job));
        }
        const match=route.match(/^\/api\/ai\/jobs\/([a-f0-9]{24})(\/cancel)?$/);
        if(match){
          const job=jobs.get(match[1]);if(!job)throw new HttpError(404,'요청을 찾을 수 없습니다.');
          if(req.method==='GET'&&!match[2])return send(res,200,publicJob(job));
          if(req.method==='POST'&&match[2]){if(job.status==='running'){job.status='cancelled';job.controller.abort();}return send(res,200,publicJob(job));}
        }
        throw new HttpError(404,'경로를 찾을 수 없습니다.');
      }
      if(req.method!=='GET')throw new HttpError(405,'허용되지 않은 요청');
      const files={'/':'index.html','/app.mjs':'app.mjs','/exam-ui.mjs':'exam-ui.mjs','/lesson-ui.mjs':'lesson-ui.mjs','/style.css':'style.css'};
      const file=files[route];if(!file)throw new HttpError(404,'페이지를 찾을 수 없습니다.');
      const data=await readFile(path.join(webRoot,file));
      res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8'});res.end(data);
    }catch(error){send(res,error.status??500,{error:error.status?error.message:'처리하지 못했습니다. 초안은 그대로 보관하세요.'});}
  });
  return {server,close:()=>new Promise(resolve=>{for(const job of jobs.values())job.controller.abort();server.close(resolve);}),getState:()=>state};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.CLOUD_STUDY_PORT??4173);
  if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid port');
  const app=await createApp({executable:await findExecutable(),adapter:createAdapter({mode:process.argv.includes('--mock')?'mock':'blocked'})});
  app.server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}\nCodex inference: ${process.argv.includes('--mock')?'MOCK ONLY':'NOT CONNECTED'}`));
  app.server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'포트가 사용 중입니다. CLOUD_STUDY_PORT를 변경하세요.':'서버 시작 실패');process.exitCode=1;});
}
