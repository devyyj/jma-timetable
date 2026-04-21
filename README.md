# JMA Timetable (연습실 예약 시스템)

JMA(주엽실용음악학원) 연습실 예약 현황을 실시간으로 확인하고 예약할 수 있는 웹 서비스입니다.

## 🚀 주요 기능
- **실시간 예약 현황:** 1층/2층 연습실의 예약 상태를 그리드 뷰로 시각화
- **실시간 업데이트:** Supabase Realtime을 통한 즉각적인 예약 상태 반영
- **예약 관리:** 사용자당 1일 최대 2시간 예약 제한 및 예약 취소 기능
- **관리자 모드:** 연습실 점유(Block), 사용자 관리 및 통계 대시보드

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend/DB:** Supabase (PostgreSQL, Auth, Realtime)
- **ORM:** Drizzle ORM
- **Deployment:** Vercel (예정)

## 📁 프로젝트 구조
- `app/`: Next.js App Router 기반 페이지 및 API
- `components/`: 재사용 가능한 UI 컴포넌트
- `db/`: Drizzle ORM 스키마 및 마이그레이션 설정
- `docs/`: 기획안 및 기술 문서
- `lib/`: 유틸리티 및 공통 로직 (Supabase 클라이언트 등)

## 🚦 시작하기

### 환경 변수 설정
`.env.local` 파일을 생성하고 아래 항목을 설정합니다.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgresql_connection_string
```

### 설치 및 실행
```bash
npm install
npm run dev
```

## 📄 문서
- [기획안 (docs/00_기획안.md)](./docs/00_기획안.md)
- [기술 사양서 (docs/01_기술_사양.md)](./docs/01_기술_사양.md)
