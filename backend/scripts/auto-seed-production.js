/**
 * Script de seed automático para produção
 * Popula o banco de dados com exercícios se estiver vazio
 * Executa automaticamente após o build no Render
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function autoSeedProduction() {
  try {
    console.log('\n🔍 Verificando estado do banco de dados...');
    
    // Verificar quantos exercícios existem
    const exerciseCount = await prisma.exercise.count();
    console.log(`📊 Exercícios no banco: ${exerciseCount}`);
    
    // Se já tiver exercícios, não fazer nada
    if (exerciseCount > 50) {
      console.log('✅ Banco já possui exercícios suficientes. Seed não necessário.');
      await prisma.$disconnect();
      process.exit(0);
    }
    
    console.log('\n⚠️  Banco com poucos exercícios! Iniciando seed automático...');
    console.log('📦 Este processo pode demorar alguns minutos...\n');
    
    // Verificar se existe arquivo JSON com exercícios pré-processados
    const jsonPath = path.join(__dirname, '../data/exercises.json');
    
    if (fs.existsSync(jsonPath)) {
      console.log('📁 Encontrado arquivo exercises.json, usando dados locais...');
      await seedFromJson(jsonPath);
    } else {
      console.log('⚠️  Arquivo exercises.json não encontrado.');
      console.log('💡 Criando exercícios básicos para garantir funcionamento...');
      await seedBasicExercises();
    }
    
    // Verificar resultado
    const finalCount = await prisma.exercise.count();
    console.log(`\n✅ Seed concluído! Total no banco: ${finalCount}`);
    
    if (finalCount > 50) {
      console.log('🎉 Banco populado com sucesso!\n');
    } else {
      console.log('⚠️  Poucos exercícios cadastrados. Verifique os logs.\n');
    }
    
    await prisma.$disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro no seed automático:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

/**
 * Seed a partir de arquivo JSON
 */
async function seedFromJson(jsonPath) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const exercises = data.exercises || data;
    
    console.log(`📦 Carregando ${exercises.length} exercícios do JSON...`);
    
    let created = 0;
    let skipped = 0;
    
    for (const ex of exercises) {
      try {
        // Verificar se já existe
        const existing = await prisma.exercise.findFirst({
          where: {
            OR: [
              { externalId: ex.externalId },
              { name: ex.name }
            ]
          }
        });
        
        if (existing) {
          skipped++;
          continue;
        }
        
        // Criar exercício
        await prisma.exercise.create({
          data: {
            externalId: ex.externalId || ex.id || `ex-${Date.now()}-${Math.random()}`,
            name: ex.name,
            bodyPart: ex.bodyPart || ex.muscle || 'geral',
            equipment: ex.equipment || 'peso corporal',
            gifUrl: ex.gifUrl || ex.imageUrl || '',
            target: ex.target || ex.bodyPart || '',
            secondaryMuscles: ex.secondaryMuscles ? JSON.stringify(ex.secondaryMuscles) : '[]',
            instructions: ex.instructions ? JSON.stringify(ex.instructions) : '[]',
            source: ex.source || 'manual'
          }
        });
        
        created++;
        
        // Log a cada 100 exercícios
        if (created % 100 === 0) {
          console.log(`   ✓ ${created} exercícios criados...`);
        }
        
      } catch (error) {
        console.error(`   ⚠️  Erro ao criar exercício ${ex.name}:`, error.message);
      }
    }
    
    console.log(`✅ Seed do JSON concluído: ${created} criados, ${skipped} já existiam`);
    
  } catch (error) {
    console.error('❌ Erro ao processar JSON:', error);
    throw error;
  }
}

/**
 * Seed com exercícios básicos (fallback)
 */
async function seedBasicExercises() {
  const basicExercises = [
    // Peito
    { name: 'Supino Reto', bodyPart: 'peito', equipment: 'barra', target: 'peitoral maior' },
    { name: 'Supino Inclinado', bodyPart: 'peito', equipment: 'barra', target: 'peitoral superior' },
    { name: 'Supino Declinado', bodyPart: 'peito', equipment: 'barra', target: 'peitoral inferior' },
    { name: 'Crucifixo', bodyPart: 'peito', equipment: 'halteres', target: 'peitoral maior' },
    { name: 'Flexão', bodyPart: 'peito', equipment: 'peso corporal', target: 'peitoral maior' },
    
    // Costas
    { name: 'Barra Fixa', bodyPart: 'costas', equipment: 'peso corporal', target: 'grande dorsal' },
    { name: 'Remada Curvada', bodyPart: 'costas', equipment: 'barra', target: 'grande dorsal' },
    { name: 'Remada Unilateral', bodyPart: 'costas', equipment: 'halter', target: 'grande dorsal' },
    { name: 'Pulldown', bodyPart: 'costas', equipment: 'máquina', target: 'grande dorsal' },
    { name: 'Levantamento Terra', bodyPart: 'costas', equipment: 'barra', target: 'lombar' },
    
    // Pernas
    { name: 'Agachamento', bodyPart: 'pernas', equipment: 'barra', target: 'quadríceps' },
    { name: 'Leg Press', bodyPart: 'pernas', equipment: 'máquina', target: 'quadríceps' },
    { name: 'Cadeira Extensora', bodyPart: 'pernas', equipment: 'máquina', target: 'quadríceps' },
    { name: 'Mesa Flexora', bodyPart: 'pernas', equipment: 'máquina', target: 'isquiotibiais' },
    { name: 'Stiff', bodyPart: 'pernas', equipment: 'barra', target: 'isquiotibiais' },
    { name: 'Panturrilha em Pé', bodyPart: 'pernas', equipment: 'máquina', target: 'panturrilha' },
    
    // Ombros
    { name: 'Desenvolvimento', bodyPart: 'ombros', equipment: 'barra', target: 'deltoide' },
    { name: 'Elevação Lateral', bodyPart: 'ombros', equipment: 'halteres', target: 'deltoide lateral' },
    { name: 'Elevação Frontal', bodyPart: 'ombros', equipment: 'halteres', target: 'deltoide anterior' },
    { name: 'Crucifixo Invertido', bodyPart: 'ombros', equipment: 'halteres', target: 'deltoide posterior' },
    
    // Braços
    { name: 'Rosca Direta', bodyPart: 'braços', equipment: 'barra', target: 'bíceps' },
    { name: 'Rosca Alternada', bodyPart: 'braços', equipment: 'halteres', target: 'bíceps' },
    { name: 'Rosca Martelo', bodyPart: 'braços', equipment: 'halteres', target: 'bíceps' },
    { name: 'Tríceps Testa', bodyPart: 'braços', equipment: 'barra', target: 'tríceps' },
    { name: 'Tríceps Corda', bodyPart: 'braços', equipment: 'cabo', target: 'tríceps' },
    { name: 'Mergulho', bodyPart: 'braços', equipment: 'peso corporal', target: 'tríceps' },
    
    // Core
    { name: 'Abdominal', bodyPart: 'abdômen', equipment: 'peso corporal', target: 'reto abdominal' },
    { name: 'Prancha', bodyPart: 'abdômen', equipment: 'peso corporal', target: 'core' },
    { name: 'Abdominal Oblíquo', bodyPart: 'abdômen', equipment: 'peso corporal', target: 'oblíquos' },
    { name: 'Elevação de Pernas', bodyPart: 'abdômen', equipment: 'peso corporal', target: 'abdominal inferior' }
  ];
  
  console.log(`📦 Criando ${basicExercises.length} exercícios básicos...`);
  
  for (const ex of basicExercises) {
    try {
      await prisma.exercise.create({
        data: {
          externalId: `basic-${ex.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: ex.name,
          bodyPart: ex.bodyPart,
          equipment: ex.equipment,
          gifUrl: `https://cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images@main/exercises/${ex.name.toLowerCase().replace(/\s+/g, '-')}/0.jpg`,
          target: ex.target,
          secondaryMuscles: '[]',
          instructions: JSON.stringify([
            'Posicione-se corretamente',
            'Execute o movimento de forma controlada',
            'Mantenha a técnica adequada',
            'Respire corretamente durante o exercício'
          ]),
          source: 'manual'
        }
      });
      
      console.log(`   ✓ ${ex.name}`);
      
    } catch (error) {
      console.error(`   ⚠️  Erro ao criar ${ex.name}:`, error.message);
    }
  }
  
  console.log('✅ Exercícios básicos criados com sucesso!');
}

// Executar seed
autoSeedProduction();
