const axios = require('axios');

// Teste simples da API do Pexels
async function testPexelsAPI() {
  try {
    console.log('🔍 Testing Pexels API...');
    
    // Você precisa de uma chave da API do Pexels
    // Obtenha em: https://www.pexels.com/api/
    const apiKey = 'YOUR_PEXELS_API_KEY'; // Substitua pela sua chave
    
    if (apiKey === 'YOUR_PEXELS_API_KEY') {
      console.log('❌ Please set your Pexels API key in the script');
      console.log('📝 Get your free API key at: https://www.pexels.com/api/');
      return;
    }
    
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        'Authorization': apiKey
      },
      params: {
        query: 'gym workout exercise',
        per_page: 3
      }
    });
    
    console.log('✅ Pexels API working!');
    console.log(`📊 Found ${response.data.photos.length} images`);
    
    response.data.photos.forEach((photo, index) => {
      console.log(`🖼️ Image ${index + 1}:`);
      console.log(`   URL: ${photo.src.medium}`);
      console.log(`   Photographer: ${photo.photographer}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing Pexels API:', error.message);
  }
}

testPexelsAPI();
