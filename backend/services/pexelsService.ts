import axios from 'axios';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
}

class PexelsService {
  private apiKey: string;
  private baseUrl: string = 'https://api.pexels.com/v1';

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('PEXELS_API_KEY não configurada. Imagens de exercícios não estarão disponíveis.');
    }
  }

  async searchExerciseImage(exerciseName: string, bodyPart?: string): Promise<string | null> {
    if (!this.apiKey) {
      // Se não há chave da API, retornar uma imagem de placeholder mais realista
      return this.getPlaceholderImage(exerciseName, bodyPart);
    }

    try {
      // Criar query de busca baseada no nome do exercício e parte do corpo
      const searchTerms = [exerciseName];
      if (bodyPart) {
        searchTerms.push(bodyPart);
      }
      
      const query = searchTerms.join(' ');
      
      const response = await axios.get<PexelsResponse>(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': this.apiKey
        },
        params: {
          query: query,
          per_page: 1,
          orientation: 'portrait'
        }
      });

      if (response.data.photos && response.data.photos.length > 0) {
        return response.data.photos[0].src.medium;
      }

      return this.getPlaceholderImage(exerciseName, bodyPart);
    } catch (error) {
      console.error('Erro ao buscar imagem no Pexels:', error);
      return this.getPlaceholderImage(exerciseName, bodyPart);
    }
  }

  private getPlaceholderImage(exerciseName: string, bodyPart?: string): string {
    // Usar Unsplash como alternativa gratuita
    const searchTerms = [exerciseName];
    if (bodyPart) {
      searchTerms.push(bodyPart);
    }
    
    const query = encodeURIComponent(searchTerms.join(' '));
    return `https://source.unsplash.com/400x400/?${query}`;
  }

  async searchFitnessImages(query: string): Promise<string[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get<PexelsResponse>(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': this.apiKey
        },
        params: {
          query: query,
          per_page: 10,
          orientation: 'portrait'
        }
      });

      if (response.data.photos && response.data.photos.length > 0) {
        return response.data.photos.map(photo => photo.src.medium);
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar imagens no Pexels:', error);
      return [];
    }
  }
}

export const pexelsService = new PexelsService();
