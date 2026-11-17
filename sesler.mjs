// Ses karışımı: dublaj (duraklamaları kırpılmış) + Openverse CC0 efektleri + düşük sesli arka plan müziği
// → out/sessiz.mp4 ile birleştirir → out/final.mp4
//   node sesler.mjs
// Müzik ayarı repodaki ayarlar.json → "muzik" (dosya kaynaklar/muzik/ içinden). Konuşma sırasında müzik
// otomatik kısılır, konuşma aralarında ve kapanışta biraz yükselir; başta ve sonda yumuşak giriş/çıkış.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const AYAR_URL = "https://raw.githubusercontent.com/haberme00-sudo/icerik_uretimi/main/ayarlar.json";
const kok = path.dirname(fileURLToPath(import.meta.url));
const projeKok = path.resolve(kok, "..", "..");
const FFMPEG = path.join(projeKok, "araclar/paketler/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const SES = JSON.parse(fs.readFileSync(path.join(kok, "seslendirme.json"), "utf8"));
const SURE = SES.sure;
const uDanT = (u) => {
  const h = SES.harita;
  for (let i = 0; i < h.length - 1; i++) if (u <= h[i + 1][1]) return h[i][0] + ((u - h[i][1]) / (h[i + 1][1] - h[i][1])) * (h[i + 1][0] - h[i][0]);
  return h[h.length - 1][0];
};
const EFEKT_SEVIYE = 0.6; // konuşmanın altında kalsın

// Openverse kimlikleri (hepsi CC0). Aramak için:
// https://api.openverse.org/v1/audio/?q=<terim>&license=cc0&page_size=12
const SESLER = {
  whooshYumusak: "70ebf580-ce10-4215-831d-8dd6c65425ab",
  ping: "adb6e260-e493-43fd-a56e-8ceb4f477fe2",
};

// [tasarım zamanı u, ses, seviye] — animasyondaki anlamlı anlara bağlı, seyrek.
// Kapanış (logo) için u yerine saniye gerekiyorsa: ["kapanis", ses, seviye] → kapanış başlangıcı.
const OLAYLAR = [
  [0.25, "whooshYumusak", 0.45],
  ["kapanis", "ping", 0.3],
];

// ---------------------------------------------------------------------------
const ar = await fetch(AYAR_URL, { signal: AbortSignal.timeout(20000) }).catch(() => null);
const ayar = ar?.ok ? await ar.json() : {};
const M = { acik: true, dosya: "altyapi-teknoloji.wav", seviye: 0.16, konusmaAltinda: 0.07, ...(ayar.muzik || {}) };

const sesKlasor = path.join(kok, "sesler");
fs.mkdirSync(sesKlasor, { recursive: true });
const kunyeler = [];
for (const [ad, id] of Object.entries(SESLER)) {
  const r = await fetch(`https://api.openverse.org/v1/audio/${id}/`, { headers: { "User-Agent": "reels-animasyon/1.0" } });
  if (!r.ok) throw new Error(`Openverse kaydı alınamadı (${ad}): ${r.status}`);
  const k = await r.json();
  if (k.license !== "cc0") throw new Error(`${ad} CC0 değil: ${k.license}`);
  const dosya = path.join(sesKlasor, `${ad}.${k.filetype || "mp3"}`);
  if (!fs.existsSync(dosya)) {
    const s = await fetch(k.url, { headers: { "User-Agent": "reels-animasyon/1.0" } });
    if (!s.ok) throw new Error(`İndirilemedi (${ad}): ${s.status}`);
    fs.writeFileSync(dosya, Buffer.from(await s.arrayBuffer()));
  }
  kunyeler.push({ ad, dosya, k });
  console.log(`✓ ${ad.padEnd(14)} ${k.title} — ${k.creator}`);
}
const muzikYol = path.join(projeKok, "kaynaklar", "muzik", M.dosya);
const muzikVar = M.acik && fs.existsSync(muzikYol);
if (M.acik && !muzikVar) console.warn(`! Müzik dosyası yok (${M.dosya}), müziksiz devam.`);

fs.writeFileSync(
  path.join(kok, "CREDITS.md"),
  [
    "# Ses kaynakları",
    "",
    "Ses efektleri Openverse üzerinden bulunan **CC0 (kamu malı)** kayıtlardır.",
    muzikVar ? `Arka plan müziği: \`kaynaklar/muzik/${M.dosya}\` (kodla üretilmiş, telifsiz).` : "",
    "",
    "| Kullanım | Başlık | Yükleyen | Kaynak | Lisans |",
    "|---|---|---|---|---|",
    ...kunyeler.map(({ ad, k }) => `| ${ad} | ${k.title} | ${k.creator} | ${k.foreign_landing_url} | ${k.license.toUpperCase()} ${k.license_url ?? ""} |`),
    "",
  ].join("\n"),
  "utf8",
);

// konuşma aralıkları (video saniyesi): yakın kelimeler birleştirilir, müzik bu aralıklarda kısılır
const konusma = [];
for (const k of SES.kelimeler || []) {
  const a = SES.onGecikme + k.bas - 0.12, b = SES.onGecikme + k.bit + 0.15;
  const son = konusma[konusma.length - 1];
  if (son && a - son[1] < 0.6) son[1] = b;
  else konusma.push([a, b]);
}

const dosyaOf = Object.fromEntries(kunyeler.map(({ ad, dosya }) => [ad, dosya]));
const girdiler = ["-i", path.join(kok, "out", "sessiz.mp4"), "-i", path.join(kok, "ses", "dublaj.mp3")];
const dms = Math.round(SES.onGecikme * 1000);
const filtre = [`[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${dms}|${dms}[dublaj]`];
const karisim = ["[dublaj]"];
OLAYLAR.forEach(([u, ad, v], i) => {
  girdiler.push("-i", dosyaOf[ad]);
  const t = u === "kapanis" ? (SES.kapanis?.[0] ?? SURE - 2.5) : uDanT(u);
  const ms = Math.round(t * 1000);
  filtre.push(`[${i + 2}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${(v * EFEKT_SEVIYE).toFixed(3)},adelay=${ms}|${ms}[e${i}]`);
  karisim.push(`[e${i}]`);
});
if (muzikVar) {
  const mi = OLAYLAR.length + 2;
  girdiler.push("-stream_loop", "-1", "-i", muzikYol);
  const ici = konusma.map(([a, b]) => `between(t,${a.toFixed(2)},${b.toFixed(2)})`).join("+") || "0";
  const zarf = `if(gt(${ici},0),${M.konusmaAltinda},${M.seviye})*min(1,t/0.8)*min(1,max(0,(${SURE}-t)/1.5))`;
  filtre.push(`[${mi}:a]atrim=0:${SURE},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume='${zarf}':eval=frame[muzik]`);
  karisim.push("[muzik]");
}
filtre.push(`${karisim.join("")}amix=inputs=${karisim.length}:normalize=0:dropout_transition=0,apad,atrim=0:${SURE},loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000[ses]`);
const r = spawnSync(
  FFMPEG,
  ["-y", "-v", "error", ...girdiler, "-filter_complex", filtre.join(";"), "-map", "0:v", "-map", "[ses]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", String(SURE), path.join(kok, "out", "final.mp4")],
  { stdio: "inherit" },
);
if (r.status !== 0) throw new Error("ffmpeg karışımı başarısız");
console.log(`✓ out/final.mp4${muzikVar ? ` (müzik: ${M.dosya})` : ""}`);
