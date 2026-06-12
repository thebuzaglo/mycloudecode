// screenshot helper: node shot.mjs <url-path> <outfile> [fullpage] [mobile]
import { chromium } from "playwright";

const [, , path = "/", out = "/tmp/shot.png", fullpage = "0", mobile = "0"] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: mobile === "1" ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:4173${path}`, { waitUntil: "networkidle", timeout: 30000 }).catch((e) => errors.push("NAV: " + e.message));
await page.waitForTimeout(1500);
// scroll through the page so whileInView reveals fire, then back to top
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: fullpage === "1" });
console.log("saved", out);
if (errors.length) console.log("ERRORS:\n" + errors.slice(0, 12).join("\n"));
await browser.close();
