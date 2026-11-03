// TEST_DEPLOYMENT.js
// File ini untuk membantu Anda test Apps Script deployment
// Copy-paste fungsi ini ke console browser untuk test

/**
 * CARA TEST:
 * 1. Buka website di browser
 * 2. Tekan F12 untuk buka Developer Tools
 * 3. Klik tab "Console"
 * 4. Copy-paste fungsi testAppsScriptDeployment() di bawah
 * 5. Tekan Enter
 * 6. Lihat response di console
 */

async function testAppsScriptDeployment() {
  const deploymentUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent';
  
  // Ganti YOUR_DEPLOYMENT_ID dengan URL Apps Script yang sebenarnya
  // Contoh: https://script.google.com/macros/s/AKfycbwxxxx/usercontent
  
  if (deploymentUrl.includes('YOUR_DEPLOYMENT_ID')) {
    console.error('❌ ERROR: Ganti URL deployment terlebih dahulu!');
    return;
  }
  
  console.log('🔄 Testing Apps Script deployment...');
  console.log('URL:', deploymentUrl);
  
  try {
    const testData = {
      timestamp: new Date().toISOString(),
      briefId: 'TEST-' + Date.now(),
      status: 'Test',
      fullName: 'Test User',
      email: 'test@example.com',
      whatsapp: '081234567890',
      brandName: 'Test Brand',
      serviceCategory: 'photo, video',
      projectGoal: 'Testing deployment',
      projectStart: 'Segera',
      contactConsent: true
    };
    
    console.log('📤 Mengirim test data:', testData);
    
    const response = await fetch(deploymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS! Apps Script deployment bekerja!');
      console.log('Response:', result);
      console.log('Brief ID:', result.briefId);
      console.log('\n📊 Check Google Sheets - tab "Client Briefs" untuk melihat test data');
    } else {
      console.error('❌ FAILED! Response:', result);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    console.error('Kemungkinan penyebab:');
    console.error('1. URL deployment salah atau tidak lengkap');
    console.error('2. Apps Script belum di-deploy atau belum granted akses');
    console.error('3. Network error');
  }
}

// Jalankan: testAppsScriptDeployment()
