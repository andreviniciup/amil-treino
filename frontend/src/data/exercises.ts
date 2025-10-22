export interface Exercise {
  id: string;
  name: string;
  category: 'musculacao' | 'cardio' | 'yoga' | 'mobilidade' | 'crossfit' | 'pilates' | 'natacao' | 'lutas';
  muscleGroup?: string;
  equipment?: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  description?: string;
}

export const exercisesDatabase: Exercise[] = [
  // MUSCULAÇÃO - PEITO
  { id: 'supino-reto', name: 'Supino Reto', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'supino-inclinado', name: 'Supino Inclinado', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'supino-declinado', name: 'Supino Declinado', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'supino-halteres', name: 'Supino com Halteres', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 'intermediario' },
  { id: 'crucifixo', name: 'Crucifixo', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'peck-deck', name: 'Peck Deck', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'flexao', name: 'Flexão de Braço', category: 'musculacao', muscleGroup: 'Peito', equipment: 'Peso Corporal', difficulty: 'iniciante' },

  // MUSCULAÇÃO - COSTAS
  { id: 'barra-fixa', name: 'Barra Fixa', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'remada-curvada', name: 'Remada Curvada', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'remada-cavalinho', name: 'Remada Cavalinho', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'pulldown', name: 'Pulldown', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'remada-unilateral', name: 'Remada Unilateral', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Halteres', difficulty: 'intermediario' },
  { id: 'levantamento-terra', name: 'Levantamento Terra', category: 'musculacao', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 'avancado' },

  // MUSCULAÇÃO - PERNAS
  { id: 'agachamento', name: 'Agachamento', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'leg-press', name: 'Leg Press', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'agachamento-bulgaro', name: 'Agachamento Búlgaro', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Halteres', difficulty: 'intermediario' },
  { id: 'extensao-pernas', name: 'Extensão de Pernas', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'flexao-pernas', name: 'Flexão de Pernas', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'afundo', name: 'Afundo', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'panturrilha-em-pe', name: 'Panturrilha em Pé', category: 'musculacao', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'iniciante' },

  // MUSCULAÇÃO - OMBROS
  { id: 'desenvolvimento-militar', name: 'Desenvolvimento Militar', category: 'musculacao', muscleGroup: 'Ombros', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'desenvolvimento-halteres', name: 'Desenvolvimento com Halteres', category: 'musculacao', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'intermediario' },
  { id: 'elevacao-lateral', name: 'Elevação Lateral', category: 'musculacao', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'elevacao-frontal', name: 'Elevação Frontal', category: 'musculacao', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'crucifixo-invertido', name: 'Crucifixo Invertido', category: 'musculacao', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'intermediario' },

  // MUSCULAÇÃO - BRAÇOS
  { id: 'rosca-direta', name: 'Rosca Direta', category: 'musculacao', muscleGroup: 'Bíceps', equipment: 'Barra', difficulty: 'iniciante' },
  { id: 'rosca-alternada', name: 'Rosca Alternada', category: 'musculacao', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'rosca-martelo', name: 'Rosca Martelo', category: 'musculacao', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 'iniciante' },
  { id: 'triceps-testa', name: 'Tríceps Testa', category: 'musculacao', muscleGroup: 'Tríceps', equipment: 'Barra', difficulty: 'intermediario' },
  { id: 'triceps-corda', name: 'Tríceps na Corda', category: 'musculacao', muscleGroup: 'Tríceps', equipment: 'Máquina', difficulty: 'iniciante' },
  { id: 'mergulho', name: 'Mergulho', category: 'musculacao', muscleGroup: 'Tríceps', equipment: 'Peso Corporal', difficulty: 'intermediario' },

  // CARDIO
  { id: 'corrida', name: 'Corrida', category: 'cardio', equipment: 'Esteira', difficulty: 'iniciante' },
  { id: 'caminhada', name: 'Caminhada', category: 'cardio', equipment: 'Esteira', difficulty: 'iniciante' },
  { id: 'ciclismo', name: 'Ciclismo', category: 'cardio', equipment: 'Bicicleta', difficulty: 'iniciante' },
  { id: 'eliptico', name: 'Elíptico', category: 'cardio', equipment: 'Elíptico', difficulty: 'iniciante' },
  { id: 'pular-corda', name: 'Pular Corda', category: 'cardio', equipment: 'Corda', difficulty: 'intermediario' },
  { id: 'hiit', name: 'HIIT', category: 'cardio', equipment: 'Peso Corporal', difficulty: 'avancado' },
  { id: 'escada', name: 'Subir Escada', category: 'cardio', equipment: 'Escada', difficulty: 'intermediario' },

  // YOGA
  { id: 'saudacao-sol', name: 'Saudação ao Sol', category: 'yoga', difficulty: 'iniciante' },
  { id: 'postura-cachorro', name: 'Cachorro Olhando para Baixo', category: 'yoga', difficulty: 'iniciante' },
  { id: 'postura-guerreiro', name: 'Guerreiro I', category: 'yoga', difficulty: 'iniciante' },
  { id: 'postura-arvore', name: 'Postura da Árvore', category: 'yoga', difficulty: 'iniciante' },
  { id: 'postura-crianca', name: 'Postura da Criança', category: 'yoga', difficulty: 'iniciante' },
  { id: 'pranayama', name: 'Pranayama (Respiração)', category: 'yoga', difficulty: 'iniciante' },
  { id: 'meditacao', name: 'Meditação', category: 'yoga', difficulty: 'iniciante' },

  // MOBILIDADE
  { id: 'alongamento-posterior', name: 'Alongamento Posterior', category: 'mobilidade', difficulty: 'iniciante' },
  { id: 'alongamento-quadriceps', name: 'Alongamento de Quadríceps', category: 'mobilidade', difficulty: 'iniciante' },
  { id: 'alongamento-peito', name: 'Alongamento de Peito', category: 'mobilidade', difficulty: 'iniciante' },
  { id: 'rolo-foam', name: 'Foam Roller', category: 'mobilidade', equipment: 'Rolo', difficulty: 'iniciante' },
  { id: 'mobilidade-quadril', name: 'Mobilidade de Quadril', category: 'mobilidade', difficulty: 'iniciante' },
  { id: 'mobilidade-ombro', name: 'Mobilidade de Ombro', category: 'mobilidade', difficulty: 'iniciante' },

  // CROSSFIT
  { id: 'burpee', name: 'Burpee', category: 'crossfit', equipment: 'Peso Corporal', difficulty: 'intermediario' },
  { id: 'thruster', name: 'Thruster', category: 'crossfit', equipment: 'Barra', difficulty: 'avancado' },
  { id: 'box-jump', name: 'Box Jump', category: 'crossfit', equipment: 'Caixa', difficulty: 'intermediario' },
  { id: 'wall-ball', name: 'Wall Ball', category: 'crossfit', equipment: 'Medicine Ball', difficulty: 'intermediario' },
  { id: 'kettlebell-swing', name: 'Kettlebell Swing', category: 'crossfit', equipment: 'Kettlebell', difficulty: 'intermediario' },
  { id: 'rope-climb', name: 'Subida na Corda', category: 'crossfit', equipment: 'Corda', difficulty: 'avancado' },

  // PILATES
  { id: 'hundred', name: 'The Hundred', category: 'pilates', equipment: 'Colchonete', difficulty: 'iniciante' },
  { id: 'roll-up', name: 'Roll Up', category: 'pilates', equipment: 'Colchonete', difficulty: 'intermediario' },
  { id: 'teaser', name: 'Teaser', category: 'pilates', equipment: 'Colchonete', difficulty: 'avancado' },
  { id: 'ponte', name: 'Ponte', category: 'pilates', equipment: 'Colchonete', difficulty: 'iniciante' },
  { id: 'prancha-lateral', name: 'Prancha Lateral', category: 'pilates', equipment: 'Colchonete', difficulty: 'intermediario' },

  // NATAÇÃO
  { id: 'nado-livre', name: 'Nado Livre (Crawl)', category: 'natacao', difficulty: 'iniciante' },
  { id: 'nado-costas', name: 'Nado de Costas', category: 'natacao', difficulty: 'iniciante' },
  { id: 'nado-peito', name: 'Nado de Peito', category: 'natacao', difficulty: 'iniciante' },
  { id: 'nado-borboleta', name: 'Nado Borboleta', category: 'natacao', difficulty: 'avancado' },

  // LUTAS
  { id: 'jab-direto', name: 'Jab e Direto', category: 'lutas', equipment: 'Saco de Pancadas', difficulty: 'iniciante' },
  { id: 'chute-alto', name: 'Chute Alto', category: 'lutas', equipment: 'Saco de Pancadas', difficulty: 'intermediario' },
  { id: 'shadowboxing', name: 'Shadowboxing', category: 'lutas', equipment: 'Peso Corporal', difficulty: 'iniciante' },
  { id: 'drills-defesa', name: 'Drills de Defesa', category: 'lutas', difficulty: 'intermediario' },
];

export function getExercisesByCategory(category: string): Exercise[] {
  return exercisesDatabase.filter(ex => ex.category === category);
}

export function getExercisesByMuscleGroup(category: string, muscleGroup: string): Exercise[] {
  return exercisesDatabase.filter(ex => ex.category === category && ex.muscleGroup === muscleGroup);
}

