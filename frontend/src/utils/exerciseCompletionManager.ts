/**
 * Gerenciador global de conclusão de exercícios
 * Garante que apenas um callback de conclusão seja executado por vez,
 * eliminando loops infinitos causados por múltiplos registros
 */

class ExerciseCompletionManager {
  private isExecuting: boolean = false;
  private lastExecutionTime: number = 0;
  private MIN_INTERVAL_MS: number = 5000; // 5 segundos

  /**
   * Executa um callback de conclusão de exercício com proteção contra loops
   * @param callback Função a ser executada
   * @param exerciseId ID do exercício para logging
   * @returns true se executou, false se bloqueou
   */
  async executeCompletion(callback: () => Promise<void>, exerciseId?: string): Promise<boolean> {
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecutionTime;

    // PROTEÇÃO 1: Verificar e SETAR flag IMEDIATAMENTE para evitar race conditions
    if (this.isExecuting) {
      console.log(`⏭️ [ExerciseCompletionManager] Já está executando, bloqueando nova chamada`, { exerciseId, timestamp: now });
      return false;
    }

    // PROTEÇÃO 2: Rate limiting (mais agressivo)
    if (this.lastExecutionTime !== 0 && timeSinceLastExecution < this.MIN_INTERVAL_MS) {
      console.log(`⏭️ [ExerciseCompletionManager] Rate limit ativo: última execução há ${timeSinceLastExecution}ms`, { exerciseId, timestamp: now });
      return false;
    }

    // PROTEÇÃO 3: Setar flag ANTES de executar para evitar race conditions
    this.isExecuting = true;
    this.lastExecutionTime = now;

    try {
      console.log(`✅ [ExerciseCompletionManager] Executando conclusão`, { exerciseId, timestamp: now });
      
      await callback();
      
      console.log(`✅ [ExerciseCompletionManager] Conclusão executada com sucesso`, { exerciseId, timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error(`❌ [ExerciseCompletionManager] Erro ao executar conclusão:`, error, { exerciseId, timestamp: Date.now() });
      // Não resetar flag aqui - deixar o finally fazer isso
      throw error;
    } finally {
      // Sempre resetar flag no finally para garantir que seja resetada mesmo em caso de erro
      this.isExecuting = false;
      console.log(`🔄 [ExerciseCompletionManager] Flag isExecuting resetada`, { exerciseId, timestamp: Date.now() });
    }
  }

  /**
   * Reseta o gerenciador (útil para testes ou mudança de exercício)
   */
  reset(): void {
    this.isExecuting = false;
    this.lastExecutionTime = 0;
    console.log(`🔄 [ExerciseCompletionManager] Reset completo`);
  }

  /**
   * Obtém o status atual do gerenciador
   */
  getStatus(): { isExecuting: boolean; lastExecutionTime: number; timeSinceLastExecution: number } {
    return {
      isExecuting: this.isExecuting,
      lastExecutionTime: this.lastExecutionTime,
      timeSinceLastExecution: Date.now() - this.lastExecutionTime
    };
  }
}

// Instância singleton
export const exerciseCompletionManager = new ExerciseCompletionManager();



