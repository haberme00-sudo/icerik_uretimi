// Görsel / carousel / story render: index.html içindeki her <section class="slayt"> → PNG.
// İş klasöründe (gorseller/<ad>/) çalıştır:
//   node gorsel-render.mjs
// Çıktı: out/01.png, 02.png … ; birden çok slayt varsa out/carousel.pdf (LinkedIn belge gönderisi)
//        ve out/onizleme.png (tüm slaytlar tek tabloda, kontrol için).
// Slayt boyutu <body data-w="1080" data-h="1350"> ile verilir.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const kok = path.dirname(fileURLToPath(import.meta.url));
const paketler = path.resolve(kok, "..", "..", "araclar", "paketler");
const require = createRequire(path.join(paketler, "package.json"));
const puppeteer = require("puppeteer-core");
const CHROME = path.join(paketler, "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");

const out = path.join(kok, "out");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const tarayici = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-device-scale-factor=1", "--allow-file-access-from-files"] });
const sayfa = await tarayici.newPage();
const url = pathToFileURL(path.join(kok, "index.html")).href;
await sayfa.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
const { w, h } = await sayfa.evaluate(() => ({ w: +document.body.dataset.w || 1080, h: +document.body.dataset.h || 1350 }));
await sayfa.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
// yazı tipleri ve görseller yüklensin
await sayfa.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
});
const eksikFont = await sayfa.evaluate(() => ["Satoshi", "IBM Plex Mono"].filter((f) => !document.fonts.check(`16px "${f}"`)));
if (eksikFont.length) console.warn("! Yüklenmeyen yazı tipi:", eksikFont.join(", "), "(internet bağlantısını kontrol et)");

const slaytlar = await sayfa.$$("section.slayt");
if (!slaytlar.length) throw new Error('index.html içinde <section class="slayt"> yok');
const dosyalar = [];
for (const [i, s] of slaytlar.entries()) {
  const kutu = await s.boundingBox();
  if (Math.round(kutu.width) !== w || Math.round(kutu.height) !== h) console.warn(`! Slayt ${i + 1} boyutu ${Math.round(kutu.width)}×${Math.round(kutu.height)}, beklenen ${w}×${h}`);
  // taşan öğe kontrolü: slayt dışına çıkan yazı/kutu
  const tasan = await s.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return [...el.querySelectorAll("*")].filter((c) => {
      const b = c.getBoundingClientRect();
      return b.width && b.height && (b.left < r.left - 1 || b.top < r.top - 1 || b.right > r.right + 1 || b.bottom > r.bottom + 1);
    }).slice(0, 3).map((c) => (c.className || c.tagName) + ": " + (c.textContent || "").trim().slice(0, 40));
  });
  if (tasan.length) console.warn(`! Slayt ${i + 1}: slayt dışına taşan öğe →`, tasan.join(" | "));
  const f = path.join(out, `${String(i + 1).padStart(2, "0")}.png`);
  await s.screenshot({ path: f, type: "png" });
  dosyalar.push(f);
  console.log("✓", path.basename(f));
}

if (slaytlar.length > 1) {
  await sayfa.addStyleTag({ content: `@page{size:${w}px ${h}px;margin:0} html,body{margin:0!important;padding:0!important;background:none!important} body>*:not(section.slayt){display:none!important} section.slayt{break-after:page;margin:0!important;box-shadow:none!important}` });
  await sayfa.pdf({ path: path.join(out, "carousel.pdf"), width: `${w}px`, height: `${h}px`, printBackground: true, pageRanges: "" });
  console.log("✓ carousel.pdf");

  const kucuk = 300;
  const kutular = dosyalar.map((f, i) => `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}"/><figcaption>${i + 1}</figcaption></figure>`).join("");
  const ts = await tarayici.newPage();
  await ts.setViewport({ width: 1600, height: 800 });
  await ts.setContent(`<body style="margin:0;background:#E5E7EB;font:600 14px Arial;color:#374151"><div id="g" style="display:grid;grid-template-columns:repeat(${Math.min(5, dosyalar.length)},${kucuk}px);gap:14px;padding:20px">${kutular}</div><style>figure{margin:0}img{width:${kucuk}px;display:block;border:1px solid #D1D5DB}figcaption{padding:4px 2px}</style></body>`);
  await (await ts.$("#g")).screenshot({ path: path.join(out, "onizleme.png") });
  console.log("✓ onizleme.png");
}
await tarayici.close();
