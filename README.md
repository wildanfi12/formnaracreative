# Nara Creative Studio — Website Resmi & Sistem Brief Proyek

Website modern, interaktif, dan premium untuk agensi kreatif **Nara Creative Studio**. Dibangun dengan estetika visual netral hangat (*warm neutral/quiet luxury*), navigasi yang aksesibel, formulir brief interaktif 5 langkah, serta integrasi aman ke Google Sheets melalui backend Google Apps Script.

---

## 📌 Ringkasan Proyek

- **Nama Brand**: Nara Creative Studio
- **Domain/Fokus**: Studio Kreatif & Strategi Visual (Foto Produk, Video Campaign, Konten Sosial Media, Brand Strategy, Identitas Visual & Website, Digital Marketing)
- **Kontak Resmi**:
  - ✉️ Email: `naracreativestudio.id@gmail.com`
  - 💬 WhatsApp: `+62 812-8188-6198` ([wa.me/6281281886198](https://wa.me/6281281886198))
  - 📸 Instagram: `@naracreativestudio` ([instagram.com/naracreativestudio](https://instagram.com/naracreativestudio))
- **Spreadsheet Target**:
  `https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit?usp=sharing`

---

## 🎨 Karakteristik Desain & Visual

1. **Palet Warna Netral Hangat (*Warm Neutral*)**:
   - Background Utama: `#faf8f5` (warm off-white)
   - Background Sekunder / Cards: `#ffffff` & `#f6f3ed`
   - Tipografi / Kontras Teks: `#191816` (charcoal gelap yang sangat mudah dibaca)
   - Satu Warna Aksen: `#b85d2a` (terracotta / copper amber khas Nara)
2. **Tipografi Modern**: Kombinasi font Google *Outfit* (headings berkarakter) & *Plus Jakarta Sans* (body text dengan legibilitas prima).
3. **Aksesibilitas (WCAG AA Compliant)**:
   - Skip-to-content link untuk navigasi pembaca layar.
   - Kontras warna teks dan tombol teruji.
   - Label formulir eksplisit pada seluruh input.
   - Fokus keyboard jelas (`:focus-visible`).
   - Dukungan `prefers-reduced-motion` untuk kenyamanan pengguna sensitif animasi.
4. **Keaslian Konten (Zero Fake Metrics)**:
   - Tidak mencantumkan klaim fiktif seperti jumlah klien tidak terverifikasi atau persentase ROI yang mengada-ada.
   - Menampilkan pilar nilai autentik Nara Creative dan studi kasus riil (Belayang Food Bali, Howell Lifestyle, Kalceri Cafe).

---

## 🛠️ Struktur File Proyek

```
formnaracreative/
├── index.html                 # Struktur utama halaman web semantik & aksesibel
├── styles.css                 # Stylesheet lengkap tema netral hangat & responsif
├── app.js                     # Logika utama: 5-step wizard, validasi, Apps Script handler
├── script.js                  # Jembatan kompatibilitas ke app.js
├── apps-script-backend.gs     # Backend Google Apps Script (Append-Only)
├── TEST-DEPLOYMENT.js         # Skrip utility pengujian koneksi Web App
├── assets/                    # Logo resmi Nara Creative & aset karya
│   ├── nara-logo-dark.png
│   ├── nara-logo-cream.png
│   ├── nara-logo-white-bg.png
│   └── portfolio/
├── README.md                  # Dokumentasi utama proyek ini
└── APPS-SCRIPT-SETUP.md       # Panduan langkah demi langkah setup Apps Script
```

---

## 📋 Struktur Formulir Brief 5 Langkah

Formulir brief dirancang terstruktur dan mempertahankan jawaban pengguna (`localStorage` + state in-memory):

1. **Langkah 1: Kebutuhan Layanan**
   - 6 Kategori Layanan Wajib (A s/d F):
     - **A. Foto Produk & Lifestyle**
     - **B. Video & Campaign**
     - **C. Konten & Media Sosial**
     - **D. Brand Strategy & Storytelling**
     - **E. Identitas Visual & Website**
     - **F. Digital Marketing & Growth**
   - Subkategori interaktif otomatis muncul saat kategori dipilih.
   - Input teks bebas *"Kebutuhan Lainnya..."* per kategori.
2. **Langkah 2: Tentang Brand**
   - Nama Brand *(wajib)*
   - Bidang Bisnis / Industri *(wajib)*
   - Website / Media Sosial Aktif *(opsional)*
   - Deskripsi Singkat Brand & Produk *(wajib)*
   - Status Identitas Visual & Logo *(wajib)*
3. **Langkah 3: Tujuan Proyek**
   - Tujuan Utama Proyek *(wajib)*
   - Target Audiens Konsumen
   - Tantangan yang Dihadapi
   - Hasil yang Diharapkan
   - Referensi Gaya / Benchmark URL
4. **Langkah 4: Rencana Proyek**
   - Perkiraan Waktu Mulai *(wajib: Segera / Bulan Depan / Fleksibel)*
   - Target Tenggat Waktu / Deadline
   - Kisaran Estimasi Anggaran (Budget)
   - Aset yang Sudah Siap Pakai
   - Catatan Tambahan Khusus
5. **Langkah 5: Informasi Kontak**
   - Nama Lengkap *(wajib)*
   - Jabatan / Peran di Brand
   - Alamat Email Aktif *(wajib, validasi format)*
   - Nomor WhatsApp Aktif *(wajib)*
   - Preferensi Jalur Komunikasi
   - Persetujuan Kontak *(wajib dicentang)*
6. **Langkah Ringkasan (Review & Edit)**:
   - Menampilkan pratinjau kartu ringkasan dari semua input.
   - Tombol **"Ubah"** di tiap seksi untuk kembali ke langkah tertentu tanpa menghapus data lain.
7. **Pesan Sukses**:
   - Menampilkan **Brief ID** unik (contoh: `NARA-20261103-A8X9`).
   - Tombol salin Brief ID.
   - Tombol konfirmasi langsung via WhatsApp dengan pesan otomatis terisi.

---

## 🔌 Integrasi Google Sheets

### Metode: Google Apps Script Web App (POST Endpoint)
- **Keamanan**: Tidak memerlukan Google API Key, OAuth Client ID, atau kredensial JSON di frontend. Frontend mengirimkan payload JSON bersih ke Web App URL.
- **Append-Only**: Menggunakan metode `sheet.appendRow(rowData)` di Google Apps Script. Setiap brief baru otomatis ditambahkan sebagai baris baru paling bawah dan **tidak akan pernah menimpa** data yang sudah ada.
- **Auto-provisioning Tab**: Jika tab **`Client Briefs`** belum tersedia di spreadsheet, script secara otomatis membuatnya lengkap dengan styling header terracotta (`#B85D2A`).

### Susunan Header yang Disarankan (27 Kolom):
1. `Timestamp`
2. `Brief ID`
3. `Status` (Default: "Baru")
4. `Nama Lengkap`
5. `Email`
6. `WhatsApp`
7. `Jabatan/Peran`
8. `Preferensi Kontak`
9. `Nama Brand`
10. `Bidang Bisnis`
11. `Website/Media Sosial`
12. `Deskripsi Brand`
13. `Status Logo/Panduan Visual`
14. `Kategori Layanan`
15. `Detail Layanan`
16. `Layanan Lainnya`
17. `Tujuan Proyek`
18. `Target Audiens`
19. `Tantangan`
20. `Hasil yang Diharapkan`
21. `Referensi`
22. `Waktu Mulai`
23. `Tenggat Waktu`
24. `Anggaran`
25. `Aset yang Tersedia`
26. `Catatan Tambahan`
27. `Persetujuan Kontak`

---

## 🚀 Cara Menjalankan Project

### Opsi 1: Buka Langsung (Paling Mudah)
Cukup buka file `index.html` dengan peramban (browser) modern apa pun (Chrome, Edge, Firefox, Safari).

### Opsi 2: Jalankan Menggunakan Local Server
Buka terminal di direktori proyek dan jalankan:
```bash
# Menggunakan Node.js npx
npx serve .

# Atau menggunakan Python 3 (jika terpasang)
python -m http.server 8000
```
Lalu akses `http://localhost:8000` di peramban.

---

## ⚙️ Langkah Manual Setup Google Sheets

1. Buka spreadsheet target:
   `https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit`
2. Klik menu **Extensions** (Ekstensi) > **Apps Script**.
3. Hapus kode default di editor, lalu salin dan tempel seluruh isi file **`apps-script-backend.gs`**.
4. Klik tombol **Save** (Ctrl+S).
5. Klik **Deploy** > **New deployment**.
6. Pilih type: **Web app**.
   - *Description*: "Nara Creative Brief Submission"
   - *Execute as*: **Me** (email Google Anda)
   - *Who has access*: **Anyone** (Siapa saja)
7. Klik **Deploy**, lalu klik **Authorize access** untuk menyetujui izin spreadsheet.
8. Salin **Web app URL** yang muncul (format: `https://script.google.com/macros/s/.../exec`).
9. Buka file **`app.js`**, lalu perbarui nilai `APPS_SCRIPT_URL`:
   ```javascript
   const CONFIG = {
     APPS_SCRIPT_URL: 'URL_WEB_APP_YANG_ANDA_SALIN',
     ...
   };
   ```
10. Simpan file `app.js` dan uji pengiriman form brief di website!
