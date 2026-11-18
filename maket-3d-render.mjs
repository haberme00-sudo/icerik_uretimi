// index.html animasyonunu görüntüsüz Chrome ile kare kare çizer.
//   node render.mjs storyboard   → storyboard/kare-*.png + storyboard/temas-tablosu.png
//   node render.mjs video        → kareler/ → out/final.mp4 (H.264, yuv420p)
//   node render.mjs kare 12.5    → tek kare (kontrol)
// Chrome ve ffmpeg: ../../araclar/paketler/node_modules içindeki kopyalar (sistem kurulumu gerekmez).
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const kok = path.dirname(fileURLToPath(import.meta.url));
const videoKok = path.resolve(kok, "..", "..", "araclar", "paketler");
const require = createRequire(path.join(videoKok, "package.json"));
const puppeteer = require("puppeteer-core");
const CHROME = path.join(videoKok, "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const FFMPEG = path.join(videoKok, "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const FPS = 30;

const [mod = "storyboard", ...arg] = process.argv.slice(2);
// ES modülleri (Three.js) file:// üzerinden yüklenmez → küçük yerel sunucu
const TURLER = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".ttf": "font/ttf", ".json": "application/json", ".png": "image/png" };
const sunucu = http.createServer((q, s) => {
  const yol = path.join(kok, decodeURIComponent(q.url.split("?")[0]));
  if (!yol.startsWith(kok) || !fs.existsSync(yol) || fs.statSync(yol).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { "Content-Type": TURLER[path.extname(yol)] || "application/octet-stream" });
  fs.createReadStream(yol).pipe(s);
});
await new Promise((r) => sunucu.listen(0, "127.0.0.1", r));
const tarayici = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--force-device-scale-factor=1"] });
const sayfa = await tarayici.newPage();
sayfa.on("console", (m) => { if (m.type() === "error" || m.type() === "warn") console.log("[sayfa]", m.text()); });
sayfa.on("pageerror", (e) => console.log("[sayfa hatası]", e.message));
await sayfa.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await sayfa.goto(`http://127.0.0.1:${sunucu.address().port}/index.html?render=1`, { waitUntil: "load" });
await sayfa.waitForFunction(() => window.__hazir, { timeout: 120000 });
await sayfa.evaluate(() => window.__hazir);
const SURE = await sayfa.evaluate(() => window.SURE);
const tuval = await sayfa.$("canvas");

async function kare(t, dosya) {
  await sayfa.evaluate((tt) => window.seek(tt), t);
  await tuval.screenshot({ path: dosya, type: "png" });
}

if (mod === "kare") {
  const t = Number(arg[0] ?? 0);
  const d = path.join(kok, "storyboard", `t-${t.toFixed(2)}.png`);
  await kare(t, d);
  console.log(d);
} else if (mod === "storyboard" || mod === "kontrol") {
  const zamanlar = mod === "kontrol" ? Array.from({ length: Math.floor(SURE / 1.5) + 1 }, (_, i) => Math.min(SURE - 0.05, i * 1.5 + 0.75)) : arg.length ? arg.map(Number) : [3.6, 8.4, 9.8, 13.9, 15.9, 19.9, 23.4, 25.6, 29.4];
  const d = path.join(kok, mod);
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
  for (const [i, t] of zamanlar.entries()) {
    const f = path.join(d, `kare-${String(i + 1).padStart(2, "0")}_${t.toFixed(1)}s.png`);
    await kare(t, f);
    console.log("✓", path.basename(f));
  }
  // temas tablosu: kareleri tarayıcıda ızgaraya dizip tek PNG olarak kaydet
  const liste = fs.readdirSync(d).filter((x) => x.startsWith("kare-")).sort();
  const kutular = liste
    .map((x) => {
      const b64 = fs.readFileSync(path.join(d, x)).toString("base64");
      const t = x.match(/_(\d+\.\d)s/)?.[1] ?? "";
      return `<figure><img src="data:image/png;base64,${b64}"/><figcaption>${x.slice(5, 7)} · ${t} sn</figcaption></figure>`;
    })
    .join("");
  const ts = await tarayici.newPage();
  await ts.setViewport({ width: mod === "kontrol" ? 1960 : 1180, height: 800, deviceScaleFactor: 1 });
  await ts.setContent(`<html><body style="margin:0;background:#070d16;font:600 16px Inter,Arial;color:#A8B8C6"><div id="g" style="display:grid;grid-template-columns:repeat(${mod === "kontrol" ? 5 : 3},360px);gap:16px;padding:24px">${kutular}</div><style>figure{margin:0}img{width:360px;display:block;border:1px solid #1A2A3A}figcaption{padding:6px 2px}</style></body></html>`);
  const izgara = await ts.$("#g");
  await izgara.screenshot({ path: path.join(d, "temas-tablosu.png") });
  console.log("✓ temas-tablosu.png");
} else if (mod === "video") {
  const d = path.join(kok, "kareler");
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
  const N = Math.round(SURE * FPS);
  for (let i = 0; i < N; i++) {
    await kare(i / FPS, path.join(d, `${String(i).padStart(5, "0")}.png`));
    if (i % 90 === 0) console.log(`  kare ${i}/${N}`);
  }
  fs.mkdirSync(path.join(kok, "out"), { recursive: true });
  const r = spawnSync(FFMPEG, ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(d, "%05d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart", path.join(kok, "out", "sessiz.mp4")], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg başarısız");
  console.log("✓ out/sessiz.mp4 (ses efektleri ayrı adımda eklenir)");
}
await tarayici.close();
sunucu.close();
