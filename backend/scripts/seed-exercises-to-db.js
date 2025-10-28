/**
 * Script para popular o banco de dados diretamente com exercícios
 * Usa Prisma para inserir os dados de forma segura
 * Funciona em desenvolvimento e produção
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// CDN base URL para imagens
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images@main/exercises';

// Mapeamento de músculos para partes do corpo
const bodyPartMap = {
  'abdominais': 'abdômen',
  'abdominals': 'abdômen',
  'oblíquos': 'abdômen',
  'core': 'abdômen',
  
  'peito': 'peito',
  'peitoral': 'peito',
  'chest': 'peito',
  
  'costas': 'costas',
  'dorsal': 'costas',
  'latíssimo': 'costas',
  'trapézio': 'costas',
  'back': 'costas',
  
  'ombros': 'ombros',
  'deltoide': 'ombros',
  'deltoides': 'ombros',
  'shoulders': 'ombros',
  
  'bíceps': 'braços',
  'biceps': 'braços',
  'tríceps': 'braços',
  'triceps': 'braços',
  'antebraços': 'braços',
  'antebracos': 'braços',
  'forearms': 'braços',
  'arms': 'braços',
  
  'quadríceps': 'pernas',
  'quadriceps': 'pernas',
  'isquiotibiais': 'pernas',
  'hamstrings': 'pernas',
  'panturrilhas': 'pernas',
  'calves': 'pernas',
  'glúteos': 'pernas',
  'gluteos': 'pernas',
  'glutes': 'pernas',
  'coxas': 'pernas',
  'thighs': 'pernas',
  'legs': 'pernas',
  
  'lombar': 'lombar',
  'lower-back': 'lombar',
  
  'pescoço': 'pescoço',
  'neck': 'pescoço',
};

function getBodyPart(muscles) {
  if (!muscles || muscles.length === 0) return 'geral';
  
  const primary = muscles[0].toLowerCase();
  
  for (const [key, value] of Object.entries(bodyPartMap)) {
    if (primary.includes(key)) {
      return value;
    }
  }
  
  return 'geral';
}

function formatGifUrl(imagePath) {
  if (!imagePath) return '';
  
  // Extrai o nome da pasta (ID do exercício)
  const folder = imagePath.split('/')[0];
  return `${CDN_BASE}/${folder}/0.jpg`;
}

async function seedExercises() {
  try {
    console.log('\n🔍 Verificando estado do banco de dados...');
    
    // Verificar se já existem exercícios
    const existingCount = await prisma.exercise.count();
    console.log(`📊 Exercícios no banco: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('\n⚠️  Banco já possui exercícios!');
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        rl.question('Deseja DELETAR todos e repopular? (sim/NAO): ', resolve);
      });
      rl.close();
      
      if (answer.toLowerCase() !== 'sim') {
        console.log('❌ Operação cancelada pelo usuário.');
        await prisma.$disconnect();
        process.exit(0);
      }
      
      console.log('\n🗑️  Deletando exercícios existentes...');
      await prisma.exercise.deleteMany({});
      console.log('✅ Exercícios deletados.');
    }
    
    // Ler JSON de exercícios
    const jsonPath = path.join(__dirname, '../temp-exercicios/exercises/exercises-ptbr-full-translation.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Arquivo de exercícios não encontrado:', jsonPath);
      await prisma.$disconnect();
      process.exit(1);
    }
    
    console.log('\n📁 Carregando exercícios do JSON...');
    const exercises = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📊 Total de exercícios: ${exercises.length}`);
    
    console.log('\n💾 Inserindo exercícios no banco de dados...');
    console.log('⏱️  Isso pode demorar alguns minutos...\n');
    
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const ex of exercises) {
      try {
        if (!ex.name) {
          skipped++;
          continue;
        }
        
        const bodyPart = getBodyPart(ex.primaryMuscles);
        const gifUrl = formatGifUrl(ex.images ? ex.images[0] : null);
        
        await prisma.exercise.create({
          data: {
            externalId: ex.id || `ex-${Date.now()}-${Math.random()}`,
            name: ex.name,
            bodyPart: bodyPart,
            equipment: ex.equipment || 'peso-do-corpo',
            gifUrl: gifUrl || '',
            target: (ex.primaryMuscles && ex.primaryMuscles[0]) || bodyPart,
            secondaryMuscles: JSON.stringify(ex.secondaryMuscles || []),
            instructions: JSON.stringify(ex.instructions || []),
            source: 'internal'
          }
        });
        
        created++;
        
        // Log de progresso a cada 100 exercícios
        if (created % 100 === 0) {
          console.log(`   ✓ ${created}/${exercises.length} exercícios inseridos...`);
        }
        
      } catch (error) {
        if (error.code === 'P2002') {
          // Exercício duplicado, pular
          skipped++;
        } else {
          console.error(`   ⚠️  Erro ao inserir ${ex.name}:`, error.message);
          errors++;
        }
      }
    }
    
    console.log('\n✅ Seed concluído com sucesso!');
    console.log(`   📝 Exercícios criados: ${created}`);
    console.log(`   ⏭️  Exercícios pulados: ${skipped}`);
    console.log(`   ❌ Erros: ${errors}`);
    
    // Verificar resultado final
    const finalCount = await prisma.exercise.count();
    console.log(`\n📊 Total no banco: ${finalCount} exercícios`);
    
    // Estatísticas por grupo muscular
    console.log('\n📈 Estatísticas por grupo muscular:');
    const stats = await prisma.exercise.groupBy({
      by: ['bodyPart'],
      _count: true,
      orderBy: {
        _count: {
          bodyPart: 'desc'
        }
      }
    });
    
    for (const stat of stats) {
      console.log(`   ${stat.bodyPart}: ${stat._count} exercícios`);
    }
    
    console.log('\n🎉 Banco de dados populado com sucesso!\n');
    
    await prisma.$disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Erro fatal no seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Executar seed
seedExercises();
