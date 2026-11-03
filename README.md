# Nara Creative Website - Panduan Setup dan Integrasi

## 📋 Ringkasan

Website Nara Creative yang telah dibuat terdiri dari:
- **index.html**: Halaman utama dengan hero, layanan, cara kerja, dan form multi-step
- **styles.css**: Styling responsif, aksesibel, dan modern
- **script.js**: Logika form, validasi, dan penyimpanan lokal
- **apps-script-backend.gs**: Backend Google Apps Script untuk integrasi Google Sheets

## 🎯 File yang Dibuat

```
C:\Users\USER\Documents\Default Project\
├── index.html                 # Halaman website utama
├── styles.css                # Styling CSS
├── script.js                 # JavaScript untuk form dan logika
└── apps-script-backend.gs    # Google Apps Script (bukan untuk direktori ini)
```

## 🚀 Cara Menjalankan Website

### Opsi 1: Buka langsung di browser (Paling Mudah)
1. Buka folder `C:\Users\USER\Documents\Default Project\`
2. Double-click file `index.html`
3. Browser akan membuka website

### Opsi 2: Gunakan Local Server (Lebih Aman untuk Testing)
Buka PowerShell/Command Prompt di folder project dan jalankan:

```powershell
# Python 3
python -m http.server 8000

# atau jika Python 2
python -m SimpleHTTPServer 8000

# atau jika sudah install Live Server di VS Code
code . # Buka di VS Code, install extension "Live Server", klik Go Live
```

Kemudian buka: `http://localhost:8000`

## 🔌 Setup Integrasi Google Sheets

### LANGKAH 1: Persiapkan Google Sheets

1. Buka spreadsheet di link ini:
   https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit

2. Pastikan Anda sudah login dengan akun Google yang tepat

### LANGKAH 2: Buat Google Apps Script

1. Di spreadsheet, klik **Extensions** → **Apps Script**
   
2. Jika sudah ada kode di editor, hapus semuanya

3. Copy seluruh kode dari file `apps-script-backend.gs` (dari project ini) dan paste ke editor Apps Script

4. Di baris awal, verifikasi:
   ```javascript
   const SHEET_NAME = 'Client Briefs'; // Nama tab untuk briefs
   const SPREADSHEET_ID = '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo';
   ```
   Pastikan SPREADSHEET_ID sudah benar

5. **Simpan** kode (Ctrl+S)

### LANGKAH 3: Deploy sebagai Web App

1. Di Apps Script editor, klik **Deploy** → **New deployment**

2. Di popup yang muncul:
   - Pilih **Type**: Web app
   - **Execute as**: [Akun Google Anda]
   - **Who has access**: Anyone
   - **Description**: Nara Creative Brief Submission

3. Klik **Deploy**

4. Google akan meminta izin akses. Klik **Grant access** dan ikuti proses login

5. Setelah deploy berhasil, Anda akan melihat URL seperti:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercontent
   ```

6. **Copy URL deployment ini** (seluruh URL)

### LANGKAH 4: Update Website dengan URL Deployment

1. Buka file `script.js` dari project Anda

2. Cari baris yang berisi:
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent', {
   ```

3. Ganti `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent` dengan URL deployment yang Anda copy di langkah 3

4. **Simpan** file `script.js`

### LANGKAH 5: Test Integrasi

1. Buka website di browser (dengan live server atau buka index.html langsung)

2. Isi form brief secara lengkap dan klik "Kirim Brief"

3. Jika berhasil:
   - Akan muncul pesan "Terima kasih sudah menceritakan proyekmu"
   - Data akan muncul di Google Sheets di tab "Client Briefs"

4. Jika gagal:
   - Periksa console browser (F12 → Console) untuk error message
   - Verifikasi URL deployment Apps Script sudah benar
   - Pastikan Apps Script sudah di-deploy dengan akses "Anyone"

## 📊 Struktur Data di Google Sheets

Setiap brief yang dikirim akan membuat satu baris baru dengan kolom berikut:

| Kolom | Deskripsi |
|-------|-----------|
| Timestamp | Waktu pengiriman brief |
| Brief ID | ID unik untuk setiap brief |
| Status | Status awal (default: "Baru") |
| Nama Lengkap | Nama person of contact |
| Email | Email kontak |
| WhatsApp | Nomor WhatsApp |
| Jabatan/Peran | Jabatan di perusahaan |
| Preferensi Kontak | WhatsApp atau Email |
| Nama Brand | Nama bisnis/brand |
| Bidang Bisnis | Industri/sektor |
| Website/Media Sosial | Link ke website atau sosial media |
| Deskripsi Brand | Deskripsi singkat tentang bisnis |
| Status Logo/Panduan Visual | Sudah/Belum/Tidak Yakin |
| Kategori Layanan | Layanan yang dipilih |
| Detail Layanan | Sublayanan spesifik |
| Layanan Lainnya | Kebutuhan custom lainnya |
| Tujuan Proyek | Tujuan utama proyek |
| Target Audiens | Siapa target audiens |
| Tantangan | Tantangan yang dihadapi |
| Hasil yang Diharapkan | Expected outcome |
| Referensi | Contoh/referensi yang disukai |
| Waktu Mulai | Kapan proyek dimulai |
| Tenggat Waktu | Deadline proyek |
| Anggaran | Kisaran budget |
| Aset yang Tersedia | Aset yang sudah ada |
| Catatan Tambahan | Notes tambahan |
| Persetujuan Kontak | Ya/Tidak persetujuan kontak |

## 🔒 Keamanan dan Best Practices

### Catatan Keamanan:
- **Jangan** simpan API key atau token di file frontend
- URL Apps Script deployment **tidak rahasia** - bersifat publik untuk menerima request dari website
- Google Apps Script memiliki rate limiting (default 6 requests per menit per user)
- Data disimpan di Google Sheets yang aman dengan akses Google

### Rekomendasi Tambahan:
1. **Enable CORS di Apps Script** (sudah default untuk Web App deployment)
2. **Validasi data** dilakukan di kedua sisi (frontend dan backend)
3. **Backup data** - Google Sheets otomatis backup di Google Drive
4. **Notifikasi Email** - Anda bisa uncomment bagian `sendEmailNotification()` di Apps Script untuk mendapat notifikasi setiap ada brief baru

## 📱 Fitur Website

### ✅ Fitur yang Sudah Diimplementasi:
- Multi-step form (5 langkah) dengan progress indicator
- Checkbox dinamis untuk kategori dan sublayanan
- Validasi form yang ramah pengguna
- Auto-save form data ke localStorage (jika user keluar, data tetap tersimpan)
- Ringkasan (summary) sebelum submit
- Pesan sukses setelah submit berhasil
- Responsive design untuk mobile, tablet, desktop
- Aksesibilitas: semantic HTML, ARIA labels, keyboard navigation
- Light animations dengan respek untuk prefers-reduced-motion

### 🎨 Desain:
- Warna: Off-white (#FAF7F5), teks gelap (#2C2520), aksen warm (#D4915D)
- Typography: Modern, clean, mudah dibaca
- Spacing: Generous whitespace untuk elegance
- Brand voice: Hangat, profesional, mengundang

## 🔄 Workflow Calon Klien

1. Calon klien buka website → Lihat layanan Nara
2. Klik "Mulai Brief" atau pilih layanan spesifik
3. Isi form 5 langkah dengan detail kebutuhan
4. Review ringkasan → Klik "Kirim Brief"
5. Menerima konfirmasi, data masuk ke Google Sheets
6. Tim Nara review dan hubungi calon klien melalui kontak yang diberikan

## 📝 Notes untuk Team Nara

- Setiap brief baru masuk ke tab "Client Briefs" di spreadsheet
- Status awal: "Baru" - bisa diupdate saat tim sudah review
- Brief ID unik untuk tracking
- Timestamp otomatis untuk audit trail
- Preferensi kontak mempermudah follow-up (WhatsApp atau Email)

## ⚠️ Troubleshooting

### Tombol "Kirim Brief" tidak bekerja / Error 404
**Solusi:**
- Pastikan URL deployment Apps Script sudah benar di script.js
- Pastikan Apps Script sudah di-deploy dengan akses "Anyone"
- Check console browser (F12) untuk error message

### Form data hilang saat refresh
**Solusi:**
- Ini normal - data akan tersimpan jika Anda refresh di tengah pengisian
- Data disimpan di localStorage browser Anda

### Google Sheets tidak menerima data
**Solusi:**
- Di Apps Script, buka Apps Script editor
- Klik tab "Executions" untuk lihat log eksekusi
- Cek error message di log
- Verifikasi permissions sudah granted

### Kolom spreadsheet tidak lengkap atau berbeda
**Solusi:**
- Jika sudah ada data di spreadsheet, script akan menambah baris tanpa membuat header baru
- Header otomatis dibuat hanya jika tab "Client Briefs" tidak ada
- Jika perlu reset, bisa hapus tab "Client Briefs" dan submit brief baru

## 🚀 Next Steps untuk Deploy Live

1. **Domain**: Pasang website ke domain Anda (misal: naracreative.com)
   - Bisa gunakan Vercel, Netlify, GitHub Pages (gratis)
   - Atau hosting biasa (Niagahoster, Cloudways, dll)

2. **Email Notifikasi**: Uncomment fungsi `sendEmailNotification()` di Apps Script jika ingin notifikasi email

3. **Analytics**: Tambahkan Google Analytics untuk tracking visitor

4. **SEO**: Optimasi meta tags, schema markup untuk SEO

5. **CMS Optional**: Jika perlu update konten tanpa edit kode, bisa tambahkan sistem CMS sederhana

## 📞 Support

Jika ada pertanyaan tentang:
- Integrasi Google Sheets → Check section "Setup Integrasi Google Sheets" di atas
- Styling/CSS → Edit colors di root variables di `styles.css`
- Form fields → Edit di `index.html` (jangan lupa update validasi di `script.js`)
- Text/Copy → Edit langsung di `index.html` dalam tag yang sesuai

---

**Website Nara Creative sudah siap digunakan! 🎉**
