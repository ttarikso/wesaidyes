# Ever After Invites · Dijital düğün davetiyesi sitesi (kurulum, Türkçe)

Etsy'den satılan, barındırılan (hosted) düğün davetiyesi web sitesi.
Alıcı sipariş numarası + e-postası ile panelini açar, tema seçer, bilgilerini doldurur,
yayınlar ve tek bir link paylaşır. Misafir linke tıklar → mühürlü zarf açılır → davetiye,
müzik, geri sayım, hikaye, program, detaylar, SSS ve RSVP formu.

Altyapı Jolly Game Night ile aynı: **Next.js 15 + Supabase + Vercel**.

## Sayfalar
| Adres | Kim için | Ne yapar |
|---|---|---|
| `/` | Herkes | Tanıtım sayfası (Etsy'den gelenler için) |
| `/demo` | Herkes | Canlı demo, tema seçici ile (Etsy ilanına bu linki koy) |
| `/redeem` | Alıcı | Etsy sipariş no + e-posta → erişim anahtarı (EA-XXXX-XXXX-XXXX) |
| `/studio` | Alıcı | Davetiyesi; ilk girişte otomatik oluşur ve editör açılır |
| `/studio/[id]` | Alıcı | Editör: tema, çift & tarih, mekan, hikaye & fotoğraflar, program, detaylar & SSS, müzik, RSVP formu, yayınla & paylaş. Sağda canlı telefon/masaüstü önizleme. Otomatik kayıt. |
| `/studio/[id]/guests` | Alıcı | RSVP listesi, sayılar, arama, CSV indirme |
| `/i/[slug]` | Misafir | Yayındaki davetiye (ör. `domain.com/i/sophia-and-daniel-2027`) |
| `/admin` | Sen | Siparişleri gör, iade edilenleri iptal et (Revoke) |

## 1) Supabase (veritabanı + fotoğraf depolama) – ücretsiz
1. https://supabase.com → New project (bölge: Frankfurt). Jolly için açtığın projeyi değil, **yeni** bir proje aç.
2. **SQL Editor** → `supabase/schema.sql` içeriğini yapıştır → Run.
   Bu, tabloları ve `photos` adlı herkese açık depolama klasörünü (bucket) oluşturur.
3. **Project Settings → API**: `Project URL`, `anon public` ve `service_role` anahtarlarını not al.

## 2) GitHub
Bu klasörü yeni bir **private** repoya yükle (ör. `ever-after-invites`).

## 3) Vercel
1. Add New → Project → repoyu seç.
2. **Environment Variables** (`.env.example` içinde hepsi var):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (gizli!)
   - `ADMIN_SECRET` = uzun rastgele şifre (`/admin` için)
   - `NEXT_PUBLIC_SITE_URL` = `https://senin-domainin.com` (paylaşım linki ve QR bundan üretilir)
   - `NEXT_PUBLIC_INVITES_PER_ORDER` = 1 (bir siparişle kaç davetiye açılabilir)
3. Deploy → Settings → Domains → domainini ekle.

## 4) Günlük kullanım
- **Yeni sipariş:** bir şey yapmana gerek yok. Alıcı Etsy sipariş numarasını girince otomatik açılır.
  Aynı sipariş no + aynı e-posta ile her cihazdan tekrar girer. Farklı e-posta ile ikinci kez açılamaz.
- **İade/iptal:** `/admin` → siparişi bul → **Revoke**.
- **Etsy teslim dosyası (PDF):** içine `domain.com/redeem` linkini ve 3 adımı yaz.

## Tema ekleme (40-50'ye çıkarmak için)
Her tema = 3 görsel + 1 satır ayar.
1. `public/themes/` içine koy: `<ad>-paper.webp` (renkli kağıt dokusu, 1000×1500),
   `<ad>-seal.webp` (şeffaf arka planlı mum mühür, ortası boş), `<ad>-floral.webp` (şeffaf çiçek kümesi).
2. `lib/themes.ts` içindeki `THEMES` listesine yeni bir satır ekle (renkler + font).
Görseller Magnific'te GPT Image 2.5 (4K, low) ile üretildi; aynı prompt kalıbını renk/çiçek değiştirerek kullan.
Mühür promptunda "smooth flat blank empty circular center with no letters" kısmı önemli: baş harfler kodla üstüne yazılıyor.

## Müzik
`public/music/` içinde 20 orijinal enstrümantal parça var (Magnific / Google Lyria 3 Pro ile üretildi, ~2,5 dk, döngüde çalar).
Liste `lib/music.ts` içinde. Yeni parça: mp3'ü klasöre koy, listeye bir satır ekle.
Ticari kullanım koşullarını Magnific planının lisans sayfasından bir kez kontrol etmeni öneririm.

## Sınırlar / notlar
- Davetiye dili şimdilik İngilizce (Etsy'nin ana kitlesi). Metinlerin çoğu panelden değiştirilebiliyor;
  bölüm başlıkları (Our Story, RSVP vb.) koddadır. Dil paketi sonraki adım olabilir.
- Geri sayım misafirin kendi saat diliminde hesaplanır; yurtdışından bakan misafir için birkaç saat sapabilir.
- Fotoğraflar tarayıcıda 1600 px'e küçültülüp yüklenir (Supabase ücretsiz katman: 1 GB depolama).
- Supabase ücretsiz projeler 7 gün hiç kullanılmazsa duraklar; satışa açınca Pro'ya geçmek ya da haftalık ping kurmak iyi olur.
- Yerelde (Supabase anahtarları olmadan) site `.data/db.json` ve `.data/uploads` kullanır.

## Geliştirme
```
npm install
npm run dev     # http://localhost:3000
```
