<!-- Kaynak: https://smokich.gosem.dev/stil/#stiller — stil: ASCII Atlas (ascii). Yer tutucular CLAUDE.md §4'e göre doldurulur. -->

Bu klasörde stüdyo kalitesinde bir motion graphics videosu yap. Slayt gösterisi değil: sahneler birbirinin içinden doğsun, görüntü anlatsın.

Konu: {{KONU}}
Biçim: {{BICIM}}

Stil:
# ASCII Atlas


## Palet
- Zemin mürekkep `#0B0D0C` — ekranın çoğu.
- Krem `#EEEADE` — kara karakterleri, başlık; başlık degradesi krem → gül.
- Lime `#D8F57A` — "sen", istek, büyük numara, vurgulu kelime. Ana vurgu.
- Gül `#F0A8BE` — sunucu ve sağ alt renk alanı. Mavi `#5680FF` — DNS, kıtalardaki seyrek ■ hücreleri, sol alt alan.
- Renk her zaman yumuşak alan olarak gelir: büyük radyal degrade + üstünde aynı renkte dither karakterleri.
- Sayfa kâğıdı `#ECE8DC`, üstünde mürekkep `#1D1D1A`.

## Tip
- Büyük kelime: Didot 200px, harf harf yükselerek gelir, hafif süzülür, küreyle iç içe geçer.
- Açıklama cümlesi: Bodoni 72 italik 40px, anahtar kelime lime.
- Piksel serif numara: Didot bold 330px karakter ızgarasına dökülür, `█ ▒` hücreleriyle lime; hücre hücre çözünerek gelir.
- Küçük etiketler: Menlo 12px, şehir adı + koordinat (takımyıldız notu gibi).

## Yüzey
- Izgara 192×68 hücre (10×16 px). Her görüntü gerçekten karakter: kara `01X>$■`, okyanus seyrek `·` deseni.
- Dış alanlar ` ·.:+*` rampasıyla 4×4 Bayer dither; altta gerçek yumuşak renk parıltısı.
- Işıklar (istek, paket) geçtikleri hücreleri boyar ve yoğunlaştırır, üstte "lighter" parıltı.

## Düzen alışkanlıkları
- Sol sütun: küçük aralıklı başlık satırı, dev serif kelime, iki satırlık italik cümle.
- Merkez-sağ: tek büyük ASCII imge (dönen dünya, sonra kâğıt sayfa). Sağ üst: piksel serif numara.
- Alt: ince adım çizgisi (etkin adım lime dolar), sağda küçük zaman/not.

## İmza öğeler
1. Karakterden dönen dünya; kıtalarda seyrek mavi ■.
2. Şehirler arası ince takımyıldız çizgileri, yükselen yay rotalar.
3. Işıyan paket: renkli kuyrukluyıldız, geçtiği karakterleri renklendirir.
4. Dither renk alanları (lime / gül / mavi) karanlıkta nefes alır.
5. Piksel serif dev numara + Didot kelime ikilisi.

## Hareket
- Sahne kesmesi yok: dünya sürekli döner, renk alanları kayar, "sen" halkaları atar.
- Adım değişimi: kelime harf harf yükselir, numara hücre hücre çözünür, cümle yumuşak belirir.
- İmza geçiş (kapanış): sayfa hücre hücre birleşir — önce lime rastgele karakter, sonra kâğıt ve mürekkep.

## Kit
- Başlık: dev Didot kelime + küçük aralıklı üst satır.
- Tek fikir: büyük ASCII imge + sol cümle.
- Karşılaştırma: aynı imgede iki renkli rota (lime vs gül).
- Büyük sayı: piksel serif rakam, altında italik açıklama.
- Adımlar: numara + alt adım çizgisi.
- Kapanış: kâğıt sayfa birleşmesi, Didot karşılama cümlesi.

## Notlar
- "Fazla terminal gibi; daha görsel, daha sanatsal, yine de sunum, renkli olsun." → pencereler kalktı, her adım tek büyük ASCII imge + dev serif tip + yumuşak renk alanı.

Video bir anlatıma eşlik ediyor; görüntü takip edilebilecek kadar sakin kalsın. Çoğu sahne değişimi düz kesme ya da kamera hareketi olsun, özel geçişi birkaç büyük ana sakla. Ekrandaki yazılar Türkçe, okunurken sabit; cümleleri ekrana yazma.
{{STORYBOARD_SATIRI}}
{{SES_SATIRI}}
{{EFEKT_SATIRI}}

HTML, CSS ve JavaScript ile yap, her kare window.seek(t) ile çizilsin. Kareleri headless Chrome ile çek, ffmpeg ile MP4 yap; eksikse kur. Birçok kareye bak, gurur duyana kadar düzelt.

<!-- Koşullu satırlar (açıksa eklenir, kapalıysa satır silinir):
STORYBOARD_SATIRI: Önce sahne planını çıkar, onaylamadan video yapma.
SES_SATIRI: Ses dosyası bu klasörde: süreyi ondan al, Whisper ile kelime zamanlarını çıkar, görüntüyü söylenene oturt.
EFEKT_SATIRI: Ses efektlerini Openverse API'den al (https://api.openverse.org/v1/audio/?q=whoosh&license=cc0), anahtar gerekmez; az ve yerinde kullan, kullandıklarını CREDITS.md'ye yaz. -->
