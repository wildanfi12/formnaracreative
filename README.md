# NARA Creative — Form Brief Proyek

Halaman **form.naracreative.site**: form singkat untuk calon klien yang datang dari portfolio
[naracreative.site](https://naracreative.site/). Desain mengikuti tema portfolio (cream editorial,
serif Georgia, aksen cokelat `#8b6842`).

## Isi form (ringkas)
| Langkah | Field |
|---|---|
| 1. Kebutuhan | Layanan (pilih ≥1 dari 6), ringkasan proyek |
| 2. Rencana | Nama brand, IG/website (opsional), anggaran, waktu mulai |
| 3. Kontak | Nama, WhatsApp, email |
| Rekap | Cek ulang + tombol "Ubah" per bagian → Kirim |

Jawaban tersimpan otomatis di browser (localStorage) saat pindah langkah atau reload.
Layar sukses **hanya** muncul jika Apps Script membalas `success: true`.

## File
- `index.html` — struktur halaman
- `styles.css` — tema
- `app.js` — langkah, validasi, rekap, pengiriman (`CONFIG.APPS_SCRIPT_URL` di baris atas)
- `apps-script-backend.gs` — backend Google Sheets (append-only, tab `Brief Klien`)
- `TEST-DEPLOYMENT.js` — uji kirim: `node TEST-DEPLOYMENT.js "<URL /exec>"`

## Menghubungkan ke Google Sheets
1. Spreadsheet → Ekstensi → Apps Script → tempel isi `apps-script-backend.gs` → Simpan.
2. Terapkan → Deployment baru → Aplikasi web → *Jalankan sebagai: Saya*, *Akses: Siapa saja*.
3. Salin URL `/exec` → tempel ke `CONFIG.APPS_SCRIPT_URL` di `app.js` → push.
4. Uji: `node TEST-DEPLOYMENT.js "<URL>"` lalu cek baris baru di tab **Brief Klien**.

Kolom tab `Brief Klien`: Timestamp · ID Brief · Status · Nama · WhatsApp · Email · Nama Brand ·
Instagram / Website · Layanan · Ringkasan Proyek · Anggaran · Mulai · Sumber.

## Jalankan lokal
Buka `index.html` langsung di browser, atau `npx serve .`
