# PETUNJUK SINGKAT - SETUP WEBSITE NARA CREATIVE

## ⚡ Quick Start

### 1. JALANKAN WEBSITE (Pilih Salah Satu)

**Cara Termudah:**
- Double-click file `index.html` di folder project ini

**Cara dengan Local Server (Lebih Baik):**
```powershell
python -m http.server 8000
# Buka: http://localhost:8000
```

### 2. HUBUNGKAN KE GOOGLE SHEETS (WAJIB!)

**Status Saat Ini:**
❌ Website belum terhubung ke Google Sheets
❌ Brief yang dikirim akan error sampai Anda setup Apps Script

**Kenapa belum terhubung?**
Saya tidak bisa melihat struktur spreadsheet Anda karena memerlukan login. Jadi Anda harus melakukan setup manual berikut:

#### Langkah Setup (Estimasi: 5-10 menit):

**A. Buka Google Sheets:**
1. Buka: https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
2. Login dengan akun Google Anda

**B. Setup Apps Script:**
1. Di Google Sheets, klik: **Extensions** → **Apps Script**
2. Hapus kode default yang ada
3. Copy-paste **seluruh kode** dari file `apps-script-backend.gs` (ada di folder project)
4. Klik **Save** (ikon disk)

**C. Deploy sebagai Web App:**
1. Klik **Deploy** → **New deployment**
2. Pilih type: **Web app**
3. Execute as: **Me** (email Anda)
4. Who has access: **Anyone**
5. Klik **Deploy**
6. Klik **Authorize access** dan ikuti login
7. **COPY URL** yang muncul (contoh: https://script.google.com/macros/s/ABCDEFG123/usercontent)

**D. Update Website:**
1. Buka file `script.js` (di folder project)
2. Cari baris 463:
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent', {
   ```
3. Ganti URL di atas dengan URL yang Anda copy di langkah C.7
4. Save file

**E. Test:**
1. Refresh website di browser
2. Isi form brief dan kirim
3. Cek Google Sheets → Tab "Client Briefs" akan muncul dengan data brief

## 📋 Struktur Tab/Kolom yang Akan Dibuat

Apps Script akan otomatis membuat tab baru bernama **"Client Briefs"** dengan kolom:

- Timestamp
- Brief ID  
- Status
- Nama Lengkap
- Email
- WhatsApp
- Jabatan/Peran
- Preferensi Kontak
- Nama Brand
- Bidang Bisnis
- Website/Media Sosial
- Deskripsi Brand
- Status Logo/Panduan Visual
- Kategori Layanan
- Detail Layanan
- Layanan Lainnya
- Tujuan Proyek
- Target Audiens
- Tantangan
- Hasil yang Diharapkan
- Referensi
- Waktu Mulai
- Tenggat Waktu
- Anggaran
- Aset yang Tersedia
- Catatan Tambahan
- Persetujuan Kontak

**PENTING:** Jangan ubah atau hapus tab/data yang sudah ada di spreadsheet. Apps Script hanya akan menambah tab baru.

## ⚠️ Hal yang Perlu Diketahui

### ✅ Yang Sudah Selesai:
- Website sudah 100% jadi (HTML, CSS, JavaScript)
- Form multi-step dengan validasi lengkap
- Auto-save data form (jika user keluar dan kembali)
- Responsive untuk mobile/tablet/desktop
- Aksesibilitas sudah diperhatikan
- Kode Apps Script sudah disiapkan

### ⏳ Yang Masih Perlu Anda Lakukan:
1. Setup Google Apps Script (ikuti langkah di atas)
2. Deploy Apps Script sebagai Web App
3. Update URL deployment di script.js
4. Test kirim brief pertama

### 🔒 Keamanan:
- **AMAN**: URL Apps Script boleh publik (memang untuk itu)
- **TIDAK PERLU API KEY**: Apps Script sudah handle autentikasi
- **DATA AMAN**: Tersimpan di Google Sheets milik Anda

## 📞 Kontak Placeholder

File `index.html` punya placeholder untuk kontak:
- Email: [email@naracreative.com]
- WhatsApp: [+62 xxx xxxx xxxx]
- Instagram: [@naracreative]

**Ganti dengan kontak asli** sebelum website live!

## 🎨 Kustomisasi Warna

Jika ingin ganti warna, edit file `styles.css` baris 15-24:

```css
:root {
    --color-bg: #FAF7F5;           /* Background utama */
    --color-text: #2C2520;         /* Text color */
    --color-text-light: #6B5F58;   /* Text secondary */
    --color-accent: #D4915D;       /* Warna aksen (tombol, dll) */
    --color-accent-dark: #B87945;  /* Hover state */
}
```

## 🐛 Troubleshooting Cepat

**"Brief gagal dikirim"**
→ Pastikan URL Apps Script sudah diganti di script.js

**"Authorization required"**
→ Deploy ulang Apps Script dengan akses "Anyone"

**"Data tidak muncul di Sheets"**
→ Check tab "Client Briefs" (akan dibuat otomatis saat brief pertama)

**"Form hilang setelah refresh"**
→ Normal. Data disimpan otomatis saat Anda pindah langkah

## 📚 Dokumentasi Lengkap

Lihat file `README.md` untuk dokumentasi lengkap dan troubleshooting detail.

---

**Butuh bantuan?** Lihat README.md atau cek console browser (F12) untuk error message.
