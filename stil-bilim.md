<!-- Kaynak: https://smokich.gosem.dev/stil/#stiller — stil: Bilim Atlası (bilim). Yer tutucular CLAUDE.md §4'e göre doldurulur. -->

Bu klasörde stüdyo kalitesinde bir motion graphics videosu yap. Slayt gösterisi değil: sahneler birbirinin içinden doğsun, görüntü anlatsın.

Konu: {{KONU}}
Biçim: {{BICIM}}

Stil:
# Stil kartı: Eski Bilim

Alınan şey görsel dil; çizimler, yerleşimler ve yazılar konuya göre yeniden yapılır.

## Palet
- Kağıt (ekranın %70'i): `#d7c79f`, `#dccda6`, `#e4d7b8` arası lekeli; kenarda koyulaşır. Taban `#dbcca6`.
- Mürekkep (%15): `#26231a`; `multiply` ile basılır, ağır baskıda ref 1 gibi siyaha yaklaşır, solukta ref 4'ün `#675f49` tonuna iner.
- Kara levha (büyük anlar, %15): `#131313` – `#2d2d2d` bulutlu; ortalama `#1d1d1d`.
- Tebeşir: `#e6e6df` (ref 2 açığı `#dbdbdb`). Kara levhada yanına küçük numaralı detay figürü konur (ref 2 gibi).
- Vurgu rengi yok. Tek renk mürekkep; vurgu ağırlıkla yapılır.

## Yazı
- Başlık: Old Standard (ref 1 "Fig. 23.—" kesimi), 39 px, ortalı: `Fig. N.—Ad.` kalıbı, sonda nokta.
- Ağır etiket: Bevan (ref 4 Clarendon/slab), 46–62 px; dev sözcük 214 px.
- İnce etiket: Old Standard düz veya italik, 40–50 px; kısım numarası italik 25 px.
- Kenar notu: Caveat 500, -9° eğik, 50–68 px. Kısa, gerçek Türkçe cümle, noktalı.
- Kod ve daktilo: Courier Prime 35–40 px.
- Ekran yazısı kısadır, anlatımı tekrar etmez, tamamlar.

## Yüzey
Lekeli kağıt, ince gren, foxing beneği, ortadan geçen kat izi, arkadan sızan satır gölgesi. Mürekkep kenarı titrek (displacement), içinde kuru baskı beneği, geniş alanda hafif solma. Kara levhada tebeşir bulutu ve çizik. Küçük gate titremesi (10 fps, 0,7 px).

## Yerleşim alışkanlığı
- İnce tek çizgi çerçeve; üstte ortalı Fig. başlığı.
- Tek büyük çizim, çevresinde bol boş kağıt; etiketler sağ sütunda hizalı, kesik kılavuzla bağlı.
- Çizim sol-orta, not sağ. Bir levhada en çok bir ağır sözcük grubu.

## İmza öğeleri
1. `Fig. N.—` başlığı.
2. Kesik kılavuz çizgisi, ucunda nokta; ona bağlı etiket ve dağınık italik kısım numaraları.
3. Gravür taraması: kenara doğru sıklaşan paralel çizgiler, koyu yerde çapraz.
4. Eğri tipleri: düz, kesikli, çizgi-nokta; üzerinde ○ × ● işaretleri, eğrinin yanında italik ad.
5. Kalemle müdahale: kalın çapraz çizik ve el yazısı kenar notu.

## Canlı hali
- Çizimler kalem sırasıyla çizilir: önce kontur, sonra tarama.
- Etiket: önce kılavuz, sonra sözcük damga gibi iner (%10 küçülerek, 3–5 kare).
- Kenar notu soldan sağa yazılır; süre sözcüğün süresidir.
- Çizelge imleci saniye saniye, sözcük vuruşuyla atlar.
- Kamera: çok yavaş itme veya çekip levhanın kalanını açma. Geçişlerin çoğu düz kesme, kesmede kısa kağıt sesi.
- **İmza geçiş:** mürekkep damlası. Çarpı işaretinin ortasına düşer, sayfayı karartır, kara levha açılır. Ses: boğuk gümleme + kağıt + alçak hava. Yalnız büyük dönüş anında (videoda en çok bir iki kez).

## Kit
- Başlık: çift çerçeve, dev slab, italik alt satır.
- Tek fikir, büyük çizim: `kitFikir`.
- Karşılaştırma: kara levha, ortada kesik ayraç, a. / b.
- Büyük sayı: ölçü oklu dev rakam.
- Adımlar: gravür madalyonlar, kesik hat.
- Kapanış: kara levhada el yazısı ve imza kıvrımı.

Video bir anlatıma eşlik ediyor; görüntü takip edilebilecek kadar sakin kalsın. Çoğu sahne değişimi düz kesme ya da kamera hareketi olsun, özel geçişi birkaç büyük ana sakla. Ekrandaki yazılar Türkçe, okunurken sabit; cümleleri ekrana yazma.
{{STORYBOARD_SATIRI}}
{{SES_SATIRI}}
{{EFEKT_SATIRI}}

HTML, CSS ve JavaScript ile yap, her kare window.seek(t) ile çizilsin. Kareleri headless Chrome ile çek, ffmpeg ile MP4 yap; eksikse kur. Birçok kareye bak, gurur duyana kadar düzelt.

<!-- Koşullu satırlar (açıksa eklenir, kapalıysa satır silinir):
STORYBOARD_SATIRI: Önce sahne planını çıkar, onaylamadan video yapma.
SES_SATIRI: Ses dosyası bu klasörde: süreyi ondan al, Whisper ile kelime zamanlarını çıkar, görüntüyü söylenene oturt.
EFEKT_SATIRI: Ses efektlerini Openverse API'den al (https://api.openverse.org/v1/audio/?q=whoosh&license=cc0), anahtar gerekmez; az ve yerinde kullan, kullandıklarını CREDITS.md'ye yaz. -->
