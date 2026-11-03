// Google Apps Script untuk Nara Creative Brief Submission
// File ini harus dipasang di Google Sheets sebagai Web App

/**
 * CARA SETUP:
 * 1. Buka Google Sheets: https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
 * 2. Klik Extensions > Apps Script
 * 3. Hapus kode default, salin dan paste SELURUH kode dari file ini
 * 4. Klik ikon Save (disk icon)
 * 5. Klik Deploy > New deployment
 * 6. Pilih type: Web app
 * 7. Isi deskripsi: "Nara Creative Brief Submission"
 * 8. Execute as: Me (your email)
 * 9. Who has access: Anyone
 * 10. Klik Deploy
 * 11. Copy URL deployment yang dihasilkan
 * 12. Buka file script.js di website
 * 13. Ganti 'YOUR_DEPLOYMENT_ID' di baris fetch dengan URL deployment yang Anda copy (GANTI DENGAN URL LENGKAP dari Apps Script, bukan hanya ID)
 * 14. Save file script.js
 * 
 * STRUKTUR SPREADSHEET:
 * Script ini akan membuat tab baru bernama "Client Briefs" jika belum ada.
 * Jika Anda ingin menggunakan tab yang sudah ada, ubah SHEET_NAME di bawah.
 */

// KONFIGURASI
const SHEET_NAME = 'Client Briefs'; // Nama tab/sheet untuk menyimpan brief
const SPREADSHEET_ID = '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo'; // ID spreadsheet Anda

/**
 * Fungsi utama untuk menerima POST request dari website
 */
function doPost(e) {
  try {
    // Parse data dari request
    const data = JSON.parse(e.postData.contents);
    
    // Validasi data wajib
    if (!data.fullName || !data.email || !data.whatsapp || !data.brandName) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Data wajib tidak lengkap'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Simpan ke spreadsheet
    const result = saveBriefToSheet(data);
    
    // Kirim response sukses
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Brief berhasil disimpan',
      briefId: data.briefId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Terjadi kesalahan: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fungsi untuk testing (opsional)
 * Bisa dijalankan dari Apps Script editor untuk mengetes
 */
function doGet(e) {
  return ContentService.createTextOutput('Nara Creative Brief Submission API is running. Use POST to submit data.');
}

/**
 * Simpan data brief ke spreadsheet
 */
function saveBriefToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Buat header
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
    sheet.appendRow(headers);
    
    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#D4915D');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  
  // Siapkan data untuk baris baru
  const timestamp = new Date(data.timestamp || new Date());
  const serviceOtherText = data.serviceOther && typeof data.serviceOther === 'object' 
    ? Object.values(data.serviceOther).join('; ') 
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
  
  // Tambahkan baris baru
  sheet.appendRow(rowData);
  
  // Auto-resize kolom untuk data pertama
  if (sheet.getLastRow() === 2) {
    sheet.autoResizeColumns(1, rowData.length);
  }
  
  // Optional: Kirim email notifikasi ke tim Nara
  // sendEmailNotification(data);
  
  return true;
}

/**
 * OPSIONAL: Kirim email notifikasi ke tim Nara setiap ada brief baru
 * Uncomment fungsi ini jika Anda ingin menerima notifikasi email
 */
/*
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com'; // Ganti dengan email tim Nara
  const subject = `Brief Baru dari ${data.brandName} - ${data.briefId}`;
  const body = `
Brief baru telah diterima:

KONTAK:
Nama: ${data.fullName}
Email: ${data.email}
WhatsApp: ${data.whatsapp}

BRAND:
Nama Brand: ${data.brandName}
Bidang: ${data.businessField}

LAYANAN:
${data.serviceCategory}
${data.serviceSubcategories}

TUJUAN:
${data.projectGoal}

Waktu Mulai: ${data.projectStart}
Anggaran: ${data.budget}

Lihat detail lengkap di spreadsheet:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
  `;
  
  try {
    MailApp.sendEmail(recipient, subject, body);
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}
*/

/**
 * Fungsi testing untuk memastikan koneksi spreadsheet bekerja
 * Jalankan fungsi ini dari Apps Script editor untuk mengetes
 */
function testConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Successfully connected to spreadsheet: ' + ss.getName());
    
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log('Sheet "' + SHEET_NAME + '" not found. It will be created on first submission.');
    } else {
      Logger.log('Sheet "' + SHEET_NAME + '" exists with ' + sheet.getLastRow() + ' rows');
    }
    
    return true;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return false;
  }
}
