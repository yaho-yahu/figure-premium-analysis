/* 슬라이드 전환 + 슬라이드별 anime.js 모션
 * ?shot=1  → 애니메이션을 끝 상태로 즉시 이동 (검증용 스크린샷)
 * #3       → 3번 슬라이드로 바로 이동
 */
(() => {
  const deck = document.getElementById('deck');
  const slides = [...deck.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const SHOT = new URLSearchParams(location.search).has('shot');
  let current = -1;
  let running = [];

  slides.forEach((s, i) => s.querySelectorAll('.pageno').forEach(p => (p.textContent = `${i + 1} / ${slides.length}`)));

  // 1920×1080 캔버스를 창 크기에 맞춤
  const fit = () => {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    deck.style.transform = `translate(-50%, -50%) scale(${k})`;
  };
  addEventListener('resize', fit);
  fit();

  const fmt = n => Math.round(n).toLocaleString('ko-KR');
  let finals = [];
  // 숫자 카운트업 (검증 모드에서는 최종값 바로 표시)
  const counter = (tl, el, from, to, at, render, step = 1) => {
    const o = { v: from };
    el.textContent = render(from);
    finals.push(() => (el.textContent = render(to)));
    tl.add({ targets: o, v: [from, to], round: step, duration: 1300, easing: 'easeInOutCubic', update: () => (el.textContent = render(o.v)) }, at);
  };

  // 공통: 등장 요소
  const enterCommon = (s, tl) => {
    const ins = s.querySelectorAll('.a-in');
    if (ins.length) tl.add({ targets: ins, opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(120), duration: 600, easing: 'easeOutCubic' }, 0);
  };

  const playVideos = s => s.querySelectorAll('video').forEach(v => {
    v.pause();
    if (SHOT) { v.currentTime = Math.max(0, (v.duration || 10) - 0.05); return; }
    v.currentTime = 0;
    v.play().catch(() => {});
  });

  const builders = {
    cover(s, tl) {
      tl.add({ targets: '#cover-extra', scaleX: [0, 1], duration: 1300, easing: 'easeInOutCubic' }, 700);
      counter(tl, s.querySelector('#cover-price'), 30000, 90000, 700, fmt, 1000);
      tl.add({ targets: '#cover-badge', scale: [0, 1], opacity: [0, 1], duration: 700, easing: 'easeOutBack' }, 2100);
    },
    metric(s, tl) {
      const pcts = s.querySelectorAll('.cmp-pct');
      tl.add({ targets: s.querySelectorAll('.cmp-bar .extra'), scaleX: [0, 1], delay: anime.stagger(500), duration: 1000, easing: 'easeOutCubic' }, 900);
      pcts.forEach((el, i) => counter(tl, el, 0, +el.dataset.count, 900 + i * 500, v => `+${Math.round(v)}%`));
      tl.add({ targets: s.querySelectorAll('.a-late'), opacity: [0, 1], translateY: [16, 0], duration: 600, easing: 'easeOutCubic' }, 2400);
    },
    scope(s, tl) {
      tl.add({ targets: s.querySelectorAll('.mx-col'), opacity: [0, 1], translateY: [-12, 0], delay: anime.stagger(80), duration: 400, easing: 'easeOutCubic' }, 300)
        .add({ targets: s.querySelectorAll('.mx-row'), opacity: [0, 1], translateX: [-24, 0], delay: anime.stagger(150), duration: 500, easing: 'easeOutCubic' }, 500)
        .add({ targets: s.querySelectorAll('.mx-cell'), opacity: [0, 1], scale: [0.6, 1], delay: anime.stagger(60, { grid: [5, 3], from: 'first' }), duration: 450, easing: 'easeOutBack' }, 900)
        .add({ targets: s.querySelectorAll('.a-late'), opacity: [0, 1], translateY: [16, 0], duration: 500, easing: 'easeOutCubic' }, 1900);
      counter(tl, s.querySelector('#scope-total'), 0, 300, 1900, fmt);
    },
    hyp(s, tl) {
      const cards = s.querySelectorAll('.hyp');
      tl.add({ targets: cards, opacity: [0, 1], translateY: [32, 0], delay: anime.stagger(120), duration: 600, easing: 'easeOutCubic' }, 200);
      const paths = s.querySelectorAll('path.draw');
      tl.add({ targets: paths, strokeDashoffset: [anime.setDashoffset, 0], delay: anime.stagger(200), duration: 1200, easing: 'easeInOutSine' }, 900);
      tl.add({ targets: s.querySelectorAll('.h1-box'), scaleY: [0, 1], delay: anime.stagger(250), duration: 700, easing: 'easeOutBack' }, 900);
      tl.add({ targets: s.querySelectorAll('.dots circle'), opacity: [0, 1], scale: [0, 1], delay: anime.stagger(50), duration: 300, easing: 'easeOutBack' }, 900);
      tl.add({ targets: s.querySelectorAll('.a-late'), opacity: [0, 1], duration: 600, easing: 'linear' }, 2400);
    },
    process(s, tl) {
      const steps = [...s.querySelectorAll('.step')];
      steps.forEach(st => st.classList.remove('on'));
      tl.add({ targets: steps, opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(100), duration: 500, easing: 'easeOutCubic' }, 200);
      steps.forEach((st, i) => tl.add({ duration: 1, complete: () => st.classList.add('on') }, 900 + i * 450));
      tl.add({ targets: '#panel-eda', opacity: [0, 1], translateY: [24, 0], duration: 600, easing: 'easeOutCubic' }, 900 + 2 * 450)
        .add({ targets: '#panel-eda img', clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], duration: 1200, easing: 'easeInOutCubic' }, 1100 + 2 * 450)
        .add({ targets: '#panel-reg', opacity: [0, 1], translateY: [24, 0], duration: 600, easing: 'easeOutCubic',
               begin: () => playVideos(s) }, 900 + 4 * 450);
    },
    // 출처 카드 → 연결선 → 데이터셋, 이후 점이 선을 따라 계속 흐름 (반복 애니메이션은 return)
    sources(s, tl) {
      const paths = [...s.querySelectorAll('.src-links path')];
      tl.add({ targets: s.querySelectorAll('.src-card'), opacity: [0, 1], translateX: [-32, 0], delay: anime.stagger(110), duration: 500, easing: 'easeOutCubic' }, 200)
        .add({ targets: paths, strokeDashoffset: [anime.setDashoffset, 0], delay: anime.stagger(110), duration: 800, easing: 'easeInOutSine' }, 700)
        .add({ targets: s.querySelector('.src-hub'), opacity: [0, 1], scale: [0.9, 1], duration: 600, easing: 'easeOutBack' }, 1300)
        .add({ targets: s.querySelectorAll('.a-late'), opacity: [0, 1], translateY: [16, 0], duration: 500, easing: 'easeOutCubic' }, 2600);
      counter(tl, s.querySelector('#hub-count'), 0, 450, 1500, fmt);
      return [...s.querySelectorAll('.flow-dots circle')].map((c, i) => {
        const p = anime.path(paths[i]);
        return anime({ targets: c, translateX: p('x'), translateY: p('y'),
          opacity: [{ value: 1, duration: 150 }, { value: 1, duration: 1000 }, { value: 0, duration: 250 }],
          duration: 1400, delay: 2200 + i * 280, endDelay: 400, loop: true, easing: 'linear', autoplay: !SHOT });
      });
    },
    vars(s, tl) {
      const rows = s.querySelectorAll('.vt tbody tr');
      tl.add({ targets: s.querySelectorAll('.vt th'), opacity: [0, 1], translateY: [-12, 0], delay: anime.stagger(50), duration: 400, easing: 'easeOutCubic' }, 200)
        .add({ targets: rows, opacity: [0, 1], translateX: [-24, 0], delay: anime.stagger(280), duration: 500, easing: 'easeOutCubic' }, 700)
        .add({ targets: s.querySelectorAll('.vg'), opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(140), duration: 550, easing: 'easeOutCubic' }, 2300);
      const pct = v => `${v < 0 ? '−' : '+'}${Math.abs(Math.round(v))}%`;
      s.querySelectorAll('td.y').forEach((el, i) => counter(tl, el, 0, +el.dataset.count, 1000 + i * 280, pct));
    },
    issues(s, tl) {
      tl.add({ targets: s.querySelectorAll('.issue'), opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(140), duration: 550, easing: 'easeOutCubic' }, 200)
        .add({ targets: s.querySelectorAll('.issue .fix'), opacity: [0, 1], translateX: [-20, 0], delay: anime.stagger(220), duration: 500, easing: 'easeOutCubic' }, 900)
        .add({ targets: '#panel-ask', opacity: [0, 1], translateY: [24, 0], duration: 600, easing: 'easeOutCubic' }, 1000)
        .add({ targets: '#panel-ask img', clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], duration: 1300, easing: 'easeInOutCubic' }, 1300);
    },
    // 생존 편향: 점을 모두 보여준 뒤 거래 기록이 없는 점만 꺼짐
    limits(s, tl) {
      const svg = s.querySelector('svg.surv');
      if (!svg.childElementCount) {
        let seed = 5;
        const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
        for (let r = 0; r < 7; r++) for (let c = 0; c < 14; c++) {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          Object.entries({ cx: 26 + c * 45, cy: 24 + r * 47, r: 13 }).forEach(([k, v]) => dot.setAttribute(k, v));
          if (rand() > 0.4) {
            dot.classList.add('gone'); dot.setAttribute('stroke', '#4a4f57'); dot.setAttribute('stroke-width', 2);
            dot.dataset.d = Math.floor(rand() * 700); // 꺼지는 순서를 무작위로
          }
          svg.appendChild(dot);
        }
      }
      tl.add({ targets: s.querySelectorAll('.panel'), opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(200), duration: 600, easing: 'easeOutCubic' }, 200)
        .add({ targets: svg.querySelectorAll('circle'), opacity: [0, 1], scale: [0, 1], delay: anime.stagger(10), duration: 300, easing: 'easeOutBack' }, 700)
        .add({ targets: svg.querySelectorAll('.gone'), fill: ['#00f0a0', '#1c1c1c'], delay: el => +el.dataset.d, duration: 500, easing: 'easeOutCubic' }, 2100)
        .add({ targets: s.querySelectorAll('.a-late'), opacity: [0, 1], translateY: [16, 0], delay: anime.stagger(200), duration: 600, easing: 'easeOutCubic' }, 2800);
    },
    schedule(s, tl) {
      tl.add({ targets: s.querySelectorAll('.wk'), opacity: [0, 1], translateY: [-12, 0], delay: anime.stagger(60), duration: 400, easing: 'easeOutCubic' }, 200)
        .add({ targets: s.querySelectorAll('.task'), opacity: [0, 1], translateX: [-24, 0], delay: anime.stagger(100), duration: 450, easing: 'easeOutCubic' }, 400)
        .add({ targets: s.querySelector('.today'), scaleY: [0, 1], opacity: [0, 1], duration: 700, easing: 'easeOutCubic' }, 600)
        .add({ targets: s.querySelectorAll('.bar'), scaleX: [0, 1], delay: anime.stagger(200), duration: 700, easing: 'easeOutCubic' }, 900);
    },
    outro(s, tl) {
      tl.add({ targets: s.querySelectorAll('.sum'), opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(150), duration: 550, easing: 'easeOutCubic' }, 600)
        .add({ targets: s.querySelector('.ticker'), opacity: [0, 1], duration: 600, easing: 'linear' }, 1200);
      const track = s.querySelector('.ticker-track');
      return [anime({ targets: track, translateX: [0, -track.scrollWidth / 2], duration: 24000, easing: 'linear', loop: true, autoplay: !SHOT })];
    },
  };

  const go = i => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === current) return;
    running.forEach(a => a.pause());
    running = [];
    finals = [];
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    current = i;
    progress.style.width = `${((i + 1) / slides.length) * 100}%`;
    history.replaceState(null, '', `${location.search}#${i + 1}`);

    const s = slides[i];
    s.querySelectorAll('video').forEach(v => v.pause());
    const tl = anime.timeline({ autoplay: !SHOT });
    enterCommon(s, tl);
    const loops = (builders[s.dataset.anim] || (() => {}))(s, tl) || [];
    if (s.dataset.anim !== 'process') playVideos(s);
    if (SHOT) {
      tl.seek(tl.duration);
      finals.forEach(f => f());
      if (s.dataset.anim === 'process') {
        s.querySelectorAll('.step').forEach(st => st.classList.add('on'));
        playVideos(s);
      }
    }
    running.push(tl, ...loops);
  };

  addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  addEventListener('click', e => { if (!e.target.closest('a, video')) go(current + (e.clientX > innerWidth / 3 ? 1 : -1)); });
  addEventListener('hashchange', () => go((parseInt(location.hash.slice(1), 10) || 1) - 1));

  window.__deck = { go, count: slides.length };
  go((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
