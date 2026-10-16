import c01 from './lessons/c01.mjs';
import c02 from './lessons/c02.mjs';
import c03 from './lessons/c03.mjs';
import c04 from './lessons/c04.mjs';
import c05 from './lessons/c05.mjs';
import c06 from './lessons/c06.mjs';
import c07 from './lessons/c07.mjs';

export const lessonVersion='2026-10-16-expanded-v1';
const definitions=[...c01,...c02,...c03,...c04,...c05,...c06,...c07];
const rubric=[{label:'개념 정확성',max:4},{label:'원리·인과관계',max:3},{label:'비교·적용',max:2},{label:'논리적 구성',max:1}];
const acceptedStatuses=new Set(['transcript-reviewed','correct-feedback-verified','correct-after-correction','quiz-verified-lab-skipped','quiz-verified-lab-blocked','lab-completed-verified','calculator-completed-verified']);

// 학습안에 기재한 ex만 연결한다. 목차나 미완료 화면을 본문 사실의 근거로 승격하지 않는다.
export function attachExpandedLessons(courses,sources){
  const chapters=courses.flatMap(course=>course.chapters);
  const registry=new Map(sources.map(source=>[source.id,source]));
  if(definitions.length!==21||new Set(definitions.map(item=>item.id)).size!==21)throw new Error('챕터 학습안 누락·중복');
  for(const data of definitions){
    const chapter=chapters.find(item=>item.id===data.id);
    if(!chapter)throw new Error('알 수 없는 학습안 챕터: '+data.id);
    const locate=(exs)=>{
      if(!exs?.length)throw new Error('근거 위치 누락: '+data.id);
      const sourceIds=exs.map(ex=>{
        const record=chapter.studyEvidence.find(item=>item.ex===ex);
        if(!record||!acceptedStatuses.has(record.status)||registry.get(record.id)?.verificationStatus!=='verified')throw new Error('미확인 근거: '+data.id+' ex='+ex);
        return record.id;
      });
      return {sourceIds,locator:'직접 확인한 DataCamp 수업 / ex='+exs.join(', ')};
    };
    let claimNumber=0;
    const block=(item,contentType,text)=>{
      const claimId=`${data.id}-expanded-${++claimNumber}`;
      const support=locate(item.ex);
      chapter.claims.push({id:claimId,text,contentType,sourceIds:support.sourceIds,supportLocator:support.locator,reviewStatus:'verified'});
      return {...item,...support,claimId,contentType};
    };
    const concepts=data.concepts.map(([term,english,ex,text],i)=>block({id:`${data.id}-concept-${i+1}`,term,english,ex,text},'DataCamp 강의 확인 내용',text));
    const questions=data.questions.map((item,i)=>{
      const result=block(item,'자체 작성 서술형 예상문제',item.answer);
      return {...result,id:item.id??`Q-${data.id}-${i+1}`,modelAnswer:item.answer,version:lessonVersion,type:'자체 작성 서술형 예상문제',sourceLocator:result.locator,
        conceptIds:concepts.filter(concept=>concept.ex.some(ex=>item.ex.includes(ex))).map(concept=>concept.id),
        objective:data.objectives[i],expectedLength:'핵심 논점 중심 5~7문장',acceptedAlternatives:'동일한 개념·인과관계와 요구를 충족하는 대안 표현을 인정합니다. 서비스 이름만 같은 답은 충분하지 않습니다.',
        commonMistakes:data.misconceptions.filter(m=>m.ex.some(ex=>item.ex.includes(ex))).map(m=>m.wrong),rubric:structuredClone(rubric)};
    });
    const why=block(data.why,'학습용 재구성',data.why.text);
    const flow=block(data.flow,'학습용 흐름 재구성',data.flow.steps.join('\n'));
    const comparisons=data.comparisons.map(item=>block(item,'학습용 비교 재구성',item.rows.map(row=>row.join(' / ')).join('\n')));
    const scenario=block(data.scenario,'학습용 가상 사례',Object.entries(data.scenario).filter(([key])=>key!=='ex').map(([,value])=>value).join('\n'));
    const misconceptions=data.misconceptions.map(item=>block(item,'자체 작성 오답 보완',item.right));
    const usedIds=[...new Set(chapter.claims.filter(claim=>claim.id.startsWith(data.id+'-expanded-')).flatMap(claim=>claim.sourceIds))];
    chapter.studyGuide={version:lessonVersion,prerequisites:data.prerequisites,objectives:data.objectives,why,concepts,flow,comparisons,scenario,misconceptions,
      recap:data.recap,sourceIds:usedIds,notice:'직접 확인한 DataCamp 수업 개념을 한국어로 풀어쓴 학습안입니다. 흐름·비교·가상 사례·예상문제·모범답안은 학습용으로 재구성했으며 공식 문항·정답이나 출제 보장이 아닙니다. 확인 이후의 제품 사양·가격·지원 상태는 별도 검증이 필요합니다.'};
    // 기존 저장 키 세 개는 유지한다. 사용자 진도·초안·자기 점검을 새로 생성하거나 덮어쓰지 않는다.
    chapter.lesson={notice:chapter.studyGuide.notice,concepts,steps:flow.steps,stepType:flow.contentType,stepSources:flow.sourceIds,stepLocator:flow.locator,
      compare:comparisons[0],questions};
    chapter.contentStatus='expanded-lesson';
    chapter.terms=[...new Set([...chapter.terms,...concepts.flatMap(item=>[item.term,...item.english.split(' · ')])])];
  }
}
