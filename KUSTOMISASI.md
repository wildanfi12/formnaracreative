# PANDUAN KUSTOMISASI - NARA CREATIVE WEBSITE

Panduan ini untuk membantu Anda mengubah konten, warna, atau text di website tanpa perlu coding skills.

---

## 📝 MENGUBAH TEXT/KONTEN

Semua text di website bisa diubah dengan membuka `index.html` di text editor (Notepad, VS Code, dll).

### 1. Judul & Headline Utama

**File:** `index.html`

**Cari:** Hero section (line ~70-100)
```html
<h1 class="hero-title">Setiap brand punya cerita. Mari cari cara terbaik untuk membuatnya terlihat, terdengar, dan berkembang.</h1>
```

**Ubah ke:** Teks baru Anda
```html
<h1 class="hero-title">TEXT BARU ANDA DI SINI</h1>
```

### 2. Deskripsi Hero

**Cari:**
```html
<p class="hero-description">
    Nara Creative membantu brand membangun cerita dan pengalaman visual...
</p>
```

**Ubah ke:** Deskripsi baru Anda

### 3. Nama & Logo Brand

**Cari:** `.nav-logo` (navigation bar)
```html
<div class="nav-logo">Nara Creative</div>
```

**Ubah ke:** Nama brand Anda

**Atau di footer:**
```html
<h3 class="footer-logo">Nara Creative</h3>
```

### 4. Deskripsi Layanan

**Cari:** Service cards section (line ~200-an)
```html
<p class="service-description">AI product photography, foto e-commerce...</p>
```

**Ubah:** Deskripsi untuk setiap layanan

### 5. Informasi Kontak di Footer

**PENTING - Ganti placeholder ini sebelum live:**

**Cari:** Footer section (line ~600-an)
```html
<p class="footer-contact-item">📧 Email: [email@naracreative.com]</p>
<p class="footer-contact-item">📱 WhatsApp: [+62 xxx xxxx xxxx]</p>
<p class="footer-contact-item">📷 Instagram: [@naracreative]</p>
```

**Ubah ke:**
```html
<p class="footer-contact-item">📧 Email: your-actual@email.com</p>
<p class="footer-contact-item">📱 WhatsApp: +62 812 3456 7890</p>
<p class="footer-contact-item">📷 Instagram: @naracreative</p>
```

### 6. Form Labels & Placeholder

**Cari:** Form step di `index.html`

Contoh:
```html
<label for="brandName" class="form-label">Nama brand atau bisnis <span class="required">*</span></label>
<input type="text" id="brandName" name="brandName" class="form-input" required>
```

Bisa diubah label teks dan placeholder sesuai kebutuhan.

---

## 🎨 MENGUBAH WARNA

**File:** `styles.css`

**Lokasi:** Line 15-24 (di `:root`)

```css
:root {
    /* Colors */
    --color-bg: #FAF7F5;           /* Background utama - off-white */
    --color-text: #2C2520;         /* Warna text - gelap */
    --color-text-light: #6B5F58;   /* Text secondary - abu gelap */
    --color-accent: #D4915D;       /* WARNA UTAMA - aksen warm */
    --color-accent-dark: #B87945;  /* Hover/dark variant */
    --color-white: #FFFFFF;        /* White */
    --color-border: #E5DDD8;       /* Border colors */
    --color-error: #C74646;        /* Error message color */
    --color-success: #4A7C59;      /* Success message color */
}
```

### Cara Mengganti Warna:

1. **Temukan warna hex** yang ingin Anda gunakan
   - Bisa pakai: https://htmlcolorcodes.com/
   - Atau: https://coolors.co/

2. **Ganti nilai hex** di atas

   Contoh - ubah warna aksen dari warm orange ke dark blue:
   ```css
   --color-accent: #D4915D;  /* LAMA */
   --color-accent: #1F3A7D;  /* BARU - dark blue */
   ```

3. **Save file `styles.css`**

4. **Refresh browser** untuk lihat perubahan

### Warna-Warna untuk Dipertimbangkan:

**Warm/Premium (Default):**
- Accent: `#D4915D` (warm orange/tan)
- Accent Dark: `#B87945` (darker warm)

**Modern/Cool:**
- Accent: `#4A90E2` (modern blue)
- Accent Dark: `#2E5C8A` (darker blue)

**Professional/Green:**
- Accent: `#47B881` (forest green)
- Accent Dark: `#2D8659` (darker green)

**Bold/Red:**
- Accent: `#E8543E` (modern red)
- Accent Dark: `#C73A2A` (darker red)

---

## 🔤 MENGUBAH FONT/TIPOGRAFI

**File:** `styles.css`

**Lokasi:** Line 11 (di `:root`)

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Ini adalah default system fonts. Jika mau custom font dari Google Fonts:

### Langkah-langkah:

1. **Buka** https://fonts.google.com/

2. **Pilih font** yang Anda suka (contoh: Poppins, Inter, Lato)

3. **Klik font**, pilih weights yang ingin (400, 600 recommended)

4. **Klik "Get embed code"** dan copy kode yang dimulai `<link>`

5. **Di `index.html`, paste ke dalam `<head>`** (bawah tag meta):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
   ```

6. **Di `styles.css`, ganti `--font-sans`:**
   ```css
   --font-sans: 'Poppins', sans-serif;
   ```

7. **Save dan refresh browser**

---

## 📏 MENGUBAH SPACING/UKURAN

Jika ingin lebih besar/kecil spacing:

**File:** `styles.css`

**Lokasi:** Line 18-24 (di `:root`)

```css
--spacing-xs: 0.5rem;    /* Paling kecil */
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;
--spacing-2xl: 4rem;
--spacing-3xl: 6rem;     /* Paling besar */
```

Ubah nilai rem sesuai kebutuhan. Contoh, untuk spacing lebih besar:
```css
--spacing-xl: 4rem;    /* Dari 3rem ke 4rem */
--spacing-3xl: 8rem;   /* Dari 6rem ke 8rem */
```

---

## 🔴 MENAMBAH/MENGURANGI LAYANAN

### Menambah Layanan Baru:

**File:** `index.html`

**Langkah 1:** Tambah di service cards section (line ~200-an)

Cari template service card:
```html
<article class="service-card">
    <div class="service-icon" aria-hidden="true">📸</div>
    <h3 class="service-title">Foto Produk & Lifestyle</h3>
    <p class="service-description">...</p>
    <button class="btn btn-secondary" onclick="openBriefWithService('photo')">Pilih layanan ini</button>
</article>
```

Copy-paste dan ubah:
```html
<article class="service-card">
    <div class="service-icon" aria-hidden="true">🎯</div>
    <h3 class="service-title">Nama Layanan Baru</h3>
    <p class="service-description">Deskripsi layanan baru Anda di sini.</p>
    <button class="btn btn-secondary" onclick="openBriefWithService('newservice')">Pilih layanan ini</button>
</article>
```

**Langkah 2:** Tambah ke `script.js`

**File:** `script.js`

**Lokasi:** Line 1-50 (di `serviceCategories` object)

Tambah:
```javascript
newservice: {
    label: 'Nama Layanan Baru',
    subcategories: [
        'Sublayanan 1',
        'Sublayanan 2',
        'Sublayanan 3'
    ]
}
```

**Langkah 3:** Save kedua file

---

## ❌ MENGHAPUS LAYANAN

**File:** `index.html`

Cari service card untuk layanan yang ingin dihapus, hapus seluruh block `<article class="service-card">...</article>`

**File:** `script.js`

Cari di `serviceCategories` object, hapus satu entry yang sesuai.

---

## 🔢 MENGUBAH ANGGARAN RANGE

**File:** `index.html`

**Cari:** Budget select dropdown di STEP 4 (line ~450-an)

```html
<select id="budget" name="budget" class="form-select">
    <option value="">Pilih kisaran anggaran</option>
    <option value="Belum yakin">Belum yakin</option>
    <option value="< 10 juta">< 10 juta</option>
    <option value="10 - 25 juta">10 - 25 juta</option>
    ...
</select>
```

**Ubah nilai** sesuai kebutuhan Anda. Contoh:
```html
<option value="1 - 5 juta">1 - 5 juta</option>
<option value="5 - 20 juta">5 - 20 juta</option>
<option value="> 50 juta">> 50 juta</option>
```

---

## 🎯 MENGUBAH TIMELINE MULAI PROYEK

**File:** `index.html`

**Cari:** Project start radio buttons di STEP 4

```html
<label class="radio-label">
    <input type="radio" name="projectStart" value="Segera" required>
    <span>Segera</span>
</label>
```

**Ubah atau tambah opsi** sesuai kebutuhan. Contoh:
```html
<label class="radio-label">
    <input type="radio" name="projectStart" value="Minggu Depan" required>
    <span>Minggu Depan</span>
</label>
```

---

## 🔧 TIPS EDITING

### Sebelum Edit:
1. **Backup file** asli (copy-paste ke file baru)
2. **Gunakan text editor** yang bagus (VS Code, Notepad++, Sublime)
3. **Perhatikan indentation** (jangan sampai error)

### Saat Edit:
1. **Cari** (Ctrl+F) untuk menemukan text dengan cepat
2. **Preview** (simpan, refresh browser) untuk lihat hasilnya
3. **Gunakan Find & Replace** (Ctrl+H) untuk perubahan massal

### Common Mistakes:
❌ Menghapus `<` atau `>` di tag HTML
❌ Menghapus tanda kutip di atribut
❌ Menghapus semicolon di CSS
❌ Menghapus kurung kurawal di JavaScript

✅ Selalu backup sebelum edit besar
✅ Edit satu section di waktu, test, kemudian lanjut

---

## 📧 SETUP EMAIL NOTIFIKASI (ADVANCED)

Jika Anda ingin team Nara dapat email setiap ada brief baru:

**File:** `apps-script-backend.gs`

**Lokasi:** Line ~100-130

Uncomment (hapus `/*` dan `*/`):

```javascript
// SEBELUM:
/*
function sendEmailNotification(data) {
  ...
}
*/

// SESUDAH:
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com'; // Ubah email
  ...
}
```

Ganti `'your-email@example.com'` dengan email tim Nara.

Save dan re-deploy Apps Script.

---

## ✅ TESTING SETELAH EDIT

Setelah mengubah konten:

1. **Refresh browser** (Ctrl+R atau Cmd+R)
2. **Clear cache** jika perlu (Ctrl+Shift+R)
3. **Test form** jika ubah form fields
4. **Test di mobile** untuk responsive design

---

## 🆘 JIKA WEBSITE ERROR SETELAH EDIT

**Kemungkinan penyebab:**
- Menghapus tag HTML pembuka/penutup
- Menghapus kutip di atribut
- Syntax error di CSS/JavaScript

**Cara fix:**
1. **Undo** (Ctrl+Z) hingga ke state terakhir yang bekerja
2. **Buka console browser** (F12 → Console) untuk lihat error
3. **Edit ulang** dengan lebih hati-hati
4. **Reference dokumentasi** HTML/CSS/JavaScript jika perlu

---

## 📞 KONSULTASI TAMBAHAN

Jika perlu:
- Menambah field form baru
- Mengubah struktur halaman
- Menambah section baru
- Integrasi dengan sistem lain

Bisa berdiskusi dengan developer untuk mengimplementasikannya.

---

**Happy customizing! 🎨**
