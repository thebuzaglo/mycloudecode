// viewport screenshots at scroll fractions: node shots-scroll.mjs <path> <prefix>
import { chromium } from "playwright";

const [, , path = "/", prefix = "/tmp/sec"] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:4173${path}`, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(1200);
const h = await page.evaluate(() => document.body.scrollHeight);
const fracs = [0.18, 0.32, 0.46, 0.6, 0.74, 0.88];
for (let i = 0; i < fracs.length; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.floor(h * fracs[i]));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${prefix}-${i}.png` });
}
console.log("done", h);
await browser.close();
