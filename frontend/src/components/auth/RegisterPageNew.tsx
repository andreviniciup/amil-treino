import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CenteredLayout, Button } from '../common/Layout';

export function RegisterPageNew() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(nome, email, senha);
      navigate('/onboarding/personal-info');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#288b9f] to-[#1a6b7d] flex items-center justify-center px-4 py-8">
      <CenteredLayout maxWidth="sm" className="justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Criar Conta
            </h1>
            <p className="text-white/80">
              Comece sua jornada fitness hoje
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                placeholder="Seu nome"
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-white/60 text-xs mt-1">Mínimo 6 caracteres</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-center">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="!bg-white !text-[#288b9f] hover:!bg-gray-100 font-bold mt-6"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>

            {/* Terms */}
            <p className="text-white/60 text-xs text-center mt-4">
              Ao criar uma conta, você concorda com nossos{' '}
              <button className="underline hover:text-white/80 transition-colors">
                Termos e Condições
              </button>
              {' '}e{' '}
              <button className="underline hover:text-white/80 transition-colors">
                Política de Privacidade
              </button>
            </p>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login">
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                className="!border-white !text-white hover:!bg-white/10"
              >
                Entrar
              </Button>
            </Link>
          </form>
        </div>

        {/* Back to Landing */}
        <button
          onClick={() => navigate('/landing')}
          className="mt-6 text-white/80 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </CenteredLayout>
    </div>
  );
}
