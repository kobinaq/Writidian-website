import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.MOBILE_QA_BASE || "http://localhost:3000";
const OUT = path.resolve("tmp/mobile-qa");

const VIEWPORTS = [
  { width: 375, height: 812, name: "375" },
  { width: 390, height: 844, name: "390" },
];

const ROUTES = [
  { path: "/", name: "home", sections: ["sanctuary", "soundscapes", "prompt", "editor", "stats"] },
  { path: "/about", name: "about", sections: [] },
  { path: "/privacy", name: "privacy", sections: [] },
];

async function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function captureRoute(page, route, viewport) {
  const dir = path.join(OUT, route.name, viewport.name);
  await ensureDir(dir);
  const files = [];

  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.goto(`${BASE}${route.path}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(1500);

  const top = path.join(dir, "00-top.png");
  await page.screenshot({ path: top, fullPage: false });
  files.push(path.relative(OUT, top));

  // Stepped scroll captures
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(500, Math.floor(viewport.height * 0.75));
  let y = 0;
  let i = 1;
  while (y < scrollHeight - viewport.height && i < 10) {
    y = Math.min(y + step, scrollHeight - viewport.height);
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(350);
    const file = path.join(dir, `${String(i).padStart(2, "0")}-scroll-${y}.png`);
    await page.screenshot({ path: file, fullPage: false });
    files.push(path.relative(OUT, file));
    i++;
  }

  for (const id of route.sections) {
    const ok = await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      return true;
    }, id);
    if (!ok) continue;
    await page.waitForTimeout(500);
    const file = path.join(dir, `section-${id}.png`);
    await page.screenshot({ path: file, fullPage: false });
    files.push(path.relative(OUT, file));
  }

  // Overflow check
  const overflowX = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  });

  return { files, overflowX, scrollHeight };
}

async function main() {
  await ensureDir(OUT);
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  const manifest = {
    timestamp: new Date().toISOString(),
    base: BASE,
    results: [],
  };

  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      console.log(`Capturing ${route.path} @ ${viewport.name}…`);
      try {
        const result = await captureRoute(page, route, viewport);
        manifest.results.push({
          route: route.path,
          name: route.name,
          viewport: viewport.name,
          overflowX: result.overflowX,
          scrollHeight: result.scrollHeight,
          files: result.files,
        });
        console.log(
          `  ${result.files.length} shots, overflowX=${result.overflowX}`,
        );
      } catch (err) {
        console.error(`  FAILED:`, err.message);
        manifest.results.push({
          route: route.path,
          name: route.name,
          viewport: viewport.name,
          error: String(err.message || err),
        });
      }
    }
  }

  const manifestPath = path.join(OUT, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifestPath}`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
