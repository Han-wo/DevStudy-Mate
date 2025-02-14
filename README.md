# DevStudy Mate - AI 기반 개발자 학습 도우미

## 1. 프로젝트 개요

사용자의 GitHub PR을 분석하여 학습 노트를 자동으로 생성하고, 이를 기반으로 퀴즈를 생성하여 학습을 돕는 웹 애플리케이션

## 2. 핵심 기능

### 2.1 GitHub PR 분석 및 학습 노트 생성
- GitHub PR 연동 및 파일 조회
- PR 내용 분석 및 학습 노트 자동 생성
- 학습 포인트 추출
- 코드 리뷰 내용 연동

### 2.2 AI 기반 학습 지원
- 학습 내용 기반 퀴즈 자동 생성
- 코드 관련 문제 생성
- 오답 노트 자동 정리
- 복습 알림 시스템

### 2.3 학습 관리
- 학습 진도 트래킹
- 태그 기반 노트 분류
- 복습 일정 관리
- 학습 통계 대시보드

## 3. 기술 스택

### Frontend
```
- Next.js 14 (App Router)
- TailwindCSS
- Zustand (상태관리)
- React-Query (API 통신)
- @uiw/react-markdown-editor
- Chart.js (데이터 시각화)
```

### Backend
```
- Firebase
  - Authentication (사용자 인증)
  - Firestore (데이터베이스)
- Express.js
  - OpenAI API 연동
  - GitHub API 연동
```

## 4. 데이터 구조

### 4.1 Study Note

```

### 4.2 Quiz


## 5. 페이지 구조

```
/
├── /auth
│   ├── /login
│   └── /signup
├── /dashboard
├── /notes
│   ├── /
│   ├── /create
│   └── /[id]
├── /quiz
│   ├── /
│   ├── /practice
│   └── /review
└── /settings
```

## 6. API 엔드포인트

### 6.1 GitHub 관련
```
GET    /api/github/prs
GET    /api/github/pr/:id/files
POST   /api/github/analyze-pr
```

### 6.2 학습 노트
```
GET    /api/notes
GET    /api/notes/:id
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

### 6.3 퀴즈
```
POST   /api/quiz/generate
GET    /api/quiz/:noteId
POST   /api/quiz/submit
```

## 7. 개발 단계

### Phase 1 - 기본 기능 (2주)
- 사용자 인증
- GitHub PR 연동
- 기본 학습 노트 작성

### Phase 2 - AI 통합 (2주)
- OpenAI API 연동
- 학습 노트 자동 생성
- 기본 퀴즈 생성

### Phase 3 - 학습 관리 (2주)
- 퀴즈 시스템 고도화
- 복습 시스템
- 학습 통계

### Phase 4 - 기능 개선 (2주)
- UI/UX 개선
- 성능 최적화
- 사용자 피드백 반영

## 8. OpenAI 프롬프트

