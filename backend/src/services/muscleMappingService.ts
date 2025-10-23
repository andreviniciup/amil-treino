/**
 * Serviço de Mapeamento de Músculos PT-EN
 * 
 * Este serviço fornece mapeamento bidirecional entre nomes de músculos
 * em português e inglês para garantir consistência nas APIs
 */

export class MuscleMappingService {
  // Mapeamento Português -> Inglês
  private static readonly MUSCLE_MAP: Record<string, string> = {
    'Peito': 'chest',
    'Costas': 'back',
    'Ombros': 'shoulders',
    'Braços': 'arms',
    'Pernas': 'legs',
    'Glúteos': 'glutes',
    'Core': 'waist',
    'Cardio': 'cardio',
    // Variações e sinônimos
    'peito': 'chest',
    'costas': 'back',
    'ombros': 'shoulders',
    'braços': 'arms',
    'bracos': 'arms',
    'pernas': 'legs',
    'glúteos': 'glutes',
    'gluteos': 'glutes',
    'core': 'waist',
    'cardio': 'cardio',
    'abdomen': 'waist',
    'abdômen': 'waist',
    'cintura': 'waist'
  };

  // Mapeamento Inglês -> Português (gerado dinamicamente)
  private static readonly REVERSE_MUSCLE_MAP: Record<string, string> = {
    'chest': 'Peito',
    'back': 'Costas',
    'shoulders': 'Ombros',
    'arms': 'Braços',
    'legs': 'Pernas',
    'glutes': 'Glúteos',
    'waist': 'Core',
    'cardio': 'Cardio',
    // Variações da API
    'upper arms': 'Braços',
    'lower arms': 'Braços',
    'upper legs': 'Pernas',
    'lower legs': 'Pernas'
  };

  /**
   * Mapeia um músculo do português para inglês
   * @param portugueseMuscle Nome do músculo em português
   * @returns Nome do músculo em inglês
   */
  static mapPortugueseToEnglish(portugueseMuscle: string): string {
    const normalized = portugueseMuscle.trim();
    const mapped = this.MUSCLE_MAP[normalized];
    
    if (!mapped) {
      console.warn(`⚠️ Músculo não mapeado: "${portugueseMuscle}". Usando fallback: chest`);
      return 'chest';
    }
    
    return mapped;
  }

  /**
   * Mapeia um músculo do inglês para português
   * @param englishMuscle Nome do músculo em inglês
   * @returns Nome do músculo em português
   */
  static mapEnglishToPortuguese(englishMuscle: string): string {
    const normalized = englishMuscle.toLowerCase().trim();
    const mapped = this.REVERSE_MUSCLE_MAP[normalized];
    
    if (!mapped) {
      console.warn(`⚠️ Músculo não mapeado: "${englishMuscle}". Usando fallback: Peito`);
      return 'Peito';
    }
    
    return mapped;
  }

  /**
   * Mapeia um array de músculos do português para inglês
   * @param portugueseMuscles Array de músculos em português
   * @returns Array de músculos em inglês
   */
  static mapArrayPortugueseToEnglish(portugueseMuscles: string[]): string[] {
    return portugueseMuscles.map(muscle => this.mapPortugueseToEnglish(muscle));
  }

  /**
   * Mapeia um array de músculos do inglês para português
   * @param englishMuscles Array de músculos em inglês
   * @returns Array de músculos em português
   */
  static mapArrayEnglishToPortuguese(englishMuscles: string[]): string[] {
    return englishMuscles.map(muscle => this.mapEnglishToPortuguese(muscle));
  }

  /**
   * Verifica se um músculo está no mapeamento português
   * @param muscle Nome do músculo
   * @returns true se o músculo está mapeado
   */
  static isPortugueseMuscle(muscle: string): boolean {
    return muscle in this.MUSCLE_MAP;
  }

  /**
   * Verifica se um músculo está no mapeamento inglês
   * @param muscle Nome do músculo
   * @returns true se o músculo está mapeado
   */
  static isEnglishMuscle(muscle: string): boolean {
    return muscle.toLowerCase() in this.REVERSE_MUSCLE_MAP;
  }

  /**
   * Obtém todos os músculos disponíveis em português
   * @returns Array de músculos em português
   */
  static getAllPortugueseMuscles(): string[] {
    return ['Peito', 'Costas', 'Ombros', 'Braços', 'Pernas', 'Glúteos', 'Core', 'Cardio'];
  }

  /**
   * Obtém todos os músculos disponíveis em inglês
   * @returns Array de músculos em inglês
   */
  static getAllEnglishMuscles(): string[] {
    return ['chest', 'back', 'shoulders', 'arms', 'legs', 'glutes', 'waist', 'cardio'];
  }
}

export default MuscleMappingService;

