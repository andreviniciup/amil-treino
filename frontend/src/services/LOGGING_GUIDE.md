# 📊 Sistema de Logging do Frontend

## Como Usar

### 1. Importar o serviço

```typescript
import logService from './services/logService';
```

### 2. Usar em componentes

#### Opção A: Diretamente com logService
```typescript
import logService from '../services/logService';

function MyComponent() {
  const handleClick = () => {
    logService.logClick('botao-iniciar-treino', '/treino');
    // seu código aqui
  };

  return <button onClick={handleClick}>Iniciar Treino</button>;
}
```

#### Opção B: Com o hook useLogger (recomendado)
```typescript
import { useLogger } from '../hooks/useLogger';

function MyComponent() {
  const { logClick, logWorkoutStart } = useLogger();

  const handleStartWorkout = (workoutId: string) => {
    logClick('botao-iniciar-treino');
    logWorkoutStart(workoutId);
    // seu código aqui
  };

  return <button onClick={() => handleStartWorkout('123')}>Iniciar</button>;
}
```

### 3. Adicionar Log Viewer no App.tsx

```typescript
import LogViewer from './components/LogViewer';

function App() {
  return (
    <div>
      {/* Seu app normal */}
      <Router>
        <Routes>...</Routes>
      </Router>
      
      {/* Log Viewer (apenas em dev ou com flag) */}
      {import.meta.env.DEV && <LogViewer />}
    </div>
  );
}
```

Pressione **CTRL+L** para abrir/fechar o Log Viewer durante o desenvolvimento!

## Métodos Disponíveis

### Logs Automáticos
- `logPageView(page)` - Log automático quando muda de página (via useLogger)

### Logs de Autenticação
```typescript
logService.logLogin(userId, 'email'); // Usuário fez login
logService.logLogout(); // Usuário fez logout
logService.logRegister(userId); // Novo usuário registrado
```

### Logs de Treino
```typescript
logService.logWorkoutCreate(workoutData); // Criou novo treino
logService.logWorkoutStart(workoutId); // Iniciou treino
logService.logWorkoutComplete(workoutId, duration); // Completou treino
```

### Logs de Exercícios
```typescript
logService.logExerciseSelect(exerciseId, exerciseName); // Selecionou exercício
```

### Logs Gerais
```typescript
logService.logClick(elementName, page, additionalData); // Clicou em algo
logService.logSearch(query, resultsCount); // Fez uma busca
logService.logError(error, 'contexto'); // Erro ocorreu
logService.logApiCall('/api/workout', 'POST', 200); // Chamada API
```

### Métodos Utilitários
```typescript
logService.getLogs(); // Retorna todos os logs
logService.getLogsByAction('WORKOUT_START'); // Filtra por ação
logService.getLogsByPage('/treino'); // Filtra por página
logService.getSessionLogs(); // Apenas logs da sessão atual
logService.printSummary(); // Imprime resumo no console
logService.exportLogs(); // Exporta logs como JSON
logService.clearLogs(); // Limpa todos os logs
```

## Exemplos Práticos

### Login
```typescript
// Em LoginPage.tsx
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    // Log de sucesso
    logService.logLogin(data.user.id, 'email');
    logService.logApiCall('/api/login', 'POST', 200);
    
  } catch (error) {
    // Log de erro
    logService.logError(error as Error, 'Login failed');
  }
};
```

### Treino
```typescript
// Em TreinoPage.tsx
const startWorkout = (workoutId: string) => {
  logService.logClick('botao-iniciar-treino');
  logService.logWorkoutStart(workoutId);
  
  // seu código aqui
  navigate(`/treino/${workoutId}`);
};

const completeWorkout = (workoutId: string, startTime: number) => {
  const duration = Date.now() - startTime;
  logService.logWorkoutComplete(workoutId, duration);
  
  // seu código aqui
};
```

### Busca de Exercícios
```typescript
// Em ExerciseSearchPage.tsx
const handleSearch = async (query: string) => {
  const results = await searchExercises(query);
  logService.logSearch(query, results.length);
};

const selectExercise = (exercise: Exercise) => {
  logService.logExerciseSelect(exercise.id, exercise.name);
  logService.logClick('exercise-card', undefined, { 
    exerciseId: exercise.id,
    musculo: exercise.musculo 
  });
};
```

### Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logService.logError(error, 'React Error Boundary');
  }
}
```

## Features

### ✅ Armazenamento Local
- Logs salvos no localStorage
- Persistem entre sessões
- Máximo de 100 logs (os mais recentes)

### ✅ Console Colorido
- Logs bonitos no console do navegador
- Emojis para identificação rápida
- Detalhes expandíveis

### ✅ Exportação
- Exportar logs como JSON
- Download com timestamp

### ✅ Filtros
- Por ação (LOGIN, WORKOUT_START, etc.)
- Por página
- Por sessão

### ✅ Session Tracking
- Cada sessão tem ID único
- Rastreia duração da sessão
- Log automático ao sair

## Debug no Console

O logService está disponível globalmente no console:

```javascript
// No console do navegador (F12)
logService.printSummary(); // Ver resumo
logService.getLogs(); // Ver todos os logs
logService.getLogsByAction('ERROR'); // Ver apenas erros
logService.clearLogs(); // Limpar tudo
```

## Visualizador de Logs (LogViewer)

- Pressione **CTRL+L** para abrir
- Interface visual com todos os logs
- Filtros por tipo de ação
- Download de logs
- Limpar logs
- Atualizar em tempo real

## Próximos Passos (Opcional)

1. **Backend Integration**: Descomentar o código em `sendToBackend()` para enviar logs para o servidor
2. **Analytics Dashboard**: Criar dashboard no backend para visualizar padrões de uso
3. **User Journey**: Mapear jornada completa do usuário
4. **Performance Metrics**: Adicionar métricas de performance

## Privacidade

⚠️ **Importante**: Os logs incluem userId e podem conter dados sensíveis. 
- Não envie para backend sem consentimento do usuário
- Em produção, considere anonimizar dados
- Respeite LGPD/GDPR
