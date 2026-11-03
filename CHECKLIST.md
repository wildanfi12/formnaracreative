# ✅ CHECKLIST IMPLEMENTASI NARA CREATIVE WEBSITE

Gunakan checklist ini untuk memastikan semua langkah sudah dilakukan dengan benar.

---

## 📦 FASE 1: VERIFIKASI FILE (Selesai ✅)

- [x] index.html tersedia
- [x] styles.css tersedia
- [x] script.js tersedia
- [x] apps-script-backend.gs tersedia
- [x] Dokumentasi lengkap tersedia

**Status:** ✅ SELESAI - Semua file sudah dibuat

---

## 🖥️ FASE 2: TEST LOKAL (Perlu Dilakukan)

### A. Buka Website

- [ ] Buka index.html di browser
  * **Cara:** Double-click `index.html` di Windows Explorer
  * **Atau:** Jalankan local server: `python -m http.server 8000`

### B. Test Navigasi

- [ ] Scroll halaman dari atas ke bawah
- [ ] Klik menu navigation (Home, Layanan, Cara Kerja, Mulai Brief)
- [ ] Klik tombol "Mulai Ceritakan Proyekmu"
- [ ] Klik salah satu "Pilih layanan ini" di service card

### C. Test Responsive

- [ ] Buka browser dev tools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test di berbagai ukuran:
  * [ ] Mobile (375px width)
  * [ ] Tablet (768px width)
  * [ ] Desktop (1200px+ width)

### D. Test Form (Tanpa Submit)

**Langkah 1:**
- [ ] Pilih minimal 1 kategori layanan
- [ ] Subcategories muncul
- [ ] Klik "Lanjut"

**Langkah 2:**
- [ ] Isi nama brand
- [ ] Isi deskripsi brand
- [ ] Pilih status logo/panduan visual
- [ ] Klik "Lanjut"

**Langkah 3:**
- [ ] Isi tujuan proyek
- [ ] (Opsional) Isi target audiens, tantangan, dll
- [ ] Klik "Lanjut"

**Langkah 4:**
- [ ] Pilih waktu mulai proyek
- [ ] (Opsional) Isi deadline, anggaran, dll
- [ ] Klik "Lanjut"

**Langkah 5:**
- [ ] Isi nama lengkap
- [ ] Isi email (format email valid)
- [ ] Isi WhatsApp
- [ ] Pilih cara terbaik dihubungi
- [ ] Centang persetujuan kontak
- [ ] Klik "Lihat Ringkasan"

**Summary:**
- [ ] Semua data muncul di ringkasan
- [ ] Bisa klik "Kembali Edit" untuk edit
- [ ] Tombol "Kirim Brief" muncul

**JANGAN submit dulu** - integrasi belum disetup!

---

## 🔗 FASE 3: SETUP GOOGLE SHEETS INTEGRATION (PENTING!)

### A. Akses Spreadsheet

- [ ] Buka: https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
- [ ] Login dengan akun Google yang benar
- [ ] Verifikasi Anda punya akses edit

### B. Setup Apps Script

**Referensi:** Lihat file `APPS-SCRIPT-SETUP.md` untuk detail

- [ ] Di Google Sheets, klik Extensions → Apps Script
- [ ] Hapus kode default
- [ ] Copy seluruh kode dari `apps-script-backend.gs`
- [ ] Paste ke Apps Script editor
- [ ] Verifikasi SPREADSHEET_ID di line 11 benar
- [ ] Save (Ctrl+S)

### C. Deploy Apps Script

- [ ] Klik Deploy → New deployment
- [ ] Type: Web app
- [ ] Execute as: Me
- [ ] Who has access: **Anyone** (PENTING!)
- [ ] Klik Deploy
- [ ] Klik Authorize access
- [ ] Grant permissions (Allow)
- [ ] Copy URL deployment yang muncul
  * Format: `https://script.google.com/macros/s/[ID]/usercontent`

### D. Update Website

- [ ] Buka file `script.js` dengan text editor
- [ ] Cari line 463:
  ```javascript
  const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent', {
  ```
- [ ] Ganti URL dengan URL deployment dari Apps Script
- [ ] Save file `script.js`

---

## 🧪 FASE 4: TEST INTEGRASI (Setelah Setup Apps Script)

### A. Test Submission

- [ ] Refresh browser (Ctrl+R)
- [ ] Isi form brief dengan data test
- [ ] Submit form
- [ ] Loading indicator muncul saat submit
- [ ] Muncul pesan sukses: "Terima kasih sudah menceritakan proyekmu"

### B. Verifikasi di Google Sheets

- [ ] Buka Google Sheets
- [ ] Tab "Client Briefs" muncul otomatis
- [ ] Header row ada (27 kolom)
- [ ] Data test muncul di row 2
- [ ] Semua kolom terisi dengan benar

### C. Test Lagi

- [ ] Kirim brief kedua dengan data berbeda
- [ ] Data muncul di row 3 (tidak menimpa row 2)
- [ ] Timestamp, Brief ID unik untuk setiap submission

### D. Error Handling

- [ ] Test submit form tanpa isi field wajib → Error muncul
- [ ] Test submit email tidak valid → Error muncul
- [ ] Field error messages jelas dan membantu

---

## 🎨 FASE 5: KUSTOMISASI (Opsional)

### A. Ganti Kontak Placeholder (WAJIB!)

**Referensi:** Lihat file `KUSTOMISASI.md`

- [ ] Buka `index.html`
- [ ] Cari section footer (line ~600-an)
- [ ] Ganti placeholder email
- [ ] Ganti placeholder WhatsApp
- [ ] Ganti placeholder Instagram
- [ ] Save file

### B. Kustomisasi Warna (Opsional)

- [ ] Buka `styles.css`
- [ ] Cari `:root` variables (line 15-24)
- [ ] Ubah `--color-accent` jika perlu
- [ ] Save dan test di browser

### C. Ubah Text/Copy (Opsional)

- [ ] Edit headline di hero section
- [ ] Edit deskripsi layanan
- [ ] Edit text lainnya sesuai kebutuhan

---

## 🚀 FASE 6: DEPLOYMENT KE LIVE (Setelah Test Lokal OK)

### Pilih Platform Hosting:

**Opsi 1: Vercel (Recommended)**
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run: `vercel` di folder project
- [ ] Follow prompts
- [ ] Copy URL production

**Opsi 2: Netlify**
- [ ] Sign up di netlify.com
- [ ] Drag & drop folder project
- [ ] Copy URL production

**Opsi 3: GitHub Pages**
- [ ] Push ke GitHub repository
- [ ] Settings → Pages → Enable
- [ ] Copy URL production

**Opsi 4: Hosting Tradisional**
- [ ] Upload via FTP semua file
- [ ] Point domain ke folder

### Setelah Deploy:

- [ ] Test website di URL production
- [ ] Test form submission dari URL production
- [ ] Verifikasi data masuk ke Google Sheets
- [ ] Test di mobile device asli
- [ ] Test di berbagai browser (Chrome, Safari, Firefox)

---

## ✅ FASE 7: FINAL CHECK (Sebelum Launch)

### Pre-Launch Checklist:

- [ ] Kontak placeholder sudah diganti dengan kontak asli
- [ ] Brief submission berhasil dari production URL
- [ ] Data masuk ke Google Sheets dengan benar
- [ ] Website responsive di mobile/tablet/desktop
- [ ] Semua link bekerja
- [ ] Form validation bekerja
- [ ] Loading states bekerja
- [ ] Error messages jelas
- [ ] Success message muncul

### Analytics & Monitoring (Opsional):

- [ ] Setup Google Analytics (jika perlu)
- [ ] Setup error monitoring (Sentry, dll - opsional)
- [ ] Setup uptime monitoring (UptimeRobot, dll - opsional)

### Team Briefing:

- [ ] Brief marketing team cara share link
- [ ] Brief operations team cara access Google Sheets
- [ ] Brief sales team cara follow-up leads dari brief
- [ ] Setup notification email (opsional - uncomment di Apps Script)

---

## 📊 FASE 8: POST-LAUNCH MONITORING

### Minggu Pertama:

- [ ] Monitor submissions harian
- [ ] Check error rate (jika ada)
- [ ] Collect feedback dari team
- [ ] Collect feedback dari 2-3 test users

### Bulanan:

- [ ] Review submissions count
- [ ] Update layanan jika ada perubahan
- [ ] Backup Google Sheets data
- [ ] Check website uptime

---

## 🆘 TROUBLESHOOTING REFERENCE

Jika ada masalah, cek file ini:

| Issue | File Reference |
|-------|---------------|
| Form submission error | `APPS-SCRIPT-SETUP.md` |
| Apps Script deployment | `APPS-SCRIPT-SETUP.md` |
| Data tidak masuk Sheets | `README.md` (Troubleshooting) |
| Edit text/konten | `KUSTOMISASI.md` |
| Ganti warna/font | `KUSTOMISASI.md` |
| General questions | `README.md` |
| Quick reference | `SETUP-SINGKAT.md` |

---

## 📞 KONTAK & SUPPORT

### Developer Notes:

Jika butuh bantuan lebih lanjut:
- Check console browser (F12) untuk error
- Check Apps Script Executions log untuk backend error
- Reference dokumentasi di folder project

### Tim Nara Notes:

- Google Sheets tab "Client Briefs" = source of truth
- Update kolom "Status" untuk tracking
- Follow-up via WhatsApp/Email yang tertera di brief

---

## ✨ STATUS AKHIR

**Saat checklist ini semua ✅:**
- Website 100% functional
- Integration dengan Google Sheets bekerja
- Ready untuk calon klien
- Team Nara bisa manage leads via Google Sheets

**Good luck dengan launch Nara Creative website! 🚀**

---

**Tanggal dibuat:** November 3, 2026
**Versi:** 1.0
**Project:** Nara Creative Website & Brief System
