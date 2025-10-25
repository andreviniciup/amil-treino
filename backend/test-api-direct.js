const axios = require('axios');

async function testAPIDirect() {
  try {
    console.log('Testando API diretamente...');
    
    // Primeiro, fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'teste.novo@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');
    
    // Dados do treino
    const workoutData = {
      name: 'Treino Teste API',
      description: 'Teste via API',
      frequency: 2,
      trainingTypes: ['Musculação'],
      workouts: [
        {
          dayOfWeek: 'Segunda',
          trainingType: 'Musculação',
          exercises: [
            {
              exerciseId: 'e5f51cc7-495e-4926-84d3-a4a4d3c2dfd6', // ID válido do banco
              exerciseName: 'Supino Reto',
              sets: 3,
              reps: '8-12',
              restTime: 90,
              order: 1,
              gifUrl: 'https://via.placeholder.com/300x300?text=Exercise',
              bodyPart: 'peito',
              equipment: 'barra',
              target: 'peitorais'
            }
          ]
        }
      ]
    };
    
    console.log('📤 Enviando dados:', JSON.stringify(workoutData, null, 2));
    
    // Tentar criar o treino
    const createResponse = await axios.post('http://localhost:3001/api/workouts/plans', workoutData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Treino criado com sucesso:', createResponse.data);
    
  } catch (error) {
    console.error('❌ Erro ao criar treino:', error.response?.data || error.message);
  }
}

testAPIDirect();
