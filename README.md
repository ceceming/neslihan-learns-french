# 🐱 Neslihan Fransızca Öğreniyor

DELF A2 sınavına (3 Kasım) hazırlık için iPhone'da kullanılacak, mor kedili alıştırma sitesi.
Sunucu gerektirmez: GitHub Pages'te çalışır, ilerleme telefonun kendisinde (localStorage) saklanır.

## Yayına alma (GitHub Pages, ücretsiz)
1. Bu dalı `main`'e birleştir (ya da Pages'te doğrudan bu dalı seç).
2. GitHub → repo → **Settings → Pages** → *Source: Deploy from a branch* → `main` / `(root)` → **Save**.
3. 1–2 dakika sonra adres: `https://<kullanıcı-adın>.github.io/neslihan-learns-french/`
4. Annenin iPhone'unda Safari ile aç → Paylaş ⬆️ → **Ana Ekrana Ekle**. Uygulama gibi açılır.

> Repo özel (private) ise ücretsiz hesapta Pages çalışmaz; repoyu public yapman gerekir.

## Bilgisayarda deneme
```bash
python3 -m http.server 8000
# tarayıcıda http://localhost:8000
```

## Bölümler
| Bölüm | Ne yapar |
|---|---|
| 🗓️ Programım | Sınava geri sayım + gün gün çalışma planı (tik atılabilir) |
| 🃏 Kelime Kartları | Aralıklı tekrar (Leitner): bilinen kelime seyrek, bilinmeyen sık gelir |
| ✅ Kelime Testi | Fransızca→Türkçe, Türkçe→Fransızca ve sadece dinleyerek çoktan seçmeli |
| 📐 Gramer | Présent, passé composé, imparfait, imparfait/PC, futur, conditionnel |
| 🎤 Sözlü Sınav | Kendini tanıtma, 13 monolog sorusu, 7 diyalog provası, ses kaydı |
| 🎧 Dinle & Yaz | Dikte: duyduğunu yaz, aksan klavyesi, kelime kelime düzeltme |
| 🗣️ Dinle & Söyle | Telaffuz: dinle, tekrar et, (destekleniyorsa) konuşma tanıma ile puan |
| 📖 Okuma | İlan, e-posta, duyuru, mesaj + sorular |
| ✍️ Yazma Atölyesi | DELF tipi 60–80 kelimelik görevler, otomatik kontrol listesi, örnek cevap |
| 🧩 Cümle Kur | Kelimeleri doğru sıraya diz |
| 📊 İlerlemem | Seri, doğru/yanlış oranları, zorlanılan kelimeler, paylaş & yedekle |

Her cevap (doğru/yanlış) kaydedilir. **İlerlememi paylaş** butonu özeti WhatsApp'a gönderir.

## İçerik ekleme
Tüm içerik `js/data.js` içinde. Yeni kelime/cümle/soru eklerken listelerin **sonuna** ekle
(kayıtlar sıra numarasına bağlı). Yeni tema için `THEMES.push({...})`.
