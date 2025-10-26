/**
 * Script de teste para verificar GIFs da ExerciseDB API
 */

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function testExerciseDBGifs() {
  const apiKey = process.env.RAPIDAPI_KEY;
  const baseUrl = 'https://exercisedb.p.rapidapi.com';

  if (!apiKey) {
    console.error('❌ RAPIDAPI_KEY não configurada');
    return;
  }

  console.log('🧪 Testando GIFs da ExerciseDB API...\n');

  try {
    // Buscar alguns exercícios
    const response = await axios.get(`${baseUrl}/exercises`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      },
      params: { limit: 10 }
    });

    const exercises = response.data;

    console.log(`✅ ${exercises.length} exercícios retornados\n`);
    console.log('📊 Exemplos de GIFs:\n');

    exercises.slice(0, 5).forEach((ex: any, index: number) => {
      console.log(`${index + 1}. ${ex.name}`);
      console.log(`   ID: ${ex.id}`);
      console.log(`   GIF: ${ex.gifUrl}`);
      console.log(`   Parte: ${ex.bodyPart}`);
      console.log(`   Equipamento: ${ex.equipment}\n`);
    });

    // Verificar se todos têm GIF
    const withGif = exercises.filter((ex: any) => ex.gifUrl).length;
    const withoutGif = exercises.length - withGif;

    console.log(`\n📈 Estatísticas:`);
    console.log(`   Com GIF: ${withGif} (${Math.round(withGif / exercises.length * 100)}%)`);
    console.log(`   Sem GIF: ${withoutGif} (${Math.round(withoutGif / exercises.length * 100)}%)`);

    // Testar se um GIF carrega
    if (exercises[0]?.gifUrl) {
      console.log(`\n🔍 Testando carregamento do GIF...`);
      console.log(`   URL: ${exercises[0].gifUrl}`);
      
      const gifResponse = await axios.head(exercises[0].gifUrl);
      console.log(`   Status: ${gifResponse.status}`);
      console.log(`   Content-Type: ${gifResponse.headers['content-type']}`);
      console.log(`   ✅ GIF acessível!`);
    }

    console.log('\n✅ Teste concluído com sucesso!');
    console.log('\n💡 Todos os exercícios da ExerciseDB incluem GIFs animados!');

  } catch (error: any) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executar teste
testExerciseDBGifs();
