/**
 * Mapeamento de bodyPart para imagens de músculos
 */
export const MUSCLE_IMAGE_MAP: Record<string, string> = {
  // Abdômen
  'Abdômen': '/musculos/abdomen.png',
  'abdomen': '/musculos/abdomen.png',
  'abs': '/musculos/abdomen.png',
  
  // Costas
  'Costas': '/musculos/costas.png',
  'costas': '/musculos/costas.png',
  'back': '/musculos/costas.png',
  'Latíssimo': '/musculos/costas.png',
  
  // Lombar
  'Lombar': '/musculos/lombar.png',
  'lombar': '/musculos/lombar.png',
  'lower back': '/musculos/lombar.png',
  
  // Peito
  'Peito': '/musculos/peito.png',
  'peito': '/musculos/peito.png',
  'chest': '/musculos/peito.png',
  'Peitoral': '/musculos/peito.png',
  
  // Ombros
  'Ombros': '/musculos/ombros.png',
  'ombros': '/musculos/ombros.png',
  'shoulders': '/musculos/ombros.png',
  'Deltoides': '/musculos/deltoides.png',
  'deltoides': '/musculos/deltoides.png',
  
  // Trapézio
  'Trapézio': '/musculos/trapezio.png',
  'trapezio': '/musculos/trapezio.png',
  'traps': '/musculos/trapezio.png',
  
  // Bíceps
  'Bíceps': '/musculos/bracos.png',
  'biceps': '/musculos/bracos.png',
  
  // Tríceps
  'Tríceps': '/musculos/triceps.png',
  'triceps': '/musculos/triceps.png',
  
  // Antebraços
  'Antebraços': '/musculos/antebracos.png',
  'antebracos': '/musculos/antebracos.png',
  'forearms': '/musculos/antebracos.png',
  
  // Quadríceps
  'Quadríceps': '/musculos/quadriceps.png',
  'quadriceps': '/musculos/quadriceps.png',
  'quads': '/musculos/quadriceps.png',
  
  // Posteriores de Coxa
  'Posteriores de Coxa': '/musculos/pernas-completas.png',
  'posteriores': '/musculos/pernas-completas.png',
  'hamstrings': '/musculos/pernas-completas.png',
  
  // Glúteos
  'Glúteos': '/musculos/gluteos.png',
  'gluteos': '/musculos/gluteos.png',
  'glutes': '/musculos/gluteos.png',
  
  // Panturrilhas
  'Panturrilhas': '/musculos/panturrilhas.png',
  'panturrilhas': '/musculos/panturrilhas.png',
  'calves': '/musculos/panturrilhas.png',
  
  // Adutores
  'Adutores': '/musculos/quadriceps-adutores.png',
  'adutores': '/musculos/quadriceps-adutores.png',
  'adductors': '/musculos/quadriceps-adutores.png',
  
  // Abdutores
  'Abdutores': '/musculos/corpo-inferior.png',
  'abdutores': '/musculos/corpo-inferior.png',
  'abductors': '/musculos/corpo-inferior.png',
  
  // Pescoço
  'Pescoço': '/musculos/trapezio-superior.png',
  'pescoco': '/musculos/trapezio-superior.png',
  'neck': '/musculos/trapezio-superior.png',
  
  // Core/Oblíquos
  'Core': '/musculos/core.png',
  'core': '/musculos/core.png',
  'Oblíquos': '/musculos/obliquos.png',
  'obliquos': '/musculos/obliquos.png',
};

/**
 * Obtém a imagem do músculo baseado no bodyPart
 */
export function getMuscleImage(bodyPart: string): string {
  const normalizedBodyPart = bodyPart.trim();
  return MUSCLE_IMAGE_MAP[normalizedBodyPart] || '/musculos/corpo-inferior.png'; // Fallback
}

/**
 * Extrai músculos únicos de uma lista de exercícios
 */
export function getUniqueMuscles(exercises: Array<{ bodyPart?: string }>): string[] {
  const muscles = new Set<string>();
  
  exercises.forEach(exercise => {
    if (exercise.bodyPart) {
      muscles.add(exercise.bodyPart);
    }
  });
  
  return Array.from(muscles);
}
