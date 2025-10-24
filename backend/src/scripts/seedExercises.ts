import prisma from '../config/database';

// Exercícios básicos para popular o banco interno
const basicExercises = [
  // Peito
  {
    name: 'Supino Reto',
    bodyPart: 'chest',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'pectorals',
    secondaryMuscles: ['anterior deltoid', 'triceps'],
    instructions: [
      'Deite-se no banco com os pés firmes no chão',
      'Segure a barra com pegada ligeiramente mais larga que os ombros',
      'Desça a barra até o peito com controle',
      'Empurre a barra para cima até a posição inicial'
    ],
    source: 'internal'
  },
  {
    name: 'Supino Inclinado',
    bodyPart: 'chest',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'upper chest',
    secondaryMuscles: ['anterior deltoid', 'triceps'],
    instructions: [
      'Ajuste o banco em 30-45 graus',
      'Deite-se com os pés firmes no chão',
      'Segure a barra com pegada ligeiramente mais larga que os ombros',
      'Desça a barra até o peito superior',
      'Empurre a barra para cima até a posição inicial'
    ],
    source: 'internal'
  },
  {
    name: 'Flexão de Braço',
    bodyPart: 'chest',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'pectorals',
    secondaryMuscles: ['anterior deltoid', 'triceps', 'core'],
    instructions: [
      'Posicione-se em prancha com as mãos ligeiramente mais largas que os ombros',
      'Mantenha o corpo em linha reta',
      'Desça o corpo até o peito quase tocar o chão',
      'Empurre para cima até a posição inicial'
    ],
    source: 'internal'
  },

  // Costas
  {
    name: 'Puxada Frontal',
    bodyPart: 'back',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'lats',
    secondaryMuscles: ['rhomboids', 'middle trapezius', 'biceps'],
    instructions: [
      'Sente-se na máquina com os joelhos fixos',
      'Segure a barra com pegada mais larga que os ombros',
      'Puxe a barra em direção ao peito',
      'Contraia as costas na parte inferior',
      'Retorne lentamente à posição inicial'
    ],
    source: 'internal'
  },
  {
    name: 'Remada Curvada',
    bodyPart: 'back',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'rhomboids',
    secondaryMuscles: ['lats', 'middle trapezius', 'biceps'],
    instructions: [
      'Segure a barra com pegada ligeiramente mais larga que os ombros',
      'Dobre os joelhos e incline o tronco para frente',
      'Mantenha as costas retas',
      'Puxe a barra em direção ao abdômen',
      'Contraia as costas na parte superior',
      'Retorne lentamente à posição inicial'
    ],
    source: 'internal'
  },

  // Pernas
  {
    name: 'Agachamento',
    bodyPart: 'upper legs',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
    instructions: [
      'Posicione a barra sobre os ombros',
      'Pés na largura dos ombros',
      'Desça como se fosse sentar em uma cadeira',
      'Mantenha os joelhos alinhados com os pés',
      'Desça até as coxas ficarem paralelas ao chão',
      'Empurre pelos calcanhares para subir'
    ],
    source: 'internal'
  },
  {
    name: 'Leg Press',
    bodyPart: 'upper legs',
    equipment: 'machine',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    instructions: [
      'Sente-se na máquina com as costas apoiadas',
      'Posicione os pés na plataforma na largura dos ombros',
      'Desça a plataforma até as coxas ficarem paralelas',
      'Empurre a plataforma para cima',
      'Mantenha os joelhos alinhados com os pés'
    ],
    source: 'internal'
  },
  {
    name: 'Stiff',
    bodyPart: 'upper legs',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower back'],
    instructions: [
      'Segure a barra com pegada na largura dos ombros',
      'Mantenha as pernas ligeiramente flexionadas',
      'Dobre o tronco para frente mantendo as costas retas',
      'Desça até sentir alongamento nos posteriores',
      'Retorne à posição inicial contraindo os glúteos'
    ],
    source: 'internal'
  },

  // Ombros
  {
    name: 'Desenvolvimento',
    bodyPart: 'shoulders',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'anterior deltoid',
    secondaryMuscles: ['lateral deltoid', 'triceps'],
    instructions: [
      'Sente-se no banco com as costas apoiadas',
      'Segure a barra na altura dos ombros',
      'Empurre a barra para cima até os braços ficarem estendidos',
      'Desça a barra lentamente até os ombros',
      'Mantenha o core contraído'
    ],
    source: 'internal'
  },
  {
    name: 'Elevação Lateral',
    bodyPart: 'shoulders',
    equipment: 'dumbbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'lateral deltoid',
    secondaryMuscles: ['anterior deltoid'],
    instructions: [
      'Segure halteres ao lado do corpo',
      'Mantenha os braços ligeiramente flexionados',
      'Eleve os halteres lateralmente até a altura dos ombros',
      'Desça lentamente até a posição inicial',
      'Mantenha o controle durante todo o movimento'
    ],
    source: 'internal'
  },

  // Braços
  {
    name: 'Rosca Bíceps',
    bodyPart: 'upper arms',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'biceps',
    secondaryMuscles: ['forearms'],
    instructions: [
      'Segure a barra com pegada na largura dos ombros',
      'Mantenha os cotovelos próximos ao corpo',
      'Flexione os braços elevando a barra',
      'Contraia os bíceps na parte superior',
      'Desça lentamente até a posição inicial'
    ],
    source: 'internal'
  },
  {
    name: 'Tríceps Pulley',
    bodyPart: 'upper arms',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'triceps',
    secondaryMuscles: ['forearms'],
    instructions: [
      'Segure a barra com pegada fechada',
      'Mantenha os cotovelos próximos ao corpo',
      'Estenda os braços para baixo',
      'Contraia os tríceps na parte inferior',
      'Retorne lentamente à posição inicial'
    ],
    source: 'internal'
  },

  // Core
  {
    name: 'Prancha',
    bodyPart: 'waist',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'core',
    secondaryMuscles: ['shoulders', 'glutes'],
    instructions: [
      'Posicione-se em prancha com antebraços no chão',
      'Mantenha o corpo em linha reta',
      'Contraia o core e mantenha a posição',
      'Respire normalmente',
      'Mantenha os quadris alinhados'
    ],
    source: 'internal'
  },
  {
    name: 'Abdominal Crunch',
    bodyPart: 'waist',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'abs',
    secondaryMuscles: ['obliques'],
    instructions: [
      'Deite-se de costas com joelhos flexionados',
      'Coloque as mãos atrás da cabeça',
      'Contraia o abdômen elevando o tronco',
      'Mantenha o pescoço relaxado',
      'Desça lentamente à posição inicial'
    ],
    source: 'internal'
  },

  // Cardio
  {
    name: 'Burpee',
    bodyPart: 'cardio',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'full body',
    secondaryMuscles: ['chest', 'shoulders', 'legs'],
    instructions: [
      'Comece em pé',
      'Agache e coloque as mãos no chão',
      'Salte os pés para trás em prancha',
      'Faça uma flexão',
      'Salte os pés de volta',
      'Salte para cima com os braços estendidos'
    ],
    source: 'internal'
  },
  {
    name: 'Mountain Climber',
    bodyPart: 'cardio',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/0gJjYH1V-s7iQr',
    target: 'full body',
    secondaryMuscles: ['core', 'shoulders', 'legs'],
    instructions: [
      'Posicione-se em prancha',
      'Mantenha o core contraído',
      'Alternadamente, traga os joelhos em direção ao peito',
      'Mantenha o ritmo constante',
      'Mantenha os quadris estáveis'
    ],
    source: 'internal'
  }
];

async function seedExercises() {
  try {
    console.log('🌱 Starting exercise seed...');

    // Limpar exercícios internos existentes
    await prisma.exercise.deleteMany({
      where: { source: 'internal' }
    });

    console.log('🧹 Cleaned existing internal exercises');

    // Inserir exercícios básicos
    for (const exercise of basicExercises) {
      await prisma.exercise.create({
        data: {
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          equipment: exercise.equipment,
          gifUrl: exercise.gifUrl,
          target: exercise.target,
          secondaryMuscles: JSON.stringify(exercise.secondaryMuscles),
          instructions: JSON.stringify(exercise.instructions),
          source: exercise.source
        }
      });
    }

    console.log(`✅ Successfully seeded ${basicExercises.length} basic exercises`);

    // Mostrar estatísticas
    const stats = await prisma.exercise.groupBy({
      by: ['bodyPart'],
      _count: { bodyPart: true }
    });

    console.log('\n📊 Exercise distribution:');
    stats.forEach(stat => {
      console.log(`  ${stat.bodyPart}: ${stat._count.bodyPart} exercises`);
    });

    const total = await prisma.exercise.count();
    console.log(`\n🎯 Total exercises in database: ${total}`);

  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log('🎉 Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

export default seedExercises;





