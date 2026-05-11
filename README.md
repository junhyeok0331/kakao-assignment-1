# 📝 과제 2. React로 Todo 앱 만들기

과제 1에서 Vanilla JS로 만든 Todo 앱을 React + Tailwind CSS로 재구현하는 과제예요.  
컴포넌트 분리, 상태 관리, 스타일링 방식의 차이를 직접 경험해봐요.

---

## 🚀 실행 방법

1. 저장소를 클론해요
```bash
git clone 저장소 주소
cd kakao-assign-2
```
2. 패키지를 설치해요
```bash
npm install
```
3. 개발 서버를 실행해요
```bash
npm run dev
```
4. 브라우저에서 `http://localhost:5173`으로 접속해요

---

## 📁 프로젝트 구조
```
kakao-assign-2/
├── src/
│   ├── components/
│   │   ├── FilterTabs.jsx     # 필터 탭 (전체 / 진행 중 / 완료)
│   │   ├── TodoInput.jsx      # Todo 입력창
│   │   ├── TodoItem.jsx       # Todo 아이템 (완료 · 수정 · 삭제)
│   │   ├── TodoList.jsx       # Todo 목록
│   │   └── WeekNavigator.jsx  # 주간 달력 네비게이터
│   ├── App.jsx                # 루트 컴포넌트 (전체 상태 관리)
│   ├── index.css              # 글로벌 스타일 (Tailwind 진입점)
│   └── main.jsx               # 앱 진입점
├── index.html
├── vite.config.js
└── package.json
```

---

## ✅ 구현 기능

### 기본 미션
- Todo CRUD (생성 / 수정 / 완료 처리 / 삭제)
- 상태별 필터링 (전체 / 진행 중 / 완료)
- 일간 뷰 (날짜별 Todo 관리)
- 로컬스토리지 연동 (새로고침 후에도 데이터 유지)

### 도전 미션
- 주간 뷰 (이번 주 날짜별 Todo 현황 + 이전 / 다음 주 이동)
- 날짜 셀에 해당 날짜의 Todo 개수 표시

---

## 🛠️ 활용 스택

- `React 19` / `Vite 8`
- `Tailwind CSS v4` (`@tailwindcss/vite` 플러그인)
- `Web Storage API` (localStorage)

---

## 📌 참고사항

- 본 과제는 AI 도구(ChatGPT, Claude 등)를 활용해 구현했어요
- 과제 1(Vanilla JS)과 동일한 기능을 React 컴포넌트 기반으로 재구현한 버전이에요
