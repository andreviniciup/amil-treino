const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');

const prisma = new PrismaClient();

async function postBuild() {
  try {
    console.log('🔍 Verificando se precisa popular banco de dados...\n');

    // Verificar se já tem exercícios no banco
    const exerciseCount = await prisma.exercise.count();
    
    console.log(`📊 Exercícios no banco: ${exerciseCount}`);

    if (exerciseCount === 0) {
      console.log('\n🚀 Banco vazio! Iniciando seed de exercícios...\n');
      console.log('⏱️  Isso pode demorar 5-10 minutos...\n');
      
      // Executar seed - cwd é a raiz do backend
      const projectRoot = path.resolve(__dirname, '..');
      console.log(`📁 Executando seed em: ${projectRoot}\n`);
      
      execSync('npm run seed:exercises:api', { 
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('\n✅ Seed concluído com sucesso!');
    } else {
      console.log('\n✅ Banco já possui exercícios. Seed não necessário.');
      console.log('💡 Para atualizar exercícios, execute: npm run seed:exercises:api\n');
    }

  } catch (error) {
    console.error('❌ Erro no post-build:', error);
    // Não falhar o deploy se o seed falhar
    console.log('\n⚠️  Seed falhou, mas o deploy continuará.');
    console.log('💡 Você pode executar manualmente: npm run seed:exercises:api\n');
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
postBuild()
  .then(() => {
    console.log('🎉 Post-build finalizado!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(0); // Não falhar o deploy
  });
