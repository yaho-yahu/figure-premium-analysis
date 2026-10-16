// 재생 모드 중간 프레임 캡처: 애니메이션이 실제로 움직이는지 확인
// 사용: node tools/motion.mjs  →  .verify/mid-N.png
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const url = pathToFileURL(resolve(root, 'site/index.html')).href;
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [n, t] of [[1, 1300], [4, 1500], [5, 2200]]) {
  await p.goto(`${url}#${n}`);
  await p.waitForTimeout(t);
  await p.screenshot({ path: resolve(root, `.verify/mid-${n}.png`) });
}
await b.close();
