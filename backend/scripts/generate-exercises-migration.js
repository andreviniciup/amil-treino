/**
 * Script para gerar migration SQL com todos os exercícios
 * Lê o JSON de exercícios e cria um arquivo SQL para popular a tabela Exercise
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Função para gerar UUID
function generateUUID() {
  return crypto.randomUUID();
}

// Caminho do JSON com exercícios
const jsonPath = path.join(__dirname, '../temp-exercicios/exercises/exercises-ptbr-full-translation.json');
const outputPath = path.join(__dirname, '../prisma/migrations/seed-exercises.sql');

// CDN base URL para imagens
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images@main/exercises';

console.log('🔍 Lendo arquivo de exercícios...');
const exercises = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
console.log(`📊 Total de exercícios encontrados: ${exercises.length}`);

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

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function formatGifUrl(imagePath) {
  if (!imagePath) return '';
  
  // Extrai o nome da pasta (ID do exercício)
  const folder = imagePath.split('/')[0];
  return `${CDN_BASE}/${folder}/0.jpg`;
}

console.log('🔄 Gerando SQL...');

// Cabeçalho do SQL
let sql = `-- Migration: Seed de Exercícios
-- Gerado automaticamente em: ${new Date().toISOString()}
-- Total de exercícios: ${exercises.length}

-- Deletar exercícios existentes (caso haja)
DELETE FROM "WorkoutExercise";
DELETE FROM "PerformanceHistory";
DELETE FROM "Exercise";

-- Inserir exercícios
`;

let insertedCount = 0;
let skippedCount = 0;

for (const ex of exercises) {
  try {
    const id = generateUUID();
    const name = escapeSQL(ex.name);
    const bodyPart = getBodyPart(ex.primaryMuscles);
    const equipment = escapeSQL(ex.equipment || 'peso-do-corpo');
    const gifUrl = formatGifUrl(ex.images ? ex.images[0] : null);
    const target = escapeSQL(ex.primaryMuscles && ex.primaryMuscles[0] ? ex.primaryMuscles[0] : '');
    const secondaryMuscles = escapeSQL(JSON.stringify(ex.secondaryMuscles || []));
    const instructions = escapeSQL(JSON.stringify(ex.instructions || []));
    const externalId = escapeSQL(ex.id);
    
    if (!name) {
      skippedCount++;
      continue;
    }
    
    sql += `INSERT INTO "Exercise" ("id", "externalId", "name", "bodyPart", "equipment", "gifUrl", "target", "secondaryMuscles", "instructions", "source", "createdAt", "updatedAt")
VALUES ('${id}', '${externalId}', '${name}', '${bodyPart}', '${equipment}', '${gifUrl}', '${target}', '${secondaryMuscles}', '${instructions}', 'internal', NOW(), NOW());

`;
    
    insertedCount++;
    
    // Log de progresso a cada 100 exercícios
    if (insertedCount % 100 === 0) {
      console.log(`   ✓ ${insertedCount} exercícios processados...`);
    }
    
  } catch (error) {
    console.error(`   ⚠️  Erro ao processar exercício ${ex.name}:`, error.message);
    skippedCount++;
  }
}

console.log(`\n✅ SQL gerado com sucesso!`);
console.log(`   📝 Exercícios inseridos: ${insertedCount}`);
console.log(`   ⚠️  Exercícios pulados: ${skippedCount}`);
console.log(`   📄 Arquivo: ${outputPath}\n`);

// Salvar arquivo SQL
fs.writeFileSync(outputPath, sql, 'utf-8');

console.log('🎉 Migration SQL criada com sucesso!');
console.log('📋 Próximos passos:');
console.log('   1. Revisar o arquivo: prisma/migrations/seed-exercises.sql');
console.log('   2. Aplicar localmente: psql $DATABASE_URL < prisma/migrations/seed-exercises.sql');
console.log('   3. Ou usar o script: npm run seed:sql');
