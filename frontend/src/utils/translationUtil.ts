/**
 * Utilitário de Tradução para Exercícios
 * 
 * Traduz nomes de exercícios, músculos, equipamentos e partes do corpo
 * do inglês para português
 */

export class TranslationUtil {
  // Mapeamento de partes do corpo
  private static readonly BODY_PARTS: Record<string, string> = {
    'back': 'Costas',
    'cardio': 'Cardio',
    'chest': 'Peito',
    'lower arms': 'Antebraços',
    'lower legs': 'Panturrilhas',
    'neck': 'Pescoço',
    'shoulders': 'Ombros',
    'upper arms': 'Bíceps/Tríceps',
    'upper legs': 'Coxas',
    'waist': 'Abdômen',
  };

  // Mapeamento de equipamentos
  private static readonly EQUIPMENT: Record<string, string> = {
    'assisted': 'Assistido',
    'band': 'Faixa Elástica',
    'barbell': 'Barra',
    'body weight': 'Peso Corporal',
    'bosu ball': 'Bola Bosu',
    'cable': 'Cabo/Polia',
    'dumbbell': 'Halter',
    'elliptical machine': 'Elíptico',
    'ez barbell': 'Barra EZ',
    'hammer': 'Martelo',
    'kettlebell': 'Kettlebell',
    'leverage machine': 'Máquina de Alavanca',
    'medicine ball': 'Bola Medicinal',
    'olympic barbell': 'Barra Olímpica',
    'resistance band': 'Faixa de Resistência',
    'roller': 'Rolo',
    'rope': 'Corda',
    'skierg machine': 'Máquina SkiErg',
    'sled machine': 'Trenó',
    'smith machine': 'Smith Machine',
    'stability ball': 'Bola Suíça',
    'stationary bike': 'Bicicleta Ergométrica',
    'stepmill machine': 'Escada Ergométrica',
    'tire': 'Pneu',
    'trap bar': 'Barra Trap',
    'upper body ergometer': 'Ergômetro Superior',
    'weighted': 'Com Peso',
    'wheel roller': 'Roda Abdominal',
  };

  // Mapeamento de músculos alvo
  private static readonly TARGET_MUSCLES: Record<string, string> = {
    'abs': 'Abdômen',
    'adductors': 'Adutores',
    'abductors': 'Abdutores',
    'biceps': 'Bíceps',
    'calves': 'Panturrilhas',
    'cardiovascular system': 'Sistema Cardiovascular',
    'delts': 'Deltoides',
    'forearms': 'Antebraços',
    'glutes': 'Glúteos',
    'hamstrings': 'Posteriores de Coxa',
    'lats': 'Dorsais',
    'levator scapulae': 'Levantador da Escápula',
    'pectorals': 'Peitorais',
    'quads': 'Quadríceps',
    'serratus anterior': 'Serrátil Anterior',
    'spine': 'Coluna',
    'traps': 'Trapézio',
    'triceps': 'Tríceps',
    'upper back': 'Costas Superior',
  };

  // Palavras comuns em nomes de exercícios
  private static readonly EXERCISE_TERMS: Record<string, string> = {
    // Movimentos
    'squat': 'agachamento',
    'push': 'empurrar',
    'pull': 'puxar',
    'press': 'pressão',
    'curl': 'rosca',
    'fly': 'crucifixo',
    'raise': 'elevação',
    'row': 'remada',
    'crunch': 'abdominal',
    'plank': 'prancha',
    'lunge': 'avanço',
    'deadlift': 'levantamento terra',
    'bench': 'banco',
    'shoulder': 'ombro',
    'lateral': 'lateral',
    'front': 'frontal',
    'reverse': 'inverso',
    'overhead': 'acima da cabeça',
    'incline': 'inclinado',
    'decline': 'declinado',
    'flat': 'reto',
    'standing': 'em pé',
    'seated': 'sentado',
    'lying': 'deitado',
    'bent': 'curvado',
    'straight': 'reto',
    'wide': 'amplo',
    'close': 'fechado',
    'grip': 'pegada',
    'hammer': 'martelo',
    'alternating': 'alternado',
    'single': 'único',
    'double': 'duplo',
    'leg': 'perna',
    'arm': 'braço',
    'chest': 'peito',
    'back': 'costas',
    'one': 'um',
    'two': 'dois',
    'three': 'três',
    'up': 'para cima',
    'down': 'para baixo',
    'in': 'dentro',
    'out': 'fora',
    'twist': 'torção',
    'rotation': 'rotação',
    'extension': 'extensão',
    'flexion': 'flexão',
    'hold': 'segurar',
    'jump': 'pulo',
    'step': 'passo',
    'walk': 'caminhada',
    'run': 'corrida',
    'sprint': 'tiro',
    'hop': 'salto',
    'kick': 'chute',
    'swing': 'balanço',
    'throw': 'arremesso',
    'catch': 'pegar',
    'slide': 'deslizar',
    'climb': 'escalar',
    'mountain': 'montanha',
    'climber': 'escalada',
    'jack': 'polichinelo',
    'burpee': 'burpee',
    'bridge': 'ponte',
    'pike': 'pike',
    'tuck': 'agrupado',
    'hollow': 'oco',
    'superman': 'super-homem',
    'bird': 'pássaro',
    'dog': 'cachorro',
    'cat': 'gato',
    'cow': 'vaca',
    'cobra': 'cobra',
    'child': 'criança',
    'warrior': 'guerreiro',
    'triangle': 'triângulo',
    'and': 'e',
    'or': 'ou',
    'with': 'com',
    'on': 'em',
    'off': 'fora',
    'to': 'para',
  };

  /**
   * Traduz parte do corpo para português
   */
  static translateBodyPart(bodyPart: string): string {
    const normalized = bodyPart.toLowerCase().trim();
    return this.BODY_PARTS[normalized] || bodyPart;
  }

  /**
   * Traduz equipamento para português
   */
  static translateEquipment(equipment: string): string {
    const normalized = equipment.toLowerCase().trim();
    return this.EQUIPMENT[normalized] || equipment;
  }

  /**
   * Traduz músculo alvo para português
   */
  static translateTargetMuscle(target: string): string {
    const normalized = target.toLowerCase().trim();
    return this.TARGET_MUSCLES[normalized] || target;
  }

  /**
   * Traduz nome do exercício para português (tentativa básica)
   * Para tradução completa, seria necessário um dicionário mais extenso
   */
  static translateExerciseName(name: string): string {
    let translated = name.toLowerCase();
    
    // Substituir termos conhecidos
    Object.entries(this.EXERCISE_TERMS).forEach(([en, pt]) => {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      translated = translated.replace(regex, pt);
    });

    // Capitalizar primeira letra de cada palavra
    return translated
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Traduz objeto completo do exercício
   */
  static translateExercise(exercise: any): any {
    return {
      ...exercise,
      name: this.translateExerciseName(exercise.name),
      bodyPart: this.translateBodyPart(exercise.bodyPart),
      equipment: this.translateEquipment(exercise.equipment),
      target: exercise.target ? this.translateTargetMuscle(exercise.target) : undefined,
    };
  }

  /**
   * Traduz array de exercícios
   */
  static translateExercises(exercises: any[]): any[] {
    return exercises.map(exercise => this.translateExercise(exercise));
  }
}

export default TranslationUtil;
