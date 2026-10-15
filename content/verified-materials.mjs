// 공식 수업 대본을 직접 읽고 작성한 개인 학습용 짧은 요약. 원문 복제 아님.
export const materialVersion = '2026-10-12.v3';
export const reviewedMaterials = [
  {
    "id": "DC-C02-1-ex1",
    "courseId": "C02",
    "chapterId": "C02-1",
    "title": "AWS의 세계",
    "url": "https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=1",
    "locator": "What is AWS? / Chapters 1–3",
    "summary": "AWS는 컴퓨팅·저장·데이터베이스 등 온디맨드 서비스를 제공하는 클라우드 플랫폼이다."
  },
  {
    "id": "DC-C02-1-ex3",
    "courseId": "C02",
    "chapterId": "C02-1",
    "title": "AWS의 이점",
    "url": "https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=3",
    "locator": "Pay for what you use / Capacity / Go global",
    "summary": "사용량 요금, 규모의 경제, 탄력적 용량, 빠른 실험과 글로벌 배포를 설명한다. 유휴 자원 종료와 최적화로 비용을 관리한다."
  },
  {
    "id": "DC-C02-1-ex6",
    "courseId": "C02",
    "chapterId": "C02-1",
    "title": "Well-Architected Framework",
    "url": "https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=6",
    "locator": "The six pillars / Reliability",
    "summary": "보안·비용 최적화·성능 효율·지속가능성·운영 우수성·신뢰성의 여섯 기둥으로 아키텍처를 평가한다. 복구 자동화와 복구 시험이 신뢰성을 뒷받침한다."
  },
  {
    "id": "DC-C02-1-ex9",
    "courseId": "C02",
    "chapterId": "C02-1",
    "title": "클라우드 마이그레이션",
    "url": "https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=9",
    "locator": "The six perspectives / Common migration strategies",
    "summary": "CAF는 비즈니스·인력·거버넌스·플랫폼·보안·운영 관점으로 도입을 준비한다. 수업은 DMS와 물리 데이터 전송을 서로 다른 이전 수단으로 소개한다."
  },
  {
    "id": "DC-C02-2-ex1",
    "courseId": "C02",
    "chapterId": "C02-2",
    "title": "클라우드 경제성",
    "url": "https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=1",
    "locator": "Fixed vs variable costs / Rightsizing / Automation",
    "summary": "초기 고정 투자와 사용량에 따른 변동 비용을 구분한다. 라이트사이징, BYOL, IaC 자동화와 관리형 서비스로 자원·운영 비용을 검토한다."
  },
  {
    "id": "DC-C02-2-ex4",
    "courseId": "C02",
    "chapterId": "C02-2",
    "title": "AWS 배포와 운영",
    "url": "https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=4",
    "locator": "Accessing AWS services / Connectivity options",
    "summary": "콘솔은 시각적 관리, CLI·SDK·API는 프로그램 접근, CloudFormation은 템플릿 기반 배포에 쓰인다. VPN은 인터넷 기반 암호화 연결, Direct Connect는 전용 연결로 비교한다."
  },
  {
    "id": "DC-C02-2-ex7",
    "courseId": "C02",
    "chapterId": "C02-2",
    "title": "글로벌 아키텍처",
    "url": "https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=7",
    "locator": "Availability zones / Edge locations",
    "summary": "리전 안의 가용 영역은 독립적인 전원·네트워크를 갖춘 데이터센터 묶음으로 설명한다. CloudFront 엣지 캐시는 사용자 가까이 콘텐츠를 두어 지연을 줄인다. 강의의 지역·거점 개수는 현재 수치로 사용하지 않는다."
  },
  {
    "id": "DC-C02-3-ex1",
    "courseId": "C02",
    "chapterId": "C02-3",
    "title": "AWS Compute 서비스",
    "url": "https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=1",
    "locator": "EC2 unpacked / Lambda unpacked",
    "summary": "EC2는 운영체제와 구성을 제어하는 가상 서버다. Lambda는 파일 업로드 등의 이벤트로 코드를 실행하는 서버리스 방식으로 대비한다."
  },
  {
    "id": "DC-C02-3-ex4",
    "courseId": "C02",
    "chapterId": "C02-3",
    "title": "AWS 데이터베이스",
    "url": "https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=4",
    "locator": "Understanding database types / AWS database migration services",
    "summary": "RDS는 관계형 데이터와 복잡한 질의·트랜잭션, DynamoDB는 키-값 기반 대규모·낮은 지연 접근으로 설명한다. DMS는 동종·이종 데이터베이스 이전을 지원하는 도구다."
  },
  {
    "id": "DC-C02-3-ex7",
    "courseId": "C02",
    "chapterId": "C02-3",
    "title": "AWS Storage 서비스",
    "url": "https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=7",
    "locator": "Storage classes / Other storage services",
    "summary": "S3 객체 저장과 장기 보관용 Glacier 계열을 접근 빈도로 비교한다. Standard, Intelligent-Tiering, Standard-IA 및 아카이브 클래스를 구분한다."
  },
  {
    "id": "DC-C03-1-ex1",
    "courseId": "C03",
    "chapterId": "C03-1",
    "title": "AWS 기술·서비스 개요",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=1",
    "locator": "Chapters 1–3 / Course format",
    "summary": "EC2·확장·서버리스, 데이터베이스·네트워크·저장, AI·분석을 연결하는 강의다. 일부 연습에는 DataCamp가 제공하는 AWS 샌드박스를 사용한다."
  },
  {
    "id": "DC-C03-1-ex3",
    "courseId": "C03",
    "chapterId": "C03-1",
    "title": "Amazon EC2",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=3",
    "locator": "EC2 instance types / Creating your EC2 instance",
    "summary": "워크로드에 맞는 인스턴스 유형을 선택한다. AMI·키 페어·VPC·보안 그룹·EBS를 구성하고 SSH·Session Manager 등의 접근 방법을 구분한다."
  },
  {
    "id": "DC-C03-1-ex6",
    "courseId": "C03",
    "chapterId": "C03-1",
    "title": "부하 분산과 자동 확장",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=6",
    "locator": "Load balancing vs. auto-scaling",
    "summary": "부하 분산은 기존 인스턴스에 트래픽을 나누고, 자동 확장은 수요에 맞춰 인스턴스 수를 바꾸는 기능으로 비교한다."
  },
  {
    "id": "DC-C03-1-ex10",
    "courseId": "C03",
    "chapterId": "C03-1",
    "title": "서버리스와 컨테이너",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=10",
    "locator": "What are containers? / Serverless architecture / Fargate",
    "summary": "컨테이너는 애플리케이션과 의존성을 묶어 실행 환경의 일관성을 높인다. ECS·EKS는 컨테이너 관리, Lambda는 이벤트 실행, Fargate는 서버 관리 없이 컨테이너 실행에 연결한다."
  },
  {
    "id": "DC-C03-2-ex1",
    "courseId": "C03",
    "chapterId": "C03-2",
    "title": "데이터베이스 유형",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=1",
    "locator": "Database categories / EC2-hosted databases",
    "summary": "관계형(RDS·Aurora), NoSQL(DynamoDB·DocumentDB), 메모리 기반, EC2 직접 운영형을 비교한다. 직접 운영형은 구성 통제와 함께 백업·관리를 사용자가 담당한다."
  },
  {
    "id": "DC-C03-2-ex4",
    "courseId": "C03",
    "chapterId": "C03-2",
    "title": "데이터 마이그레이션",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=4",
    "locator": "Data migration in practice / When to use which service",
    "summary": "평가→준비→실행→검증→최적화 순서로 이전을 설명한다. DMS는 DB 이전, SCT는 스키마 변환, DataSync는 저장 데이터 전송으로 구분한다."
  },
  {
    "id": "DC-C03-2-ex7",
    "courseId": "C03",
    "chapterId": "C03-2",
    "title": "네트워크 서비스",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=7",
    "locator": "VPC concepts / Route 53 / CloudFront",
    "summary": "VPC 안의 서브넷·라우팅·게이트웨이를 구성하고, VPN·전용 연결로 외부를 연결한다. Route 53은 DNS, CloudFront는 가까운 캐시를 통한 콘텐츠 전달로 구분한다."
  },
  {
    "id": "DC-C03-2-ex10",
    "courseId": "C03",
    "chapterId": "C03-2",
    "title": "스토리지 유형",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=10",
    "locator": "Storage types / Storage lifecycle policies / AWS Backup",
    "summary": "객체(S3)·블록(EBS)·파일(EFS)·캐시(ElastiCache) 저장을 비교한다. S3 라이프사이클은 규칙에 따라 저장 클래스를 바꾸며, AWS Backup은 중앙 백업 관리로 소개된다."
  },
  {
    "id": "DC-C03-3-ex1",
    "courseId": "C03",
    "chapterId": "C03-3",
    "title": "AI·ML 서비스",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=1",
    "locator": "AI & ML services / SageMaker / Sample ML pipeline",
    "summary": "미리 준비된 AI 기능과 사용자 모델 개발을 구분한다. Translate·Polly·Lex·Rekognition 등과 SageMaker, TensorFlow·PyTorch 등의 프레임워크를 소개한다."
  },
  {
    "id": "DC-C03-3-ex4",
    "courseId": "C03",
    "chapterId": "C03-3",
    "title": "분석과 BI",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=4",
    "locator": "Athena / QuickSight / Kinesis / Glue",
    "summary": "Kinesis로 스트림을 받고, S3 저장과 Glue 변환을 연결한다. Athena는 질의, Redshift는 웨어하우스, QuickSight는 시각화, Macie는 민감 데이터 발견의 역할로 구분한다."
  },
  {
    "id": "DC-C03-3-ex7",
    "courseId": "C03",
    "chapterId": "C03-3",
    "title": "기타 AWS 서비스",
    "url": "https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=7",
    "locator": "Application integration / Developer services / Advanced intelligence",
    "summary": "EventBridge의 이벤트 연결, SQS의 큐, SNS의 알림을 구분한다. Connect·SES, CodePipeline·CodeCommit, IoT Core·Braket의 서비스 범주를 소개한다."
  },
  {
    "id": "DC-C04-1-ex1",
    "courseId": "C04",
    "chapterId": "C04-1",
    "title": "보안·비용 관리 개요",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=1",
    "locator": "The structure of this course",
    "summary": "보안·거버넌스, ID·네트워크·저장 보호, 비용 분석·최적화를 세 챕터로 연결한다."
  },
  {
    "id": "DC-C04-1-ex3",
    "courseId": "C04",
    "chapterId": "C04-1",
    "title": "공동 책임 모델",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=3",
    "locator": "Shared responsibility / How responsibilities change",
    "summary": "AWS는 물리 인프라를 보호하고 고객은 사용하는 서비스에 따라 운영체제·애플리케이션·데이터·자격증명을 보호한다. 관리형·서버리스 선택에 따라 책임 경계가 달라진다."
  },
  {
    "id": "DC-C04-1-ex7",
    "courseId": "C04",
    "chapterId": "C04-1",
    "title": "규정 준수와 거버넌스",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=7",
    "locator": "Governance functions / AWS tools for governance",
    "summary": "자원 식별, 탐지, 보호, 대응, 복구를 정책과 도구로 연결한다. CloudTrail은 사용자·API 활동 추적, Inspector는 취약점, GuardDuty는 위협 탐지로 소개한다."
  },
  {
    "id": "DC-C04-1-ex11",
    "courseId": "C04",
    "chapterId": "C04-1",
    "title": "보안 자동화",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=11",
    "locator": "Security Hub / Trusted Advisor / Limitations",
    "summary": "Security Hub는 보안 상태와 발견 사항을 모으고, Trusted Advisor는 비용·성능·신뢰성·보안 권고를 제공한다. 자동화 도구는 전문가의 판단을 대체하지 않는다."
  },
  {
    "id": "DC-C04-2-ex1",
    "courseId": "C04",
    "chapterId": "C04-2",
    "title": "최소 권한",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=1",
    "locator": "Strategies for least privilege / Root user security",
    "summary": "업무에 필요한 가장 좁은 권한을 부여한다. 루트 보호·MFA, 그룹 권한, 역할·임시 자격증명, Secrets Manager로 자격증명 보호를 연결한다."
  },
  {
    "id": "DC-C04-2-ex5",
    "courseId": "C04",
    "chapterId": "C04-2",
    "title": "IAM",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=5",
    "locator": "Users vs. Roles / Policy / Identity Center",
    "summary": "사용자·그룹·역할·정책을 구분한다. 정책은 리소스에서 허용할 작업을 표현하고, 역할은 임시 자격증명을 사용한다. Identity Center는 여러 계정·앱의 인력 접근을 중앙 관리한다."
  },
  {
    "id": "DC-C04-2-ex9",
    "courseId": "C04",
    "chapterId": "C04-2",
    "title": "네트워크 보안",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=9",
    "locator": "VPC security / NACL, firewall, and WAF",
    "summary": "서브넷과 환경을 분리하고 NACL·방화벽·WAF·흐름 로그를 연결한다. NACL은 서브넷의 네트워크 제어, WAF는 웹 요청 보호라는 범위를 비교한다."
  },
  {
    "id": "DC-C04-2-ex13",
    "courseId": "C04",
    "chapterId": "C04-2",
    "title": "컴퓨팅과 데이터 보안",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=13",
    "locator": "Security groups / Encryption at-rest",
    "summary": "보안 그룹은 인스턴스 트래픽을 제어하는 상태 기반 방화벽이다. 저장 데이터 암호화·KMS, S3 공개 접근 점검·버전 관리·복제를 연결한다."
  },
  {
    "id": "DC-C04-3-ex1",
    "courseId": "C04",
    "chapterId": "C04-3",
    "title": "AWS 가격 모델",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=1",
    "locator": "Pricing models / Bandwidth costs / Pricing calculator",
    "summary": "온디맨드·장기 약정·대량 사용 할인과 데이터 전송 비용을 구분한다. Pricing Calculator는 사전 견적 도구이며 강의 가격 숫자는 현재 요금으로 재사용하지 않는다."
  },
  {
    "id": "DC-C04-3-ex5",
    "courseId": "C04",
    "chapterId": "C04-3",
    "title": "예산과 비용 관리",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=5",
    "locator": "Cost Explorer / Budgets / Guidelines",
    "summary": "Cost Explorer로 지출을 분석하고 Budgets로 목표·알림·대응을 정한다. SNS·Lambda 같은 대응 흐름을 소개하며, 예산 도구만으로 비용 통제가 보장되지 않는다고 설명한다."
  },
  {
    "id": "DC-C04-3-ex9",
    "courseId": "C04",
    "chapterId": "C04-3",
    "title": "비용 배분·결제·지원",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=9",
    "locator": "Cost allocation tags / AWS Organization / AWS Health",
    "summary": "태그와 계정별 비용 구분, Organizations의 통합 비용, AWS Health의 서비스 영향 확인을 소개한다. 지원 플랜·응답 시간의 현재 조건은 별도 확인 대상으로 남긴다."
  },
  {
    "id": "DC-C04-3-ex13",
    "courseId": "C04",
    "chapterId": "C04-3",
    "title": "비용 최적화",
    "url": "https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=13",
    "locator": "Cost optimization framework / Optimization example",
    "summary": "라이트사이징, 탄력적 용량, 가격 모델 선택, Lambda 같은 대안, 저장 수명 주기를 검토한다. 중단 허용 배치와 상시 웹 요청을 서로 다른 워크로드로 비교한다."
  },
  {
    "id": "DC-C05-1-ex1",
    "courseId": "C05",
    "chapterId": "C05-1",
    "title": "Microsoft Azure 소개",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=1",
    "locator": "Cloud computing / Benefits",
    "summary": "Azure는 컴퓨팅·저장·네트워크 등을 제공하는 클라우드 플랫폼이다. 온디맨드 자원과 수직·수평 확장, 웹 호스팅·분석 등 활용 범위를 소개한다."
  },
  {
    "id": "DC-C05-1-ex5",
    "courseId": "C05",
    "chapterId": "C05-1",
    "title": "Azure 핵심 구성요소",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=5",
    "locator": "Resources / Resource groups / ARM",
    "summary": "리소스는 서비스를 구성하는 단위이며 리소스 그룹으로 관련 자원을 묶는다. ARM은 배포·관리 계층으로 소개된다."
  },
  {
    "id": "DC-C05-1-ex9",
    "courseId": "C05",
    "chapterId": "C05-1",
    "title": "Azure 서비스 개요",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=9",
    "locator": "IaaS / PaaS / SaaS",
    "summary": "VM의 운영체제 관리, App Service의 플랫폼 관리, SaaS 이용을 관리 책임으로 비교한다. 서비스 모델이 달라도 고객의 데이터·계정 보호 책임을 검토한다."
  },
  {
    "id": "DC-C05-2-ex1",
    "courseId": "C05",
    "chapterId": "C05-2",
    "title": "Azure Compute 1",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=1",
    "locator": "Virtual machines / App Service / Functions",
    "summary": "VM은 운영체제 통제, App Service는 웹·API 호스팅, Functions는 이벤트 기반 코드 실행으로 구분한다. 서버리스는 서버 운영을 공급자가 맡는 방식이다."
  },
  {
    "id": "DC-C05-2-ex5",
    "courseId": "C05",
    "chapterId": "C05-2",
    "title": "Azure Compute 2",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=5",
    "locator": "Containers / AKS / ACI / Container Apps",
    "summary": "컨테이너는 앱과 의존성을 묶는다. AKS는 Kubernetes 기반 관리, ACI는 간단한 컨테이너 실행, Container Apps는 관리형 앱 실행으로 비교한다."
  },
  {
    "id": "DC-C05-2-ex9",
    "courseId": "C05",
    "chapterId": "C05-2",
    "title": "Azure Storage",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=9",
    "locator": "Access tiers / LRS, GRS, ZRS",
    "summary": "접근 빈도·복구 지연에 따라 저장 계층을 선택한다. Blob·Files·Data Lake와 지역 내·영역 간·지역 간 중복성을 구분한다."
  },
  {
    "id": "DC-C05-2-ex12",
    "courseId": "C05",
    "chapterId": "C05-2",
    "title": "스토리지 계정 생성",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=12",
    "locator": "Demo / Versioning",
    "summary": "구독·리소스 그룹·이름·지역·성능·중복성 선택 후 설정을 검토한다. Blob 버전 관리는 과거 데이터를 보존하는 선택 항목으로 소개된다. 실습 자원은 생성하지 않았다."
  },
  {
    "id": "DC-C05-2-ex14",
    "courseId": "C05",
    "chapterId": "C05-2",
    "title": "데이터 처리",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=14",
    "locator": "Real-time vs batch / ETL / Processing tools",
    "summary": "실시간과 배치 처리를 요구 지연 시간으로 비교한다. ETL은 추출→변환→적재이며 Stream Analytics, Data Factory, Databricks 등의 역할을 소개한다."
  },
  {
    "id": "DC-C05-3-ex1",
    "courseId": "C05",
    "chapterId": "C05-3",
    "title": "보안과 규정 준수",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=1",
    "locator": "RBAC / Network security / Key Vault",
    "summary": "저장·전송 암호화, RBAC 권한, 네트워크 제어와 Key Vault의 비밀 보관을 연결한다. 강의의 옛 서비스 명칭은 현재 명칭과 분리해 검토한다."
  },
  {
    "id": "DC-C05-3-ex5",
    "courseId": "C05",
    "chapterId": "C05-3",
    "title": "Azure 경제성",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=5",
    "locator": "Pricing / Spot / Calculators",
    "summary": "종량제·장기 약정·중단 가능한 Spot을 워크로드로 비교한다. Pricing Calculator는 서비스 견적, TCO Calculator는 이전 비용 비교, Cost Management는 지출 분석으로 소개된다."
  },
  {
    "id": "DC-C05-3-ex9",
    "courseId": "C05",
    "chapterId": "C05-3",
    "title": "Azure 가격 계산기",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=9",
    "locator": "Demo / Actual costs can vary",
    "summary": "지역·운영체제·사용 시간·약정을 입력해 VM 견적을 비교한다. 계산기 결과는 추정치이며 실제 비용은 사용량·추가 서비스·가격 변경에 따라 달라진다."
  },
  {
    "id": "DC-C05-3-ex11",
    "courseId": "C05",
    "chapterId": "C05-3",
    "title": "리소스 관리",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=11",
    "locator": "ARM / Monitor / Automation / Advisor / Policy",
    "summary": "ARM의 반복 배포, Monitor의 관찰·알림, Automation의 반복 작업, Advisor의 권고, Policy의 조직 기준을 구분한다."
  },
  {
    "id": "DC-C05-3-ex15",
    "courseId": "C05",
    "chapterId": "C05-3",
    "title": "Azure 통합과 이전",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=15",
    "locator": "Planning, implementation, operations / Migration strategies",
    "summary": "계획→구현→운영 흐름과 재호스팅·리팩터링·재설계·재구축을 비교한다. VPN·ExpressRoute 연결과 Migrate·Site Recovery·DB Migration Service 역할을 소개한다."
  },
  {
    "id": "DC-C06-1-ex1",
    "courseId": "C06",
    "chapterId": "C06-1",
    "title": "Azure 아키텍처와 서비스 개요",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=1",
    "locator": "Regions / Resources / Hierarchical structure",
    "summary": "리전·가용 영역의 물리 구분과 관리 그룹→구독→리소스 그룹→리소스의 관리 구조를 소개한다. 리소스 그룹은 중첩하지 않으며 자원 묶음으로 사용한다."
  },
  {
    "id": "DC-C06-1-ex5",
    "courseId": "C06",
    "chapterId": "C06-1",
    "title": "Azure 저장 서비스",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=5",
    "locator": "Blobs / Files / Queues / Tables / Disks",
    "summary": "Blob은 객체, Files는 공유 파일, Queues는 메시지, Tables는 NoSQL, Disks는 VM 영구 저장으로 비교한다. 접근 빈도로 Hot·Cool·Cold·Archive 계층을 구분한다."
  },
  {
    "id": "DC-C06-1-ex9",
    "courseId": "C06",
    "chapterId": "C06-1",
    "title": "스토리지 계정 생성과 삭제",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=9",
    "locator": "Demo",
    "summary": "리소스 그룹·고유 이름·지역·성능·중복성을 선택하고 검증 후 생성하는 시연을 확인했다. 실제 계정 생성·삭제는 수행하지 않았다."
  },
  {
    "id": "DC-C06-1-ex12",
    "courseId": "C06",
    "chapterId": "C06-1",
    "title": "저장 구성과 파일 관리",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=12",
    "locator": "Redundancy / Migration / File operations",
    "summary": "LRS·ZRS·GRS·GZRS를 복제 범위로 비교한다. Migrate·Data Box는 이전, AzCopy·Storage Explorer는 파일 작업, File Sync는 동기화로 구분한다."
  },
  {
    "id": "DC-C06-1-ex16",
    "courseId": "C06",
    "chapterId": "C06-1",
    "title": "Blob 작업",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=16",
    "locator": "Demo",
    "summary": "컨테이너 생성→Blob 업로드→조회·다운로드 흐름과 지원 텍스트 형식의 포털 편집을 시연한다. 앱 컨테이너와 Blob 컨테이너 용어를 구별한다."
  },
  {
    "id": "DC-C06-2-ex1",
    "courseId": "C06",
    "chapterId": "C06-2",
    "title": "Azure 컴퓨팅 서비스",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=1",
    "locator": "IaaS / PaaS / Functions / Containers",
    "summary": "IaaS VM, PaaS Azure SQL·App Service, 이벤트 기반 Functions의 관리 책임을 비교한다. ACI·Registry·AKS의 실행·이미지 저장·오케스트레이션 역할을 구분한다."
  },
  {
    "id": "DC-C06-2-ex4",
    "courseId": "C06",
    "chapterId": "C06-2",
    "title": "Azure 네트워킹",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=4",
    "locator": "VNET / Peering / VPN / ExpressRoute / DNS",
    "summary": "주소 공간을 서브넷으로 나누고 VNET으로 자원을 연결한다. Peering·VPN·ExpressRoute 연결과 DNS 이름 해석을 소개한다. 엔드포인트의 단순화된 설명은 검토 항목으로 남긴다."
  },
  {
    "id": "DC-C06-2-ex8",
    "courseId": "C06",
    "chapterId": "C06-2",
    "title": "Azure VM",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=8",
    "locator": "Components / Scale sets / Availability sets",
    "summary": "CPU·메모리·OS·디스크·NIC·VNET을 VM 구성으로 연결한다. Scale Sets는 수요에 따른 VM 수 조정, Availability Sets는 하드웨어·유지보수 장애 분산으로 비교한다."
  },
  {
    "id": "DC-C06-2-ex11",
    "courseId": "C06",
    "chapterId": "C06-2",
    "title": "VM 생성과 구성",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=11",
    "locator": "Demo",
    "summary": "리소스 그룹→이미지·크기·가용성→관리자 접근→디스크·네트워크→검증 흐름을 시연한다. 데모의 공개 RDP·라이선스 선택을 일반 운영 권고로 사용하지 않는다."
  },
  {
    "id": "DC-C06-2-ex13",
    "courseId": "C06",
    "chapterId": "C06-2",
    "title": "앱 호스팅 선택",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=13",
    "locator": "Migration / App Service / Web jobs",
    "summary": "기존 앱의 VM 이전과 컨테이너·App Service 활용을 비교한다. 웹 요청 처리, API 통신, 백그라운드 작업을 서로 다른 역할로 설명한다."
  },
  {
    "id": "DC-C06-3-ex1",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "Azure 디렉터리 서비스",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=1",
    "locator": "Active Directory / Entra ID / Hybrid",
    "summary": "온프레미스 AD와 클라우드 Entra ID를 ID·접근 관리로 연결한다. SSO·외부 ID·하이브리드 동기화의 목적을 소개한다."
  },
  {
    "id": "DC-C06-3-ex6",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "ID와 접근 제어",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=6",
    "locator": "MFA / Passwordless / Conditional access",
    "summary": "인증은 신원 확인이다. MFA·Windows Hello·Authenticator·FIDO2와 조건부 접근의 사용자·기기·위치 신호를 소개한다."
  },
  {
    "id": "DC-C06-3-ex10",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "Entra ID 사용자·그룹 생성",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=10",
    "locator": "Demo / Administrative limitations",
    "summary": "사용자 생성과 그룹 멤버 연결 시연을 확인했다. 원문은 샌드박스의 관리 제한으로 해당 사용자 생성 실습을 제공하지 않는다고 명시한다."
  },
  {
    "id": "DC-C06-3-ex11",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "Azure 권한 모델",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=11",
    "locator": "Directory roles / RBAC / Inheritance",
    "summary": "디렉터리 관리 역할과 Azure 리소스 RBAC를 관리 대상으로 비교한다. 상위 범위의 권한이 하위에 상속되는 흐름을 소개한다. 상속 제거 예시는 검토 보류한다."
  },
  {
    "id": "DC-C06-3-ex15",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "Azure 권한 구성",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=15",
    "locator": "Demo / Storage Blob Data Contributor",
    "summary": "리소스 그룹에 데이터 역할을 부여해 하위 저장 자원에 상속시키는 시연과 개별 자원에 직접 부여하는 시연을 비교한다. 실제 권한 변경은 수행하지 않았다."
  },
  {
    "id": "DC-C06-3-ex17",
    "courseId": "C06",
    "chapterId": "C06-3",
    "title": "Azure 클라우드 보안",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=17",
    "locator": "Zero Trust / Defense-in-depth / Defender",
    "summary": "Zero Trust는 명시적 검증·최소 권한·침해 가정으로 설명한다. 다층 방어와 Defender for Cloud의 상태 평가·보안 강화·위협 탐지를 연결한다."
  },
  {
    "id": "DC-C07-1-ex1",
    "courseId": "C07",
    "chapterId": "C07-1",
    "title": "Azure 관리와 거버넌스",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=1",
    "locator": "Services vs resources / Four uses",
    "summary": "서비스는 기능 묶음, 리소스는 관리 대상 인스턴스로 구별한다. 비용 관리·정책 기준·리소스 관리·모니터링을 업무 지원의 네 축으로 연결한다."
  },
  {
    "id": "DC-C07-1-ex5",
    "courseId": "C07",
    "chapterId": "C07-1",
    "title": "비용 관리와 거버넌스",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=5",
    "locator": "Costs / Governance / Audit trail",
    "summary": "사용량 지출을 관찰하고 예산·알림을 설정한다. 거버넌스의 책임성·투명성·보안과 정책·활동 기록·준수 보고를 연결한다."
  },
  {
    "id": "DC-C07-1-ex9",
    "courseId": "C07",
    "chapterId": "C07-1",
    "title": "리소스 관리와 모니터링",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=9",
    "locator": "IaC / Tags / Locks / Monitoring",
    "summary": "IaC는 코드 기반 반복 배포, 태그는 분류 메타데이터, 잠금은 변경·삭제 제어로 비교한다. 관찰 데이터로 장애와 용량 요구를 살핀다."
  },
  {
    "id": "DC-C07-1-ex13",
    "courseId": "C07",
    "chapterId": "C07-1",
    "title": "리소스 생성·태그·잠금",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=13",
    "locator": "Demo",
    "summary": "VM 설정 검토→이름·값 태그 부여→생성→태그 수정·잠금 설정의 포털 시연을 확인했다. 실제 자원 생성·잠금 변경은 수행하지 않았다."
  },
  {
    "id": "DC-C07-2-ex1",
    "courseId": "C07",
    "chapterId": "C07-2",
    "title": "비용 계획과 관리",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=1",
    "locator": "Cost factors / Ways to manage costs",
    "summary": "사용량·구독 조건·자원 유형과 설정·지역·전송을 비용 요인으로 소개한다. 사전 견적, 사용 중 분석, 미사용 자원 검토를 구분한다."
  },
  {
    "id": "DC-C07-2-ex5",
    "courseId": "C07",
    "chapterId": "C07-2",
    "title": "비용 관리 도구",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=5",
    "locator": "Pricing Calculator / TCO / Cost Analysis",
    "summary": "Pricing Calculator는 자원 구성 견적, TCO는 온프레미스와 이전 비용 비교, Cost Management는 실제 지출 관찰로 구분한다. Cost Analysis에서 필터·시각화·예측을 소개한다."
  },
  {
    "id": "DC-C07-2-ex9",
    "courseId": "C07",
    "chapterId": "C07-2",
    "title": "거버넌스·준수 구현",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=9",
    "locator": "Service Trust Portal / Microsoft Purview",
    "summary": "Service Trust Portal의 공급자 보안·준수 문서와 Purview의 데이터 관리·분류·준수 평가를 구분한다. 점수와 권고는 준수 보장으로 해석하지 않는다."
  },
  {
    "id": "DC-C07-2-ex13",
    "courseId": "C07",
    "chapterId": "C07-2",
    "title": "거버넌스 도구",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=13",
    "locator": "Policy / Initiatives / Blueprints",
    "summary": "Policy는 기준의 평가·시행, Initiative는 관련 정책 묶음으로 소개된다. 원문의 Blueprints 배포 표준화는 수업 시점 내용이며 현재 사용 권고와 분리한다."
  },
  {
    "id": "DC-C07-2-ex17",
    "courseId": "C07",
    "chapterId": "C07-2",
    "title": "가격 계산기 활용",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=17",
    "locator": "Demo",
    "summary": "분석 구성 예시를 견적에 추가하고 각 제품의 설정·통화를 조정해 비용을 검토하는 시연을 확인했다. 샘플 견적은 현재 실제 요금으로 사용하지 않는다."
  },
  {
    "id": "DC-C07-3-ex1",
    "courseId": "C07",
    "chapterId": "C07-3",
    "title": "Azure 접근 도구",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=1",
    "locator": "Portal / PowerShell / CLI / Arc / Mobile",
    "summary": "Portal의 GUI, PowerShell·CLI 자동화, Arc의 외부 자원 연결, 모바일 상태 관찰을 소개한다. CLI를 Bash에서만 동작하는 도구로 해석하지 않는다."
  },
  {
    "id": "DC-C07-3-ex5",
    "courseId": "C07",
    "chapterId": "C07-3",
    "title": "Azure 리소스 관리",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=5",
    "locator": "ARM / Resource providers / Templates",
    "summary": "ARM이 자원 배포를 관리하고 resource provider가 유형별 작업을 수행한다. 템플릿·Bicep과 버전 관리로 반복 가능한 구성을 만든다."
  },
  {
    "id": "DC-C07-3-ex9",
    "courseId": "C07",
    "chapterId": "C07-3",
    "title": "Azure Monitor",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=9",
    "locator": "Data collection / Analysis / Alerts",
    "summary": "수집→분석·시각화→알림·대응으로 관찰 흐름을 설명한다. Metrics는 수치, Logs는 이벤트와 상세 기록으로 비교한다."
  },
  {
    "id": "DC-C07-3-ex13",
    "courseId": "C07",
    "chapterId": "C07-3",
    "title": "모니터링 도구",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=13",
    "locator": "Application Insights / Log Analytics / Service Health / Advisor",
    "summary": "Application Insights의 앱 관찰, Log Analytics의 로그 분석, Alerts의 조건 대응, Service Health의 서비스 영향, Advisor의 최적화 권고를 구별한다."
  },
  {
    "id": "DC-C07-3-ex18",
    "courseId": "C07",
    "chapterId": "C07-3",
    "title": "Monitor 알림 설정",
    "url": "https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=18",
    "locator": "Demo / Available Memory / Action group",
    "summary": "대상 범위→신호→임계값→동작 그룹→검증 순서로 알림을 설정한다. 시연은 사용 가능 메모리가 임계값 아래로 떨어질 때 알리는 규칙이며 사용량 증가와 신호 방향을 구분한다."
  }
];
export const supplementalNotes = [
  {
    "id": "MS-rbac-inheritance",
    "chapterIds": [
      "C06-3"
    ],
    "title": "RBAC 상속 권한 제거",
    "url": "https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-remove",
    "locator": "Azure portal / inherited role assignments",
    "text": "하위 범위에서 상속된 역할 할당을 제거할 수 없다. 역할을 부여한 상위 범위에서 할당을 변경해야 한다. 수업의 단순한 ‘상속 끊기’ 예시는 확정 근거로 사용하지 않는다."
  },
  {
    "id": "MS-budget-alerts",
    "chapterIds": [
      "C05-3",
      "C07-1",
      "C07-2"
    ],
    "title": "예산 알림과 소비 중단 구분",
    "url": "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets",
    "locator": "In this article / resources aren't affected",
    "text": "Azure 예산 임계값 알림만으로 리소스나 소비가 중단되지 않는다. 예산 알림과 별도 자동화 대응을 구분한다."
  },
  {
    "id": "MS-blueprints-retirement",
    "chapterIds": [
      "C05-3",
      "C07-2"
    ],
    "title": "Azure Blueprints 단계적 종료",
    "url": "https://learn.microsoft.com/en-us/azure///governance/blueprints/blueprint-retirement",
    "locator": "Phased retirement timeline / 2026-07-31, 2027-01-31",
    "text": "Microsoft의 확인일 기준 문서는 2026년 7월 31일부터 단계적 종료, 2027년 1월 31일 종료를 안내한다. 수업의 Blueprints 설명은 학습 범위로 남기고 새 운영 선택은 별도 검토한다."
  }
];
