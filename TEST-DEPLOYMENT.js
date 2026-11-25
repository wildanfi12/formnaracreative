/**
 * Uji kirim brief ke Apps Script (Node 18+).
 * Pemakaian:  node TEST-DEPLOYMENT.js "https://script.google.com/macros/s/XXXX/exec"
 * Catatan: ini benar-benar menambah 1 baris uji di tab "Brief Klien".
 */
const url = process.argv[2];
if (!url || !/\/exec$/.test(url)) {
  console.error('Berikan URL Web App yang berakhiran /exec');
  process.exit(1);
}

const payload = {
  briefId: 'NARA-TEST-' + Date.now().toString(36).toUpperCase(),
  timestamp: new Date().toISOString(),
  services: 'Konten & Digital Marketing',
  deliverables: 'Reels & TikTok Short-Form, Content Strategy & Calendar',
  projectSummary: 'UJI SISTEM (boleh dihapus). Tes koneksi form ke spreadsheet.',
  brandName: 'TEST NARA',
  brandLink: '',
  budget: 'Belum tahu / ingin konsultasi',
  timeline: 'Fleksibel',
  fullName: 'Tes Sistem',
  whatsapp: '6281281886198',
  email: 'naracreativestudio.id@gmail.com',
  source: 'TEST-DEPLOYMENT.js'
};

(async () => {
  const health = await fetch(url).then((r) => r.text()).catch((e) => 'ERR ' + e.message);
  console.log('GET  :', health.slice(0, 200));

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });
  const text = await res.text();
  console.log('POST :', res.status, text.slice(0, 300));
  try {
    const json = JSON.parse(text);
    console.log(json.success ? '✔ Berhasil — cek baris baru di tab "Brief Klien".' : '✖ Gagal: ' + json.message);
  } catch {
    console.log('✖ Respons bukan JSON. Pastikan akses deployment = "Siapa saja".');
  }
})();
