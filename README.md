# NARA Creative | Form Brief Proyek

Halaman **form.naracreative.site**: form brief interaktif untuk calon klien yang datang dari portfolio
[naracreative.site](https://naracreative.site/). Desain mengikuti tema portfolio (cream editorial `#f5f1e9`,
charcoal `#29271e`, serif Georgia, aksen bronze `#8b6842`).

## Isi form & interaksi
| Langkah | Isi |
|---|---|
| 1. Layanan | Menu interaktif *"Apa yang Bisa Kami Kerjakan"* di sisi pengantar (01 Editing Video & Motion, 02 Desain Grafis & Branding, 03 Building Website: portfolio/company profile/landing page, 04 Foto Produk & AI Visual, 05 Konten & Digital Marketing) sinkron dua arah dengan accordion output spesifik di form + template cepat ringkasan |
| 2. Rencana | Nama brand, IG/website (opsional), pilihan kartu anggaran, waktu mulai |
| 3. Kontak | Nama, WhatsApp, email |
| 4. Rekap | Cek ulang semua data + tombol "Ubah" per baris → Kirim |

Ringkasan brief langsung di panel pengantar ikut terbarui saat klien memilih layanan, brand, anggaran, atau jadwal, beserta estimasi pengerjaan yang mengacu pada FAQ di portfolio.
Jawaban tersimpan otomatis di browser (`localStorage` key `nara_brief_v7`) saat pindah langkah atau reload.
Layar sukses **hanya** muncul jika Apps Script membalas `success: true`.

## File
- `index.html`: struktur halaman
- `styles.css`: tema editorial & komponen interaktif
- `app.js`: sinkronisasi kapabilitas/output, Live Brief Dossier, validasi, rekap, pengiriman (`CONFIG.APPS_SCRIPT_URL` di baris atas)
- `apps-script-backend.gs`: backend Google Sheets (append-only, tab `Brief Klien`)
- `TEST-DEPLOYMENT.js`: uji kirim dengan `node TEST-DEPLOYMENT.js "<URL /exec>"`

## Menghubungkan ke Google Sheets
1. Spreadsheet → Ekstensi → Apps Script → tempel isi `apps-script-backend.gs` → Simpan.
2. Terapkan → Deployment baru → Aplikasi web → *Jalankan sebagai: Saya*, *Akses: Siapa saja*.
3. Salin URL `/exec` → tempel ke `CONFIG.APPS_SCRIPT_URL` di `app.js` → push.
4. Uji: `node TEST-DEPLOYMENT.js "<URL>"` lalu cek baris baru di tab **Brief Klien**.

Kolom tab `Brief Klien`: Timestamp · ID Brief · Status · Nama · WhatsApp · Email · Nama Brand ·
Instagram / Website · Layanan · Detail Output · Ringkasan Proyek · Anggaran · Mulai · Sumber.

## Jalankan lokal
Buka `index.html` langsung di browser, atau jalankan server statis lokal.
