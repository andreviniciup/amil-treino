#!/usr/bin/env node

/**
 * Script para resetar e popular o banco de dados com exercícios
 * Uso: npm run reset:database
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🗑️  RESETANDO BANCO DE DADOS...\n');

    // 1. Deletar todos os exercícios da API
    console.log('🔄 Removendo exercícios antigos da API...');
    const deleted = await prisma.exercise.deleteMany({
      where: {
        source: 'exercisedb'
      }
    });
    console.log(`✅ ${deleted.count} exercícios removidos\n`);

    // 2. Executar seed
    console.log('🚀 Populando banco com exercícios traduzidos...');
    console.log('⏱️  Isso pode demorar 5-10 minutos...\n');
    
    execSync('npm run seed:exercises:api', { 
      stdio: 'inherit',
      cwd: __dirname + '/..'
    });

    // 3. Verificar resultado
    const total = await prisma.exercise.count();
    console.log(`\n📊 Total de exercícios no banco: ${total}`);

    if (total > 1000) {
      console.log('✅ Banco resetado e populado com sucesso!\n');
    } else {
      console.log(`⚠️  Apenas ${total} exercícios no banco. Esperado: 1300+\n`);
    }

  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Confirmação
console.log('⚠️  ATENÇÃO: Este script irá DELETAR todos os exercícios da API!\n');
console.log('Exercícios customizados (source="internal") serão mantidos.\n');
console.log('Iniciando em 3 segundos...\n');

setTimeout(() => {
  resetDatabase()
    .then(() => {
      console.log('🎉 Processo concluído!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}, 3000);
