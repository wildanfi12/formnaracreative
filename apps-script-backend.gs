/**
 * ============================================================================
 * NARA CREATIVE — BRIEF FORM BACKEND (Google Apps Script Web App)
 * ============================================================================
 *
 * CARA PASANG (sekali saja):
 * 1. Buka spreadsheet:
 *    https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit
 * 2. Menu Ekstensi > Apps Script. Hapus kode lama, tempel SELURUH file ini, Simpan.
 * 3. (Opsional) Jalankan fungsi `testSetup` sekali dari editor untuk memberi izin.
 * 4. Terapkan > Deployment baru > jenis "Aplikasi web":
 *      - Jalankan sebagai : Saya
 *      - Yang memiliki akses : Siapa saja
 * 5. Salin URL Aplikasi web (berakhiran /exec) lalu tempel ke
 *    CONFIG.APPS_SCRIPT_URL di app.js.
 *
 * Jika sebelumnya sudah pernah deploy: Terapkan > Kelola deployment > ikon pensil
 * > Versi: "Versi baru" > Terapkan. URL tetap sama.
 *
 * KEAMANAN DATA:
 * - Append-only: setiap brief = baris baru. Tidak ada baris lama yang diubah/dihapus.
 * - Memakai tab baru "Brief Klien" agar tidak bentrok dengan tab/kolom yang sudah ada.
 * - LockService mencegah tabrakan saat ada beberapa brief masuk bersamaan.
 * - Nilai yang diawali = + - @ diberi prefiks ' agar tidak dieksekusi sebagai rumus.
 */

const SPREADSHEET_ID = '1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo';
const SHEET_NAME = 'Brief Klien';
const NOTIFY_EMAIL = 'naracreativestudio.id@gmail.com';
const SEND_EMAIL_NOTIFICATION = false; // ubah ke true jika ingin notifikasi email per brief

const HEADERS = [
  'Timestamp',
  'ID Brief',
  'Status',
  'Nama',
  'WhatsApp',
  'Email',
  'Nama Brand',
  'Instagram / Website',
  'Layanan',
  'Detail Output',
  'Ringkasan Proyek',
  'Anggaran',
  'Mulai',
  'Sumber'
];

const LIMITS = {
  briefId: 40, fullName: 100, whatsapp: 20, email: 120, brandName: 120,
  brandLink: 200, services: 300, deliverables: 500, projectSummary: 800, budget: 60, timeline: 60, source: 80
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ success: false, message: 'Data tidak ditemukan.' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return json_({ success: false, message: 'Format data tidak valid.' });
    }

    // Honeypot: bot biasanya mengisi field tersembunyi
    if (data.company_site) {
      return json_({ success: false, message: 'Pengiriman ditolak.' });
    }

    var d = {};
    Object.keys(LIMITS).forEach(function (k) {
      d[k] = String(data[k] == null ? '' : data[k]).trim().slice(0, LIMITS[k]);
    });

    var missing = [];
    if (!d.fullName) missing.push('Nama');
    if (!d.whatsapp) missing.push('WhatsApp');
    if (!d.email) missing.push('Email');
    if (!d.brandName) missing.push('Nama Brand');
    if (!d.services) missing.push('Layanan');
    if (!d.projectSummary) missing.push('Ringkasan Proyek');
    if (!d.budget) missing.push('Anggaran');
    if (!d.timeline) missing.push('Waktu Mulai');
    if (missing.length) {
      return json_({ success: false, message: 'Data wajib belum lengkap: ' + missing.join(', ') + '.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
      return json_({ success: false, message: 'Format email tidak valid.' });
    }
    if (!/^\+?\d{9,15}$/.test(d.whatsapp.replace(/[\s\-().]/g, ''))) {
      return json_({ success: false, message: 'Format nomor WhatsApp tidak valid.' });
    }

    var briefId = d.briefId || ('NARA-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd') + '-' +
      Math.random().toString(36).slice(2, 6).toUpperCase());

    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      var sheet = getSheet_();
      sheet.appendRow([
        new Date(),
        safe_(briefId),
        'Baru',
        safe_(d.fullName),
        safe_(d.whatsapp),
        safe_(d.email),
        safe_(d.brandName),
        safe_(d.brandLink),
        safe_(d.services),
        safe_(d.deliverables),
        safe_(d.projectSummary),
        safe_(d.budget),
        safe_(d.timeline),
        safe_(d.source)
      ]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    if (SEND_EMAIL_NOTIFICATION) {
      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: 'Brief baru: ' + d.brandName + ' (' + briefId + ')',
          body: [
            'ID Brief : ' + briefId,
            'Nama     : ' + d.fullName,
            'WhatsApp : ' + d.whatsapp,
            'Email    : ' + d.email,
            'Brand    : ' + d.brandName + (d.brandLink ? ' - ' + d.brandLink : ''),
            'Layanan  : ' + d.services,
            d.deliverables ? 'Output   : ' + d.deliverables : null,
            'Anggaran : ' + d.budget,
            'Mulai    : ' + d.timeline,
            '',
            d.projectSummary
          ].filter(Boolean).join('\n')
        });
      } catch (mailErr) {
        Logger.log('Email gagal: ' + mailErr); // brief tetap tersimpan
      }
    }

    return json_({ success: true, message: 'Brief tersimpan.', briefId: briefId });
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return json_({ success: false, message: 'Terjadi kesalahan di server. Silakan coba lagi.' });
  }
}

function doGet() {
  return json_({ status: 'online', service: 'NARA Creative Brief API', sheet: SHEET_NAME });
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#282821')
      .setFontColor('#F5F1E9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(11, 380);
  }
  return sheet;
}

function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Jalankan manual dari editor untuk memberi izin & membuat tab. */
function testSetup() {
  var sheet = getSheet_();
  Logger.log('OK — tab "' + SHEET_NAME + '" siap. Baris terakhir: ' + sheet.getLastRow());
}
