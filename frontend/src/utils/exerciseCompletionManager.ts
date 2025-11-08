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

    // Proteção 1: Verificar se já está executando
    if (this.isExecuting) {
      console.log(`⏭️ [ExerciseCompletionManager] Já está executando, bloqueando nova chamada`, { exerciseId });
      return false;
    }

    // Proteção 2: Rate limiting
    if (this.lastExecutionTime !== 0 && timeSinceLastExecution < this.MIN_INTERVAL_MS) {
      console.log(`⏭️ [ExerciseCompletionManager] Rate limit ativo: última execução há ${timeSinceLastExecution}ms`, { exerciseId });
      return false;
    }

    try {
      console.log(`✅ [ExerciseCompletionManager] Executando conclusão`, { exerciseId, timestamp: now });
      this.isExecuting = true;
      this.lastExecutionTime = now;
      
      await callback();
      
      console.log(`✅ [ExerciseCompletionManager] Conclusão executada com sucesso`, { exerciseId });
      return true;
    } catch (error) {
      console.error(`❌ [ExerciseCompletionManager] Erro ao executar conclusão:`, error);
      throw error;
    } finally {
      this.isExecuting = false;
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



