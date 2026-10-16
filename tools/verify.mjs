// 슬라이드 검증: 슬라이드별 1920×1080 스크린샷(애니메이션 끝 상태) + 자동 점검
// 사용: node tools/verify.mjs [url]   (기본: site/index.html 로컬 파일)
// 결과: .verify/slide-N.png, 콘솔에 문제 목록
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const base = process.argv[2] || pathToFileURL(resolve(root, 'site/index.html')).href;
const outDir = resolve(root, '.verify');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const problems = [];
page.on('console', m => m.type() === 'error' && problems.push(`console: ${m.text()}`));
page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
page.on('requestfailed', r => problems.push(`404/실패: ${r.url()}`));

const sep = base.includes('?') ? '&' : '?';
await page.goto(`${base}${sep}shot=1#1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const count = await page.evaluate(() => window.__deck.count);

for (let i = 0; i < count; i++) {
  await page.evaluate(n => window.__deck.go(n), i);
  await page.waitForTimeout(900);
  const issues = await page.evaluate(n => {
    const s = document.querySelectorAll('.slide')[n];
    const sb = s.getBoundingClientRect();
    const out = [];
    const k = sb.width / 1920;
    for (const el of s.querySelectorAll('*')) {
      if (el.closest('svg') && el.tagName !== 'svg') continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const name = `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${(el.textContent || '').trim().slice(0, 20)}"`;
      if (r.right > sb.right + 1 || r.bottom > sb.bottom + 1 || r.left < sb.left - 1 || r.top < sb.top - 1) out.push(`화면 밖: ${name}`);
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === 'visible' && el.children.length === 0) out.push(`가로 넘침: ${name}`);
      const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (own && fs < 20) out.push(`글자 작음 ${fs}px: ${name}`);
    }
    // 본문 영역(하단 160px 여백) 침범
    const limit = sb.top + (1080 - 160 + 8) * k;
    for (const el of s.querySelectorAll(':scope > *:not(.footer)')) {
      const r = el.getBoundingClientRect();
      if (r.bottom > limit) out.push(`하단 여백 침범 ${Math.round((r.bottom - limit) / k)}px: ${el.className}`);
    }
    return out;
  }, i);
  issues.forEach(m => problems.push(`[슬라이드 ${i + 1}] ${m}`));
  await page.screenshot({ path: resolve(outDir, `slide-${i + 1}.png`) });
}

await browser.close();
console.log(problems.length ? problems.join('\n') : 'OK: 문제 없음');
console.log(`스크린샷: ${outDir}`);
