/**
 * Smooth hero demo (portrait).
 * Login + prompt reveal happen OFF camera.
 * On camera: settled DailyPrompt → Write Now → hold duration sheet → 30 Mins → settled Editor → type story.
 *
 * node scripts/record-hero-demo.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "tmp", "hero-record");
const FINAL_WEBM = path.join(ROOT, "public", "videos", "herodemo.webm");
const FINAL_MP4 = path.join(ROOT, "public", "videos", "herodemo.mp4");

const APP = "https://app.writidian.com";
const EMAIL = process.env.WRITIDIAN_EMAIL || "barneslevi23@gmail.com";
const PASSWORD = process.env.WRITIDIAN_PASSWORD || "00000000";

const WIDTH = 834;
const HEIGHT = 1112;

const STORY_LINES = [
  '"Mister! Mister! MISTER!"',
  "",
  "Her last call woke me up.",
  "",
  "Apparently, she bore the name Linda. Her face was unfamiliar but I knew her somehow.",
  "",
  '"We need to go now! They\'ll be here any minute!" she yelled over me as I lay on the cold hard floor.',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitSettled(page, { minMs = 800 } = {}) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await sleep(minMs);
  // Wait out common loaders / skeleton flashes
  await page
    .locator(
      '[class*="animate-spin"], [class*="loading"], [aria-busy="true"], .skeleton',
    )
    .first()
    .waitFor({ state: "hidden", timeout: 8000 })
    .catch(() => {});
  await sleep(400);
}

async function dismissChrome(page) {
  for (const name of [/dismiss install/i, /^skip$/i, /get started/i]) {
    const btn = page.getByRole("button", { name });
    if ((await btn.count()) > 0) {
      await btn.first().click({ timeout: 2000 }).catch(() => {});
      await sleep(500);
    }
  }
  // Close install banner if still present
  await page
    .evaluate(() => {
      const x = [...document.querySelectorAll("button")].find((b) =>
        /dismiss/i.test(b.getAttribute("aria-label") || ""),
      );
      x?.click();
    })
    .catch(() => {});
}

async function login(page) {
  await page.goto(`${APP}/Login`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(800);
  await dismissChrome(page);

  if (/SignUp/i.test(page.url())) {
    await page.getByRole("button", { name: /sign in/i }).first().click();
    await sleep(500);
  }
  if (!/Login/i.test(page.url())) {
    await page.goto(`${APP}/Login`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await sleep(600);
  }

  await page.getByPlaceholder(/email/i).fill(EMAIL);
  await page.getByPlaceholder(/password/i).fill(PASSWORD);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/Write|DailyPrompt|Editor|Persona|Onboarding/i, {
    timeout: 45000,
  });
  await waitSettled(page, { minMs: 1000 });
  await dismissChrome(page);

  if (/Onboarding/i.test(page.url())) {
    const skip = page.getByRole("button", { name: /^skip$/i });
    if ((await skip.count()) > 0) await skip.first().click();
    await sleep(500);
    const gs = page.getByRole("button", { name: /get started/i });
    if ((await gs.count()) > 0) await gs.first().click();
    await sleep(900);
    if (/SignUp|Login/i.test(page.url())) {
      if (/SignUp/i.test(page.url())) {
        await page.getByRole("button", { name: /sign in/i }).first().click();
        await sleep(400);
      }
      await page.getByPlaceholder(/email/i).fill(EMAIL);
      await page.getByPlaceholder(/password/i).fill(PASSWORD);
      await page.getByRole("button", { name: /^sign in$/i }).click();
      await page.waitForURL(/Write|DailyPrompt|Editor|Persona/i, {
        timeout: 45000,
      });
    }
  }
  await waitSettled(page);
}

async function tapPen(page) {
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("div")].find((node) => {
      const s = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      return (
        s.cursor === "pointer" &&
        r.width > 100 &&
        r.height > 100 &&
        r.width < 400 &&
        r.height < 400
      );
    });
    el?.click();
  });
}

async function ensurePromptReady(page) {
  await page.goto(`${APP}/DailyPrompt`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await waitSettled(page, { minMs: 1200 });
  await dismissChrome(page);

  if ((await page.getByRole("button", { name: /write now/i }).count()) === 0) {
    await tapPen(page);
    await page.getByRole("button", { name: /write now/i }).waitFor({
      timeout: 20000,
    });
    await waitSettled(page, { minMs: 1000 });
  }
}

async function typeStory(page) {
  const editor = page.locator(".rte-content, [contenteditable='true']").first();
  await editor.waitFor({ state: "visible", timeout: 25000 });
  await waitSettled(page, { minMs: 1200 });

  // Editor should show timer / Done before we type
  await page.getByText(/done/i).first().waitFor({ timeout: 15000 }).catch(() => {});
  await sleep(800);

  await editor.click({ position: { x: 40, y: 80 } });
  await sleep(600);

  // Clear any placeholder focus glitch
  await page.keyboard.press("End");
  await sleep(200);

  for (const line of STORY_LINES) {
    if (line === "") {
      await page.keyboard.press("Enter");
      await sleep(380);
      continue;
    }
    // Steady cadence — less jitter than random
    await page.keyboard.type(line, { delay: 38 });
    await page.keyboard.press("Enter");
    await sleep(520);
  }
  // Hold on finished draft
  await sleep(2800);
}

async function main() {
  const runDir = path.join(OUT_DIR, `run-${Date.now()}`);
  fs.mkdirSync(runDir, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "public", "videos"), { recursive: true });
  const statePath = path.join(runDir, "auth.json");

  console.log(`Portrait ${WIDTH}x${HEIGHT}`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });

  // ——— OFF CAMERA: login + reveal prompt ———
  console.log("Warming session (not recorded)…");
  const warm = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const warmPage = await warm.newPage();
  await login(warmPage);
  await ensurePromptReady(warmPage);
  // Confirm Write Now is on screen before we save state
  await warmPage.getByRole("button", { name: /write now/i }).waitFor();
  await warm.storageState({ path: statePath });
  await warm.close();
  console.log("Session ready.");

  // ——— ON CAMERA ———
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    storageState: statePath,
    recordVideo: { dir: runDir, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();

  try {
    await page.goto(`${APP}/DailyPrompt`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await waitSettled(page, { minMs: 1500 });
    await dismissChrome(page);

    if ((await page.getByRole("button", { name: /write now/i }).count()) === 0) {
      await tapPen(page);
      await page.getByRole("button", { name: /write now/i }).waitFor({
        timeout: 20000,
      });
      await waitSettled(page, { minMs: 1200 });
    }

    // 1) Hold on the prompt card so the open is clean
    console.log("Holding on prompt…");
    await page.getByRole("button", { name: /write now/i }).waitFor();
    await sleep(2800);

    // 2) Open duration sheet and HOLD so it’s readable
    console.log("Write Now → duration sheet…");
    await page.getByRole("button", { name: /write now/i }).click();
    await page
      .getByRole("heading", { name: /how long will you write/i })
      .waitFor({ timeout: 12000 });
    await page.getByRole("button", { name: /30\s*mins?/i }).waitFor();
    // Important: keep the sheet visible for a few seconds
    console.log("Holding on duration sheet…");
    await sleep(3500);

    // 3) Pick 30 Mins, wait for editor to be fully ready
    console.log("Selecting 30 Mins…");
    await page.getByRole("button", { name: /30\s*mins?/i }).click();
    await page.waitForURL(/Editor/i, { timeout: 25000 });
    await page.locator(".rte-content, [contenteditable='true']").first().waitFor({
      state: "visible",
      timeout: 25000,
    });
    await waitSettled(page, { minMs: 1800 });
    console.log("Editor ready", page.url());

    // 4) Type story smoothly
    console.log("Typing story…");
    await typeStory(page);
    console.log("Done.");
  } finally {
    const video = page.video();
    try {
      await page.close({ runBeforeUnload: false });
    } catch {
      /* ignore */
    }
    if (video) {
      try {
        await video.saveAs(FINAL_WEBM);
        console.log("Saved via video.saveAs →", FINAL_WEBM);
      } catch (err) {
        console.log("video.saveAs failed:", err?.message || err);
      }
    }
    try {
      await context.close();
    } catch {
      /* ignore */
    }
    try {
      await browser.close();
    } catch {
      /* ignore */
    }
  }

  if (!fs.existsSync(FINAL_WEBM) || fs.statSync(FINAL_WEBM).size < 100000) {
    const files = fs
      .readdirSync(runDir)
      .filter((f) => f.endsWith(".webm"))
      .map((f) => ({ f, t: fs.statSync(path.join(runDir, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
    if (!files.length) throw new Error("No video recorded");
    fs.copyFileSync(path.join(runDir, files[0].f), FINAL_WEBM);
  }
  console.log("Wrote", FINAL_WEBM, `(${fs.statSync(FINAL_WEBM).size} bytes)`);

  const ff = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      FINAL_WEBM,
      "-vf",
      "fps=30",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      FINAL_MP4,
    ],
    { encoding: "utf8", timeout: 120000 },
  );
  if (ff.status === 0 && fs.existsSync(FINAL_MP4)) {
    console.log("Wrote", FINAL_MP4, `(${fs.statSync(FINAL_MP4).size} bytes)`);
  } else {
    console.log("ffmpeg failed or missing; webm is the hero source");
    console.log((ff.stderr || String(ff.error || "")).slice(-600));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
