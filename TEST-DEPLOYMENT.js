/**
 * NARA CREATIVE STUDIO — TEST DEPLOYMENT UTILITY
 * Gunakan skrip ini untuk menguji endpoint Google Apps Script Web App Anda.
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka website di browser atau buka console browser (tekan F12 > Console).
 * 2. Masukkan URL deployment Web App Anda pada variabel DEPLOYMENT_URL di bawah.
 * 3. Jalankan fungsi: testAppsScriptDeployment("URL_DEPLOYMENT_ANDA")
 */

async function testAppsScriptDeployment(deploymentUrl) {
  const targetUrl = deploymentUrl || 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

  if (!targetUrl || targetUrl.includes('YOUR_DEPLOYMENT_ID')) {
    console.warn('⚠️ PERINGATAN: Masukkan URL Deployment Web App Anda terlebih dahulu!');
    console.info('Contoh: testAppsScriptDeployment("https://script.google.com/macros/s/AKfycbw.../exec")');
    return;
  }

  console.log('🔄 Memulai pengujian pengiriman brief ke Google Sheets...');
  console.log('Target Endpoint:', targetUrl);

  const testPayload = {
    timestamp: new Date().toISOString(),
    briefId: 'TEST-' + Date.now(),
    status: 'Test',
    fullName: 'Tester Nara Creative',
    role: 'Quality Assurance',
    email: 'naracreativestudio.id@gmail.com',
    whatsapp: '+62 812-8188-6198',
    preferredContact: 'WhatsApp',
    brandName: 'Brand Uji Coba Nara',
    businessField: 'F&B & Lifestyle',
    websiteSocial: 'https://instagram.com/naracreativestudio',
    brandDescription: 'Ini adalah entri pengujian otomatis untuk memverifikasi append-row ke spreadsheet.',
    hasVisualIdentity: 'Sudah Lengkap & Siap Pakai',
    serviceCategory: 'Foto Produk & Lifestyle, Video & Campaign',
    serviceSubcategories: 'AI Product Photography, Video komersial & iklan digital',
    serviceOther: 'Kebutuhan uji coba konektivitas',
    projectGoal: 'Memverifikasi penambahan baris baru di spreadsheet target',
    targetAudience: 'Pasar umum Indonesia',
    challenges: 'Uji koneksi Web App',
    expectedResults: 'Baris baru muncul di Google Sheets tanpa error',
    references: 'https://instagram.com/naracreativestudio',
    projectStart: 'Segera (1-2 minggu ke depan)',
    deadline: 'Minggu ini',
    budget: '5 - 15 Juta',
    existingAssets: 'Sample Produk Fisik, File Logo Master (AI/PNG)',
    additionalNotes: 'Data uji coba. Aman untuk dihapus jika tidak diperlukan.',
    contactConsent: true
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ SUKSES BESAR! Web App berhasil terhubung ke Google Sheets.');
      console.log('Detail Response:', result);
      console.log('Buka spreadsheet Anda untuk memeriksa baris baru di tab "Client Briefs":');
      console.log('https://docs.google.com/spreadsheets/d/1qIoAhvmh_kmQ89fQcnVkzecYzR0AWzZo8OgDBlpQjJo/edit');
    } else {
      console.error('❌ Respon gagal dari server Apps Script:', result);
    }
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat fetch:', error);
    console.info('Kemungkinan penyebab:');
    console.info('1. URL deployment salah atau belum berakhiran /exec');
    console.info('2. "Who has access" saat deployment belum disetel ke "Anyone"');
    console.info('3. Izin otorisasi Google belum disetujui');
  }
}
