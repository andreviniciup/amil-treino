const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestWorkoutLog() {
  try {
    console.log('Criando log de treino de teste...');
    
    // Buscar um usuário
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('Nenhum usuário encontrado');
      return;
    }
    
    console.log('Usuário encontrado:', user.email);
    
    // Buscar um plano de treino
    const plan = await prisma.workoutPlan.findFirst({
      where: { userId: user.id },
      include: { workouts: { include: { exercises: true } } }
    });
    
    if (!plan || !plan.workouts.length) {
      console.log('Nenhum plano de treino encontrado');
      return;
    }
    
    const workout = plan.workouts[0];
    console.log('Plano encontrado:', plan.name);
    console.log('Exercícios no treino:', workout.exercises.length);
    
    // Criar log de treino para hoje
    const today = new Date();
    const log = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        workoutId: workout.id,
        duration: 45, // 45 minutos
        notes: 'Treino de teste',
        completedAt: today,
        exercises: {
          create: workout.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: JSON.stringify([12, 12, 12]),
            weights: JSON.stringify([60, 65, 70]),
            completed: true
          }))
        }
      },
      include: {
        exercises: true
      }
    });
    
    console.log('✅ Log de treino criado com sucesso!');
    console.log('ID do log:', log.id);
    console.log('Data:', log.completedAt);
    console.log('Duração:', log.duration, 'minutos');
    console.log('Exercícios registrados:', log.exercises.length);
    
  } catch (error) {
    console.error('Erro ao criar log:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestWorkoutLog();
