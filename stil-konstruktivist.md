<!-- Kaynak: https://smokich.gosem.dev/stil/#stiller — stil: Konstrüktivist (konstruktivist). Yer tutucular CLAUDE.md §0 "Stil dosyasındaki yer tutucular" kısmına göre doldurulur. -->

Bu klasörde stüdyo kalitesinde bir motion graphics videosu yap. Slayt gösterisi değil: sahneler birbirinin içinden doğsun, görüntü anlatsın.

Konu: {{KONU}}
Biçim: {{BICIM}}

Stil:
# Stil kartı: KONSTRÜKTİVİST

Kod karşılığı: `looks/konstruktivist.js`.

## Palet
- Krem `#E3CFA1`: zemin, yaklaşık %40. Açık ışın tonu `#EDDDB6`.
- Kırmızı `#D32619`: büyük çapraz alan, yaklaşık %30.
- Siyah `#0B0A09`: gövde, üçgen alan ve yazı, yaklaşık %30.
- Başka renk yok. Gradyan yok.

## Yazı
- Köşeli, ağır, geniş blok harf (Russo One), hep büyük harf.
- Yazı yatay durmaz: çapraz bandın eğimine oturur.
- İki boy: bandı dolduran dev sözcük ve küçük blok etiket. Orta boy çok az.

## Yüzey
Eskimiş kağıt, ince mürekkep beneği. Kenarlar keskin, alanlar düz baskı.

## Yerleşim alışkanlıkları
- Sayfa, 30-35 derecelik tek bir ana eğimle bölünür. Her şey ona paralel ya da dik durur.
- Köşelerde büyük üçgenler.
- Nesne de eğimden payını alır, dik durmaz.
- Merkez yok; göz çapraz boyunca akar.

## İmza öğeleri
1. Sayfayı boydan boya kesen kırmızı çapraz band.
2. Banda paralel ince siyah şeritler.
3. Bir noktadan yayılan güneş ışınları.
4. Büyük siyah köşe üçgeni, üstünde krem yazı.
5. Küçük geometrik işaretler: kare, üçgen.

## Canlı hali
- Biçimler düz çizgide, kararlı hareket eder; süzülme ve yaylanma yok.
- Işınlar çok yavaş döner, patlama anında kırmızıya döner.
- Sözcük değişimi düz kesmedir, bant yerinde kalır.
- İmza geçiş: kırmızı band ekranı çapraz keser, sesi kısa kağıt vuruşu. Yalnızca büyük anlarda.

## Anlatım takımı
Hepsi aynı eğim üzerine kurulur.
- Başlık: dev iki sözcük bandın üstünde.
- Tek fikir: büyük nesne, bir köşeden gelen ışınlar.
- Karşılaştırma: çapraz ikiye bölünmüş sayfa, kırmızı ve siyah.
- Büyük sayı: bandın üstünde dev rakam.
- Adımlar: eğim boyunca dizilmiş kare bloklar.
- Kapanış: siyah üçgen, tek cümle.

Video bir anlatıma eşlik ediyor; görüntü takip edilebilecek kadar sakin kalsın. Çoğu sahne değişimi düz kesme ya da kamera hareketi olsun, özel geçişi birkaç büyük ana sakla. Ekrandaki yazılar Türkçe, okunurken sabit; cümleleri ekrana yazma.
{{STORYBOARD_SATIRI}}
{{SES_SATIRI}}
{{EFEKT_SATIRI}}

HTML, CSS ve JavaScript ile yap, her kare window.seek(t) ile çizilsin. Kareleri headless Chrome ile çek, ffmpeg ile MP4 yap; eksikse kur. Birçok kareye bak, gurur duyana kadar düzelt.

<!-- Koşullu satırlar (açıksa eklenir, kapalıysa satır silinir):
STORYBOARD_SATIRI: Önce sahne planını çıkar, onaylamadan video yapma.
SES_SATIRI: Ses dosyası bu klasörde: süreyi ondan al, Whisper ile kelime zamanlarını çıkar, görüntüyü söylenene oturt.
EFEKT_SATIRI: Ses efektlerini Openverse API'den al (https://api.openverse.org/v1/audio/?q=whoosh&license=cc0), anahtar gerekmez; az ve yerinde kullan, kullandıklarını CREDITS.md'ye yaz. -->
