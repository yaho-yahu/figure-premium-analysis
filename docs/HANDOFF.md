# 작업 기록 · 이어서 하기

> 다른 PC에서 이어서 작업할 때 이 파일부터 읽으세요. Claude Code에게는 "HANDOFF.md 읽고 이어서 하자"라고 말하면 됩니다.

## 지금 상태 (2026-10-16)
- ✅ 주제·분석 계획 확정 → `docs/01_topic.md`, `docs/02_plan.md`
- ✅ 하이라이트 샘플 슬라이드 5장 제작·검증·배포 → https://yaho-yahu.github.io/figure-premium-analysis/
- ⏳ **사용자 컨펌 대기** (모션 양·속도, 디자인·말투)
- ⏳ Google Flow 이미지 4장 미생성 (자리만 있음)
- ⏳ 나머지 슬라이드 미제작

## 지금까지 한 일
1. **주제 정하기**: 서브컬쳐 굿즈 프리미엄을 피규어(스케일/넨도로이드/경품) × 인기 IP 4~6개로 좁힘. 경품 피규어는 정가가 없다는 문제를 인지하고 있음(수집 때 기준가를 결정).
2. **폴더 구조 정리**: `docs/`(계획), `references/`(레퍼런스), `data/`, `inbox/` 등. 결정 사항은 `docs/decisions.md`에 기록.
3. **디자인 기준**: `DESIGN.md`(Jobright 스타일: 민트 #00f0a0 · 검정 · 흰색, Titillium Web + Inter, 한글은 Noto Sans KR)
4. **제작 요구사항**: `yaho.md`(모션그래픽 차트, Google Flow 이미지, 계획→제작→검증, GitHub Pages 배포)
5. **1차 시안**: Claude Artifact 슬라이드로 만들었으나 anime.js를 실행할 수 없어 폐기 → `archive/artifact-sample/`
6. **2차(현재)**: 직접 만든 HTML 덱 `site/`
   - anime.js: 숫자 카운트업, 차트 그리기, 순차 등장 (`site/assets/js/deck.js`)
   - manim 영상 2편: 프리미엄율 공식 조립, 회귀선 맞추기 (`src/manim/scenes.py`)
   - seaborn 차트 1개: 유형별 프리미엄율 분포 (`src/charts/eda_preview.py`)
   - 모든 차트는 **가상 데이터**이며 슬라이드에 표기함
7. **검증 루프**: `tools/verify.mjs`(스크린샷 + 화면 넘침·글자 크기·콘솔 에러 점검)를 3회 반복해서 문제 7개 수정
8. **배포**: GitHub 저장소 생성, `main`에 push하면 Actions가 `site/`를 Pages에 자동 배포

## 다음에 할 일
1. 샘플 5장 컨펌 받기 → 피드백 반영
2. 나머지 슬라이드: 데이터 출처, 변수 설계, 예상 이슈(경품 정가 문제 등), 한계, 일정
3. Google Flow 이미지 4장 → `site/assets/img/flow/`에 넣고 `.img-slot` 자리 교체
   - 표지 키비주얼 1장, 피규어 유형(스케일/넨도/경품) 3장
   - 저작권 문제를 피하려고 실존 캐릭터가 아닌 **오리지널 디자인**으로 생성
4. 플레이스홀더 채우기: 표지 `[이름] · [학번]`, 범위 슬라이드 `[IP 1~6]`
5. 제출: Pages URL

## 새 PC 준비 체크리스트
- [ ] `git clone https://github.com/yaho-yahu/figure-premium-analysis.git`
- [ ] Python 3.14+: `pip install -r requirements.txt` (seaborn, manim)
- [ ] Node 24+: `cd tools && npm install` (검증용 playwright-core, **Chrome 설치 필요**)
- [ ] `gh auth login` 후 `gh auth refresh -s workflow` (워크플로 파일 push 권한), `gh auth setup-git`
- [ ] git 작성자 설정: `git config user.name yaho-yahu` + GitHub noreply 이메일
- [ ] Google Flow 이미지 작업: Claude Code를 `claude --chrome`으로 실행하고 Chrome에서 Flow 로그인
- [ ] git에 없는 파일은 따로 옮기기: `references/images|articles|slides-examples/`, `data/raw/` (저작권 때문에 제외)

## 알아둘 점
- seaborn은 `set_theme(font="Malgun Gothic")`처럼 테마에 폰트를 지정해야 한글이 깨지지 않음. manim도 Malgun Gothic을 사용하므로 Windows 기준.
- manim 출력물은 `.manim_media/`(git 제외)에 생기므로 `site/assets/media/`로 복사해야 함 (README 참고).
- `deck.js`는 `?shot=1`을 붙이면 애니메이션 끝 상태로 바로 이동함 (검증 스크린샷용).
