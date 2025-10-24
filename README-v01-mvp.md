# 🏋️ Sistema de Treino - MVP v01

Versão simplificada do sistema de treinos focada em validação do conceito.

## 🎯 **OBJETIVO**

Criar um MVP (Minimum Viable Product) que demonstre o conceito principal do sistema de treinos com funcionalidades essenciais.

## ✅ **FUNCIONALIDADES**

### **🔐 Autenticação**
- ✅ Login/Registro básico
- ✅ Sessão de usuário
- ✅ Proteção de rotas

### **👤 Onboarding**
- ✅ 3 etapas simplificadas
- ✅ Coleta de dados básicos
- ✅ Configuração inicial

### **🏋️ Criação de Treinos**
- ✅ Interface simplificada
- ✅ Exercícios básicos
- ✅ Séries e repetições
- ✅ Tempo de descanso

### **📱 Execução de Treinos**
- ✅ Interface de execução
- ✅ Controle de séries
- ✅ Timer de descanso
- ✅ Finalização de treino

### **📊 Dashboard**
- ✅ Visão geral simples
- ✅ Histórico básico
- ✅ Estatísticas essenciais

## 🚀 **COMO EXECUTAR**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **Instalação**
```bash
# 1. Alternar para branch v01-mvp
git checkout v01-mvp

# 2. Instalar dependências do backend
cd backend
npm install

# 3. Configurar banco de dados
npx prisma generate
npx prisma db push

# 4. Instalar dependências do frontend
cd ../frontend
npm install

# 5. Executar sistema
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **Acesso**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs

## 🏗️ **ARQUITETURA SIMPLIFICADA**

### **Backend**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── userController.ts      ✅ (simplificado)
│   │   ├── workoutController.ts   ✅ (simplificado)
│   │   └── exerciseController.ts  ✅ (básico)
│   ├── routes/
│   │   ├── userRoutes.ts          ✅ (simplificado)
│   │   ├── workoutRoutes.ts      ✅ (simplificado)
│   │   └── exerciseRoutes.ts     ✅ (básico)
│   ├── middleware/
│   │   ├── auth.ts               ✅ (básico)
│   │   └── errorHandler.ts       ✅ (básico)
│   └── server.ts                 ✅ (simplificado)
└── prisma/
    └── schema.prisma              ✅ (simplificado)
```

### **Frontend**
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/                  ✅ (manter)
│   │   ├── onboarding/            ✅ (3 etapas)
│   │   ├── dashboard/             ✅ (simples)
│   │   ├── workout-creator/       ✅ (simplificado)
│   │   └── workout-execution/     ✅ (novo)
│   ├── contexts/
│   │   ├── AuthContext.tsx        ✅ (manter)
│   │   └── WorkoutContext.tsx     ✅ (novo)
│   └── services/
│       └── api.ts                 ✅ (simplificado)
```

## 📊 **BANCO DE DADOS SIMPLIFICADO**

### **Tabelas Principais**
- `users` - Usuários
- `workouts` - Treinos
- `exercises` - Exercícios
- `workout_exercises` - Relação treino-exercício
- `workout_sessions` - Sessões de treino

### **Schema Simplificado**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  
  workouts Workout[]
}

model Workout {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  
  user     User              @relation(fields: [userId], references: [id])
  exercises WorkoutExercise[]
  sessions WorkoutSession[]
}

model Exercise {
  id          String   @id @default(cuid())
  name        String
  description String?
  muscleGroup String
  
  workouts WorkoutExercise[]
}

model WorkoutExercise {
  id         String @id @default(cuid())
  workoutId  String
  exerciseId String
  sets       Int
  reps       Int
  weight     Float?
  
  workout  Workout  @relation(fields: [workoutId], references: [id])
  exercise Exercise @relation(fields: [exerciseId], references: [id])
}

model WorkoutSession {
  id        String   @id @default(cuid())
  workoutId String
  startedAt DateTime @default(now())
  endedAt   DateTime?
  
  workout Workout @relation(fields: [workoutId], references: [id])
}
```

## 🎨 **INTERFACE SIMPLIFICADA**

### **Páginas Principais**
1. **Login/Registro** - Autenticação básica
2. **Onboarding** - 3 etapas de configuração
3. **Dashboard** - Visão geral simples
4. **Criar Treino** - Interface simplificada
5. **Executar Treino** - Controle básico
6. **Histórico** - Lista simples de treinos

### **Componentes Essenciais**
- `LoginForm` - Formulário de login
- `RegisterForm` - Formulário de registro
- `OnboardingSteps` - 3 etapas de onboarding
- `Dashboard` - Visão geral
- `WorkoutCreator` - Criador de treinos
- `WorkoutExecutor` - Executor de treinos
- `WorkoutHistory` - Histórico de treinos

## 🔧 **CONFIGURAÇÃO**

### **Variáveis de Ambiente**
```env
# Backend
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-jwt-secret"
PORT=3000

# Frontend
VITE_API_URL="http://localhost:3000"
```

### **Scripts Disponíveis**
```bash
# Backend
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar produção

# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
```

## 🧪 **TESTES**

### **Testes Básicos**
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📱 **RESPONSIVIDADE**

- ✅ Mobile-first design
- ✅ Tablet otimizado
- ✅ Desktop funcional
- ✅ PWA ready

## 🚀 **DEPLOY**

### **Desenvolvimento**
```bash
# Usar scripts de desenvolvimento
npm run dev
```

### **Produção**
```bash
# Build e deploy
npm run build
npm run start
```

## 📈 **MÉTRICAS MVP**

### **Objetivos de Validação**
- ✅ Usuários conseguem se registrar
- ✅ Usuários conseguem criar treinos
- ✅ Usuários conseguem executar treinos
- ✅ Sistema é estável e funcional
- ✅ Interface é intuitiva

### **KPIs**
- Taxa de conversão (registro → primeiro treino)
- Tempo para completar onboarding
- Taxa de conclusão de treinos
- Satisfação do usuário

## 🔄 **PRÓXIMOS PASSOS**

1. **Validação** - Testar com usuários reais
2. **Feedback** - Coletar feedback dos usuários
3. **Iteração** - Melhorar baseado no feedback
4. **Evolução** - Mover para v02-complete

## 📞 **SUPORTE**

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação
- Entre em contato com a equipe

---

**Versão:** v01-mvp  
**Última atualização:** $(date)  
**Status:** ✅ Estável
