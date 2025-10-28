import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImageUrls() {
  try {
    console.log('🔍 Verificando URLs das imagens no banco de dados...\n');

    // Verificar total de exercícios
    const totalExercises = await prisma.exercise.count();
    console.log(`📊 Total de exercícios: ${totalExercises}`);

    // Verificar exercícios com URL do GitHub original
    const oldUrls = await prisma.exercise.count({
      where: {
        gifUrl: {
          contains: 'raw.githubusercontent.com/yuhonas'
        }
      }
    });
    console.log(`🔗 Exercícios com URL antiga (GitHub yuhonas): ${oldUrls}`);

    // Verificar exercícios com URL do CDN
    const cdnUrls = await prisma.exercise.count({
      where: {
        gifUrl: {
          contains: 'cdn.jsdelivr.net/gh/andreviniciup'
        }
      }
    });
    console.log(`⚡ Exercícios com URL do CDN (jsDelivr): ${cdnUrls}`);

    // Mostrar exemplos de URLs atuais
    console.log('\n📋 Exemplos de URLs no banco:');
    const samples = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        gifUrl: true
      },
      take: 5
    });

    samples.forEach((ex: any) => {
      console.log(`\n  ID: ${ex.id}`);
      console.log(`  Nome: ${ex.name}`);
      console.log(`  URL: ${ex.gifUrl}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImageUrls();
