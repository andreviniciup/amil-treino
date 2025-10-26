import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Tradução de partes do corpo
const BODY_PARTS_PT: Record<string, string> = {
  'back': 'Costas',
  'cardio': 'Cardio',
  'chest': 'Peito',
  'lower arms': 'Antebraços',
  'lower legs': 'Panturrilhas',
  'neck': 'Pescoço',
  'shoulders': 'Ombros',
  'upper arms': 'Bíceps/Tríceps',
  'upper legs': 'Coxas',
  'waist': 'Abdômen',
};

// Tradução de equipamentos
const EQUIPMENT_PT: Record<string, string> = {
  'assisted': 'Assistido',
  'band': 'Faixa Elástica',
  'barbell': 'Barra',
  'body weight': 'Peso Corporal',
  'bosu ball': 'Bola Bosu',
  'cable': 'Cabo/Polia',
  'dumbbell': 'Halter',
  'elliptical machine': 'Elíptico',
  'ez barbell': 'Barra EZ',
  'hammer': 'Martelo',
  'kettlebell': 'Kettlebell',
  'leverage machine': 'Máquina de Alavanca',
  'medicine ball': 'Bola Medicinal',
  'olympic barbell': 'Barra Olímpica',
  'resistance band': 'Faixa de Resistência',
  'roller': 'Rolo',
  'rope': 'Corda',
  'skierg machine': 'Máquina SkiErg',
  'sled machine': 'Trenó',
  'smith machine': 'Smith Machine',
  'stability ball': 'Bola Suíça',
  'stationary bike': 'Bicicleta Ergométrica',
  'stepmill machine': 'Escada Ergométrica',
  'tire': 'Pneu',
  'trap bar': 'Barra Trap',
  'upper body ergometer': 'Ergômetro Superior',
  'weighted': 'Com Peso',
  'wheel roller': 'Roda Abdominal',
};

// Tradução de músculos alvo
const TARGET_MUSCLES_PT: Record<string, string> = {
  'abs': 'Abdômen',
  'adductors': 'Adutores',
  'abductors': 'Abdutores',
  'biceps': 'Bíceps',
  'calves': 'Panturrilhas',
  'cardiovascular system': 'Sistema Cardiovascular',
  'delts': 'Deltoides',
  'forearms': 'Antebraços',
  'glutes': 'Glúteos',
  'hamstrings': 'Posteriores de Coxa',
  'lats': 'Dorsais',
  'levator scapulae': 'Levantador da Escápula',
  'pectorals': 'Peitorais',
  'quads': 'Quadríceps',
  'serratus anterior': 'Serrátil Anterior',
  'spine': 'Coluna',
  'traps': 'Trapézio',
  'triceps': 'Tríceps',
  'upper back': 'Costas Superior',
};

// Dicionário de tradução de nomes de exercícios (palavras comuns)
const EXERCISE_TERMS: Record<string, string> = {
  // Movimentos básicos
  'squat': 'agachamento',
  'push': 'empurrar',
  'pull': 'puxar',
  'press': 'pressão',
  'curl': 'rosca',
  'fly': 'crucifixo',
  'raise': 'elevação',
  'row': 'remada',
  'crunch': 'abdominal',
  'plank': 'prancha',
  'lunge': 'avanço',
  'deadlift': 'levantamento terra',
  'bench': 'banco',
  'dip': 'mergulho',
  'pullup': 'barra fixa',
  'chinup': 'barra fixa supinada',
  
  // Partes do corpo
  'shoulder': 'ombro',
  'chest': 'peito',
  'back': 'costas',
  'leg': 'perna',
  'arm': 'braço',
  'bicep': 'bíceps',
  'tricep': 'tríceps',
  'calf': 'panturrilha',
  'thigh': 'coxa',
  'glute': 'glúteo',
  
  // Direções e posições
  'lateral': 'lateral',
  'front': 'frontal',
  'reverse': 'inverso',
  'overhead': 'acima da cabeça',
  'incline': 'inclinado',
  'decline': 'declinado',
  'flat': 'reto',
  'standing': 'em pé',
  'seated': 'sentado',
  'lying': 'deitado',
  'bent': 'curvado',
  'straight': 'reto',
  'wide': 'amplo',
  'close': 'fechado',
  'narrow': 'estreito',
  
  // Tipos de pegada/grip
  'grip': 'pegada',
  'hammer': 'martelo',
  'overhand': 'pronada',
  'underhand': 'supinada',
  
  // Modificadores
  'alternating': 'alternado',
  'single': 'único',
  'double': 'duplo',
  'one': 'um',
  'two': 'dois',
  
  // Ações
  'up': 'para cima',
  'down': 'para baixo',
  'in': 'dentro',
  'out': 'fora',
  'twist': 'torção',
  'rotation': 'rotação',
  'extension': 'extensão',
  'flexion': 'flexão',
  
  // Conectores
  'and': 'e',
  'with': 'com',
  'on': 'em',
  'to': 'para',
};

// Função para traduzir nome do exercício
function translateExerciseName(name: string): string {
  let translated = name.toLowerCase();
  
  // Substituir termos conhecidos
  Object.entries(EXERCISE_TERMS).forEach(([en, pt]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, pt);
  });

  // Capitalizar primeira letra de cada palavra
  return translated
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Função para traduzir
function translate(value: string, dictionary: Record<string, string>): string {
  const normalized = value.toLowerCase().trim();
  return dictionary[normalized] || value;
}

interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

async function fetchAllExercises(): Promise<ExerciseDBExercise[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  const baseUrl = process.env.RAPIDAPI_BASE_URL || 'https://exercisedb.p.rapidapi.com';
  
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY não configurada no .env');
  }

  console.log('🔄 Buscando exercícios da API ExerciseDB...');
  
  try {
    const response = await axios.get(`${baseUrl}/exercises`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      },
      params: {
        limit: 1500 // Buscar todos os exercícios disponíveis
      }
    });

    console.log(`✅ ${response.data.length} exercícios encontrados`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar exercícios:', error.response?.data || error.message);
    throw error;
  }
}

async function seedExercises() {
  try {
    console.log('🚀 Iniciando seed de exercícios...\n');

    // 1. Buscar todos os exercícios da API
    const apiExercises = await fetchAllExercises();
    
    console.log('\n📊 Estatísticas da API:');
    console.log(`- Total: ${apiExercises.length} exercícios`);
    
    // Agrupar por parte do corpo
    const byBodyPart: Record<string, number> = {};
    apiExercises.forEach(ex => {
      byBodyPart[ex.bodyPart] = (byBodyPart[ex.bodyPart] || 0) + 1;
    });
    
    console.log('\n- Por parte do corpo:');
    Object.entries(byBodyPart).forEach(([part, count]) => {
      console.log(`  • ${part}: ${count}`);
    });

    // 2. Limpar exercícios antigos da API (manter apenas internos)
    console.log('\n🗑️  Limpando exercícios antigos da API...');
    const deleted = await prisma.exercise.deleteMany({
      where: {
        source: 'exercisedb'
      }
    });
    console.log(`✅ ${deleted.count} exercícios antigos removidos`);

    // 3. Inserir novos exercícios traduzidos
    console.log('\n💾 Inserindo exercícios traduzidos no banco...');
    
    let inserted = 0;
    let failed = 0;
    
    for (const apiEx of apiExercises) {
      try {
        await prisma.exercise.create({
          data: {
            externalId: apiEx.id,
            name: translateExerciseName(apiEx.name),
            bodyPart: translate(apiEx.bodyPart, BODY_PARTS_PT),
            equipment: translate(apiEx.equipment, EQUIPMENT_PT),
            gifUrl: apiEx.gifUrl,
            target: translate(apiEx.target, TARGET_MUSCLES_PT),
            secondaryMuscles: JSON.stringify(
              apiEx.secondaryMuscles?.map(m => translate(m, TARGET_MUSCLES_PT)) || []
            ),
            instructions: JSON.stringify(apiEx.instructions || []),
            source: 'exercisedb'
          }
        });
        inserted++;
        
        if (inserted % 100 === 0) {
          console.log(`  ⏳ ${inserted}/${apiExercises.length} exercícios inseridos...`);
        }
      } catch (error: any) {
        failed++;
        console.error(`  ❌ Erro ao inserir "${apiEx.name}":`, error.message);
      }
    }

    console.log('\n✅ Seed concluído!');
    console.log(`\n📈 Resumo:`);
    console.log(`  • Inseridos: ${inserted}`);
    console.log(`  • Falhas: ${failed}`);
    console.log(`  • Total no banco: ${await prisma.exercise.count()}`);
    
    // Mostrar exemplos de traduções
    console.log('\n🔤 Exemplos de traduções:');
    const samples = await prisma.exercise.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    samples.forEach(ex => {
      console.log(`\n  • ${ex.name}`);
      console.log(`    - Parte: ${ex.bodyPart}`);
      console.log(`    - Equipamento: ${ex.equipment}`);
      console.log(`    - Alvo: ${ex.target}`);
    });

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed
seedExercises()
  .then(() => {
    console.log('\n✅ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Processo falhou:', error);
    process.exit(1);
  });
