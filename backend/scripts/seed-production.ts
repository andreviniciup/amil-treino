import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { execSync } from 'child_process';
import * as fs from 'fs';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Limpar e regenerar Prisma Client com a configuração do PostgreSQL
console.log('\n🔧 Limpando e regenerando Prisma Client para PostgreSQL...');
try {
  const backendRoot = path.resolve(__dirname, '..');
  const prismaClientPath = path.join(backendRoot, 'node_modules', '.prisma');
  
  // Remover cache do Prisma Client
  if (fs.existsSync(prismaClientPath)) {
    console.log('🗑️  Removendo cache antigo do Prisma Client...');
    fs.rmSync(prismaClientPath, { recursive: true, force: true });
  }
  
  // Regenerar
  console.log('⚙️  Gerando novo Prisma Client...');
  execSync('npx prisma generate', {
    cwd: backendRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL
    }
  });
  console.log('✅ Prisma Client regenerado\n');
} catch (error) {
  console.error('❌ Erro ao regenerar Prisma Client:', error);
  process.exit(1);
}

// Importar Prisma Client DEPOIS de regenerar
const { PrismaClient } = require('@prisma/client');
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

// Dicionário de tradução de nomes de exercícios
const EXERCISE_TERMS: Record<string, string> = {
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
  'single': 'único',
  'double': 'duplo',
  'alternate': 'alternado',
  'hammer': 'martelo',
  'cable': 'cabo',
  'dumbbell': 'halter',
  'barbell': 'barra',
  'machine': 'máquina',
  'bodyweight': 'peso corporal',
  'weighted': 'com peso',
  'assisted': 'assistido',
  'unilateral': 'unilateral',
  'bilateral': 'bilateral',
  'static': 'estático',
  'dynamic': 'dinâmico',
  'explosive': 'explosivo',
  'slow': 'lento',
  'fast': 'rápido',
  'tempo': 'tempo',
  'pause': 'pausa',
  'hold': 'segurar',
  'stretch': 'alongamento',
  'flex': 'flexão',
  'extend': 'extensão',
  'rotate': 'rotação',
  'twist': 'torção',
  'up': 'para cima',
  'down': 'para baixo',
};

function translate(value: string, dictionary: Record<string, string>): string {
  const normalized = value.toLowerCase().trim();
  return dictionary[normalized] || value;
}

function translateExerciseName(name: string): string {
  let translated = name;
  
  Object.entries(EXERCISE_TERMS).forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, portuguese);
  });
  
  // Capitalizar primeira letra de cada palavra
  return translated
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
    throw new Error('❌ RAPIDAPI_KEY não configurada no .env');
  }

  console.log('🔄 Buscando exercícios da API ExerciseDB...');
  console.log('💡 Estratégia: Buscar por cada parte do corpo\n');
  
  const allExercises: ExerciseDBExercise[] = [];
  const bodyParts = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
  
  for (const bodyPart of bodyParts) {
    try {
      console.log(`📥 Buscando: ${bodyPart}...`);
      
      const response = await axios.get(`${baseUrl}/exercises/bodyPart/${bodyPart}`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        timeout: 30000
      });
      
      const count = response.data.length;
      console.log(`   ✅ ${count} exercícios`);
      
      allExercises.push(...response.data);
      
      // Delay entre requisições
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      console.error(`   ❌ Erro em ${bodyPart}:`, error.message);
    }
  }

  console.log(`\n✅ Total: ${allExercises.length} exercícios\n`);
  return allExercises;
}

async function seedProduction() {
  try {
    console.log('\n🚀 SEED DE PRODUÇÃO - Popula banco diretamente\n');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...\n');

    // 1. Verificar conexão
    console.log('🔌 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');

    // 2. Contar exercícios atuais
    const currentCount = await prisma.exercise.count();
    console.log(`📊 Exercícios atuais no banco: ${currentCount}\n`);

    if (currentCount >= 1000) {
      console.log('⚠️  Banco já possui muitos exercícios.');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise<string>(resolve => {
        readline.question('Deseja limpar e repovoar? (sim/não): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() !== 'sim') {
        console.log('❌ Operação cancelada.');
        return;
      }
    }

    // 3. Buscar exercícios da API
    const apiExercises = await fetchAllExercises();

    if (apiExercises.length === 0) {
      throw new Error('Nenhum exercício foi retornado da API');
    }

    // 4. Limpar exercícios antigos da API
    console.log('🗑️  Limpando exercícios antigos da API...');
    const deleted = await prisma.exercise.deleteMany({
      where: { source: 'exercisedb' }
    });
    console.log(`✅ ${deleted.count} exercícios removidos\n`);

    // 5. Inserir novos exercícios
    console.log('💾 Inserindo exercícios traduzidos...');
    
    let inserted = 0;
    let failed = 0;
    const total = apiExercises.length;

    for (let i = 0; i < apiExercises.length; i++) {
      const apiEx = apiExercises[i];
      
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

        // Mostrar progresso a cada 50 exercícios
        if (inserted % 50 === 0) {
          const progress = ((inserted / total) * 100).toFixed(1);
          console.log(`   📈 Progresso: ${inserted}/${total} (${progress}%)`);
        }

      } catch (error: any) {
        failed++;
        if (failed <= 5) {
          console.error(`   ⚠️  Erro ao inserir ${apiEx.name}:`, error.message);
        }
      }
    }

    // 6. Resultado final
    const finalCount = await prisma.exercise.count();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`📊 Inseridos: ${inserted}`);
    console.log(`❌ Falhas: ${failed}`);
    console.log(`📈 Total no banco: ${finalCount}`);
    console.log('='.repeat(60) + '\n');

    // Mostrar alguns exemplos
    const examples = await prisma.exercise.findMany({
      take: 5,
      orderBy: { name: 'asc' }
    });

    console.log('🔤 Exemplos de exercícios:');
    examples.forEach((ex: any) => {
      console.log(`  • ${ex.name}`);
      console.log(`    - Parte: ${ex.bodyPart} | Equipamento: ${ex.equipment}`);
    });

    console.log('\n✅ Banco de produção populado com sucesso!\n');

  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
seedProduction()
  .then(() => {
    console.log('🎉 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
