# DataCamp 학습 자료 확인 기록

확인일: 2026-10-12 (Asia/Seoul). 콘텐츠 버전: 2026-10-12.v3.

## 확인 결과와 범위

사용자가 제공한 6개 강의를 지정 순서로 직접 열었다. 로그인된 강의 화면에서 강의명·챕터 목록을 대조했으며 AWS 기술과 Azure 아키텍처의 일시적인 서버 오류는 재방문 시 복구됐다. 18개 챕터의 이론·시연 대본 76개를 DataCamp 공식 campus 페이지에서 읽고 짧은 한국어 요약과 원문 위치를 기록했다. 마무리·축하 영상 6개는 내용 요약 대상에서 제외했다.

이 기록은 영상 전체 재생·시청이나 모든 문항 풀이 완료를 의미하지 않는다. 공개 영어 대본이 주된 내용 근거이며 현재 한국어 대본과 모든 슬라이드의 일치를 검증하지 않았다. 로그인된 한국어 대본을 직접 읽은 표본은 AWS 입문, Azure 입문, Azure 아키텍처 소개다. AWS 보안 및 Azure 거버넌스의 실제 영상 화면도 열었으나 대본이 비어 있던 초기 화면은 내용 근거로 세지 않았다.

실습은 대본의 시연 흐름만 확인했다. AWS/Azure 자원을 생성하거나 변경하지 않았고 DataCamp 답안을 제출하지 않았다. 연습문제 제목 확인은 문제 요구·공식 정답·해설 확인과 구분한다. Azure Billing Strategies(ex=8)는 문제 요구만 추가 열람했으며 공식 정답은 확인하지 않았다.

웹사이트에는 확인한 개념 요약, 출처, 확인 범위, 별도 Microsoft 보충설명을 반영했다. 18개 챕터의 전체 학습 구성·비교표·서술형 문제·모범답안·채점 기준은 아직 작성 전이다. 기존 입문 1챕터의 자체 작성 연습 3개는 유지한다. 실제 Codex AI 추론은 기존처럼 활성화하지 않았다.

## 로그인된 강의 화면의 메타데이터

업데이트 월은 DataCamp 화면 표시값이며 모든 대본의 수정일을 의미하지 않는다. 학습 완료 배지는 이 앱의 숙달도로 가져오지 않았다.

|강의|업데이트 표시|영상|연습문제|열람 대본|챕터|
|---|---|---:|---:|---:|---:|
|C02 AWS 개념|2026년 4월|11|31|10|3|
|C03 AWS 클라우드 기술 및 서비스 개념|2026년 7월|12|36|11|3|
|C04 AWS 보안 및 비용 관리 개념|2026년 4월|13|48|12|3|
|C05 Microsoft Azure 이해하기|2026년 9월|14|46|13|3|
|C06 Microsoft Azure 아키텍처와 서비스 이해하기|2026년 1월|17|54|16|3|
|C07 Microsoft Azure 관리 및 거버넌스 이해하기|2026년 3월|15|53|14|3|

## 추가 자료

[AWS Concepts 공식 용어집](https://assets.datacamp.com/production/repositories/6455/datasets/1e79cf3e43d4631b702eb304c75772aa5e1aaf64/AWS%20Concepts.pdf)의 1페이지를 직접 확인했다. EC2·S3·RDS·DynamoDB·CAF·CloudFormation·elasticity·rightsizing 및 여섯 기둥 정의가 있다. AWS 범위와 관련 없는 중복 Hallucination 항목은 학습 콘텐츠에서 제외했다. PDF 원문은 재배포하지 않는다.

## 검토 항목과 처리

다음은 대본을 읽으며 발견한 표현·시점 문제다. 별도 공식 근거로 확정한 3개 항목 외에는 오류로 단정하지 않고 검토 보류한다. 보류 표현을 모범답안·채점 사실 근거로 사용하지 않는다.

|대상|원문 위치|처리|
|---|---|---|
|C03 부하 분산과 자동 확장|ex=6 / 기능 설명|역할이 섞인 설명은 제외. 부하 분산은 트래픽 분배, 자동 확장은 용량 조정의 구별만 요약.|
|C03 AWS 네트워크 용어|ex=7 / Network Security Groups|다른 강의의 AWS security groups와 용어가 달라 검토 보류.|
|C03 데이터베이스 용량·SLA|ex=1 / 서비스 보장 수치|무제한·무조건 보장 문구와 수치를 재사용하지 않음.|
|C03 AI·개발 서비스 명칭·제공 상태|ex=1,7 / CodeWhisperer, Forecast 등|수업 시점 예시를 현재 제공 상태로 확정하지 않음.|
|C03 Macie 적용 범위|ex=4 / 예시 파이프라인|S3 설명과 Redshift·Athena 예시 범위의 차이 검토 보류.|
|C03 SNS 순서 보장|ex=7 / messaging|모드 구분 없는 FIFO 보장을 제외.|
|C04 NACL 기본 동작|ex=9 / network security|default/custom 구분 없는 차단 문구 제외.|
|C04 자원 중지와 비용|ex=1 / pricing|중지만으로 잔여 저장 등 모든 요금이 0이라는 보장 제외.|
|C04 비용 배분 태그|ex=9 / object tags|객체 태그를 청구 배분 태그로 간주하는 표현 검토 보류.|
|C05 App Service 컨테이너|Compute ex=5|컨테이너 앱 불가라는 일반화 제외.|
|C05 예약·예산 보장|Management ex=5|예약만으로 용량이 보장되거나 예산만으로 소비가 중단된다는 표현 제외. 예산은 Microsoft 보충 근거 연결.|
|C05 구명칭·서비스 통합 관계|Security ex=1, Processing ex=14|Azure AD·Security Center 등 구명칭과 Fabric/Synapse 관계는 별도 시점 검토.|
|C06 네트워크·엔드포인트|Compute ex=4,8|private IP와 private endpoint의 동일시 및 인터넷 접근에 반드시 공인 IP가 필요하다는 일반화 제외.|
|C06 VM·컨테이너·가용성|Compute ex=1,8|컨테이너의 OS 경계·무중단·최저비용 보장을 제외.|
|C06 VM 시연 접근·라이선스|Compute ex=11|공개 RDP 및 라이선스 체크 시연을 일반 보안·라이선스 권고로 사용하지 않음.|
|C06 RBAC 상속 끊기|Identity ex=11 / RBAC inheritance|Microsoft 문서와 차이 확인. 하위에서 상속 역할을 제거할 수 없으며 상위 할당 범위에서 변경해야 한다는 보충설명을 별도 표시.|
|C07 그룹 태그 상속·CLI|Resource ex=1,5|태그가 자동 상속되거나 CLI가 Bash 전용이라는 해석 제외·검토 보류.|
|C07 Monitor 경보 신호|Resource ex=18|시연은 Available Memory가 기준 아래일 때 발생. 메모리 사용량 증가와 신호 방향을 구분.|
|C05/C07 Azure Blueprints|Management ex=1,11 / Governance ex=13|수업 시점 기능 설명과 현재 단계적 종료 문서를 분리. 종료 일정은 확인일 기준이며 변경 가능.|
|전체 가격·할인·지역·거점 수·지원 조건|해당 비용·인프라 대본|현재 운영 수치나 무조건 보장으로 재사용하지 않음.|

## 공식 외부 보충설명

- [RBAC 상속 권한 제거](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-remove) — 하위 범위에서 상속된 역할 할당을 제거할 수 없다. 역할을 부여한 상위 범위에서 할당을 변경해야 한다. 수업의 단순한 ‘상속 끊기’ 예시는 확정 근거로 사용하지 않는다. 확인 위치: Azure portal / inherited role assignments. DataCamp 강의 확인 내용과 별도 분류.
- [예산 알림과 소비 중단 구분](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets) — Azure 예산 임계값 알림만으로 리소스나 소비가 중단되지 않는다. 예산 알림과 별도 자동화 대응을 구분한다. 확인 위치: In this article / resources aren't affected. DataCamp 강의 확인 내용과 별도 분류.
- [Azure Blueprints 단계적 종료](https://learn.microsoft.com/en-us/azure///governance/blueprints/blueprint-retirement) — Microsoft의 확인일 기준 문서는 2026년 7월 31일부터 단계적 종료, 2027년 1월 31일 종료를 안내한다. 수업의 Blueprints 설명은 학습 범위로 남기고 새 운영 선택은 별도 검토한다. 확인 위치: Phased retirement timeline / 2026-07-31, 2027-01-31. DataCamp 강의 확인 내용과 별도 분류.

## 수업별 근거 목록

아래 목록은 직접 읽은 원문과 해당 위치를 연결한다. 한국어 요약은 content/verified-materials.mjs에 저장되어 있으며 모든 요약은 출처 ID와 연결된다. 원문 대본·문항을 대량 저장하지 않았다.

### C02 AWS 개념

- C02-1 · [AWS의 세계](https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=1) · DC-C02-1-ex1 · What is AWS? / Chapters 1–3
- C02-1 · [AWS의 이점](https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=3) · DC-C02-1-ex3 · Pay for what you use / Capacity / Go global
- C02-1 · [Well-Architected Framework](https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=6) · DC-C02-1-ex6 · The six pillars / Reliability
- C02-1 · [클라우드 마이그레이션](https://campus.datacamp.com/courses/aws-concepts/introduction-to-aws-1?ex=9) · DC-C02-1-ex9 · The six perspectives / Common migration strategies
- C02-2 · [클라우드 경제성](https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=1) · DC-C02-2-ex1 · Fixed vs variable costs / Rightsizing / Automation
- C02-2 · [AWS 배포와 운영](https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=4) · DC-C02-2-ex4 · Accessing AWS services / Connectivity options
- C02-2 · [글로벌 아키텍처](https://campus.datacamp.com/courses/aws-concepts/cloud-economics-and-global-infrastructure?ex=7) · DC-C02-2-ex7 · Availability zones / Edge locations
- C02-3 · [AWS Compute 서비스](https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=1) · DC-C02-3-ex1 · EC2 unpacked / Lambda unpacked
- C02-3 · [AWS 데이터베이스](https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=4) · DC-C02-3-ex4 · Understanding database types / AWS database migration services
- C02-3 · [AWS Storage 서비스](https://campus.datacamp.com/courses/aws-concepts/the-core-aws-services?ex=7) · DC-C02-3-ex7 · Storage classes / Other storage services

### C03 AWS 클라우드 기술 및 서비스 개념

- C03-1 · [AWS 기술·서비스 개요](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=1) · DC-C03-1-ex1 · Chapters 1–3 / Course format
- C03-1 · [Amazon EC2](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=3) · DC-C03-1-ex3 · EC2 instance types / Creating your EC2 instance
- C03-1 · [부하 분산과 자동 확장](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=6) · DC-C03-1-ex6 · Load balancing vs. auto-scaling
- C03-1 · [서버리스와 컨테이너](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-compute-services?ex=10) · DC-C03-1-ex10 · What are containers? / Serverless architecture / Fargate
- C03-2 · [데이터베이스 유형](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=1) · DC-C03-2-ex1 · Database categories / EC2-hosted databases
- C03-2 · [데이터 마이그레이션](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=4) · DC-C03-2-ex4 · Data migration in practice / When to use which service
- C03-2 · [네트워크 서비스](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=7) · DC-C03-2-ex7 · VPC concepts / Route 53 / CloudFront
- C03-2 · [스토리지 유형](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-databases-networking-and-storage?ex=10) · DC-C03-2-ex10 · Storage types / Storage lifecycle policies / AWS Backup
- C03-3 · [AI·ML 서비스](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=1) · DC-C03-3-ex1 · AI & ML services / SageMaker / Sample ML pipeline
- C03-3 · [분석과 BI](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=4) · DC-C03-3-ex4 · Athena / QuickSight / Kinesis / Glue
- C03-3 · [기타 AWS 서비스](https://campus.datacamp.com/courses/aws-cloud-technology-and-services/aws-machine-learning-ai-analytics-and-beyond?ex=7) · DC-C03-3-ex7 · Application integration / Developer services / Advanced intelligence

### C04 AWS 보안 및 비용 관리 개념

- C04-1 · [보안·비용 관리 개요](https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=1) · DC-C04-1-ex1 · The structure of this course
- C04-1 · [공동 책임 모델](https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=3) · DC-C04-1-ex3 · Shared responsibility / How responsibilities change
- C04-1 · [규정 준수와 거버넌스](https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=7) · DC-C04-1-ex7 · Governance functions / AWS tools for governance
- C04-1 · [보안 자동화](https://campus.datacamp.com/courses/aws-security-and-cost-management/introduction-to-aws-security-and-compliance?ex=11) · DC-C04-1-ex11 · Security Hub / Trusted Advisor / Limitations
- C04-2 · [최소 권한](https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=1) · DC-C04-2-ex1 · Strategies for least privilege / Root user security
- C04-2 · [IAM](https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=5) · DC-C04-2-ex5 · Users vs. Roles / Policy / Identity Center
- C04-2 · [네트워크 보안](https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=9) · DC-C04-2-ex9 · VPC security / NACL, firewall, and WAF
- C04-2 · [컴퓨팅과 데이터 보안](https://campus.datacamp.com/courses/aws-security-and-cost-management/network-and-user-security?ex=13) · DC-C04-2-ex13 · Security groups / Encryption at-rest
- C04-3 · [AWS 가격 모델](https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=1) · DC-C04-3-ex1 · Pricing models / Bandwidth costs / Pricing calculator
- C04-3 · [예산과 비용 관리](https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=5) · DC-C04-3-ex5 · Cost Explorer / Budgets / Guidelines
- C04-3 · [비용 배분·결제·지원](https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=9) · DC-C04-3-ex9 · Cost allocation tags / AWS Organization / AWS Health
- C04-3 · [비용 최적화](https://campus.datacamp.com/courses/aws-security-and-cost-management/billing-and-cost-management?ex=13) · DC-C04-3-ex13 · Cost optimization framework / Optimization example

### C05 Microsoft Azure 이해하기

- C05-1 · [Microsoft Azure 소개](https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=1) · DC-C05-1-ex1 · Cloud computing / Benefits
- C05-1 · [Azure 핵심 구성요소](https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=5) · DC-C05-1-ex5 · Resources / Resource groups / ARM
- C05-1 · [Azure 서비스 개요](https://campus.datacamp.com/courses/understanding-microsoft-azure/introduction-to-azure-services?ex=9) · DC-C05-1-ex9 · IaaS / PaaS / SaaS
- C05-2 · [Azure Compute 1](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=1) · DC-C05-2-ex1 · Virtual machines / App Service / Functions
- C05-2 · [Azure Compute 2](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=5) · DC-C05-2-ex5 · Containers / AKS / ACI / Container Apps
- C05-2 · [Azure Storage](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=9) · DC-C05-2-ex9 · Access tiers / LRS, GRS, ZRS
- C05-2 · [스토리지 계정 생성](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=12) · DC-C05-2-ex12 · Demo / Versioning
- C05-2 · [데이터 처리](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-compute-and-data-management?ex=14) · DC-C05-2-ex14 · Real-time vs batch / ETL / Processing tools
- C05-3 · [보안과 규정 준수](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=1) · DC-C05-3-ex1 · RBAC / Network security / Key Vault
- C05-3 · [Azure 경제성](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=5) · DC-C05-3-ex5 · Pricing / Spot / Calculators
- C05-3 · [Azure 가격 계산기](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=9) · DC-C05-3-ex9 · Demo / Actual costs can vary
- C05-3 · [리소스 관리](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=11) · DC-C05-3-ex11 · ARM / Monitor / Automation / Advisor / Policy
- C05-3 · [Azure 통합과 이전](https://campus.datacamp.com/courses/understanding-microsoft-azure/azure-management-essentials?ex=15) · DC-C05-3-ex15 · Planning, implementation, operations / Migration strategies

### C06 Microsoft Azure 아키텍처와 서비스 이해하기

- C06-1 · [Azure 아키텍처와 서비스 개요](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=1) · DC-C06-1-ex1 · Regions / Resources / Hierarchical structure
- C06-1 · [Azure 저장 서비스](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=5) · DC-C06-1-ex5 · Blobs / Files / Queues / Tables / Disks
- C06-1 · [스토리지 계정 생성과 삭제](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=9) · DC-C06-1-ex9 · Demo
- C06-1 · [저장 구성과 파일 관리](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=12) · DC-C06-1-ex12 · Redundancy / Migration / File operations
- C06-1 · [Blob 작업](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/azure-storage-services?ex=16) · DC-C06-1-ex16 · Demo
- C06-2 · [Azure 컴퓨팅 서비스](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=1) · DC-C06-2-ex1 · IaaS / PaaS / Functions / Containers
- C06-2 · [Azure 네트워킹](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=4) · DC-C06-2-ex4 · VNET / Peering / VPN / ExpressRoute / DNS
- C06-2 · [Azure VM](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=8) · DC-C06-2-ex8 · Components / Scale sets / Availability sets
- C06-2 · [VM 생성과 구성](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=11) · DC-C06-2-ex11 · Demo
- C06-2 · [앱 호스팅 선택](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/compute-and-networking-services?ex=13) · DC-C06-2-ex13 · Migration / App Service / Web jobs
- C06-3 · [Azure 디렉터리 서비스](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=1) · DC-C06-3-ex1 · Active Directory / Entra ID / Hybrid
- C06-3 · [ID와 접근 제어](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=6) · DC-C06-3-ex6 · MFA / Passwordless / Conditional access
- C06-3 · [Entra ID 사용자·그룹 생성](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=10) · DC-C06-3-ex10 · Demo / Administrative limitations
- C06-3 · [Azure 권한 모델](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=11) · DC-C06-3-ex11 · Directory roles / RBAC / Inheritance
- C06-3 · [Azure 권한 구성](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=15) · DC-C06-3-ex15 · Demo / Storage Blob Data Contributor
- C06-3 · [Azure 클라우드 보안](https://campus.datacamp.com/courses/understanding-microsoft-azure-architecture-and-services/identity-access-control-and-security?ex=17) · DC-C06-3-ex17 · Zero Trust / Defense-in-depth / Defender

### C07 Microsoft Azure 관리 및 거버넌스 이해하기

- C07-1 · [Azure 관리와 거버넌스](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=1) · DC-C07-1-ex1 · Services vs resources / Four uses
- C07-1 · [비용 관리와 거버넌스](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=5) · DC-C07-1-ex5 · Costs / Governance / Audit trail
- C07-1 · [리소스 관리와 모니터링](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=9) · DC-C07-1-ex9 · IaC / Tags / Locks / Monitoring
- C07-1 · [리소스 생성·태그·잠금](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/azure-management-and-governance-fundamentals?ex=13) · DC-C07-1-ex13 · Demo
- C07-2 · [비용 계획과 관리](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=1) · DC-C07-2-ex1 · Cost factors / Ways to manage costs
- C07-2 · [비용 관리 도구](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=5) · DC-C07-2-ex5 · Pricing Calculator / TCO / Cost Analysis
- C07-2 · [거버넌스·준수 구현](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=9) · DC-C07-2-ex9 · Service Trust Portal / Microsoft Purview
- C07-2 · [거버넌스 도구](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=13) · DC-C07-2-ex13 · Policy / Initiatives / Blueprints
- C07-2 · [가격 계산기 활용](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/cost-management-and-governance?ex=17) · DC-C07-2-ex17 · Demo
- C07-3 · [Azure 접근 도구](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=1) · DC-C07-3-ex1 · Portal / PowerShell / CLI / Arc / Mobile
- C07-3 · [Azure 리소스 관리](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=5) · DC-C07-3-ex5 · ARM / Resource providers / Templates
- C07-3 · [Azure Monitor](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=9) · DC-C07-3-ex9 · Data collection / Analysis / Alerts
- C07-3 · [모니터링 도구](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=13) · DC-C07-3-ex13 · Application Insights / Log Analytics / Service Health / Advisor
- C07-3 · [Monitor 알림 설정](https://campus.datacamp.com/courses/understanding-microsoft-azure-management-and-governance/resource-management-and-monitoring?ex=18) · DC-C07-3-ex18 · Demo / Available Memory / Action group

## 개발 검증

출처 ID 중복, 76개 대본·18개 챕터 연결, 근거 위치·HTTPS URL, 자체 작성 문제·루브릭, 표시 파일 문자 무결성 검사를 통과했다. 기존 저장·인증·접근 제한·모의 작업 테스트 7개도 통과했다. 테스트의 로컬 연결은 기본 권한에서 차단되어 허용된 재실행으로 검증했으며 제품 오류로 분류하지 않았다.

실제 train 폴더의 실행 서버를 새 버전으로 재시작했다. 브라우저에서 v3 홈의 6개 요약 표시, Azure 아키텍처 3개 챕터 목록, ID·접근 제어 챕터의 6개 요약·출처 링크·Microsoft 보충설명 분리를 확인했다. 사용자 답안·진도를 변경하거나 실제 AI를 호출하지 않았다. 최종 PDF 출력은 검증 범위에 포함하지 않는다.

