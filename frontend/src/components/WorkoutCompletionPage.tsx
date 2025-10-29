import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Flame, Clock, TrendingUp } from 'lucide-react';
import { workoutApi } from '../services/api';

interface WorkoutStats {
  workoutName: string;
  duration: number; // segundos
  targetDuration?: number;
  totalVolume: number; // kg total
  personalRecords: {
    exerciseName: string;
    value: number;
    unit: string;
  }[];
  currentStreak: number; // semanas
  improvementCount: number; // quantos exercícios melhoraram
}

export function WorkoutCompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutStats();
  }, []);

  const loadWorkoutStats = async () => {
    try {
      // Buscar dados do estado da navegação ou API
      const workoutData = location.state?.workoutData;
      const duration = location.state?.duration || 0;

      // Buscar streak e PRs do backend
      const userStats = await workoutApi.getStats();
      
      // Calcular volume total (soma de peso × reps × sets)
      const totalVolume = workoutData?.exercises?.reduce((sum: number, ex: any) => {
        const exerciseVolume = ex.sets * ex.reps * (ex.weight || 0);
        return sum + exerciseVolume;
      }, 0) || 0;

      // Identificar PRs (exercícios com peso maior que o anterior)
      const prs = workoutData?.exercises
        ?.filter((ex: any) => ex.isPersonalRecord)
        ?.map((ex: any) => ({
          exerciseName: ex.name,
          value: ex.weight,
          unit: 'kg'
        })) || [];

      setStats({
        workoutName: workoutData?.name || 'Treino',
        duration,
        targetDuration: workoutData?.estimatedDuration,
        totalVolume,
        personalRecords: prs,
        currentStreak: userStats.currentStreak || 0,
        improvementCount: prs.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Dados padrão se houver erro
      setStats({
        workoutName: 'Treino',
        duration: 0,
        totalVolume: 0,
        personalRecords: [],
        currentStreak: 0,
        improvementCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    navigate('/home');
  };

  const handleViewExercises = () => {
    navigate('/progress', { state: { showUpdatedExercises: true } });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#4f6c25] to-[#2a3d15] min-h-screen flex items-center justify-center">
        <p className="text-white font-['Alexandria:Regular',_sans-serif] text-[16px]">
          Calculando resultados...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#4f6c25] via-[#3d5620] to-[#2a3d15] min-h-screen relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent" />
      
      <div className="relative z-10 px-5 py-10 max-w-[393px] mx-auto">
        {/* Header de Congratulação */}
        <div className="text-center mb-8">
          <div className="w-[80px] h-[80px] mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-['Alexandria:Bold',_sans-serif] text-white text-[28px] mb-2">
            Parabéns!
          </h1>
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.8)] text-[16px]">
            Você completou o <span className="font-['Alexandria:Medium',_sans-serif]">{stats?.workoutName}</span>
          </p>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Personal Record */}
          {stats && stats.personalRecords.length > 0 && (
            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-[20px] p-4">
              <div className="w-[40px] h-[40px] bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.7)] text-[12px] mb-1">
                {stats.personalRecords[0].exerciseName}
              </p>
              <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[24px]">
                {stats.personalRecords[0].value} {stats.personalRecords[0].unit}
              </p>
            </div>
          )}

          {/* Streak */}
          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-[20px] p-4">
            <div className="w-[40px] h-[40px] bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.7)] text-[12px] mb-1">
              Sequência
            </p>
            <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[24px]">
              {stats?.currentStreak} <span className="text-[16px]">semanas</span>
            </p>
          </div>

          {/* Duração */}
          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-[20px] p-4">
            <div className="w-[40px] h-[40px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.7)] text-[12px] mb-1">
              Duração
            </p>
            <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[24px]">
              {formatDuration(stats?.duration || 0)}
            </p>
            {stats?.targetDuration && (
              <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[10px] mt-1">
                Meta: {formatDuration(stats.targetDuration)}
              </p>
            )}
          </div>

          {/* Volume Total */}
          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-[20px] p-4">
            <div className="w-[40px] h-[40px] bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.7)] text-[12px] mb-1">
              Volume Total
            </p>
            <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[24px]">
              {stats?.totalVolume.toFixed(0)} <span className="text-[16px]">kg</span>
            </p>
          </div>
        </div>

        {/* Gráfico de Progresso do Treino */}
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-[20px] p-5 mb-6">
          <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px] mb-4">
            Linha do Tempo do Treino
          </p>
          
          {/* Timeline visual simples */}
          <div className="relative h-[100px]">
            <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-[rgba(255,255,255,0.2)] rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-[4px] bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-1000"
              style={{ width: '100%' }}
            />
            
            {/* Marcadores */}
            <div className="absolute top-1/2 left-0 w-[12px] h-[12px] bg-blue-400 rounded-full -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[12px] h-[12px] bg-green-400 rounded-full -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-[12px] h-[12px] bg-green-500 rounded-full -translate-y-1/2" />
            
            {/* Labels */}
            <div className="absolute top-[calc(50%+20px)] left-0 -translate-x-1/4">
              <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.6)] text-[10px]">
                Início
              </p>
            </div>
            <div className="absolute top-[calc(50%+20px)] right-0 translate-x-1/4">
              <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.6)] text-[10px]">
                Fim
              </p>
            </div>
          </div>
        </div>

        {/* Link para exercícios atualizados */}
        {stats && stats.improvementCount > 0 && (
          <button
            onClick={handleViewExercises}
            className="w-full mb-4 text-center"
          >
            <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.7)] text-[14px] underline">
              Ver {stats.improvementCount} exercício{stats.improvementCount > 1 ? 's' : ''} atualizado{stats.improvementCount > 1 ? 's' : ''}
            </p>
          </button>
        )}

        {/* Botão de Finalizar */}
        <button
          onClick={handleFinish}
          className="w-full bg-white hover:bg-[#f0f0f0] rounded-full h-[56px] flex items-center justify-center transition-all active:scale-95 shadow-lg"
        >
          <p className="font-['Alexandria:Bold',_sans-serif] text-[#1c1c1c] text-[18px]">
            Finalizar
          </p>
        </button>
      </div>
    </div>
  );
}
