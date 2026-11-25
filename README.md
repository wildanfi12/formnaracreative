# NARA Creative | Form Brief Proyek

Halaman **form.naracreative.site**: form brief interaktif untuk calon klien yang datang dari portfolio
[naracreative.site](https://naracreative.site/). Desain mengikuti tema portfolio (cream editorial `#f5f1e9`,
charcoal `#29271e`, serif Georgia, aksen bronze `#8b6842`).

## Isi form & interaksi
| Langkah | Isi |
|---|---|
| 1. Kapabilitas | 4 pilar utama dari portfolio (AI Creativity & Produksi Visual, Konten & Digital Marketing, Visual Branding & Strategy, Website Development) dengan accordion output spesifik yang dapat dicentang + template cepat pengisian ringkasan proyek |
| 2. Rencana | Nama brand, IG/website (opsional), pilihan kartu anggaran, waktu mulai |
| 3. Kontak | Nama, WhatsApp, email |
| 4. Rekap | Cek ulang semua data + tombol "Ubah" per baris → Kirim |

Panel **Live Brief Dossier** di sisi pengantar diperbarui secara real-time saat klien memilih pilar, output, brand, anggaran, atau jadwal, beserta estimasi pengerjaan yang mengacu pada FAQ di portfolio.
Jawaban tersimpan otomatis di browser (`localStorage` key `nara_brief_v6`) saat pindah langkah atau reload.
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
