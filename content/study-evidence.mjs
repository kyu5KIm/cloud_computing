import run from './study-run.json' with {type:'json'};
import {createHash} from 'node:crypto';
export const runCheckedAt=run.checkedAt;
export const runRevision=createHash('sha256').update(JSON.stringify(run)).digest('hex').slice(0,12);
export const runStatusLabels={
  'transcript-reviewed':'대본 확인',
  'correct-feedback-verified':'제출·정답 피드백 확인',
  'correct-after-correction':'오답 수정 후 정답 확인',
  'quiz-verified-lab-blocked':'확인 질문 정답 · 실제 실습 미완료',
  'submitted-existing-response':'기존 자기 성찰 답안 제출',
  'blocked-loading-error':'로딩 오류 · 미완료',
  'lab-blocked-awaiting-login':'로그인 대기 · 실습 미완료',
  'lab-completed-verified':'실제 콘솔 수행 · 정답 피드백 확인',
  'lab-pending-revisit':'실습 재확인 필요 · 미완료',
  'lab-in-progress':'실제 실습 진행 중 · 미완료',
  'calculator-completed-verified':'계산기 실제 입력 · 정답 피드백 확인',
  'solution-reviewed-lab-skipped':'공식 해설 확인 · 실제 실습 생략·미완료',
  'quiz-verified-lab-skipped':'문제 정답 확인 · 실제 실습 생략·미완료'
};
export function attachStudyEvidence(courses,sources){
  for(const note of run.supplements??[]){
    const ch=courses.flatMap(c=>c.chapters).find(c=>c.id===note.chapterId);
    if(!ch)throw new Error('보충 출처 챕터 누락');
    sources.push({...note,verificationStatus:'verified',version:note.checkedAt,accessScope:'보충설명 — 공식 외부 문서',rightsNote:'공식 문서 해당 항목의 짧은 재서술'});
    const noteIds=[note.id];
    for(const related of note.relatedSources??[]){
      sources.push({...related,publisher:note.publisher,courseId:note.courseId,chapterId:note.chapterId,checkedAt:note.checkedAt,
        verificationStatus:'verified',version:note.checkedAt,accessScope:'보충설명 — 공식 외부 문서',rightsNote:'해당 항목의 짧은 재서술'});
      noteIds.push(related.id);
    }
    ch.supplements??=[];
    ch.supplements.push({...note,sourceIds:noteIds,contentType:'보충설명 — 공식 외부 문서'});
    ch.sourceIds.push(...noteIds);
    ch.claims.push({id:note.id,text:note.text,contentType:'보충설명 — 공식 외부 문서',sourceIds:noteIds,supportLocator:note.locator,reviewStatus:'verified'});
  }
  for(const record of [...run.studyRun].sort((a,b)=>a.course.localeCompare(b.course)||a.chapter-b.chapter||a.ex-b.ex)){
    const manifest=run.courseManifests[record.course];
    const slugs=[...new Set(manifest.map(m=>new URL(m.url).pathname.split('/').at(-1)))];
    const item=manifest.find(m=>new URL(m.url).pathname.split('/').at(-1)===slugs[record.chapter-1]&&Number(new URL(m.url).searchParams.get('ex'))===record.ex);
    if(!item)throw new Error('수업 기록의 원문 위치 누락');
    const ch=courses.find(c=>c.id===record.course).chapters[record.chapter-1];
    const id=`DC-run-${ch.id}-ex${record.ex}`;
    const label=runStatusLabels[record.status];
    if(!label)throw new Error('알 수 없는 진행 상태');
    sources.push({id,publisher:'DataCamp',title:item.title,url:item.url,courseId:record.course,chapterId:ch.id,
      checkedAt:record.checkedAt??'2026-10-12',locator:`현재 한국어 수업 / ex=${record.ex} / ${label}`,
      verificationStatus:record.status==='blocked-loading-error'?'unverified':'verified',accessScope:label,version:'수업 화면 직접 진행 기록',rightsNote:'개인 학습용 요구·개념·피드백의 짧은 재서술; 원문 문항·개인 답안 재배포 없음'});
    ch.studyEvidence??=[];
    ch.studyEvidence.push({...record,title:item.title,url:item.url,id,sourceIds:[id,...(record.supplementIds??[])],statusLabel:label,
      contentType:record.status==='blocked-loading-error'?'확인 필요':record.kind==='theory'?'DataCamp 대본 확인':'문제 풀이에 기반한 자체 작성 학습 해설'});
    ch.sourceIds.push(id);
  }
}
