import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;
  private readonly DEFAULT_TTL = 3600; // 1 hora
  private readonly EXERCISE_TTL = 1800; // 30 minutos
  private readonly IMAGE_TTL = 86400; // 24 horas

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.DEFAULT_TTL,
      checkperiod: 600, // Verificar a cada 10 minutos
      useClones: false
    });

    console.log('✅ Cache service initialized');
  }

  /**
   * Obtém dados do cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Define dados no cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || this.DEFAULT_TTL);
  }

  /**
   * Cache específico para exercícios
   */
  setExercise(key: string, data: any): boolean {
    return this.set(`exercise:${key}`, data, this.EXERCISE_TTL);
  }

  getExercise(key: string): any {
    return this.get(`exercise:${key}`);
  }

  /**
   * Cache específico para imagens
   */
  setImage(key: string, url: string): boolean {
    return this.set(`image:${key}`, url, this.IMAGE_TTL);
  }

  getImage(key: string): string | undefined {
    return this.get<string>(`image:${key}`);
  }

  /**
   * Cache para listas de exercícios
   */
  setExerciseList(key: string, exercises: any[]): boolean {
    return this.set(`list:${key}`, exercises, this.EXERCISE_TTL);
  }

  getExerciseList(key: string): any[] | undefined {
    return this.get<any[]>(`list:${key}`);
  }

  /**
   * Invalida cache específico
   */
  invalidate(pattern: string): number {
    const keys = this.cache.keys().filter(key => key.includes(pattern));
    return this.cache.del(keys);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.flushAll();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Estatísticas do cache
   */
  getStats(): {
    keys: number;
    hits: number;
    misses: number;
    ksize: number;
    vsize: number;
  } {
    return this.cache.getStats();
  }

  /**
   * Verifica se uma chave existe
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Obtém TTL de uma chave
   */
  getTtl(key: string): number | undefined {
    return this.cache.getTtl(key);
  }

  /**
   * Cache com callback (padrão cache-aside)
   */
  async getOrSet<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Tentar obter do cache primeiro
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    // Se não estiver no cache, buscar e salvar
    try {
      const data = await fetchFunction();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      throw error;
    }
  }
}

export default new CacheService();
