/**
 * ============================================================================
 * GOOGLE APPS SCRIPT — NARA CREATIVE STUDIO BRIEF SUBMISSION
 * Backend Endpoint untuk Google Sheets Integration
 * ============================================================================
 * 
 * PANDUAN DEPLOYMENT:
 * 1. Buka spreadsheet target:
 *    https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
 * 2. Klik menu: Extensions (Ekstensi) > Apps Script
 * 3. Hapus kode default, lalu salin dan tempel SELURUH isi file ini.
 * 4. Klik ikon Save (Ctrl+S).
 * 5. Klik tombol "Deploy" di kanan atas > pilih "New deployment".
 * 6. Klik ikon gear (Select type) > pilih "Web app".
 * 7. Konfigurasi:
 *    - Description: "Nara Creative Brief Submission API"
 *    - Execute as: "Me" (email Google Anda)
 *    - Who has access: "Anyone" (Siapa saja, termasuk anonim)
 * 8. Klik tombol "Deploy". Berikan izin (Authorize access) jika diminta.
 * 9. Salin "Web app URL" yang muncul (berakhiran /exec).
 * 10. Buka file app.js di website, lalu perbarui CONFIG.APPS_SCRIPT_URL dengan URL tersebut.
 * 
 * KEAMANAN & INTEGRITAS DATA:
 * - Tidak ada kredensial/token rahasia yang disimpan di frontend.
 * - Append-Only: Menggunakan sheet.appendRow(), sehingga setiap brief baru
 *   menjadi baris baru di bawah tanpa pernah menimpa atau menghapus data lama.
 * - Tab otomatis: Tab "Client Briefs" akan dibuat otomatis jika belum ada.
 */

// KONFIGURASI SPREADSHEET
const SPREADSHEET_ID = '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo';
const SHEET_NAME = 'Client Briefs';
const NOTIFICATION_EMAIL = 'naracreativestudio.id@gmail.com'; // Email resmi Nara Creative

/**
 * Endpoint POST: Menerima payload brief dari website
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(false, 'Payload tidak ditemukan atau format tidak sesuai.');
    }

    const data = JSON.parse(e.postData.contents);

    // Validasi data wajib minimal
    if (!data.fullName || !data.email || !data.whatsapp || !data.brandName) {
      return createJsonResponse(false, 'Data wajib belum lengkap (Nama, Email, WhatsApp, dan Nama Brand wajib diisi).');
    }

    // Simpan ke Google Sheets
    const saveResult = saveBriefToSheet(data);

    if (!saveResult.success) {
      return createJsonResponse(false, saveResult.message || 'Gagal menyimpan ke spreadsheet.');
    }

    // Kirim response sukses
    return createJsonResponse(true, 'Brief berhasil diterima dan disimpan.', {
      briefId: data.briefId || '',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    Logger.log('Error doPost: ' + error.toString());
    return createJsonResponse(false, 'Terjadi kesalahan server: ' + error.toString());
  }
}

/**
 * Endpoint GET: Pemeriksaan status API
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    service: 'Nara Creative Studio Brief Submission API',
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Menyimpan data brief ke tab spreadsheet target (Append-Only)
 */
function saveBriefToSheet(data) {
  try {
    let ss;
    try {
      // Prioritaskan active spreadsheet jika bound script
      ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }

    if (!ss) {
      return { success: false, message: 'Spreadsheet tidak dapat dibuka.' };
    }

    let sheet = ss.getSheetByName(SHEET_NAME);

    // 27 Kolom Header Resmi
    const headers = [
      'Timestamp',
      'Brief ID',
      'Status',
      'Nama Lengkap',
      'Email',
      'WhatsApp',
      'Jabatan/Peran',
      'Preferensi Kontak',
      'Nama Brand',
      'Bidang Bisnis',
      'Website/Media Sosial',
      'Deskripsi Brand',
      'Status Logo/Panduan Visual',
      'Kategori Layanan',
      'Detail Layanan',
      'Layanan Lainnya',
      'Tujuan Proyek',
      'Target Audiens',
      'Tantangan',
      'Hasil yang Diharapkan',
      'Referensi',
      'Waktu Mulai',
      'Tenggat Waktu',
      'Anggaran',
      'Aset yang Tersedia',
      'Catatan Tambahan',
      'Persetujuan Kontak'
    ];

    // Jika tab "Client Briefs" belum ada, buat tab baru dan pasang header
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(headers);

      // Format header agar rapi dan elegan
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#B85D2A'); // Warna terracotta Nara Creative
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontFamily('Arial');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // Persiapkan baris data baru
    const timestamp = new Date(data.timestamp || new Date());
    const serviceOtherText = data.serviceOther && typeof data.serviceOther === 'object'
      ? Object.entries(data.serviceOther).map(function(pair) { return pair[0] + ': ' + pair[1]; }).join('; ')
      : (data.serviceOther || '');

    const rowData = [
      timestamp,
      data.briefId || '',
      data.status || 'Baru',
      data.fullName || '',
      data.email || '',
      data.whatsapp || '',
      data.role || '',
      data.preferredContact || '',
      data.brandName || '',
      data.businessField || '',
      data.websiteSocial || '',
      data.brandDescription || '',
      data.hasVisualIdentity || '',
      data.serviceCategory || '',
      data.serviceSubcategories || '',
      serviceOtherText,
      data.projectGoal || '',
      data.targetAudience || '',
      data.challenges || '',
      data.expectedResults || '',
      data.references || '',
      data.projectStart || '',
      data.deadline || '',
      data.budget || '',
      data.existingAssets || '',
      data.additionalNotes || '',
      data.contactConsent ? 'Ya' : 'Tidak'
    ];

    // Tambahkan data ke baris paling baru (Append)
    sheet.appendRow(rowData);

    // Auto-fit kolom jika baru baris pertama
    if (sheet.getLastRow() === 2) {
      sheet.autoResizeColumns(1, headers.length);
    }

    return { success: true };
  } catch (err) {
    Logger.log('Error saveBriefToSheet: ' + err.toString());
    return { success: false, message: err.toString() };
  }
}

/**
 * Helper untuk response JSON dengan format standar
 */
function createJsonResponse(success, message, extra) {
  const payload = Object.assign({
    success: success,
    message: message
  }, extra || {});

  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi uji koneksi internal
 * Bisa dijalankan langsung dari editor Apps Script untuk verifikasi izin
 */
function testSpreadsheetConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Koneksi berhasil ke spreadsheet: ' + ss.getName());
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet) {
      Logger.log('Tab "' + SHEET_NAME + '" ditemukan. Jumlah baris: ' + sheet.getLastRow());
    } else {
      Logger.log('Tab "' + SHEET_NAME + '" belum ada (akan dibuat otomatis saat brief pertama masuk).');
    }
    return true;
  } catch (err) {
    Logger.log('Gagal menghubungkan: ' + err.toString());
    return false;
  }
}
