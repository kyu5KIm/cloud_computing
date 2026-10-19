"""Build readable two-page keyword contents. Requires reportlab and pypdf."""
import sys
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader

DATA = '''1 ★|클라우드 기초|클라우드, 종량제, 가상화, 수직·수평 확장, 컴퓨팅·스토리지·DB, 온프레미스, IaaS·PaaS·SaaS
2 ★|클라우드 배포 모델|퍼블릭·프라이빗·하이브리드, 멀티클라우드, 커뮤니티 클라우드, 클라우드 버스팅, 지연 시간, 데이터 위치, 클라우드 직무
3|제공업체와 도입 사례|AWS·Azure·Google Cloud 서비스 비교, 제공업체 선택, 이전·운영 비용, 제품 의존성, NerdWallet·Ottawa·Lush 사례
4 ★|AWS 도입·설계 원칙|클라우드의 6가지 이점, Well-Architected 6개 관점, 운영 우수성·신뢰성, CAF 6개 관점, DMS, Snowball
5 ★|경제성·글로벌 인프라|투자비·운영비, 라이트사이징, BYOL, 라이선스 포함, CloudFormation, Console·CLI·SDK·API·IaC, VPN·Direct Connect, 리전·AZ·엣지
6|AWS 핵심 서비스|EC2, Lambda, RDS, DynamoDB, 특수 목적 DB, S3, 스토리지 클래스, 접근 빈도·복원 시간
7 ★|AWS 컴퓨팅|인스턴스 유형, AMI, 키 페어, 볼륨, VPC·보안 그룹, 로드 밸런싱, Auto Scaling, 컨테이너, ECS·EKS, Lambda·Fargate
8 ★|AWS DB·이전·네트워크·저장|RDS·Aurora·DynamoDB·DocumentDB, 이전 5단계, DMS·SCT·DataSync·Snow Family, 서브넷·라우팅·게이트웨이, PrivateLink·Route 53·CloudFront, S3·EBS·EFS·ElastiCache
9 ★|AWS AI·분석·메시징|AI·ML, S3→SageMaker→배포, Kinesis·Glue·Athena·Redshift·QuickSight, Macie, EventBridge·SQS·SNS
10 ★|AWS 보안·규정 준수|공동 책임 모델, 거버넌스·컴플라이언스, 식별→보호→탐지→대응→복구, CloudWatch·CloudTrail·GuardDuty·Inspector, IAM·Shield·Security Hub·Trusted Advisor
11 ★|AWS 권한·네트워크 보안|최소 권한, IAM 정책, Principal·Action·Resource, 인증·인가, 보안 그룹·NACL, WAF, Flow Logs, 패치, KMS, 데이터 접근·복구
12 ★|AWS 비용·청구|On-Demand·약정 할인, Pricing Calculator, Cost Explorer·Budgets, Billing Conductor, Reserved Instances 유연성, 비용 배분, Organizations·통합 청구, Health·Support, 비용 최적화
13 ★|Azure 기초|Azure 플랫폼, 리소스·리소스 그룹, ARM, Entra ID, 서비스 모델·고객 책임, VM·App Service·SaaS, 데이터·분석·AI
14 ★|Azure 컴퓨팅·데이터|VM·App Service·Functions, 컨테이너·Kubernetes, ACR·ACI·AKS·Container Apps, 서버리스·무상태, Blob·Data Lake·Files·Backup, 저장 계층·복제, ETL, Data Factory·Stream Analytics·Databricks·HDInsight·Synapse
15|Azure 보안·비용·운영|RBAC, 암호화, Key Vault·NSG·Sentinel, Reservations·Spot·Hybrid Benefit, Pricing Calculator·TCO·Cost Management, ARM·Monitor·Automation·Advisor·Policy, 이전 전략 4R
16 ★|Azure 스토리지|리전·가용 영역·관리 계층, Blob·Files·Queues·Tables·Managed Disks, Hot·Cool·Cold·Archive, LRS·ZRS·GRS·GZRS, 저장 계정→컨테이너→Blob, Migrate·Data Box·AzCopy·Storage Explorer·File Sync
17 ★|Azure 컴퓨팅·네트워크|VM·App Service·Functions·컨테이너, VNet·서브넷·피어링, CPU·메모리·OS·디스크·NIC, Scale Set·Availability Set·Zone, VPN·ExpressRoute, 웹·API·백그라운드 작업
18 ★|Azure ID·접근 제어|AD·Entra ID, SSO, MFA·패스워드리스, 조건부 액세스, 사용자·그룹·디렉터리 역할, RBAC의 주체·역할·범위, 권한 상속·축소, CIA·Zero Trust·심층 방어·Defender
19 ★|Azure 관리·거버넌스 기초|서비스·리소스 구분, 비용 관리, 거버넌스·컴플라이언스, IaC, 태그, 리소스 잠금, 모니터링, 구성·유효성 검사
20 ★|Azure 비용·정책·데이터 거버넌스|사용량·설정·지역별 비용, Pricing Calculator·TCO·Cost Management, Cost Analysis·태그·예측, Service Trust Portal, Purview·Data Map·Catalog·계보, Policy·Initiative, Blueprints·Template Specs·Deployment Stacks
21 ★|Azure 관리·모니터링|Portal·PowerShell·CLI·Arc·Mobile, ARM·리소스 공급자·템플릿·Bicep, 메트릭·로그, Application Insights·Log Analytics, 경고 규칙·Action Group·경고 처리 규칙, Service Health·Advisor, 최근 5분 평균 가용 메모리 2GiB 경고
22|AWS ↔ Azure 비교표|컴퓨팅·스토리지·DB·네트워크·보안·모니터링·비용 관리 등 역할별 서비스 대응과 차이
23|클라우드·AWS 색인|클라우드 기초부터 AWS 비용 관리까지 챕터별 핵심 용어·요약·해당 페이지
24|Azure 색인|Azure 기초부터 관리·모니터링까지 챕터별 핵심 용어·요약·해당 페이지
25|EC2 구성·접속·관리 책임|AMI·인스턴스·볼륨·키 페어 구분, 서비스 모델별 관리 책임, SSH·Session Manager·Instance Connect 접속 조건
26|웹 요청·네트워크 흐름|DNS·Route 53→CDN·CloudFront→라우팅→접근 통제→로드 밸런서→앱·DB, 퍼블릭·프라이빗 서브넷, 공인 IP, Private Endpoint·NAT Gateway·VNet Integration, 피어링·VPN·ExpressRoute
27|스토리지·DB 선택 기준|객체·블록·파일·캐시, S3·Blob·EBS·Managed Disks·EFS·Azure Files, 보관 계층·복원 시간, 관계형·NoSQL·캐시·분석 DB, RDS·Azure SQL·DynamoDB·Cosmos DB·ElastiCache
28|가용성·백업·재해 복구|고가용성·복제·백업·재해 복구 구분, 영역·리전 분산, LRS·ZRS·GRS·GZRS, Azure Backup·Site Recovery, 복구 흐름, Scale Set·Availability Set·Zone, Fault Domain·Update Domain
29|보안 규칙·가격 모델·과금|보안 그룹·NACL, Stateful·Stateless, 허용·거부·규칙 순서·응답 트래픽, On-Demand·Reserved Instances·Savings Plans·Spot, Running·Stopped·Deallocated, VM 비용 계산
30|Azure 권한·정책·AWS 메시징|관리 그룹→구독→리소스 그룹→리소스, 상속, RBAC·Policy·Lock·Tag, Reader·Contributor·Owner·Storage Blob Data Reader, 최소 권한·권한 축소, EventBridge·SQS·SNS 주문 처리 흐름'''

def build(output):
    pdfmetrics.registerFont(TTFont('KR', 'C:/Windows/Fonts/malgun.ttf'))
    pdfmetrics.registerFont(TTFont('KB', 'C:/Windows/Fonts/malgunbd.ttf'))
    w,h=A4; margin=10*mm; width=w-2*margin; height=h-2*margin
    raw=[line.split('|') for line in DATA.splitlines()]
    assert len(raw)==30
    pdfmetrics.registerFontFamily('KR',normal='KR',bold='KB')
    def make_table(part,size):
        def para(text,bold=False):
            return Paragraph(text,ParagraphStyle('cell',fontName='KB' if bold else 'KR',fontSize=size,leading=size*1.35,wordWrap='CJK'))
        rows=[[para('본문 쪽',True),para('주제 / 주요 개념·키워드',True)]]
        rows += [[para(escape(a),True),para('<b>'+escape(b)+'</b><br/>'+escape(c))] for a,b,c in part]
        table=Table(rows,colWidths=[18*mm,width-18*mm])
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
            ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#dce2e6')),
            ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f3f5f6')]),
            ('LINEBELOW',(0,0),(-1,-1),0.25,colors.HexColor('#bac0c4')),
            ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
            ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
        return table
    parts=[raw[:15],raw[15:]]
    for size in [11,10.8,10.6,10.5]:
        tables=[make_table(part,size) for part in parts]
        heights=[t.wrap(width,height)[1] for t in tables]
        if max(heights)<=height: break
    else: raise RuntimeError('Two-page table does not fit at readable size')
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(output),pagesize=A4)
    c.setTitle('클라우드 1-30쪽 키워드 목차')
    for table,th in zip(tables,heights):
        table.drawOn(c,margin,h-margin-th)
        c.showPage()
    c.save()
    reader=PdfReader(output)
    assert len(reader.pages)==2
    text='\n'.join(p.extract_text() for p in reader.pages)
    import re
    normalized=re.sub(r'\s+','',text)
    for row in raw:
        for cell in row: assert re.sub(r'\s+','',cell) in normalized
    assert text.count('★')==18
    for page,part in zip(reader.pages,parts):
        page_text=re.sub(r'\s+','',page.extract_text())
        for row in part: assert re.sub(r'\s+','',row[1]) in page_text
    print(f'PASS: 2 A4 pages, 15+15 rows, 18 stars, 10mm margins, font={size}pt, heights={heights}, limit={height:.1f}pt')

if __name__=='__main__':
    build(sys.argv[1] if len(sys.argv)>1 else 'exports/pdf/cloud_keyword_index.pdf')
