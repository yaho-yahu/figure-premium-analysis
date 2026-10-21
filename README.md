# 서브컬쳐 피규어 중고 프리미엄 분석

데이터분석 입문 수업 과제: **주제 설명 + 데이터분석 계획**을 담은 HTML 슬라이드덱

- 📽 슬라이드: GitHub Pages (`site/` 폴더가 자동 배포됨)
- 🎯 주제: 애니·게임 피규어(스케일 / 넨도로이드 / 경품)의 중고 프리미엄은 무엇이 만드는가

> 🔁 **이어서 작업하려면 [`docs/HANDOFF.md`](docs/HANDOFF.md)부터 읽으세요.** 지금까지 한 일, 현재 상태, 다음 할 일, 새 PC 준비 목록이 있어요.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `site/` | **배포되는 슬라이드** (index.html + css/js + 이미지·영상) |
| `src/manim/` | manim 개념 영상 소스 → `site/assets/media/*.mp4` |
| `src/charts/` | seaborn 차트 소스 → `site/assets/img/*.svg` |
| `tools/` | 검증 스크립트 (Playwright 스크린샷·자동 점검) |
| `docs/` | 주제, 분석 계획, 슬라이드 계획, 결정 로그 |
| `references/` | 레퍼런스 링크·자료 (이미지·PDF는 저작권 때문에 git 제외) |
| `data/` | 수집 데이터 (`raw/`는 git 제외) |
| `archive/` | 이전 시안 |
| `CLAUDE.md` · `DESIGN.md` · `yaho.md` | Claude 작업 규칙 · 디자인 기준 · 제작 요구사항 |

## 다른 PC에서 이어서 작업하기

```bash
git clone https://github.com/yaho-yahu/figure-premium-analysis.git
cd figure-premium-analysis

pip install -r requirements.txt        # seaborn, manim
cd tools && npm install && cd ..       # 검증용 (Chrome 설치 필요)
```

### 차트·영상 다시 만들기
```bash
python src/charts/eda_preview.py
python src/charts/ask_vs_sold.py

cd src/manim
python -m manim -qh --format=mp4 -o premium_formula --media_dir ../../.manim_media scenes.py PremiumFormula
python -m manim -qh --format=mp4 -o regression_fit  --media_dir ../../.manim_media scenes.py RegressionFit
python -m manim -qh --format=mp4 -o confounder      --media_dir ../../.manim_media scenes.py Confounder
cp ../../.manim_media/videos/scenes/1080p60/*.mp4 ../../site/assets/media/
```

### 검증
```bash
node tools/verify.mjs     # 슬라이드별 스크린샷 + 화면 넘침/글자 크기/콘솔 에러 점검 → .verify/
node tools/motion.mjs     # 애니메이션 중간 프레임 캡처
```

### 배포
`main` 브랜치에 push하면 GitHub Actions가 `site/`를 Pages에 자동 배포합니다.

## 슬라이드 조작
`←` `→` / 클릭으로 이동 · `F` 전체화면 · URL 끝에 `#3`을 붙이면 3번 슬라이드로 이동
