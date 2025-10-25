const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCreateWorkout() {
  try {
    console.log('Testando criação de treino diretamente...');
    
    // Primeiro, verificar se existe um usuário
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    
    // Buscar um exercício válido
    const exercise = await prisma.exercise.findFirst({
      where: { bodyPart: 'peito' }
    });
    
    if (!exercise) {
      console.log('❌ Nenhum exercício encontrado');
      return;
    }
    
    console.log('✅ Exercício encontrado:', exercise.name, 'ID:', exercise.id);
    
    // Tentar criar o plano de treino
    const plan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        name: 'Treino Teste',
        description: 'Teste de criação',
        frequency: 2,
        trainingTypes: JSON.stringify(['Musculação']),
        workouts: {
          create: [
            {
              dayOfWeek: 'Segunda',
              trainingType: 'Musculação',
              exercises: {
                create: [
                  {
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    sets: 3,
                    reps: '8-12',
                    restTime: 90,
                    order: 1,
                    gifUrl: exercise.gifUrl,
                    bodyPart: exercise.bodyPart,
                    equipment: exercise.equipment,
                    target: exercise.target
                  }
                ]
              }
            },
            {
              dayOfWeek: 'Quarta',
              trainingType: 'Musculação',
              exercises: {
                create: [
                  {
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    sets: 3,
                    reps: '8-12',
                    restTime: 90,
                    order: 1,
                    gifUrl: exercise.gifUrl,
                    bodyPart: exercise.bodyPart,
                    equipment: exercise.equipment,
                    target: exercise.target
                  }
                ]
              }
            }
          ]
        }
      }
    });
    
    console.log('✅ Treino criado com sucesso! ID:', plan.id);
    
  } catch (error) {
    console.error('❌ Erro ao criar treino:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateWorkout();
