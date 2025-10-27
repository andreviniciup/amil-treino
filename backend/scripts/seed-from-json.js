const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

// Mapeamentos
const MUSCLE_MAPPING = {
  'peito': 'Peito',
  'dorsais': 'Costas',
  'meio-das-costas': 'Costas',
  'inferior-das-costas': 'Lombar',
  'ombros': 'Ombros',
  'biceps': 'Bíceps',
  'triceps': 'Tríceps',
  'antebracos': 'Antebraços',
  'quadriceps': 'Quadríceps',
  'isquiotibiais': 'Posteriores de Coxa',
  'panturrilhas': 'Panturrilhas',
  'gluteos': 'Glúteos',
  'abdominais': 'Abdômen',
  'abdutores': 'Abdutores',
  'adutores': 'Adutores',
  'trapezio': 'Trapézio'
};

const EQUIPMENT_MAPPING = {
  'barra': 'Barra',
  'halteres': 'Halteres',
  'peso-do-corpo': 'Peso Corporal',
  'cabo': 'Cabo/Polia',
  'maquina': 'Máquina',
  'bola-de-exercicio': 'Bola de Exercício',
  'bola-medicinal': 'Bola Medicinal',
  'outros': 'Outros',
  'kettlebell': 'Kettlebell'
};

async function seedFromJSON() {
  try {
    console.log('\n=== SEED DO BANCO DE DADOS OPEN SOURCE ===\n');

    // Conectar
    await prisma.$connect();
    console.log('Conectado ao banco!\n');

    // Contar exercícios atuais
    const currentCount = await prisma.exercise.count();
    console.log('Exercícios atuais:', currentCount, '\n');

    // Ler JSON
    const jsonPath = path.resolve(__dirname, '../temp-exercicios/exercises/exercises-ptbr-full-translation.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const exercises = JSON.parse(jsonData); // É um array direto, não tem .exercises
    
    console.log('Exercícios no arquivo:', exercises.length, '\n');

    // LIMPAR TODO O BANCO
    console.log('Limpando TODOS os exercícios do banco...\n');
    const deleted = await prisma.exercise.deleteMany({});
    console.log('Exercícios removidos:', deleted.count, '\n');

    // Inserir
    console.log('Inserindo exercícios...\n');
    
    let inserted = 0;
    let failed = 0;

    for (const ex of exercises) {
      try {
        // Pegar primeiro músculo primário como bodyPart
        const primaryMuscle = (ex.primaryMuscles && ex.primaryMuscles[0]) || 'outros';
        const bodyPart = MUSCLE_MAPPING[primaryMuscle] || primaryMuscle || 'Outros';
        
        // Mapear equipamento
        const equipment = EQUIPMENT_MAPPING[ex.equipment] || ex.equipment || 'Outros';
        
        // URL da imagem do GitHub
        const gifUrl = (ex.images && ex.images.length > 0)
          ? 'https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/' + ex.images[0]
          : null;
        
        // Mapear músculos secundários
        const secondaryMuscles = (ex.secondaryMuscles && ex.secondaryMuscles.length > 0)
          ? ex.secondaryMuscles.map(m => MUSCLE_MAPPING[m] || m)
          : [];

        await prisma.exercise.create({
          data: {
            externalId: ex.id,
            name: ex.name,
            bodyPart: bodyPart,
            equipment: equipment,
            gifUrl: gifUrl,
            target: MUSCLE_MAPPING[primaryMuscle] || primaryMuscle,
            secondaryMuscles: JSON.stringify(secondaryMuscles),
            instructions: JSON.stringify(ex.instructions || []),
            source: 'open-source'
          }
        });
        
        inserted++;

        if (inserted % 100 === 0) {
          console.log('  Progresso:', inserted, '/', exercises.length);
        }

      } catch (error) {
        failed++;
        if (failed <= 5) {
          console.error('  Erro ao inserir', ex.name, ':', error.message);
        }
      }
    }

    // Resultado
    const finalCount = await prisma.exercise.count();
    
    console.log('\n' + '='.repeat(50));
    console.log('SEED CONCLUÍDO!');
    console.log('='.repeat(50));
    console.log('Inseridos:', inserted);
    console.log('Falhas:', failed);
    console.log('Total no banco:', finalCount);
    console.log('='.repeat(50) + '\n');

    // Estatísticas
    const byBodyPart = await prisma.exercise.groupBy({
      by: ['bodyPart'],
      _count: true
    });

    console.log('Exercícios por bodyPart:\n');
    byBodyPart.forEach(bp => {
      console.log('  -', bp.bodyPart + ':', bp._count);
    });

  } catch (error) {
    console.error('\nERRO:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFromJSON()
  .then(() => {
    console.log('\nScript finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
