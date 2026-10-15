import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {createApp,validateState} from '../apps/local-server/server.mjs';
import {createAdapter,cleanEnvironment,validateResult} from '../packages/codex-adapter/adapter.mjs';
async function fixture(t,options={}){
  const stateDir=await mkdtemp(path.join(tmpdir(),'cloud-study-test-'));
  const app=await createApp({stateDir,...options});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await app.close();await rm(stateDir,{recursive:true,force:true});});
  const origin='http://127.0.0.1:'+app.server.address().port;
  const res=await fetch(origin+'/api/session');const cookie=res.headers.get('set-cookie').split(';')[0];const {csrf}=await res.json();
  const request=(url,{method='GET',data,headers={}}={})=>fetch(origin+url,{method,headers:{cookie,...(method==='GET'?{}:{origin,'content-type':'application/json','x-csrf-token':csrf}),...headers},body:data===undefined?undefined:JSON.stringify(data)});
  return {request,app,stateDir,origin};
}
test('7 courses, protected API, no calls during reads or saves',async t=>{
  let calls=0;const adapter={status:()=>({mode:'mock'}),run:()=>{calls++;return Promise.resolve({});}};
  const {request,origin}=await fixture(t,{adapter});
  assert.equal((await fetch(origin+'/api/state')).status,401);
  const data=await (await request('/api/catalog')).json();assert.equal(data.courses.length,7);assert.equal(data.courses.flatMap(c=>c.chapters).length,21);
  const state=await (await request('/api/state')).json();state.drafts['Q-scale']='한 서버의 성능과 서버 수의 차이';
  assert.equal((await request('/api/state',{method:'PUT',data:state})).status,200);
  assert.equal(calls,0);
  assert.equal((await request('/.runtime/state.json')).status,404);
  assert.equal((await request('/packages/codex-adapter/adapter.mjs')).status,404);
});
test('Host, Origin, fetch-site, CSRF and input validation',async t=>{
  const {request,origin}=await fixture(t);
  const hostStatus=await new Promise((resolve,reject)=>{const req=http.request(origin+'/api/state',{headers:{host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
  assert.equal(hostStatus,403);
  assert.equal((await request('/api/state',{headers:{origin:'https://evil.example'}})).status,403);
  assert.equal((await request('/api/session',{headers:{'sec-fetch-site':'cross-site'}})).status,403);
  const state={revision:0,progress:{},drafts:{},notes:{},checks:{}};
  assert.equal((await request('/api/state',{method:'PUT',data:state,headers:{'x-csrf-token':'bad'}})).status,403);
  assert.equal((await request('/api/state',{method:'PUT',data:{...state,notes:{'../../x':'bad'}}})).status,400);
  assert.equal((await request('/api/state',{method:'PUT',data:{...state,drafts:{'Q-scale':'a'.repeat(12001)}}})).status,400);
  assert.equal((await request('/api/state',{method:'PUT',data:{...state,checks:{'Q-scale':[1,2,3,4]}}})).status,400);
  const res=await request('/');assert.match(res.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
});
test('draft persistence, conflict protection and restart',async t=>{
  const {request,app,stateDir}=await fixture(t);
  const state={revision:0,progress:{'C01-1':'review'},drafts:{'Q-scale':'<script>danger()</script>'},notes:{},checks:{}};
  assert.equal((await request('/api/state',{method:'PUT',data:state})).status,200);
  assert.equal((await request('/api/state',{method:'PUT',data:state})).status,409);
  const saved=JSON.parse(await readFile(path.join(stateDir,'state.json'),'utf8'));assert.equal(saved.drafts['Q-scale'],state.drafts['Q-scale']);assert.equal(saved.revision,1);
  const app2=await createApp({stateDir});assert.equal(app2.getState().progress['C01-1'],'review');assert.equal(app.getState().revision,1);
});
test('corrupt state preserved and writes blocked',async t=>{
  const dir=await mkdtemp(path.join(tmpdir(),'cloud-study-corrupt-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  const file=path.join(dir,'state.json');await writeFile(file,'not JSON');
  const app=await createApp({stateDir:dir});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));t.after(()=>app.close());
  const url='http://127.0.0.1:'+app.server.address().port;const res=await fetch(url+'/api/session');const cookie=res.headers.get('set-cookie').split(';')[0];const {csrf,storageWarning}=await res.json();assert(storageWarning);
  const response=await fetch(url+'/api/state',{method:'PUT',headers:{origin:url,cookie,'content-type':'application/json','x-csrf-token':csrf},body:JSON.stringify({revision:0,progress:{},drafts:{},checks:{},notes:{}})});
  assert.equal(response.status,503);assert.equal(await readFile(file,'utf8'),'not JSON');
});
test('actual inference blocked without safety verification',async t=>{
  const {request}=await fixture(t);
  const res=await request('/api/ai/jobs',{method:'POST',data:{requestId:'test-12345',operation:'grade',chapterId:'C01-1',questionId:'Q-scale',text:'답안'}});
  assert.equal(res.status,503);assert.match((await res.json()).error,/격리/);
  const adapter=createAdapter();await assert.rejects(()=>adapter.run({}),/격리/);
});
test('mock idempotency, one active job, cancellation, source result validation',async t=>{
  const {request}=await fixture(t,{adapter:createAdapter({mode:'mock',delayMs:120})});
  const input={requestId:'mock-12345',operation:'grade',chapterId:'C01-1',questionId:'Q-scale',text:'수직·수평 확장'};
  const first=await (await request('/api/ai/jobs',{method:'POST',data:input})).json();
  const second=await (await request('/api/ai/jobs',{method:'POST',data:input})).json();assert.equal(first.id,second.id);
  assert.equal((await request('/api/ai/jobs',{method:'POST',data:{...input,text:'changed'}})).status,409);
  assert.equal((await request('/api/ai/jobs',{method:'POST',data:{...input,requestId:'mock-99999'}})).status,429);
  await new Promise(resolve=>setTimeout(resolve,150));const done=await (await request('/api/ai/jobs/'+first.id)).json();assert.equal(done.result.total,null);assert.equal(done.result.status,'deferred');assert.match(done.result.text,/모의/);
  const another=await (await request('/api/ai/jobs',{method:'POST',data:{...input,requestId:'mock-00000'}})).json();
  assert.equal((await (await request('/api/ai/jobs/'+another.id+'/cancel',{method:'POST',data:{}})).json()).status,'cancelled');
  assert.throws(()=>validateResult({text:'x',sourceIds:['invented']},'ask',['DC-cloud-ch1']),/출처/);
  assert.throws(()=>validateResult({text:'x',sourceIds:['DC-cloud-ch1'],total:9,status:'deferred'},'grade',['DC-cloud-ch1']),/점수/);
});
test('credential environment never inherited',()=>{
  const env=cleanEnvironment({PATH:'safe',SystemRoot:'C:/Windows',CODEX_API_KEY:'secret',OPENAI_API_KEY:'secret',CODEX_HOME:'unsafe-config',OPENAI_BASE_URL:'unsafe',CODEX_ACCESS_TOKEN:'secret',TEST_SECRET:'secret'});
  assert.deepEqual(env,{PATH:'safe',SystemRoot:'C:/Windows'});
  assert.throws(()=>validateState({revision:0,progress:[],drafts:{},notes:{},checks:{}}),/진도/);
});
