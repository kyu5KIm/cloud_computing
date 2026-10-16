import {attachExpandedLessons,lessonVersion} from './expanded-lessons.mjs';
import {reviewedMaterials, supplementalNotes, materialVersion} from './verified-materials.mjs';
import {attachStudyEvidence,runCheckedAt,runRevision} from './study-evidence.mjs';
const checkedAt = '2026-10-12';
const definitions = [
  ['C01','클라우드 컴퓨팅 이해하기','Understanding Cloud Computing','understanding-cloud-computing','FOUNDATIONS',[
    ['Introduction to Cloud Computing','클라우드의 기초','온프레미스와 클라우드, 확장성, IaaS·PaaS·SaaS를 다룹니다.',['Cloud computing','Scalability','IaaS','PaaS','SaaS']],
    ['Cloud Deployment','클라우드 배포','퍼블릭·프라이빗·하이브리드 배포와 데이터 보호 규정, 조직의 역할을 다룹니다.',['Public cloud','Private cloud','Hybrid cloud']],
    ['Cloud Providers and Case Studies','제공업체와 사례','AWS·Azure·Google Cloud와 제공업체 선택 사례를 다룹니다.',['AWS','Azure','Google Cloud','Vendor lock-in']]]],
  ['C02','AWS 개념','AWS Concepts','aws-concepts','AWS',[
    ['Introduction to AWS','AWS 입문','AWS의 이점, Well-Architected Framework, 클라우드 마이그레이션을 다룹니다.',['Well-Architected','Cloud migration']],
    ['Cloud Economics and Global Infrastructure','클라우드 경제성과 글로벌 인프라','비용 최적화, 배포·운영 방법, 글로벌 아키텍처를 다룹니다.',['Cloud economics','Global infrastructure']],
    ['The Core AWS Services','AWS 핵심 서비스','컴퓨팅·스토리지·데이터베이스 서비스 선택을 다룹니다.',['EC2','Lambda','S3','RDS','DynamoDB']]]],
  ['C03','AWS 클라우드 기술 및 서비스 개념','AWS Cloud Technology and Services Concepts','aws-cloud-technology-and-services','AWS',[
    ['AWS Compute Services','AWS 컴퓨팅','EC2, 부하 분산, 자동 확장, Lambda와 Fargate를 다룹니다.',['EC2','Load balancing','Auto-scaling','Lambda']],
    ['AWS Databases, Networking, and Storage','데이터베이스·네트워크·스토리지','데이터베이스와 마이그레이션, 네트워크 및 스토리지를 다룹니다.',['RDS','DynamoDB','VPC','S3','EBS']],
    ['AWS Machine Learning, AI, Analytics, and Beyond','머신러닝·AI·분석','AI·ML 서비스와 분석 도구, 기타 서비스 범주를 다룹니다.',['SageMaker','Rekognition','QuickSight']]]],
  ['C04','AWS 보안 및 비용 관리 개념','AWS Security and Cost Management Concepts','aws-security-and-cost-management','AWS',[
    ['Introduction to AWS Security and Compliance','보안과 규정 준수','공동 책임 모델과 규정 준수·거버넌스, 보안 자동화를 다룹니다.',['Shared responsibility','CloudTrail','Security Hub']],
    ['Network and User Security','네트워크와 사용자 보안','최소 권한, IAM, 네트워크 보안과 암호화를 다룹니다.',['IAM','Least privilege','NACL','Encryption']],
    ['Billing and Cost Management','결제와 비용 관리','가격 모델, 예산, 비용 배분 및 최적화 전략을 다룹니다.',['AWS Budgets','Cost allocation','Pricing models']]]],
  ['C05','Microsoft Azure 이해하기','Understanding Microsoft Azure','understanding-microsoft-azure','AZURE',[
    ['Introduction to Azure Services','Azure 서비스 입문','Azure 생태계와 핵심 구성요소, 서비스 개요를 다룹니다.',['Azure','Identity','Resources']],
    ['Azure Compute and Data Management','컴퓨팅과 데이터 관리','컴퓨팅, 스토리지, 데이터 처리 방법을 다룹니다.',['Virtual machines','Containers','AKS','Storage']],
    ['Azure Management Essentials','Azure 관리 기초','보안·규정 준수, 경제성, 리소스 관리와 마이그레이션을 다룹니다.',['Security','Resource Manager','Migration']]]],
  ['C06','Microsoft Azure 아키텍처와 서비스 이해하기','Understanding Microsoft Azure Architecture and Services','understanding-microsoft-azure-architecture-and-services','AZURE',[
    ['Azure Storage Services','Azure 스토리지','Azure 아키텍처 개요와 스토리지 서비스를 다룹니다.',['Storage account','Blob','Redundancy']],
    ['Compute and Networking Services','컴퓨팅과 네트워크','가상 머신, 네트워크 구성요소, 애플리케이션 서비스를 다룹니다.',['Virtual network','Virtual machines','App services']],
    ['Identity, Access Control and Security','ID·접근 제어·보안','클라우드 ID, 접근 제어, RBAC와 Zero Trust를 다룹니다.',['Entra ID','RBAC','Zero Trust','Defender for Cloud']]]],
  ['C07','Microsoft Azure 관리 및 거버넌스 이해하기','Understanding Microsoft Azure Management and Governance','understanding-microsoft-azure-management-and-governance','AZURE',[
    ['Azure Management and Governance Fundamentals','관리와 거버넌스 기초','비용·거버넌스·리소스 관리와 모니터링을 다룹니다.',['Governance','Tags','Locks','IaC']],
    ['Cost Management and Governance','비용 관리와 거버넌스','비용 계획, 비용 관리 도구, 거버넌스 구현을 다룹니다.',['Pricing Calculator','TCO Calculator','Azure Policy']],
    ['Resource Management and Monitoring','리소스 관리와 모니터링','Azure와 상호작용하는 도구, 리소스 관리 및 모니터링을 다룹니다.',['ARM','Azure Monitor','Service Health','Azure Advisor']]]]
];

export const sources = definitions.map(([id,,title,slug]) => ({
  id: `${id}-outline`, publisher:'DataCamp', title, url:`https://www.datacamp.com/courses/${slug}`,
  checkedAt, locator:'Course outline / chapter headings and descriptions', verificationStatus:'verified',
  accessScope:'공개 소개·목차만 확인', version:checkedAt, rightsNote:'짧은 한국어 요약과 출처 링크; 원문 자료를 재배포하지 않음'
}));
sources.push({id:'DC-cloud-ch1',publisher:'DataCamp',title:'Understanding Cloud Computing — Chapter 1 slides',
  url:'https://assets.datacamp.com/production/repositories/5796/datasets/ce42f6612ea4991332630c248859a2d791c22fe3/chapter1.pdf',
  checkedAt,locator:'PDF p.8, 14–24, 29–39, 52–67 (1-based)',verificationStatus:'verified',
  accessScope:'공개 수업 슬라이드의 해당 페이지 텍스트 확인; 현재 계정 내 강의 버전과 대조 전',version:checkedAt,
  rightsNote:'선택 개념의 짧은 재서술; 슬라이드 원본은 저장·재배포하지 않음'});
sources.push({id:'DC-cloud-models',publisher:'DataCamp',title:'Cloud service models — projector',
  url:'https://projector.datacamp.com/?projector_key=course_39627_9fbc61460a9383af8693f7f8df31d616',
  checkedAt,locator:'Cloud service models / cloud pyramid',verificationStatus:'verified',accessScope:'공개 슬라이드 텍스트·설명',version:checkedAt,rightsNote:'간단한 요약'});

export const courses = definitions.map(([id,title,englishTitle,slug,group,rows]) => ({id,title,englishTitle,group,learningUrl:`https://app.datacamp.com/learn/courses/${slug}`,sourceIds:[`${id}-outline`],
  chapters: rows.map(([englishTitle,title,summary,terms],i)=>({id:`${id}-${i+1}`,number:i+1,title,englishTitle,summary,terms,
    contentStatus:id==='C01'&&i===0?'partial-lesson':'outline-only',sourceIds:[`${id}-outline`],
    claims:[{id:`${id}-${i+1}-scope`,text:summary,contentType:'outline',sourceIds:[`${id}-outline`],supportLocator:`Course outline > ${englishTitle}`,reviewStatus:'verified'}]}))
}));

const chapter = courses[0].chapters[0];
chapter.sourceIds.push('DC-cloud-ch1','DC-cloud-models');
chapter.lesson = {
  notice:'공개 슬라이드에서 확인한 핵심 개념의 초기 요약입니다. 전체 영상·연습문제 해설은 아직 포함하지 않았습니다.',
  concepts:[
    {id:'cloud',term:'클라우드 컴퓨팅',english:'Cloud computing',text:'인터넷을 통해 컴퓨팅·저장·데이터베이스 등의 기술 서비스를 사용합니다.',locator:'p.8',sourceIds:['DC-cloud-ch1']},
    {id:'scale',term:'확장성',english:'Scalability',text:'수요에 맞춰 자원을 조정합니다. 수직 확장은 한 머신의 성능을, 수평 확장은 머신 수를 늘립니다.',locator:'p.34–37',sourceIds:['DC-cloud-ch1']},
    {id:'billing',term:'사용량 기반 요금',english:'Pay-as-you-go',text:'필요한 자원을 이용하고 사용에 따라 비용을 지불하는 방식입니다.',locator:'p.38–39',sourceIds:['DC-cloud-ch1']}
  ],
  steps:['서비스 요청 발생','컴퓨팅·저장 자원 사용','수요에 맞춰 용량 조정','사용에 따른 비용 확인'],
  stepType:'학습용 흐름 재구성',stepSources:['DC-cloud-ch1'],stepLocator:'p.8, 16–20, 34–39',
  compare:{type:'DataCamp 공개 수업 자료 요약',sourceIds:['DC-cloud-ch1'],locator:'p.14, 24, 34–39',
    headers:['비교 기준','온프레미스','클라우드'],rows:[['인프라','직접 보유·운영','제공업체 자원 이용'],['수요 변화','서버 추가·유휴 용량 고려','수요에 맞춰 자원 조정'],['선택 관점','통제','유연성']]},
  models:{type:'DataCamp 공개 슬라이드 요약',sourceIds:['DC-cloud-models'],locator:'Cloud service models / cloud pyramid',
    headers:['모델','제공 범위','학습 관점'],rows:[['IaaS','인프라','통제와 운영'],['PaaS','개발 플랫폼','개발에 집중'],['SaaS','완성된 소프트웨어','서비스 이용']],
    note:'세 모델은 추상화 수준을 비교하는 틀입니다. 서비스별 보안 책임은 별도 근거를 확인해야 합니다.'},
  scenario:{type:'학습용 가상 사례',text:'수강 신청 기간에만 이용자가 몰리는 대학 웹사이트를 가정해 보세요. 수요 변화에 맞춘 자원 조정과 운영 방식의 선택을 함께 설명해 보세요.',sourceIds:['DC-cloud-ch1']},
  caution:'“클라우드면 언제나 더 싸다”와 같은 결론은 이 자료만으로 확정할 수 없습니다. 실제 조건과 비용을 따로 비교하세요.',
  questions:[
    {id:'Q-scale',title:'수요가 변할 때 자원을 어떻게 조정할까요?',text:'온프레미스와 클라우드의 자원 운영을 비교하고, 수직·수평 확장의 차이를 설명하세요.',
      type:'자체 작성 서술형 예상문제',sourceIds:['DC-cloud-ch1'],sourceLocator:'p.14, 16–24, 34–39',version:'1',
      modelAnswer:'온프레미스는 서버 확보와 유휴 용량을 고려한다. 클라우드는 수요에 따라 자원을 조정한다. 수직 확장은 한 머신의 성능을 높이고 수평 확장은 머신을 추가한다.',
      points:['운영 방식 차이','수직·수평 확장 구분','수요 변화와 자원 조정의 연결','논리적인 구성'],
      rubric:[{label:'개념 정확성',max:4},{label:'원리·인과관계',max:3},{label:'비교·적용',max:2},{label:'논리적 구성',max:1}]},
    {id:'Q-models',title:'IaaS·PaaS·SaaS를 어떤 기준으로 구분할까요?',text:'제공 범위와 추상화 수준을 기준으로 세 모델을 비교하세요.',type:'자체 작성 서술형 예상문제',sourceIds:['DC-cloud-models'],sourceLocator:'Cloud service models / cloud pyramid',version:'1',
      modelAnswer:'IaaS는 인프라, PaaS는 개발 플랫폼, SaaS는 완성된 소프트웨어를 제공한다. IaaS에서 SaaS로 갈수록 더 많은 구현 세부사항이 추상화된다.',
      points:['세 모델의 제공 범위','추상화 수준의 차이','비교 기준의 일관성','논리적인 구성'],
      rubric:[{label:'개념 정확성',max:4},{label:'원리·인과관계',max:3},{label:'비교·적용',max:2},{label:'논리적 구성',max:1}]}
  ]
};
// 사용자 로그인 후 실제 수업 대본을 확인한 범위만 현재 수업 근거로 등록한다.
for(const [id,title,exercise,duration]of [
  ['DC-current-intro','클라우드 컴퓨팅 소개',1,'00:00–03:17'],
  ['DC-current-power','클라우드의 힘',4,'00:00–03:38'],
  ['DC-current-models','클라우드 서비스 모델',7,'00:00–03:16']
])sources.push({id,publisher:'DataCamp',title:`클라우드 컴퓨팅 이해하기 / ${title}`,
  url:`https://campus.datacamp.com/ko/courses/understanding-cloud-computing/introduction-to-cloud-computing?ex=${exercise}`,
  checkedAt,locator:`영상 대본 / ${duration}`,verificationStatus:'verified',accessScope:'사용자 로그인 후 현재 수업 대본 직접 확인',
  version:'수업 페이지 표시: 업데이트 2026년 7월; 확인 '+checkedAt,rightsNote:'개인 학습용 짧은 재서술; 대본·문항 원문을 재배포하지 않음'});
chapter.title='클라우드 컴퓨팅 입문';
chapter.sourceIds=['C01-outline','DC-current-intro','DC-current-power','DC-current-models'];
chapter.terms.push('Virtualization','Compute','Storage','Database');
chapter.lesson.notice='로그인된 현재 수업의 이론 영상 대본 3개와 연습문제 1개의 요구를 직접 확인한 핵심 요약입니다. 전체 문제와 공식 정답·해설은 아직 확인하지 않았습니다.';
for(const concept of chapter.lesson.concepts){concept.sourceIds=[concept.id==='cloud'?'DC-current-intro':'DC-current-power'];concept.locator=concept.id==='cloud'?'소개 영상 대본 00:00–03:17':'클라우드의 힘 대본 00:00–03:38';}
chapter.lesson.concepts.push(
  {id:'virtualization',term:'가상화',english:'Virtualization',text:'하나의 물리 서버를 여러 가상 서버로 나누어 각각 독립적인 머신처럼 동작하게 합니다. 자원 효율을 높이는 원리입니다.',sourceIds:['DC-current-power'],locator:'가상화 설명 / 00:00–03:38'},
  {id:'core-services',term:'컴퓨팅·스토리지·데이터베이스',english:'Compute · Storage · Database',text:'컴퓨팅은 작업을 처리하고, 스토리지는 파일을 보관하며, 데이터베이스는 데이터를 조회·관리·분석하기 쉽게 저장합니다.',sourceIds:['DC-current-power'],locator:'핵심 서비스 설명 / 00:00–03:38'}
);
chapter.lesson.stepSources=['DC-current-intro','DC-current-power'];chapter.lesson.stepLocator='소개와 클라우드의 힘 대본 / 수요·자원·요금 설명';
chapter.lesson.compare.sourceIds=['DC-current-intro','DC-current-power'];chapter.lesson.compare.locator='현재 수업 대본 / 온프레미스 비교';
chapter.lesson.compare.type='DataCamp 현재 수업 대본 요약';
chapter.lesson.models={type:'현재 DataCamp 수업 대본 요약',sourceIds:['DC-current-models'],locator:'서비스 모델 영상 대본 00:00–03:16',
  headers:['모델','제공 범위','주 이용자','수업의 예시'],rows:[['IaaS','기본 인프라','시스템 관리자','AWS EC2'],['PaaS','인프라와 개발 환경','개발자','Google App Engine'],['SaaS','온라인 소프트웨어','최종 사용자','Google Workspace']],
  note:'IaaS에서 SaaS로 갈수록 직접 제어는 줄고 이용 편의성이 높아집니다. 보안 책임의 세부사항은 서비스별로 추가 확인해야 합니다.'};
chapter.lesson.scenario={type:'DataCamp 강의의 가상 사례 요약',text:'DataCamp 같은 웹사이트의 프로모션으로 방문자가 늘어난다고 가정합니다. 직접 마련한 서버는 피크 이후 유휴 용량이 남을 수 있지만, 클라우드는 수요에 맞춰 용량을 늘리거나 줄이는 방식으로 설명합니다.',sourceIds:['DC-current-intro'],locator:'소개 영상 / 트래픽 급증·감소 예시'};
chapter.lesson.caution='수업은 수요가 안정적으로 예측되는 기업에서 온프레미스가 더 경제적일 수도 있다고 설명합니다. 클라우드가 항상 저렴하다고 결론짓지 마세요.';
chapter.lesson.cautionSources=['DC-current-power'];chapter.lesson.cautionLocator='클라우드의 힘 / 비용 비교';
chapter.lesson.questions[0].sourceIds=['DC-current-intro','DC-current-power'];chapter.lesson.questions[0].sourceLocator='현재 수업 / 온프레미스 비교·수직/수평 확장';
chapter.lesson.questions[1].sourceIds=['DC-current-models'];chapter.lesson.questions[1].sourceLocator='현재 서비스 모델 대본 / 00:00–03:16';
chapter.lesson.questions.push({id:'Q-virtualization',title:'가상화는 자원 활용에 어떤 도움을 줄까요?',text:'물리 서버와 가상 서버의 관계를 설명하고, 가상화가 자원 효율에 연결되는 이유를 서술하세요.',type:'자체 작성 서술형 예상문제',
  sourceIds:['DC-current-power'],sourceLocator:'클라우드의 힘 / 가상화 설명',version:'1',modelAnswer:'하나의 물리 서버 위에 여러 가상 서버가 각각 독립적인 머신처럼 동작한다. 물리 자원을 나누어 활용하므로 자원 효율을 높일 수 있다.',
  points:['물리 서버와 가상 서버의 관계','독립적인 머신처럼 동작함','자원 효율과의 연결','논리적인 구성'],rubric:[{label:'개념 정확성',max:4},{label:'원리·인과관계',max:3},{label:'비교·적용',max:2},{label:'논리적 구성',max:1}]});
sources.push({id:'DC-current-exercise2',publisher:'DataCamp',title:'클라우드 컴퓨팅의 가치 / 연습문제',url:'https://campus.datacamp.com/ko/courses/understanding-cloud-computing/introduction-to-cloud-computing?ex=2',checkedAt,
  locator:'문제 요구와 선택지 / 답변 제출 전 화면',verificationStatus:'verified',accessScope:'문제 요구·선택지만 직접 확인; 공식 정답·해설 미확인',version:checkedAt,rightsNote:'문항을 복제하지 않고 학습 목표만 요약'});
chapter.sourceIds.push('DC-current-exercise2');
chapter.lesson.exerciseNotes={title:'클라우드의 가치를 구분하기',type:'DataCamp 연습문제 요구 요약',
  text:'클라우드가 일상에 주는 가치를 판단하는 문제입니다. 디지털 서비스 접근의 이점과, 개인정보·온프레미스 필요성·접근 방식에 대한 과도한 단정을 구별합니다.',
  sourceIds:['DC-current-exercise2'],locator:'ex=2 / 문제·선택지',
  explanation:'자체 작성 학습 해설: 인터넷을 통해 서비스를 제공한다는 수업 정의를 먼저 떠올리세요. 서비스 접근의 이점을 모든 운영·보안 문제가 사라진다는 결론으로 확대하지 않는 연습입니다.',
  explanationSources:['DC-current-intro','DC-current-exercise2'],notice:'공식 정답·해설을 열람하거나 답안을 제출하지 않았습니다.'};
for(const material of reviewedMaterials){
  const ch=courses.flatMap(c=>c.chapters).find(c=>c.id===material.chapterId);
  sources.push({id:material.id,sourceId:material.id,publisher:'DataCamp',title:material.title,url:material.url,
    courseId:material.courseId,chapterId:material.chapterId,checkedAt,locator:material.locator,verificationStatus:'verified',
    accessScope:'공식 공개 영어 수업 대본 직접 열람; 전체 영상 시청·실습 수행·공식 정답 확인과 구분',
    version:'확인일 열람본; 공개 대본과 현재 한국어 수업의 전체 일치 미검증',rightsNote:'개념의 짧은 재서술과 링크만 제공; 대본·문항 원문 재배포 없음'});
  ch.materials??=[];ch.materials.push({...material,sourceIds:[material.id],contentType:'DataCamp 강의 확인 내용'});
  ch.sourceIds.push(material.id);ch.contentStatus='materials-verified';
  ch.claims.push({id:material.id+'-summary',text:material.summary,contentType:'DataCamp 강의 확인 내용',
    sourceIds:[material.id],supportLocator:material.locator,reviewStatus:'verified'});
}
for(const note of supplementalNotes){
  sources.push({id:note.id,sourceId:note.id,publisher:'Microsoft Learn',title:note.title,url:note.url,checkedAt,
    locator:note.locator,verificationStatus:'verified',accessScope:'보충설명 — 공식 외부 문서',version:checkedAt,rightsNote:'해당 구절의 짧은 재서술'});
  for(const chapterId of note.chapterIds){
    const ch=courses.flatMap(c=>c.chapters).find(c=>c.id===chapterId);
    ch.supplements??=[];ch.supplements.push({...note,sourceIds:[note.id],contentType:'보충설명 — 공식 외부 문서'});
    ch.sourceIds.push(note.id);
    ch.claims.push({id:chapterId+'-'+note.id,text:note.text,contentType:'보충설명 — 공식 외부 문서',sourceIds:[note.id],supportLocator:note.locator,reviewStatus:'verified'});
  }
}
attachStudyEvidence(courses,sources);
chapter.lesson.exerciseNotes.notice='문제 요구·선택지뿐 아니라 답안 제출 후 정답 피드백까지 확인했습니다. 상세 진행 기록을 아래에서 볼 수 있습니다.';
chapter.lesson.exerciseNotes.sourceIds.push('DC-run-C01-1-ex2');
attachExpandedLessons(courses,sources);
export const catalog = {version:lessonVersion+'-'+materialVersion+'-run-'+runRevision,checkedAt:runCheckedAt,courses,sources};
export const findChapter = id => courses.flatMap(c=>c.chapters).find(c=>c.id===id);
