# Görsel · Carousel · Story — Solarinsider sosyal medya

Bu dosya **tek görsel, carousel ve story** istekleri içindir. **Videolar bu dosyadan etkilenmez**; onlar `CLAUDE.md`'deki stil sistemiyle üretilir.

---

## 1–2. Strateji, içerik türleri, konu ve platform kontrolü
**Önce `REPO` + `strateji.md` dosyasını oku ve uygula.** Amaç (satış belli etmeden takipçi kazanmak), ton, çağrı yasağı, içerik türleri ve rozetleri, doğruluk kuralları, **konu kontrolü** (uymuyorsa nedenini söyleyip gerekçeli alternatif öner) ve **platform/tür uygunluğu** (ör. LinkedIn'de story yok, X'te carousel yok) oradadır. Bu dosya yalnızca görsel üretimin nasıl yapılacağını anlatır.

## 3. Doğruluk kuralları (özellikle haber ve yönetmelik)
- **Güncel bilgi web aramasıyla doğrulanır.** Önce birincil kaynak:
  - Resmî Gazete (resmigazete.gov.tr)
  - EPDK (epdk.gov.tr)
  - EPİAŞ / Şeffaflık Platformu (epias.com.tr, seffaflik.epias.com.tr)
  - Enerji ve Tabii Kaynaklar Bakanlığı (enerji.gov.tr)
  - TEİAŞ
  
  Haber siteleri sadece ikincil kaynaktır.
- Yönetmelik içeriğinde şunlar yazılır: yayım tarihi, Resmî Gazete sayısı ya da karar numarası, yürürlük tarihi. Kimi etkilediği yalnızca metinden çıkan kadarıyla yazılır, yorum katılmaz.
- Her haber ve yönetmelik görselinde küçük bir **kaynak satırı** bulunur: `Kaynak: Resmî Gazete, 12.11.2026, Sayı 33xxx`. Bağlantı `metin.md`'ye yazılır.
- Doğrulanamayan bilgi, rakam, tarih **yazılmaz.** Emin olunamıyorsa konu başka bir konuyla değiştirilir.
- Hesap örneklerinde `ÖRNEK HESAP` etiketi ve varsayımlar (kurulu güç, verim, saat) yazılır. Temsilî grafikler `temsilî` diye etiketlenir.
- Mevzuat içeriği hukuki tavsiye gibi yazılmaz. Gerekirse son slayta küçük bir not eklenir: "Bilgilendirme amaçlıdır; ayrıntı için resmî metne bakınız."

## 4. İstek gelince: sen karar verirsin
Kullanıcıya platform, tür ya da ölçü **sorma** (`rehber.md`).
- **Konu:** yoksa `rehber.md` §3–4'e göre bugünün önerisini sun.
- **Tür:** serinin varsayılanı (`rehber.md` §4).
- **Platform:** kullanıcı belirtmediyse **LinkedIn + Instagram ikisi için birden** hazırla. Carousel'de 1080×1350 PNG'ler + `carousel.pdf`; tek görselde 1080×1350.

Kullanıcı bir platform ya da tür söylediyse ona uy. Önce `strateji.md` §4 ile uygunluğunu kontrol et (ör. LinkedIn'de story yok); uymuyorsa sade dille söyle ve en yakın seçeneği öner. Üretimden önce konuyu `strateji.md` §3 ile kontrol et.

## 5. Ölçüler
| Platform / tür | Ölçü (`data-w × data-h`) | Teslim |
|---|---|---|
| LinkedIn carousel | 1080 × 1350 | `carousel.pdf`: LinkedIn'de "belge ekle" ile yüklenir, akışta kaydırmalı görünür (`strateji.md` §4). PNG'ler yedek. |
| Instagram carousel / gönderi | 1080 × 1350 | PNG'ler (en fazla 20 slayt) |
| LinkedIn / X / Facebook tek görsel | 1200 × 1200 (kare) veya 1200 × 675 (yatay) | PNG |
| Story (Instagram/Facebook) | 1080 × 1920 | PNG; üst 220 px ve alt 300 px'e önemli bilgi koyma |

Carousel: **5–9 slayt.** Her slaytta tek fikir, en fazla ~30 kelime.

## 6. Tasarım — www2 sitesinin teması
Temiz, beyaz, ferah bir SaaS görünümü. Bol boşluk, ince gri çerçeveler, tek ana renk mavi, kayıp/uyarı için kırmızı.

**Yazı tipleri** (internetten yüklenir, `index.html` başına):
```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&display=swap">
```
- **Satoshi:** başlık ve metin
- **IBM Plex Mono:** rakam, fiyat, tarih, sayfa numarası, kaynak satırı, rozet içindeki küçük veriler

**Renkler**
| Kullanım | Renk |
|---|---|
| Zemin | `#FFFFFF`, ikincil zemin `#F9FAFB`, grafik kutusu `#FAFAFA` |
| Ana metin | `#111827` |
| İkincil metin | `#6B7280`, soluk `#9CA3AF` |
| Çizgi / çerçeve | `#E5E7EB`, `#F0F0F0` |
| Ana mavi (vurgu, rakam, çizgi) | `#2563EB`, koyu `#1D4ED8`, açık `#60A5FA` |
| Rozet zemini | `#EFF6FF`, seçili `#DBEAFE` |
| Kayıp / uyarı / negatif | `#DC2626`, zemini `#FEF2F2`, çerçeve `#FECACA` |
| Koyu slayt (kapak ya da vurgu) | zemin `#111827`, başlık `#FFFFFF`, metin `#9CA3AF`, rozet zemini `rgba(37,99,235,.14)` ve yazısı `#60A5FA` |

**Bileşenler** (sitedeki karşılıklarıyla birebir, 1080 px genişliğe ölçeklenmiş)
- **Rozet:** hap biçimli, zemin `#EFF6FF`, 6 px nokta `#3B82F6` + yazı 22 px, 700, `#2563EB`, büyük harf (`toLocaleUpperCase("tr-TR")`), harf aralığı 2 px, iç boşluk 12×30 px.
- **Başlık:** Satoshi 800, 76–92 px, satır yüksekliği 1.08, harf aralığı −2 px, `#111827`. Vurgulanacak bir iki kelime `#2563EB` ya da (kayıpsa) `#DC2626` olabilir.
- **Açıklama:** 32–36 px, `#6B7280`, satır yüksekliği 1.55. Önemli kısım `#111827` ve 600 ağırlıkta.
- **Rakam kartı:** beyaz zemin, 1 px `#E5E7EB` çerçeve, köşe 24 px, iç boşluk 56 px. Değer IBM Plex Mono 700, 96–120 px, harf aralığı −3 px (`#111827`, kayıpsa `#DC2626`). Birim 28 px 600 `#4B5563`, açıklama 26 px `#9CA3AF`.
- **Bilgi kartı:** beyaz, 1 px `#E5E7EB`, köşe 24 px. Numara mono 22 px mavi (`01`, `02`…), başlık 34 px 700, metin 28 px `#6B7280`.
- **Grafik kutusu:** zemin `#FAFAFA`, 1 px `#F0F0F0`, köşe 28 px. Grafikler satır içi SVG ile çizilir: eksen etiketleri mono 20 px `#B0B0B0`, ana çizgi `#2563EB` 4 px, eşik çizgisi kesikli. Eşiğin altındaki bölge `#DC2626` %12 dolgu. Grafikte **gerçek veri** varsa kaynağı yazılır, yoksa `temsilî` etiketi konur.
- **Karşılaştırma:** iki sütun; olumlu taraf `✓` mavi, olumsuz taraf `✗` kırmızı (sitedeki karşılaştırma tablosu gibi).
- **Kaynak satırı:** alt kısımda, mono 20 px, `#9CA3AF`.
- **Sayfa göstergesi** (carousel): sağ altta mono 22 px `#9CA3AF`: `02 / 07`. Kapakta sağ altta sadece ince bir `→` oku. "Kaydır" yazısı yok.
- **Logo imzası:** her slaytta sol altta, genişlik ~200 px. Kapak ve son slaytta ~260 px. SVG `REPO` + `logo.md` dosyasından alınır. Renk kuralı aynı: açık zeminde siyah yazı, koyu zeminde beyaz yazı, şimşek mavi.

**Yerleşim:** kenar boşluğu 88 px. İçerik üstten başlar: rozet → başlık → açıklama → görsel öğe. Alt 120 px logo, kaynak ve sayfa göstergesi için ayrılır. Hizalama sola; kapak ve son slaytta ortalı olabilir. Metinler en az 24 px (telefonda okunur olsun).

**Carousel akışı**
1. **Kapak = kanca** (`strateji.md` §5): rozet + güçlü başlık (soru, şaşırtıcı bilgi ya da "ne değişti") + tek satır alt başlık. Koyu (`#111827`) ya da beyaz olabilir.
2. **Bağlam:** neden şimdi, neden önemli
3. **Ara slaytlar:** her biri tek fikir (rakam kartı, grafik, adım, karşılaştırma, kontrol listesi)
4. **Son slayt:** "Özetle" ya da tek akılda kalan cümle + kaynak + büyük logo. Çağrı yok.

**Kaçınılacaklar:** stok fotoğraf, emoji, clipart, 3D ikon, neon, gradyan yığını, gölge abartısı, ekranı dolduran metin, başlık ve açıklamada aynı cümlenin tekrarı, uydurma grafik.

## 7. Üretim
1. Klasör: `gorseller/YYYY-AA-GG_<kısa-ad>/` (proje kökünde).
2. `curl -s REPO/gorsel-render.mjs -o gorsel-render.mjs` ile render scriptini bu klasöre indir.
3. `index.html` dosyasını yaz:
   - `<body data-w="1080" data-h="1350">` (ölçü §5'ten)
   - Her slayt ayrı bir `<section class="slayt">`, tam o ölçüde (`width/height` px, `overflow:hidden`, `position:relative`). Slaytlar alt alta dizilir.
   - Yazı tipleri §6'daki `<link>` ile. Logo SVG'si satır içi.
   - Türkçe metinlerde büyük harf için `toLocaleUpperCase("tr-TR")` ya da doğrudan doğru yazım (İ, I, Ş, Ğ).
4. Çalıştır: `../../araclar/node/node.exe gorsel-render.mjs` → `out/01.png…`, birden çok slaytta `out/carousel.pdf` ve `out/onizleme.png`.
5. **Kontrol:** `out/onizleme.png` ve her PNG'yi görüntüle. Script taşan öğeleri ve yüklenmeyen yazı tiplerini uyarır. Taşan yazı, çakışan öğe, okunmayacak kadar küçük metin, boş alan dengesizliği, slaytlar arası tutarsız hizalama varsa düzelt ve yeniden render et.

## 8. Teslim
- `metin.md` dosyasını yaz. İçinde:
  - Gönderi açıklaması (platforma göre):
    - **LinkedIn:** 600–1300 karakter. İlk satır kanca, sonra 3–5 kısa paragraf. Bilgi verir, son satır özet cümlesi. Çağrı yok.
    - **Instagram:** 300–600 karakter.
  - 3–6 sade hashtag (`#GüneşEnerjisi` `#GES` `#EnerjiPiyasası` `#EPDK` `#YenilenebilirEnerji` gibi; konuya göre)
  - Kaynak bağlantıları
  - LinkedIn için PDF'e verilecek belge başlığı
- Kullanıcıya kısa özet ver: klasör yolu, slayt sayısı, hangi dosyanın hangi platforma **nasıl** yükleneceği (LinkedIn carousel: "belge ekle" ile `carousel.pdf`; Instagram: PNG'leri sırayla seç). Klasörü aç (`Invoke-Item "<klasör>"`).
