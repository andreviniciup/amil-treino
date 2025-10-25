const axios = require('axios');

async function testArmsAPI() {
  try {
    console.log('Testando API para arms...');
    
    const response = await axios.get('http://localhost:3001/api/exercises/bodypart/arms');
    console.log('Exercícios de braços encontrados:', response.data.data.length);
    
    if (response.data.data.length > 0) {
      const firstExercise = response.data.data[0];
      console.log('Primeiro exercício:');
      console.log('ID:', firstExercise.id);
      console.log('Name:', firstExercise.name);
      console.log('BodyPart:', firstExercise.bodyPart);
    }
    
  } catch (error) {
    console.error('Erro ao testar API:', error.response?.data || error.message);
  }
}

testArmsAPI();
