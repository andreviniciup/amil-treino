import prisma from '../config/database';
import cacheService from './cacheService';

interface ExerciseCategory {
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface MultiModalExercise {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // em minutos
  equipment?: string[];
  instructions: string[];
  benefits: string[];
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}

class MultiModalExerciseService {
  private readonly CATEGORIES: ExerciseCategory[] = [
    {
      name: 'Musculação',
      description: 'Exercícios com pesos e resistência',
      color: '#FF6B6B',
      icon: '💪'
    },
    {
      name: 'Cardio',
      description: 'Exercícios aeróbicos e de resistência',
      color: '#4ECDC4',
      icon: '❤️'
    },
    {
      name: 'Yoga',
      description: 'Práticas de flexibilidade e mindfulness',
      color: '#45B7D1',
      icon: '🧘'
    },
    {
      name: 'Pilates',
      description: 'Fortalecimento do core e postura',
      color: '#96CEB4',
      icon: '🤸'
    },
    {
      name: 'Abdominal',
      description: 'Exercícios específicos para o core e abdômen',
      color: '#FFEAA7',
      icon: '🔥'
    },
    {
      name: 'Corrida',
      description: 'Exercícios de corrida e corrida no lugar',
      color: '#DDA0DD',
      icon: '🏃'
    }
  ];

  /**
   * Busca exercícios por categoria
   */
  async getExercisesByCategory(category: string): Promise<MultiModalExercise[]> {
    try {
      console.log(`🔍 Fetching ${category} exercises...`);
      
      // Verificar cache primeiro
      const cacheKey = `category:${category}`;
      const cached = cacheService.getExerciseList(cacheKey);
      if (cached) {
        console.log(`🚀 Found ${cached.length} ${category} exercises in cache`);
        return cached;
      }

      let exercises: MultiModalExercise[] = [];

      switch (category.toLowerCase()) {
        case 'musculação':
        case 'musculacao':
        case 'strength':
          exercises = await this.getStrengthExercises();
          break;
        case 'cardio':
        case 'cardiovascular':
          exercises = await this.getCardioExercises();
          break;
        case 'yoga':
          exercises = await this.getYogaExercises();
          break;
        case 'pilates':
          exercises = await this.getPilatesExercises();
          break;
        case 'abdominal':
        case 'abs':
        case 'core':
          exercises = await this.getAbdominalExercises();
          break;
        case 'corrida':
        case 'running':
        case 'run':
          exercises = await this.getRunningExercises();
          break;
        default:
          exercises = await this.getAllModalExercises();
      }

      // Salvar no cache
      cacheService.setExerciseList(cacheKey, exercises);
      
      return exercises;
    } catch (error) {
      console.error(`Error fetching ${category} exercises:`, error);
      return [];
    }
  }



  /**
   * Exercícios de musculação (usando API existente)
   */
  private async getStrengthExercises(): Promise<MultiModalExercise[]> {
    try {
      // Usar a API existente do ExerciseDB
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch strength exercises');
      }

      const data = await response.json() as any[];
      
      return data.slice(0, 20).map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description || 'Exercício de musculação',
        category: 'Musculação',
        subcategory: exercise.bodyPart || 'Geral',
        difficulty: exercise.difficulty || 'intermediate',
        duration: 10,
        equipment: [exercise.equipment],
        instructions: exercise.instructions || [],
        benefits: this.getStrengthBenefits(exercise.bodyPart),
        imageUrl: exercise.gifUrl,
        tags: [exercise.bodyPart, exercise.target, exercise.equipment].filter(Boolean)
      }));
    } catch (error) {
      console.error('Error fetching strength exercises:', error);
      return [];
    }
  }

  /**
   * Exercícios de cardio (dados mockados com base em conhecimento)
   */
  private async getCardioExercises(): Promise<MultiModalExercise[]> {
    return [
      {
        id: 'cardio-001',
        name: 'Burpees',
        description: 'Exercício completo que combina agachamento, flexão e salto',
        category: 'Cardio',
        subcategory: 'Alta Intensidade',
        difficulty: 'intermediate',
        duration: 30,
        equipment: [],
        instructions: [
          'Comece em pé',
          'Agache e coloque as mãos no chão',
          'Estenda as pernas para trás (posição de flexão)',
          'Faça uma flexão',
          'Volte à posição de agachamento',
          'Salte para cima com os braços estendidos',
          'Repita o movimento'
        ],
        benefits: ['Queima de gordura', 'Melhora cardiovascular', 'Fortalecimento total'],
        tags: ['alta intensidade', 'funcional', 'queima gordura']
      },
      {
        id: 'cardio-002',
        name: 'Jumping Jacks',
        description: 'Exercício clássico de aquecimento e cardio',
        category: 'Cardio',
        subcategory: 'Baixa Intensidade',
        difficulty: 'beginner',
        duration: 20,
        equipment: [],
        instructions: [
          'Fique em pé com os pés juntos',
          'Salte abrindo as pernas e levantando os braços',
          'Volte à posição inicial',
          'Repita o movimento ritmicamente'
        ],
        benefits: ['Aquecimento', 'Coordenação', 'Resistência'],
        tags: ['aquecimento', 'coordenacao', 'resistencia']
      },
      {
        id: 'cardio-003',
        name: 'Mountain Climbers',
        description: 'Exercício de alta intensidade para o core e cardio',
        category: 'Cardio',
        subcategory: 'Alta Intensidade',
        difficulty: 'intermediate',
        duration: 45,
        equipment: [],
        instructions: [
          'Comece na posição de flexão',
          'Mantenha o core contraído',
          'Traga um joelho em direção ao peito',
          'Volte à posição inicial',
          'Repita com a outra perna',
          'Mantenha o ritmo constante'
        ],
        benefits: ['Core forte', 'Cardio intenso', 'Coordenação'],
        tags: ['core', 'alta intensidade', 'coordenacao']
      }
    ];
  }

  /**
   * Exercícios de yoga (dados mockados)
   */
  private async getYogaExercises(): Promise<MultiModalExercise[]> {
    return [
      {
        id: 'yoga-001',
        name: 'Saudação ao Sol',
        description: 'Sequência clássica de yoga para aquecimento',
        category: 'Yoga',
        subcategory: 'Vinyasa',
        difficulty: 'beginner',
        duration: 10,
        equipment: ['Tapete de yoga'],
        instructions: [
          'Fique em pé com os pés juntos',
          'Inspire e levante os braços',
          'Expire e dobre para frente',
          'Inspire e olhe para frente',
          'Expire e pule para trás (chaturanga)',
          'Inspire e abra o peito (cobra)',
          'Expire e volte à posição inicial'
        ],
        benefits: ['Flexibilidade', 'Força', 'Respiração', 'Concentração'],
        tags: ['flexibilidade', 'respiração', 'concentração']
      },
      {
        id: 'yoga-002',
        name: 'Pose da Criança',
        description: 'Pose de relaxamento e alongamento',
        category: 'Yoga',
        subcategory: 'Restaurativa',
        difficulty: 'beginner',
        duration: 5,
        equipment: ['Tapete de yoga'],
        instructions: [
          'Ajoelhe-se no chão',
          'Sente-se sobre os calcanhares',
          'Dobre para frente com os braços estendidos',
          'Descanse a testa no chão',
          'Respire profundamente',
          'Mantenha a pose por alguns minutos'
        ],
        benefits: ['Relaxamento', 'Alongamento da coluna', 'Alívio do estresse'],
        tags: ['relaxamento', 'alongamento', 'meditação']
      }
    ];
  }

  /**
   * Exercícios de pilates (dados mockados)
   */
  private async getPilatesExercises(): Promise<MultiModalExercise[]> {
    return [
      {
        id: 'pilates-001',
        name: 'Hundred',
        description: 'Exercício clássico de pilates para o core',
        category: 'Pilates',
        subcategory: 'Core',
        difficulty: 'intermediate',
        duration: 3,
        equipment: ['Tapete de pilates'],
        instructions: [
          'Deite-se de costas',
          'Levante as pernas em 90 graus',
          'Levante a cabeça e os ombros',
          'Estenda os braços ao lado do corpo',
          'Bombe os braços para cima e para baixo',
          'Respire profundamente',
          'Conte até 100'
        ],
        benefits: ['Core forte', 'Respiração', 'Concentração'],
        tags: ['core', 'respiração', 'concentração']
      }
    ];
  }

  /**
   * Exercícios de abdominal (dados mockados)
   */
  private async getAbdominalExercises(): Promise<MultiModalExercise[]> {
    return [
      {
        id: 'abs-001',
        name: 'Abdominal Crunch',
        description: 'Exercício clássico para fortalecer o abdômen',
        category: 'Abdominal',
        subcategory: 'Superior',
        difficulty: 'beginner',
        duration: 3,
        equipment: ['Tapete'],
        instructions: [
          'Deite-se de costas com os joelhos flexionados',
          'Coloque as mãos atrás da cabeça',
          'Levante os ombros do chão',
          'Contraia o abdômen',
          'Volte à posição inicial',
          'Repita o movimento'
        ],
        benefits: ['Fortalecimento do abdômen', 'Core forte', 'Postura'],
        tags: ['abdômen', 'core', 'postura']
      },
      {
        id: 'abs-002',
        name: 'Prancha',
        description: 'Exercício isométrico para o core completo',
        category: 'Abdominal',
        subcategory: 'Isométrico',
        difficulty: 'intermediate',
        duration: 1,
        equipment: ['Tapete'],
        instructions: [
          'Deite-se de bruços',
          'Apoie-se nos antebraços e pontas dos pés',
          'Mantenha o corpo reto',
          'Contraia o abdômen',
          'Mantenha a posição',
          'Respire normalmente'
        ],
        benefits: ['Core completo', 'Estabilidade', 'Força isométrica'],
        tags: ['core', 'estabilidade', 'isométrico']
      },
      {
        id: 'abs-003',
        name: 'Mountain Climbers',
        description: 'Exercício dinâmico para abdômen e cardio',
        category: 'Abdominal',
        subcategory: 'Dinâmico',
        difficulty: 'intermediate',
        duration: 1,
        equipment: [],
        instructions: [
          'Comece na posição de flexão',
          'Mantenha o core contraído',
          'Traga um joelho em direção ao peito',
          'Volte à posição inicial',
          'Repita com a outra perna',
          'Mantenha o ritmo constante'
        ],
        benefits: ['Core dinâmico', 'Cardio', 'Coordenação'],
        tags: ['core', 'cardio', 'dinâmico']
      },
      {
        id: 'abs-004',
        name: 'Russian Twists',
        description: 'Exercício para oblíquos e rotação do tronco',
        category: 'Abdominal',
        subcategory: 'Oblíquos',
        difficulty: 'intermediate',
        duration: 2,
        equipment: ['Peso opcional'],
        instructions: [
          'Sente-se com os joelhos flexionados',
          'Incline-se levemente para trás',
          'Gire o tronco para um lado',
          'Volte ao centro',
          'Gire para o outro lado',
          'Mantenha o abdômen contraído'
        ],
        benefits: ['Oblíquos fortes', 'Rotação', 'Estabilidade'],
        tags: ['oblíquos', 'rotação', 'estabilidade']
      }
    ];
  }

  /**
   * Exercícios de corrida (dados mockados)
   */
  private async getRunningExercises(): Promise<MultiModalExercise[]> {
    return [
      {
        id: 'run-001',
        name: 'Corrida no Lugar',
        description: 'Exercício de corrida sem sair do lugar',
        category: 'Corrida',
        subcategory: 'No Lugar',
        difficulty: 'beginner',
        duration: 5,
        equipment: [],
        instructions: [
          'Fique em pé com os pés na largura dos ombros',
          'Comece a correr no lugar',
          'Levante os joelhos alternadamente',
          'Mantenha o ritmo constante',
          'Bombe os braços naturalmente',
          'Mantenha a postura ereta'
        ],
        benefits: ['Cardio', 'Aquecimento', 'Coordenação'],
        tags: ['cardio', 'aquecimento', 'coordenacao']
      },
      {
        id: 'run-002',
        name: 'High Knees',
        description: 'Corrida no lugar com joelhos altos',
        category: 'Corrida',
        subcategory: 'Alta Intensidade',
        difficulty: 'intermediate',
        duration: 3,
        equipment: [],
        instructions: [
          'Fique em pé com os pés na largura dos ombros',
          'Comece a correr no lugar',
          'Levante os joelhos até a altura do quadril',
          'Mantenha o ritmo rápido',
          'Bombe os braços vigorosamente',
          'Mantenha o core contraído'
        ],
        benefits: ['Cardio intenso', 'Força das pernas', 'Coordenação'],
        tags: ['cardio intenso', 'pernas', 'coordenacao']
      },
      {
        id: 'run-003',
        name: 'Butt Kicks',
        description: 'Corrida no lugar tocando os calcanhares no glúteo',
        category: 'Corrida',
        subcategory: 'Aquecimento',
        difficulty: 'beginner',
        duration: 3,
        equipment: [],
        instructions: [
          'Fique em pé com os pés na largura dos ombros',
          'Comece a correr no lugar',
          'Toque os calcanhares no glúteo',
          'Mantenha o ritmo constante',
          'Bombe os braços naturalmente',
          'Mantenha a postura ereta'
        ],
        benefits: ['Aquecimento', 'Flexibilidade', 'Coordenação'],
        tags: ['aquecimento', 'flexibilidade', 'coordenacao']
      },
      {
        id: 'run-004',
        name: 'Sprint no Lugar',
        description: 'Corrida de alta velocidade no lugar',
        category: 'Corrida',
        subcategory: 'Sprint',
        difficulty: 'advanced',
        duration: 1,
        equipment: [],
        instructions: [
          'Fique em pé com os pés na largura dos ombros',
          'Comece a correr no lugar em velocidade máxima',
          'Levante os joelhos rapidamente',
          'Bombe os braços vigorosamente',
          'Mantenha o ritmo máximo',
          'Mantenha o core contraído'
        ],
        benefits: ['Cardio máximo', 'Força explosiva', 'Resistência'],
        tags: ['cardio maximo', 'explosivo', 'resistencia']
      }
    ];
  }

  /**
   * Todos os exercícios de todas as modalidades
   */
  private async getAllModalExercises(): Promise<MultiModalExercise[]> {
    const allExercises = [
      ...await this.getStrengthExercises(),
      ...await this.getCardioExercises(),
      ...await this.getYogaExercises(),
      ...await this.getPilatesExercises(),
      ...await this.getAbdominalExercises(),
      ...await this.getRunningExercises()
    ];

    return allExercises;
  }


  /**
   * Obter benefícios específicos para musculação
   */
  private getStrengthBenefits(bodyPart: string): string[] {
    const benefitsMap: Record<string, string[]> = {
      'chest': ['Fortalecimento do peito', 'Melhora da postura', 'Força superior'],
      'back': ['Fortalecimento das costas', 'Melhora da postura', 'Prevenção de dores'],
      'legs': ['Fortalecimento das pernas', 'Melhora do equilíbrio', 'Força inferior'],
      'arms': ['Fortalecimento dos braços', 'Melhora da coordenação', 'Força dos membros superiores'],
      'core': ['Fortalecimento do core', 'Melhora da estabilidade', 'Prevenção de lesões']
    };

    return benefitsMap[bodyPart?.toLowerCase()] || ['Fortalecimento geral', 'Melhora da força', 'Bem-estar físico'];
  }

  /**
   * Obter todas as categorias disponíveis
   */
  getCategories(): ExerciseCategory[] {
    return this.CATEGORIES;
  }

  /**
   * Buscar exercícios por tags
   */
  async getExercisesByTags(tags: string[]): Promise<MultiModalExercise[]> {
    try {
      const allExercises = await this.getAllModalExercises();
      
      return allExercises.filter(exercise => 
        tags.some(tag => 
          exercise.tags.some(exerciseTag => 
            exerciseTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    } catch (error) {
      console.error('Error fetching exercises by tags:', error);
      return [];
    }
  }

  /**
   * Buscar exercícios por dificuldade
   */
  async getExercisesByDifficulty(difficulty: string): Promise<MultiModalExercise[]> {
    try {
      const allExercises = await this.getAllModalExercises();
      
      return allExercises.filter(exercise => 
        exercise.difficulty === difficulty
      );
    } catch (error) {
      console.error('Error fetching exercises by difficulty:', error);
      return [];
    }
  }
}

export default new MultiModalExerciseService();
