import { spawn } from 'node:child_process';

export class AdapterError extends Error {
  constructor(code,message){ super(message); this.code=code; }
}
export function cleanEnvironment(env=process.env){
  const allowed=['SystemRoot','WINDIR','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA','PATH','HOME'];
  const result={};
  for(const [k,v] of Object.entries(env)) if(allowed.some(a=>a.toLowerCase()===k.toLowerCase())) result[k]=v;
  return result;
}
export const safetyStatus = {
  mode:'blocked',ready:false,
  reason:'실제 AI 실행은 아직 연결하지 않았습니다. 평가용 격리와 도구 차단 검증을 마친 뒤 활성화합니다.',
  usage:'ChatGPT로 인증한 Codex 호출은 계정 사용량을 이용합니다. 잔여량·차감량·무과금은 보장하지 않습니다.',
  usageUrl:'https://learn.chatgpt.com/docs/pricing'
};
export function validateResult(result,operation,sourceIds){
  if(!result||typeof result!=='object'||Array.isArray(result)) throw new AdapterError('invalid_output','잘못된 결과 형식');
  if(typeof result.text!=='string'||result.text.length>24000) throw new AdapterError('invalid_output','결과 본문 오류');
  if(!Array.isArray(result.sourceIds)||!result.sourceIds.length||result.sourceIds.some(id=>!sourceIds.includes(id))) throw new AdapterError('invalid_output','출처 검증 실패');
  if(operation==='grade'){
    if(result.total!==null) throw new AdapterError('invalid_output','연동 전에는 점수를 확정할 수 없습니다.');
    if(result.status!=='deferred') throw new AdapterError('invalid_output','평가 상태 오류');
  }
  return result;
}
export function createAdapter({mode='blocked',delayMs=30}={}){
  return {
    status(){return mode==='mock'?{...safetyStatus,mode:'mock',reason:'개발용 모의 연동입니다. 실제 Codex 호출과 AI 채점을 하지 않습니다.'}:safetyStatus;},
    async run({operation,chapter,question,signal}){
      if(mode!=='mock') throw new AdapterError('safety_unverified',safetyStatus.reason);
      await new Promise((resolve,reject)=>{
        const timer=setTimeout(resolve,delayMs);
        signal?.addEventListener('abort',()=>{clearTimeout(timer);reject(new AdapterError('cancelled','요청을 취소했습니다.'));},{once:true});
        if(signal?.aborted){clearTimeout(timer);reject(new AdapterError('cancelled','요청을 취소했습니다.'));}
      });
      const result=operation==='grade'
        ?{text:'[개발용 모의 결과] 자동 채점은 보류했습니다. 필수 논점과 모범답안을 비교해 직접 보완하세요.',sourceIds:question.sourceIds,total:null,status:'deferred'}
        :{text:'[개발용 모의 결과] '+chapter.summary+' 실제 질문에 대한 AI 응답이 아닙니다.',sourceIds:chapter.sourceIds};
      return validateResult(result,operation,chapter.sourceIds);
    }
  };
}

// 진단 전용: 추론/exec를 호출하지 않고 공식 로그인 상태만 확인한다.
export async function checkLogin(executable,{runner=spawn}={}){
  if(!executable) return {method:'unknown',message:'Codex 실행 파일을 찾지 못했습니다.'};
  return new Promise(resolve=>{
    let text='',settled=false;
    const done=result=>{if(settled)return;settled=true;clearTimeout(timer);resolve(result);};
    const child=runner(executable,['login','status'],{shell:false,windowsHide:true,env:cleanEnvironment(),stdio:['ignore','pipe','pipe']});
    const timer=setTimeout(()=>{child.kill();done({method:'unknown',message:'인증 확인 시간이 초과되었습니다.'});},6000);
    for(const stream of [child.stdout,child.stderr]) stream?.on('data',chunk=>{text=(text+chunk).slice(-8000);});
    child.on('error',()=>done({method:'unknown',message:'Codex 인증 확인을 실행할 수 없습니다.'}));
    child.on('close',code=>{
      if(code===0&&/logged in using chatgpt/i.test(text)) done({method:'chatgpt',message:'ChatGPT 로그인 확인. 실제 AI 실행 연결은 준비 중입니다.'});
      else if(/api key/i.test(text)) done({method:'api-key',message:'API 키 인증이 확인되어 이 앱에서 사용할 수 없습니다.'});
      else done({method:'unknown',message:'ChatGPT 로그인 상태를 확인하지 못했습니다. 공식 CLI에서 로그인하세요.'});
    });
  });
}
