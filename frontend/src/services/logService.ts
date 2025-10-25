/**
 * Serviço de Logging para rastrear ações do usuário
 */

interface LogEvent {
  timestamp: string;
  userId?: string;
  action: string;
  page: string;
  details?: any;
  sessionId: string;
}

class LogService {
  private sessionId: string;
  private logs: LogEvent[] = [];
  private apiUrl: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
    this.initializeLogging();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private initializeLogging() {
    console.log('📊 Log Service initialized - Session:', this.sessionId);
    
    // Recuperar logs anteriores do localStorage
    const savedLogs = localStorage.getItem('user_logs');
    if (savedLogs) {
      try {
        this.logs = JSON.parse(savedLogs);
      } catch (e) {
        console.error('Error loading saved logs:', e);
      }
    }

    // Log quando o usuário sair
    window.addEventListener('beforeunload', () => {
      this.log('SESSION_END', window.location.pathname, { duration: this.getSessionDuration() });
    });
  }

  private getSessionDuration(): number {
    const firstLog = this.logs.find(log => log.sessionId === this.sessionId);
    if (!firstLog) return 0;
    return Date.now() - new Date(firstLog.timestamp).getTime();
  }

  /**
   * Registra uma ação do usuário
   */
  log(action: string, page: string, details?: any) {
    const userId = this.getUserId();
    
    const event: LogEvent = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      page,
      details,
      sessionId: this.sessionId
    };

    this.logs.push(event);
    
    // Salvar no localStorage
    this.saveToLocalStorage();
    
    // Log no console
    this.logToConsole(event);
    
    // Enviar para o backend (opcional)
    this.sendToBackend(event);
  }

  private getUserId(): string | undefined {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData.email;
      }
    } catch (e) {
      return undefined;
    }
  }

  private logToConsole(event: LogEvent) {
    const emoji = this.getEmojiForAction(event.action);
    const style = 'color: #4CAF50; font-weight: bold;';
    
    console.log(
      `%c${emoji} [${event.action}]`,
      style,
      `\n📍 Page: ${event.page}`,
      `\n👤 User: ${event.userId || 'Anonymous'}`,
      `\n⏰ Time: ${new Date(event.timestamp).toLocaleTimeString()}`,
      event.details ? `\n📋 Details:` : '',
      event.details || ''
    );
  }

  private getEmojiForAction(action: string): string {
    const emojiMap: Record<string, string> = {
      'PAGE_VIEW': '👁️',
      'CLICK': '👆',
      'LOGIN': '🔐',
      'LOGOUT': '👋',
      'REGISTER': '📝',
      'WORKOUT_CREATE': '💪',
      'WORKOUT_START': '🏃',
      'WORKOUT_COMPLETE': '✅',
      'EXERCISE_SELECT': '🎯',
      'SEARCH': '🔍',
      'ERROR': '❌',
      'API_CALL': '📡',
      'SESSION_END': '🛑'
    };
    return emojiMap[action] || '📌';
  }

  private saveToLocalStorage() {
    try {
      // Manter apenas os últimos 100 logs
      const recentLogs = this.logs.slice(-100);
      localStorage.setItem('user_logs', JSON.stringify(recentLogs));
    } catch (e) {
      console.error('Error saving logs to localStorage:', e);
    }
  }

  private async sendToBackend(event: LogEvent) {
    // Enviar logs para o backend (implementação futura)
    // Não bloqueia a execução se falhar
    try {
      // await fetch(`${this.apiUrl}/api/logs`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (e) {
      // Silenciosamente falha - logs não devem quebrar a aplicação
    }
  }

  /**
   * Logs específicos para diferentes ações
   */

  logPageView(page: string) {
    this.log('PAGE_VIEW', page, { url: window.location.href });
  }

  logClick(element: string, page: string, additionalData?: any) {
    this.log('CLICK', page, { element, ...additionalData });
  }

  logLogin(userId: string, method: string = 'email') {
    this.log('LOGIN', '/login', { userId, method });
  }

  logLogout() {
    this.log('LOGOUT', window.location.pathname);
  }

  logRegister(userId: string) {
    this.log('REGISTER', '/register', { userId });
  }

  logWorkoutCreate(workoutData: any) {
    this.log('WORKOUT_CREATE', '/workout/create', { workout: workoutData });
  }

  logWorkoutStart(workoutId: string) {
    this.log('WORKOUT_START', '/workout', { workoutId, startTime: new Date().toISOString() });
  }

  logWorkoutComplete(workoutId: string, duration: number) {
    this.log('WORKOUT_COMPLETE', '/workout', { workoutId, duration });
  }

  logExerciseSelect(exerciseId: string, exerciseName: string) {
    this.log('EXERCISE_SELECT', window.location.pathname, { exerciseId, exerciseName });
  }

  logSearch(query: string, results: number) {
    this.log('SEARCH', window.location.pathname, { query, results });
  }

  logError(error: Error, context?: string) {
    this.log('ERROR', window.location.pathname, {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  logApiCall(endpoint: string, method: string, status?: number) {
    this.log('API_CALL', window.location.pathname, { endpoint, method, status });
  }

  /**
   * Métodos utilitários
   */

  getLogs(): LogEvent[] {
    return this.logs;
  }

  getLogsByAction(action: string): LogEvent[] {
    return this.logs.filter(log => log.action === action);
  }

  getLogsByPage(page: string): LogEvent[] {
    return this.logs.filter(log => log.page === page);
  }

  getSessionLogs(): LogEvent[] {
    return this.logs.filter(log => log.sessionId === this.sessionId);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('user_logs');
    console.log('🗑️ All logs cleared');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  printSummary() {
    const sessionLogs = this.getSessionLogs();
    const pageViews = this.getLogsByAction('PAGE_VIEW');
    const errors = this.getLogsByAction('ERROR');
    
    console.log(`
╔════════════════════════════════════════╗
║     📊 LOG SUMMARY - SESSION ${this.sessionId.slice(0, 8)}    ║
╠════════════════════════════════════════╣
║ Total Logs: ${this.logs.length.toString().padStart(27)} ║
║ Session Logs: ${sessionLogs.length.toString().padStart(25)} ║
║ Page Views: ${pageViews.length.toString().padStart(27)} ║
║ Errors: ${errors.length.toString().padStart(31)} ║
║ User ID: ${(this.getUserId() || 'Anonymous').padEnd(28)} ║
╚════════════════════════════════════════╝
    `);

    if (errors.length > 0) {
      console.log('❌ Recent Errors:');
      errors.slice(-3).forEach(error => {
        console.log(`  - ${error.details?.message} (${new Date(error.timestamp).toLocaleTimeString()})`);
      });
    }
  }
}

// Singleton instance
const logService = new LogService();

// Expor globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).logService = logService;
}

export default logService;
