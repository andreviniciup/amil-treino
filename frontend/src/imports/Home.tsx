import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WorkoutPlansList } from '../components/WorkoutPlansList';

function Frame500({ userName }: { userName?: string }) {
  return (
    <div className="absolute content-stretch flex flex-col font-['Alexandria:Medium',_sans-serif] font-medium gap-[6px] items-start leading-[normal] left-[20px] text-[36px] top-[20px] w-[350px]">
      <p className="relative shrink-0 text-white w-full">Hey, {userName || 'Usuário'}!</p>
      <p className="relative shrink-0 text-[#2c2c2c] w-full text-[24px]">Vamos treinar hoje?</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-[#181818] relative size-full overflow-y-auto" data-name="home">
      <Frame500 userName={user?.name} />
      
      <div className="absolute left-[20px] right-[20px] top-[120px] pb-[100px]">
        {/* Botão Criar Novo Treino */}
        <button
          onClick={() => navigate('/workout/create/intro')}
          className="w-full bg-[#d9d9d9] hover:bg-[#e9e9e9] transition-colors rounded-[20px] p-4 mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[24px]">+</span>
            <span className="text-[#202020] font-['Alexandria:Medium',_sans-serif] text-[16px]">
              Criar Novo Treino
            </span>
          </div>
        </button>

        {/* Botão Ver Todos os Treinos */}
        <button
          onClick={() => navigate('/my-workouts')}
          className="w-full bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors rounded-[20px] p-4 mb-6"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-['Alexandria:Medium',_sans-serif] text-[16px]">
              Ver Todos os Treinos
            </span>
          </div>
        </button>

        {/* Título Meus Planos */}
        <h2 className="text-white font-['Alexandria:Medium',_sans-serif] text-[20px] mb-4">
          Últimos Planos
        </h2>

        {/* Lista de Planos */}
        <WorkoutPlansList />
      </div>
    </div>
  );
}