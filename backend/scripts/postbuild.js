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

    // Seed necessário se tiver menos de 100 exercícios (indica que o seed completo não rodou)
    if (exerciseCount < 100) {
      console.log('\n🚀 Banco com poucos exercícios! Iniciando seed completo...\n');
      console.log('⏱️  Isso pode demorar 5-10 minutos...\n');
      
      // Executar seed - cwd é a raiz do backend
      const projectRoot = path.resolve(__dirname, '..');
      console.log(`📁 Executando seed em: ${projectRoot}\n`);
      
      // Usar o comando de produção que executa o arquivo compilado
      execSync('npm run seed:exercises:api:prod', { 
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      // Verificar resultado
      const newCount = await prisma.exercise.count();
      console.log(`\n✅ Seed concluído! Total de exercícios: ${newCount}`);
      
      if (newCount > 1000) {
        console.log('🎉 Banco populado com sucesso!');
      } else {
        console.log(`⚠️  Atenção: Esperado 1300+ exercícios, mas obteve ${newCount}`);
      }
    } else {
      console.log(`\n✅ Banco já possui ${exerciseCount} exercícios. Seed não necessário.`);
      console.log('💡 Para atualizar exercícios, execute: npm run seed:exercises:api:prod\n');
    }

  } catch (error) {
    console.error('❌ Erro no post-build:', error);
    // Não falhar o deploy se o seed falhar
    console.log('\n⚠️  Seed falhou, mas o deploy continuará.');
    console.log('💡 Você pode executar manualmente: npm run seed:exercises:api:prod\n');
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
