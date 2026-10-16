# 서브컬쳐 굿즈 프리미엄 분석 프로젝트

## 과제
데이터분석 주제를 정하고, **주제 설명 + 데이터분석 계획**을 담은 **HTML 슬라이드덱 URL**을 제출.

## 주제
서브컬쳐(애니·게임) 피규어의 중고 프리미엄 가격 상승 요인 분석
- 자세한 내용: `docs/01_topic.md`, `docs/02_plan.md`
- 확정/보류 사항: `docs/decisions.md` ← **작업 전 항상 먼저 확인**

## 폴더 구조
| 경로 | 용도 |
|---|---|
| `DESIGN.md` | 슬라이드 디자인 기준 (Jobright 스타일). UI 작성 전 반드시 참고 |
| `docs/` | 주제·계획·결정 로그 (Claude와 합의된 내용의 원본) |
| `references/` | 사용자가 넣는 레퍼런스 (링크, 이미지, 기사, 참고 슬라이드) |
| `data/raw/` | 수집한 원본 데이터 (수정 금지) |
| `data/processed/` | 정제된 데이터 |
| `site/` | **HTML 슬라이드덱** (GitHub Pages로 자동 배포) |
| `src/manim/`, `src/charts/` | manim 영상 · seaborn 차트 소스 → `site/assets/` |
| `tools/` | 검증: `node tools/verify.mjs`(스크린샷+자동점검), `node tools/motion.mjs`(중간 프레임) |
| `archive/` | 이전 시안 (Claude Artifact 샘플) |
| `inbox/` | 분류 안 된 파일 임시 투척. Claude가 확인 후 알맞은 폴더로 정리 |

## 저장소 / 배포
- GitHub: `yaho-yahu/figure-premium-analysis` (public), `main` push → Actions가 `site/`를 Pages 배포
- 차트는 실제 데이터 전까지 **가상 데이터**, 슬라이드에 반드시 표기
- Google Flow 이미지 자리: `.img-slot` (표지 키비주얼 1, 피규어 유형 3) → `site/assets/img/flow/`

## 슬라이드 제작 요구사항 (`yaho.md`)
- 모션그래픽 차트를 많이: anime.js(메인), manim(개념 영상), seaborn(차트 이미지)
- 이미지 에셋은 Claude in Chrome으로 Google Flow에서 생성
- 계획 먼저 → 제작 → 검증 루프 (계획: `docs/03_slide_plan.md`)
- 배포는 gh CLI로 GitHub Pages
- GitHub/Google Flow 로그인이 필요하면 즉시 사용자에게 요청

## Claude 작업 규칙
- 사용자와 대화는 한국어
- 새로 합의/변경된 사항은 `docs/decisions.md`에 날짜와 함께 기록
- 사용자가 "inbox 확인"이라고 하면 `inbox/` 파일을 읽고 분류·요약
- 레퍼런스를 슬라이드에 인용할 때는 `references/links.md`의 출처를 함께 표기
- `data/raw/`는 덮어쓰지 않음
