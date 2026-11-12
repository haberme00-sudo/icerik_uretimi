<!-- Kaynak: https://smokich.gosem.dev/stil/#stiller — stil: Kâğıt Poster (kagit-poster). Yer tutucular CLAUDE.md §4'e göre doldurulur. -->

Bu klasörde stüdyo kalitesinde bir motion graphics videosu yap. Slayt gösterisi değil: sahneler birbirinin içinden doğsun, görüntü anlatsın.

Konu: {{KONU}}
Biçim: {{BICIM}}

Stil:
# Kâğıt Poster

Krem kâğıt üzerine basılmış poster. İnce, sabit kâğıt greni; düz mürekkep, çok az nokta. Renkler: krem #F3F0E6, koyu #111410, zeytin #68725F, lime #D5FA73. Lime yalnız vurgu ya da koyu alanın içinde. Kalın, dar başlıklar. Her fikir tek büyük illüstrasyonla anlatılır; illüstrasyonlar aynı mürekkeplerle basılmış gibi durur.

Video bir anlatıma eşlik ediyor; görüntü takip edilebilecek kadar sakin kalsın. Çoğu sahne değişimi düz kesme ya da kamera hareketi olsun, özel geçişi birkaç büyük ana sakla. Ekrandaki yazılar Türkçe, okunurken sabit; cümleleri ekrana yazma.
{{STORYBOARD_SATIRI}}
{{SES_SATIRI}}
{{EFEKT_SATIRI}}

HTML, CSS ve JavaScript ile yap, her kare window.seek(t) ile çizilsin. Kareleri headless Chrome ile çek, ffmpeg ile MP4 yap; eksikse kur. Birçok kareye bak, gurur duyana kadar düzelt.

<!-- Koşullu satırlar (açıksa eklenir, kapalıysa satır silinir):
STORYBOARD_SATIRI: Önce sahne planını çıkar, onaylamadan video yapma.
SES_SATIRI: Ses dosyası bu klasörde: süreyi ondan al, Whisper ile kelime zamanlarını çıkar, görüntüyü söylenene oturt.
EFEKT_SATIRI: Ses efektlerini Openverse API'den al (https://api.openverse.org/v1/audio/?q=whoosh&license=cc0), anahtar gerekmez; az ve yerinde kullan, kullandıklarını CREDITS.md'ye yaz. -->
