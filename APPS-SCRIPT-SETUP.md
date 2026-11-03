# INSTRUKSI SETUP GOOGLE APPS SCRIPT - STEP by STEP

## 📍 Anda di Sini:

```
Website Nara Creative ✅ SELESAI
    ↓
Google Apps Script ⏳ SETUP MANUAL (Langkah ini)
    ↓
Google Sheets Integration ⏳ PENDING
```

---

## STEP 1: Buka Google Sheets

1. **Buka link spreadsheet:**
   ```
   https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
   ```

2. **Pastikan Anda sudah login** dengan akun Google (jika belum, login dulu)

---

## STEP 2: Akses Google Apps Script

**Di Google Sheets yang sudah dibuka:**

1. Klik menu **Extensions** (atau **Ekstensi** jika bahasa Indonesia)
   
2. Klik **Apps Script**
   ```
   Extensions → Apps Script
   ```

3. Tab baru akan terbuka dengan Google Apps Script editor

---

## STEP 3: Ganti Kode

Di Apps Script editor yang terbuka:

1. **Hapus semua kode default** yang ada (pilih semua dengan Ctrl+A, lalu Delete)

2. **Buka file `apps-script-backend.gs`** dari folder project Anda

3. **Copy seluruh isinya**

4. **Paste ke editor Apps Script** (Ctrl+V)

5. **Verifikasi baris 10 & 11:**
   ```javascript
   const SHEET_NAME = 'Client Briefs';
   const SPREADSHEET_ID = '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo';
   ```
   - Pastikan SPREADSHEET_ID sama dengan ID di URL spreadsheet
   - SHEET_NAME bisa dibiarkan (akan dibuat otomatis)

6. **Klik Save** (ikon disk atau Ctrl+S)

---

## STEP 4: Deploy sebagai Web App

**Penting: Jangan jalankan/execute kode, langsung deploy!**

1. Di Apps Script editor, klik tombol **Deploy** (biasanya di kanan atas)

2. Klik **New deployment** (atau jika ada versi lama, klik "Deploy")

3. **Di popup yang muncul, isi:**

   | Field | Value |
   |-------|-------|
   | **Type** | Pilih **Web app** |
   | **Description** | Nara Creative Brief Submission (atau apa saja) |
   | **Execute as** | Pilih **Me** (akun Google Anda) |
   | **Who has access** | Pilih **Anyone** |

4. **Klik tombol Deploy (biru)** di bawah kanan popup

5. **Google akan meminta izin:**
   - Klik **Authorize access**
   - Pilih akun Google Anda
   - Klik **Allow** ketika ada warning "Google hasn't verified this app"
   - (Ini normal karena ini adalah script pribadi)

6. **Copy URL Deployment:**
   
   Setelah deploy berhasil, akan muncul window dengan:
   ```
   Deployment successful
   New deployment ID: ...
   ```
   
   Cari URL yang terlihat seperti:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercontent
   ```
   
   **Salin URL ini** (copy ke clipboard)

---

## STEP 5: Update Website dengan URL Deployment

**Kembali ke folder project Anda:**

1. **Buka file `script.js`** dengan text editor (Notepad++, VS Code, dll)

2. **Cari baris 463** (tekan Ctrl+G di kebanyakan editor untuk Go to Line):
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent', {
   ```

3. **Ganti** `'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent'` 
   
   **dengan** URL yang Anda copy di STEP 4.6
   
   Contoh hasil akhir:
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/AKfycbwXXXXXXXX/usercontent', {
   ```

4. **Save file** (Ctrl+S)

---

## STEP 6: Test Integrasi

1. **Refresh browser** di mana website terbuka (atau buka index.html ulang)

2. **Isi form brief** dengan data:
   - Kategori layanan: Pilih salah satu
   - Nama brand: "Test Brand"
   - Deskripsi: "Testing integration"
   - Tujuan: "Test"
   - Lanjut hingga akhir
   
3. **Klik "Kirim Brief"**

4. **Jika sukses:**
   ✅ Muncul pesan hijau "Terima kasih sudah menceritakan proyekmu"
   ✅ Buka Google Sheets, lihat tab baru "Client Briefs" dengan data Anda

5. **Jika gagal:**
   - Buka console browser (F12 → Console)
   - Cari error message
   - Kemungkinan penyebab:
     * URL deployment salah
     * Apps Script belum granted akses
     * Network error

---

## 🔧 Troubleshooting

### Error: "404 Not Found"
- **Penyebab:** URL deployment salah atau belum di-deploy
- **Solusi:**
  1. Periksa URL yang di-copy dari Apps Script
  2. Pastikan di-deploy dengan "Who has access: Anyone"
  3. Ulang STEP 4 dan 5

### Error: "TypeError: Cannot read property 'postData' of undefined"
- **Penyebab:** Script belum di-deploy dengan benar
- **Solusi:** Pastikan deploy sebagai "Web app", bukan hanya "Execute"

### Apps Script tidak membuat tab baru di Sheets
- **Penyebab:** Kemungkinan Apps Script belum berhasil eksekusi
- **Solusi:**
  1. Cek Apps Script editor → Executions tab → lihat log
  2. Verifikasi SPREADSHEET_ID di baris 11 benar
  3. Pastikan akun Google memiliki akses ke spreadsheet

### Brief dikirim tapi tidak muncul di Sheets
- **Penyebab:** Permissions atau Apps Script error
- **Solusi:**
  1. Di Apps Script editor, buka tab **Executions**
  2. Lihat log eksekusi terakhir untuk error message
  3. Cek apakah tab "Client Briefs" sudah dibuat

---

## ✅ Checklist Selesai

Setelah mengikuti semua steps di atas, centang:

- [ ] Google Apps Script sudah di-setup di spreadsheet
- [ ] Kode Apps Script sudah di-paste dan di-save
- [ ] Apps Script sudah di-deploy sebagai Web App
- [ ] URL deployment sudah di-copy
- [ ] URL deployment sudah di-update di script.js
- [ ] File script.js sudah di-save
- [ ] Test form sudah dikirim
- [ ] Data muncul di Google Sheets tab "Client Briefs"

**Jika semua checkmark ✅, maka integrasi BERHASIL!**

---

## 📚 File Reference

Di folder project Anda:
- `index.html` - Halaman website
- `styles.css` - Styling
- `script.js` - **File ini yang perlu di-update dengan URL deployment** ← PENTING
- `apps-script-backend.gs` - **Kode untuk di-paste ke Apps Script**
- `README.md` - Dokumentasi lengkap
- `SETUP-SINGKAT.md` - Petunjuk singkat
- `TEST-DEPLOYMENT.js` - Untuk testing (opsional)

---

## 🚀 Setelah Sukses Setup

Setelah integrasi berhasil:

1. **Website siap untuk calon klien** - share link ke marketing
2. **Brief masuk otomatis ke Google Sheets** - team Nara bisa review dan follow-up
3. **Setiap kolom tersedia** - untuk tracking dan management brief

**Selamat! Website Nara Creative sudah fully operational! 🎉**
