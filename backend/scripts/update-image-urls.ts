import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    console.log('🔄 Iniciando atualização das URLs das imagens...');

    // Atualizar todas as URLs dos exercícios para usar o CDN do repositório amil-treino-images
    const result = await prisma.$executeRaw`
      UPDATE "Exercise"
      SET "gifUrl" = REPLACE(
        "gifUrl",
        'https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/',
        'https://cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images@main/exercises/'
      )
      WHERE "gifUrl" LIKE 'https://raw.githubusercontent.com/joao-gugel%'
    `;

    console.log(`✅ ${result} exercícios atualizados com sucesso!`);

    // Verificar algumas URLs atualizadas
    const samplesUpdated = await prisma.exercise.findMany({
      where: {
        gifUrl: {
          contains: 'cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images'
        }
      },
      select: {
        id: true,
        name: true,
        gifUrl: true
      },
      take: 5
    });

    console.log('\n📋 Exemplos de URLs atualizadas:');
    samplesUpdated.forEach(ex => {
      console.log(`  - ${ex.name}: ${ex.gifUrl}`);
    });

    // Verificar se ainda existem URLs antigas
    const oldUrlsCount = await prisma.exercise.count({
      where: {
        gifUrl: {
          contains: 'raw.githubusercontent.com/joao-gugel'
        }
      }
    });

    if (oldUrlsCount > 0) {
      console.log(`\n⚠️  Ainda existem ${oldUrlsCount} exercícios com URLs antigas`);
    } else {
      console.log('\n✅ Todas as URLs foram atualizadas com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar URLs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
updateImageUrls()
  .then(() => {
    console.log('\n🎉 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na execução:', error);
    process.exit(1);
  });
