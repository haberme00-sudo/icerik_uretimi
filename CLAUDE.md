> **Uzaktan okunan sürüm.** Bu dosya ve stil dosyaları GitHub reposundan okunur; klasörde yerel kopyaları yoktur.
> Adres kökü (aşağıda **REPO**): `https://raw.githubusercontent.com/haberme00-sudo/icerik_uretimi/main/`
> Repoda klasör yok, her şey tek seviyede: `CLAUDE.md` (bu dosya), `stil-katalog.md`, `stil-<id>.md` (11 stil), `stil-skill.md`, `logo.md`, `seslendirme.mjs`, `ayarlar.json`.
> Dosyaları Bash'te `curl -s REPO<dosya>` ile birebir oku (WebFetch özetler, kullanma). Diske veya hafızaya kaydetme; her seferinde repodan yeniden oku.

# Stil Tabanlı Video Üretim Klasörü

Bu klasör, Claude Code ile **istenen herhangi bir konuda**, seçilen bir **görsel stilde** animasyonlu, seslendirmeli açıklama videoları üretir
(varsayılan: Reels/Shorts için dikey 1080×1920, 30 fps, H.264 + AAC).
Kullanıcı teknik bilgi sahibi olmayabilir; kısa Türkçe isteklerle çalışır. Her şeyi bu dosyadaki yolla sen yaparsın.

> Klasördeki yerel `CLAUDE.md` yalnızca bu dosyayı okutan kısa bir yönlendirmedir; Claude Code hafızası (`~/.claude/...`) kullanılmaz. Bilinmesi gereken her şey burada.

---

## 0. İstek geldiğinde: konu + stil gerekir

| Kullanıcı ne verdi? | Ne yap |
|---|---|
| **Konu + stil adı** ("izometrik stilde su musluğa nasıl gelir") | Stili `REPO` + `stil-<id>.md` dosyasından al (ör. `stil-izometrik.md`) → §2 |
| **Konu + resim** (poster, reklam, video karesi) | `REPO` + `stil-skill.md` dosyasını oku ve oradaki adımları uygula → resimden `stil-prompt.md` üret → §2 |
| **Uzun stil promptu yapıştırdı** (`# TASK … # 1. PROJECT CONFIGURATION …`) | Doğrudan §2 |
| **Konu var, stil yok, resim yok** | **Sor** (aşağıdaki kalıp). Stil seçmeden başlama. |
| **Konu da yok** | Konuyu ve stili birlikte sor; istenirse stilin "örnek konu"sunu öner |

**Stil sorma kalıbı** (kısa tut, hepsini listele):
> Hangi stilde olsun? Örneklerini buradan izleyebilirsin: **https://smokich.gosem.dev/stil/#stiller**
> 1 Kâğıt Poster · 2 Kesik Kâğıt · 3 Konstrüktivist · 4 Bilim Atlası · 5 Risograf · 6 İzometrik Çizim · 7 Düz Vektör · 8 Kinetik Tipografi · 9 Sıvı Cam · 10 ASCII Atlas · 11 Parçacık
> (Ya da beğendiğin bir görseli at, onun tarzını çıkarayım.)

Gerekirse her stilin bir satırlık tanımını ve "en iyi olduğu konuları" `REPO` + `stil-katalog.md` dosyasından ekle; konuya uyanı öner.

### Varsayılan ayarlar (kullanıcı başka demedikçe)
| Ayar | Varsayılan | Not |
|---|---|---|
| Biçim | **Dikey 9:16, 1080×1920** | "YouTube yatay" derse 16:9 1920×1080 |
| Seslendirme | **Açık** (ai33, §3) | Kullanıcı sessiz/yalnız efektli videoyu "ses yok" diye eksik buldu. Bir prompt "Voiceover: Disabled" derse bir kez sor. |
| Storyboard | **Açık** | Önce önizleme kareleri + sahne tablosu, onaydan sonra tam video |
| Ses efektleri | Açık | Openverse CC0 (`sesler.mjs`); internet yoksa `kaynaklar/sfx/*.wav` |
| Müzik | Kapalı | İsterse `kaynaklar/muzik/*.wav` (kodla üretilmiş, telifsiz) |
| Altyazı | Kapalı | Ekrandaki başlıklar anlatımı taşır; isterse eklenir |

### Stil dosyasındaki yer tutucular
Uzun promptlar: `{{KONU}}` konu metni · `{{STORYBOARD}}` `Enabled`/`Disabled` · `{{SES}}` `Enabled (the recording is in this folder)` / `Disabled` · `{{BICIM}}` `Vertical, 9:16, native resolution 1080 × 1920` (yatayda `Horizontal, 16:9, native resolution 1920 × 1080`) · `{{EFEKT}}` · `{{MUZIK}}`.
Kısa stil kartları (Kâğıt Poster, Konstrüktivist, Bilim Atlası, ASCII Atlas): `{{KONU}}`, `{{BICIM}}` ve açık olan koşullu satırlar (dosyanın sonundaki yorumda).
Doldurulmuş promptu `animasyonlar/<ad>/stil-prompt.md` olarak kaydet; o videonun tek doğru kaynağı odur.

---

## 1. Stil promptları ile bu klasörün karşılıkları
Stil promptları (ve `stil` skill'inin ortak gövdesi) başka bir ortam varsayar. Bu klasörde **şunları kullan**:

| Prompt diyor ki | Bu klasörde |
|---|---|
| HTML Artifact, oynatma kontrolleri, MediaRecorder, WebCodecs | Yok sayılır → `index.html` + `window.seek(t)` + `render.mjs` |
| Puppeteer/Playwright kur, Chrome indir; ffmpeg "eksikse kur" | **Kurma.** puppeteer-core + Chrome + ffmpeg `araclar/paketler/node_modules/` içinde (`render.mjs` hazır) |
| Whisper ile kelime zamanları | Kurma. Seslendirme ai33 (olmazsa ElevenLabs) ile üretilir, kelime zamanları onların transkriptinden (`seslendirme.mjs`) |
| "Voiceover: the recording is in this folder" | Kayıt yoksa senaryoyu sen yaz (konuya göre, doğru bilgi), §3'teki script ile seslendir |
| Openverse'ten CC0 ses | Olur — `sesler.mjs`, kaynaklar `CREDITS.md`'ye |
| "Do not synthesize music" | Müzik açıksa `kaynaklar/muzik/*.wav` (önceden üretilmiş, telifsiz) |
| Konuda başka bir markanın logosu gerekiyorsa | (Solar Insider logosu `logo.md`'de, buna dahil değil.) Kullanıcıdan dosyayı `kaynaklar/referans/` içine koymasını iste |

---

## 2. Üretim adımları (her video)
Örnek ve şablon: **`animasyonlar/gunes-paneli-izometrik/`** (İzometrik Çizim stili, seslendirmeli). Yeni video için bu klasörü `animasyonlar/<ad>/` olarak kopyala; `out/`, `ses/`, `sesler/`, `storyboard/`, `seslendirme.*`, `CREDITS.md` içeriğini temizle.

1. **Prompt:** stil dosyasını doldur → `animasyonlar/<ad>/stil-prompt.md`. Promptun stil bölümlerini (görsel dil, hareket, teknik uygulama, kaçınılacaklar) dikkatle uygula.
2. **Senaryo + sahne planı:** konu için doğru bilgiyle 6 bölüm civarı, ~450–520 karakterlik anlatım (≈35–40 sn). Uygun 2–4 yerde duygu etiketi (§3). Sahne tablosu: | Sahne | Zaman | Anlatılan | Kompozisyon | Çizim/hareket | Kamera/geçiş | Ekrandaki yazı | Ses |
3. **`index.html`:** **Her videoya logo gömülür (üstte küçük logo + sonda büyüyen logo ve "intelligence" kapanışı): `REPO` + `logo.md` dosyasını oku ve uygula (atlanmaz).** Sahneleri stilin diliyle yeniden yaz (Canvas 2D / SVG / Three.js — stile göre). Kurallar: `window.seek(t)` aynı t için hep aynı kareyi çizer (requestAnimationFrame, Date.now, Math.random yok; tohumlu rastgele kullan). Tasarım çizelgesi `u` (0–30) birimiyle yaz; seslendirme varsa `seslendirme.js` haritası `u`'yu gerçek saniyeye bağlar (örnekteki `haritala`). Şablondaki çizim motoru (izdüşüm, kısmi çizgi çizimi `yol`, yüz dolgusu, `cagri` etiketleri, `yazi`, başlık sistemi) uyarlanabilir; stil başka bir görünüm istiyorsa (kâğıt dokusu, mürekkep, cam kırılması, parçacık) o tekniği prompttaki "technical implementation" bölümüne göre kur. Yazılar Türkçe; büyük harfte `toLocaleUpperCase("tr-TR")`. Font dosyasını klasöre koy (örnekte `Inter.ttf`; stilin istediği ücretsiz fontu Google Fonts'tan indirip ekleyebilirsin).
4. **Storyboard:** `node render.mjs storyboard [t1 t2 …]` → `storyboard/kare-*.png` + `temas-tablosu.png`. Görüntüle; kesilen yazı/çakışma varsa ya da logo herhangi bir karede eksik/kesikse düzelt. Sahne tablosu + temas tablosu yolunu göster → **dur, onay iste**.
5. **Seslendirme:** (§3) `REPO` + `seslendirme.mjs`'yi indir, başındaki `METIN` ve `CAPALAR`'ı yaz (çapa: "bu kelime söylendiğinde animasyon bu `u` anında olsun"; aynı kelimenin kaçıncı geçişi olduğuna dikkat; sıra hem saniyede hem `u`'da artmalı) → `node seslendirme.mjs`.
6. **Kontrol:** `node render.mjs kontrol` → `kontrol/temas-tablosu.png` (1,5 sn'de bir kare). Özellikle sahne geçişlerinde hayalet bindirmeye (iki sahne yarı saydam üst üste) ve kesilen etiketlere bak; geçişleri sıralı yap.
7. **Render + ses:** `node render.mjs video` (~1200 kare ≈ 4–5 dk) → `sesler.mjs`'de `OLAYLAR` (u zamanı, ses, seviye) ve `SESLER` (Openverse CC0 kimlikleri; aramak için `https://api.openverse.org/v1/audio/?q=<terim>&license=cc0&page_size=12`) → `node sesler.mjs` → dublaj + efektler + loudnorm (-15 LUFS, 48 kHz) → `out/final.mp4`.
8. **Teslim:** ffprobe ile süre/akış kontrolü, videoyu **Windows oynatıcısıyla aç** (PowerShell `Invoke-Item "<yol>"`), kısa özet: dosya yolu, süre, harcanan kredi, nasıl değiştirilebileceği. Paylaşım metni istenirse `icerikler/YYYY-AA-GG_<ad>.md`.

Komutları `animasyonlar/<ad>/` içinde, `../../araclar/node/node.exe <script>` ile çalıştır (veya Bash'te `export PATH="<kök>/araclar/node:$PATH"`).

---

## 3. Seslendirme — önce ai33, olmazsa ElevenLabs
- **Script repoda:** her videoda `REPO` + `seslendirme.mjs` dosyasını `curl -s` ile video klasörüne indir (şablondaki eski `seslendirme.mjs`'nin yerine), başındaki `METIN` ve `CAPALAR`'ı yaz, çalıştır. Ses, hız, sağlayıcı sırası ve süre sınırı repodaki `ayarlar.json`'dan okunur; script onu kendisi çeker. Yerel `ayarlar.json` kullanılmaz.
- **Sıra:** önce **ai33** denenir. ai33 isteğe `yanitSn` (15 sn) içinde yanıt vermezse, işi kabul edip sesi `uretimSn` (5 dk) içinde hazırlamazsa ya da hata verirse otomatik olarak **doğrudan ElevenLabs API**'ye geçilir (aynı ses `cWVxITrm3nn4UZgIKhad`, model `eleven_v3`). Hangi sağlayıcının kullanıldığı ve kalan kredi çıktıda yazar.
- **Anahtarlar yalnızca kullanıcının bilgisayarında**, proje kökündeki `.env`: `AI33_API_KEY=...` ve `ELEVENLABS_API_KEY=...` (kullanıcının kendi ElevenLabs hesabı, ücretli plan gerekir — ücretsiz plan kütüphane seslerini API'de kullandırmaz). `ELEVENLABS_API_KEY` yoksa ve gerekiyorsa kullanıcıdan iste, `.env`'ye yaz. **Asla** yazdırma, sohbete, dokümana, koda veya repoya koyma.
- Hızı veya sesi değiştirmek aynı metinli videoları yeniden seslendirtir (kredi) — önce sor.
- Türkçe metni **Node fetch** ile gönder (script öyle yapar; Windows'ta curl komut satırı Türkçe karakteri bozar).
- Duygu etiketleri: `[curious]` soru/kanca · `[excited]` şaşırtıcı an · `[whispers]` sır · `[softly]` kapanış · `[sighs]` · `[laughs]`. Cümle başına; seslendirilmez, transkriptte görünmez. Ayrıca üç nokta ve ünlemle tonlama.
- Maliyet: ~500 karakter ≈ 650–750 ai33 kredisi; ElevenLabs'te yaklaşık karakter başına 1 kredi. Metin + ayarlar değişmezse script yeniden seslendirmez.
- Script `seslendirme.js`'ye `window.SES = { sure, harita, onGecikme, kapanis }` yazar. `kapanis` = `[başlangıç, bitiş]` saniye: logo kapanış kartının zamanı (`logo.md`). Son sahne `u = 30`'da biter, kart onun ardından gelir.
- Transkript bazen iki kelimeyi birleştirir ("trafo da" → "Trafoda"); çapa seçerken buna dikkat.

---

## 4. Ortam (taşınabilir — sisteme hiçbir şey kurma)
- Node 24 → `araclar/node/` (Windows x64)
- puppeteer-core, Remotion (yalnızca Chrome indirmesi ve ffmpeg için) → `araclar/paketler/node_modules/`
- Görüntüsüz Chrome → `araclar/paketler/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe`
- ffmpeg/ffprobe → `araclar/paketler/node_modules/@remotion/compositor-win32-x64-msvc/` (libx264, aac, adelay, amix, loudnorm var; **glob, xstack, testsrc yok** — temas tablosu tarayıcıda yapılır). Sistem ffmpeg'i ve Python **olmayabilir**, kullanma.
- Yeni npm paketi gerekirse yalnızca `araclar/paketler/` içine (`npm install --save-exact`).
- `ortam.cmd`: kullanıcı için PATH ayarlı terminal.
- Mac/Linux'ta `araclar/node` ve Chrome çalışmaz: oradaki Node ile `cd araclar/paketler && npm ci && npx remotion browser ensure`; scriptlerdeki Chrome/ffmpeg yolları platforma göre değişir.

## 5. Her işte geçerli
- **Bilgi doğru olmalı.** Uydurma rakam/iddia yok; emin değilsen yazma ya da "temsilî" diye etiketle.
- **Kendi kareni kontrol et:** render sonrası kareleri görüntüle; çakışan yazı, taşan etiket, boş kare, hayalet geçiş bırakma.
- Kullanıcı "ses yok" derse: önce videoyu VS Code içinde mi açtığını sor (VS Code önizlemesi AAC sesi çalmaz).
- Kısa, sade Türkçe ile konuş; teknik ayrıntıyı kullanıcı sormadıkça anlatma.

## 6. Klasör haritası
```
CLAUDE.md                yalnızca bu uzak kılavuzu okutan kısa yönlendirme
README.md                kullanıcı için başlangıç kılavuzu
(repoda) stil-katalog.md, stil-<id>.md, stil-skill.md   11 stil + katalog + resimden stil çıkarma adımları — kaynak: https://smokich.gosem.dev/stil/#stiller
(repoda) logo.md          her videoya gömülen Solar Insider logosu + yerleşim kuralları
.env                     AI33_API_KEY, ELEVENLABS_API_KEY (gizli, yalnızca bu bilgisayarda)
(repoda) ayarlar.json + seslendirme.mjs   seslendirme ayarları ve scripti (yerel ayarlar.json kullanılmaz)
animasyonlar/<ad>/       her video: stil-prompt.md, index.html, render.mjs, seslendirme.mjs, sesler.mjs, out/final.mp4
kaynaklar/referans/      kullanıcının verdiği görseller
kaynaklar/muzik, sfx/    kodla üretilmiş telifsiz müzik ve efektler
icerikler/               paylaşım metinleri, performans kaydı
araclar/node/            taşınabilir Node.js
araclar/paketler/        Chrome, ffmpeg, puppeteer-core (node_modules)
ortam.cmd                PATH ayarlı terminal
```
