// Anlatımı seslendirir, kelime zamanlarını alır ve animasyonun tasarım çizelgesini (u: 0–30)
// konuşmaya bağlayan zaman haritasını üretir.
//   node seslendirme.mjs [--zorla]
// Sıra: önce ai33 (kısa süre sınırıyla) → yanıt gelmez/hata olursa doğrudan ElevenLabs API.
// Ayarlar (ses, hız, süre sınırı) repodaki ayarlar.json'dan okunur; anahtarlar yerel .env'den:
//   AI33_API_KEY=...          (ai33 için)
//   ELEVENLABS_API_KEY=...    (ElevenLabs için)
// Çıktı: ses/dublaj.mp3, seslendirme.json, seslendirme.js (index.html bunu yükler)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AYAR_URL = "https://raw.githubusercontent.com/haberme00-sudo/icerik_uretimi/main/ayarlar.json";
const kok = path.dirname(fileURLToPath(import.meta.url));
const projeKok = path.resolve(kok, "..", "..");
const ON_GECIKME = 0.3; // video başı → konuşma başlangıcı
const KUYRUK = 1.2; // konuşma sonu → son sahnenin bitişi (u = 30)
const KAPANIS = 3.5; // ardından logo kapanışı: logo ortaya büyür + "intelligence" (logo.md)

// Anlatım: her parça ekrandaki bölümle eşleşir. [etiketler] seslendirilmez.
const METIN = [
  "[curious] Buraya anlatımın ilk cümlesi gelir.",
  "İkinci bölümün anlatımı.",
].join(" ");

// Zaman haritası çapaları: [kelime kökü, kaçıncı geçiş, tasarım zamanı u]
// "kelime söylendiği an" → animasyonun o andaki tasarım zamanı
const CAPALAR = [
  ["ikinci", 1, 5.0],
];

// ---------------------------------------------------------------------------
const envYol = path.join(projeKok, ".env");
const env = fs.existsSync(envYol)
  ? Object.fromEntries(fs.readFileSync(envYol, "utf8").split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]))
  : {};
const ar = await fetch(AYAR_URL, { signal: AbortSignal.timeout(20000) }).catch(() => null);
if (!ar?.ok) throw new Error("Ayarlar okunamadı; seslendirme yapılamaz.");
const ayar = await ar.json();
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const sade = (s) => String(s).toLocaleLowerCase("tr-TR").replace(/['’].*$/, "").replace(/[^\p{L}\p{N}]/gu, "");
const etiketMi = (s) => /^\[[^\]]*\][.,!?;:…]*$/.test(s);

// ai33 / ElevenLabs STT "words" dizisi → [{metin, bas, bit}]
function kelimeDizisi(words) {
  const out = [];
  for (const w of words || []) {
    const m = String(w.text || "").trim();
    if (!m || w.type === "spacing" || w.type === "audio_event" || etiketMi(m)) continue;
    if (w.type === "punctuation" || /^[.,!?;:…]+$/.test(m)) {
      if (out.length) out[out.length - 1].metin += m;
      continue;
    }
    out.push({ metin: m, bas: +w.start, bit: +w.end });
  }
  return out;
}
// ElevenLabs karakter hizalaması → [{metin, bas, bit}]
function karakterdenKelime(al) {
  const c = al?.characters || [], s = al?.character_start_times_seconds || [], e = al?.character_end_times_seconds || [];
  const out = [];
  let k = null;
  for (let i = 0; i < c.length; i++) {
    if (/\s/.test(c[i])) { if (k) out.push(k); k = null; continue; }
    if (!k) k = { metin: "", bas: s[i], bit: e[i] };
    k.metin += c[i];
    k.bit = e[i];
  }
  if (k) out.push(k);
  return out.filter((w) => !etiketMi(w.metin) && /[\p{L}\p{N}]/u.test(w.metin.replace(/\[[^\]]*\]/g, "")))
    .map((w) => ({ ...w, metin: w.metin.replace(/\[[^\]]*\]/g, "") }));
}

async function ai33() {
  const a = ayar.ai33;
  if (!env.AI33_API_KEY) throw new Error("AI33_API_KEY yok");
  const H = { "xi-api-key": env.AI33_API_KEY };
  const taban = env.AI33_BASE_URL || "https://api.ai33.pro";
  const yanitMs = (a.yanitSn ?? 15) * 1000; // ai33 işi kabul etmezse bu kadar bekle → ElevenLabs
  const uretimSn = a.uretimSn ?? 300; // iş kabul edildiyse sesin hazır olmasını bu kadar bekle
  const f = new FormData();
  f.append("text", METIN);
  f.append("voice_id", a.ses);
  f.append("speed", String(a.hiz));
  f.append("with_transcript", "true");
  f.append("file_name", path.basename(kok) + "-dublaj");
  let r;
  try {
    r = await (await fetch(`${taban}/v3/text-to-speech`, { method: "POST", headers: H, body: f, signal: AbortSignal.timeout(yanitMs) })).json();
  } catch (e) {
    throw new Error(e.name === "TimeoutError" ? `${yanitMs / 1000} sn içinde yanıt vermedi` : `bağlanılamadı (${e.message})`);
  }
  if (!r.task_id) throw new Error("görev oluşturulamadı: " + JSON.stringify(r).slice(0, 200));
  const sinir = Date.now() + uretimSn * 1000;
  const kalan = () => Math.max(1000, sinir - Date.now());
  let g;
  for (;;) {
    if (Date.now() > sinir) throw new Error(`ses ${uretimSn / 60} dk içinde hazır olmadı`);
    await bekle(2500);
    try {
      g = await (await fetch(`${taban}/v1/task/${r.task_id}`, { headers: H, signal: AbortSignal.timeout(Math.min(yanitMs, kalan())) })).json();
    } catch { continue; } // tek bir durum sorgusu takılırsa süre dolana kadar tekrar dene
    if (g.status === "error") throw new Error("başarısız: " + g.error_message);
    const ts = g.metadata?.transcript_status;
    if (g.status === "done" && (!ts || ts !== "processing")) break;
  }
  const ses = Buffer.from(await (await fetch(g.metadata.audio_url, { signal: AbortSignal.timeout(kalan()) })).arrayBuffer());
  const j = await (await fetch(g.metadata.json_url, { signal: AbortSignal.timeout(kalan()) })).json();
  const kelimeler = kelimeDizisi((Array.isArray(j) ? j[0] : j).words);
  if (!kelimeler.length) throw new Error("kelime zamanları gelmedi");
  let kalanKredi = null;
  try { kalanKredi = (await (await fetch(`${taban}/v1/credits`, { headers: H })).json()).credits; } catch {}
  return { ses, kelimeler, bilgi: `ai33, ${g.credit_cost} kredi${kalanKredi != null ? `, kalan ${Number(kalanKredi).toLocaleString("tr-TR")}` : ""}` };
}

async function elevenlabs() {
  const e = ayar.elevenlabs;
  if (!env.ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY yok (.env)");
  const H = { "xi-api-key": env.ELEVENLABS_API_KEY };
  const taban = "https://api.elevenlabs.io";
  const govde = JSON.stringify({ text: METIN, model_id: e.model, voice_settings: { speed: e.hiz } });
  const tts = `${taban}/v1/text-to-speech/${e.ses}`;
  let ses, kelimeler;
  // 1) Ses + karakter zamanları tek istekte
  const r = await fetch(`${tts}/with-timestamps?output_format=mp3_44100_128`, { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: govde, signal: AbortSignal.timeout(180000) });
  if (r.ok) {
    const j = await r.json();
    ses = Buffer.from(j.audio_base64, "base64");
    kelimeler = karakterdenKelime(j.alignment || j.normalized_alignment);
  } else {
    const hata = await r.text();
    if (r.status === 401 || r.status === 402) throw new Error(`ElevenLabs ${r.status}: ${hata.slice(0, 300)}`);
    console.warn(`! Zamanlı seslendirme olmadı (${r.status}), düz seslendirme + yazıya dökme deneniyor.`);
  }
  // 2) Zaman gelmediyse: düz ses + Speech-to-Text ile kelime zamanları
  if (!kelimeler?.length) {
    if (!ses) {
      const r2 = await fetch(`${tts}?output_format=mp3_44100_128`, { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: govde, signal: AbortSignal.timeout(180000) });
      if (!r2.ok) throw new Error(`ElevenLabs ${r2.status}: ${(await r2.text()).slice(0, 300)}`);
      ses = Buffer.from(await r2.arrayBuffer());
    }
    const f = new FormData();
    f.append("model_id", e.sttModel || "scribe_v1");
    f.append("timestamps_granularity", "word");
    f.append("file", new Blob([ses], { type: "audio/mpeg" }), "dublaj.mp3");
    const s = await fetch(`${taban}/v1/speech-to-text`, { method: "POST", headers: H, body: f, signal: AbortSignal.timeout(180000) });
    if (!s.ok) throw new Error(`ElevenLabs STT ${s.status}: ${(await s.text()).slice(0, 300)}`);
    kelimeler = kelimeDizisi((await s.json()).words);
  }
  if (!kelimeler.length) throw new Error("kelime zamanları alınamadı");
  let bilgi = "ElevenLabs";
  try {
    const u = await (await fetch(`${taban}/v1/user/subscription`, { headers: H })).json();
    if (u.character_limit != null) bilgi += `, kalan ${(u.character_limit - u.character_count).toLocaleString("tr-TR")} kredi`;
  } catch {}
  return { ses, kelimeler, bilgi };
}

const SAGLAYICILAR = { ai33, elevenlabs };
const sesDir = path.join(kok, "ses");
fs.mkdirSync(sesDir, { recursive: true });
const jsonYol = path.join(kok, "seslendirme.json");
const hash = crypto.createHash("sha1").update(`${JSON.stringify([ayar.ai33, ayar.elevenlabs])}|${METIN}`).digest("hex").slice(0, 12);
const onceki = fs.existsSync(jsonYol) ? JSON.parse(fs.readFileSync(jsonYol, "utf8")) : null;

let kelimeler, saglayici;
if (onceki && onceki.hash === hash && fs.existsSync(path.join(sesDir, "dublaj.mp3")) && !process.argv.includes("--zorla")) {
  console.log("= Metin değişmedi, seslendirme atlandı (0 kredi).");
  ({ kelimeler, saglayici } = onceki);
} else {
  const hatalar = [];
  for (const ad of ayar.sira || ["ai33", "elevenlabs"]) {
    try {
      console.log(`… ${ad} deneniyor`);
      const s = await SAGLAYICILAR[ad]();
      fs.writeFileSync(path.join(sesDir, "dublaj.mp3"), s.ses);
      kelimeler = s.kelimeler;
      saglayici = ad;
      console.log(`✓ Dublaj (${s.bilgi}): ${kelimeler.length} kelime`);
      break;
    } catch (err) {
      hatalar.push(`${ad}: ${err.message}`);
      console.warn(`! ${ad} olmadı → ${err.message}`);
    }
  }
  if (!kelimeler) throw new Error("Seslendirme yapılamadı.\n" + hatalar.join("\n"));
}

// zaman haritası: [video saniyesi, tasarım u]
const harita = [[0, 0]];
for (const [kok_, kac, u] of CAPALAR) {
  let n = 0;
  const w = kelimeler.find((k) => sade(k.metin).startsWith(sade(kok_)) && ++n === kac);
  if (!w) {
    console.warn(`! Çapa bulunamadı: ${kok_} (${kac}) — atlandı`);
    continue;
  }
  const t = ON_GECIKME + w.bas;
  const [st, su] = harita[harita.length - 1];
  if (t > st + 0.2 && u > su) harita.push([+t.toFixed(3), u]);
  else console.warn(`! Çapa sırası bozuk: ${kok_} (${kac}) t=${t.toFixed(2)} — atlandı`);
}
const sonKelime = kelimeler[kelimeler.length - 1];
const sahneSonu = +(ON_GECIKME + sonKelime.bit + KUYRUK).toFixed(3);
harita.push([sahneSonu, 30]);
const sure = +(sahneSonu + KAPANIS).toFixed(3);
const kapanis = [sahneSonu, sure];

const veri = { hash, saglayici, onGecikme: ON_GECIKME, sure, kapanis, harita, kelimeler };
fs.writeFileSync(jsonYol, JSON.stringify(veri, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(kok, "seslendirme.js"), `// otomatik üretildi — seslendirme.mjs\nwindow.SES = ${JSON.stringify({ sure, harita, onGecikme: ON_GECIKME, kapanis })};\n`, "utf8");
console.log(`✓ Süre: ${sure} sn (kapanış kartı ${kapanis[0]}–${kapanis[1]} sn)`);
harita.forEach(([t, u]) => console.log(`  t=${String(t).padStart(6)} sn → u=${u}`));
