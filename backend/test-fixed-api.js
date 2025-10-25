const axios = require('axios');

async function testFixedAPI() {
  try {
    console.log('Testando API corrigida...');
    
    // Testar endpoint de exercícios por grupo muscular
    const response = await axios.get('http://localhost:3001/api/exercises/bodypart/chest');
    console.log('Exercícios de peito encontrados:', response.data.data.length);
    
    if (response.data.data.length > 0) {
      const firstExercise = response.data.data[0];
      console.log('Primeiro exercício:');
      console.log('ID:', firstExercise.id);
      console.log('Name:', firstExercise.name);
      console.log('BodyPart:', firstExercise.bodyPart);
      
      // Verificar se o ID é um UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(firstExercise.id)) {
        console.log('✅ ID é um UUID válido');
      } else {
        console.log('❌ ID não é um UUID válido');
      }
    }
    
  } catch (error) {
    console.error('Erro ao testar API:', error.response?.data || error.message);
  }
}

testFixedAPI();
