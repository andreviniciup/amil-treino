# 🎯 MVP - Sistema de Treino Inteligente

## 📋 **DEFINIÇÃO DO MVP**

**Objetivo:** Criar uma versão simplificada e funcional do sistema de treino, focando nas funcionalidades essenciais para validação do conceito.

---

## 🎯 **FUNCIONALIDADES ESSENCIAIS DO MVP**

### **✅ INCLUIR NO MVP**

#### **1. Autenticação Básica**
- ✅ Login/Registro de usuários
- ✅ Perfil básico (nome, email, senha)
- ✅ Proteção de rotas

#### **2. Onboarding Simplificado**
- ✅ Informações pessoais (idade, peso, altura)
- ✅ Objetivo principal (1-2 opções)
- ✅ Dias disponíveis (2-6 dias)
- ✅ Nível de experiência (Iniciante/Intermediário/Avançado)

#### **3. Criação de Treinos**
- ✅ Criador de treinos básico
- ✅ Seleção de exercícios por grupo muscular
- ✅ Configuração de séries e repetições
- ✅ Nome e descrição do treino

#### **4. Execução de Treinos**
- ✅ Lista de treinos criados
- ✅ Iniciar treino
- ✅ Marcar exercícios como concluídos
- ✅ Timer de descanso básico
- ✅ Finalizar treino

#### **5. Histórico Básico**
- ✅ Lista de treinos realizados
- ✅ Data e duração
- ✅ Status (concluído/pendente)

#### **6. Dashboard Simples**
- ✅ Estatísticas básicas (treinos realizados, streak)
- ✅ Próximos treinos
- ✅ Progresso simples

---

## ❌ **REMOVER DO MVP (Simplificar)**

### **Funcionalidades Complexas (Deixar para v2)**
- ❌ Sistema de recomendação ML
- ❌ ML Service Python
- ❌ Gamificação (badges, pontos, níveis)
- ❌ Análise de progresso avançada
- ❌ Sistema de PRs (Personal Records)
- ❌ Integração com APIs externas
- ❌ Sistema de feedback científico
- ❌ Predições de performance
- ❌ Análise de consistência
- ❌ Sistema de badges automáticos

### **Funcionalidades Avançadas (Deixar para v2)**
- ❌ Múltiplos métodos de treino
- ❌ Sistema de perfil detalhado
- ❌ Análise de plateaus
- ❌ Recomendações personalizadas
- ❌ Sistema de pontuação
- ❌ Integração com PubMed
- ❌ Validação científica

---

## 🏗️ **ARQUITETURA MVP SIMPLIFICADA**

### **Backend (Apenas TypeScript)**
```
backend/src/
├── controllers/
│   ├── userController.ts          ✅ (simplificado)
│   ├── workoutController.ts       ✅ (simplificado)
│   └── exerciseController.ts     ✅ (básico)
├── routes/
│   ├── userRoutes.ts             ✅ (simplificado)
│   ├── workoutRoutes.ts          ✅ (simplificado)
│   └── exerciseRoutes.ts         ✅ (básico)
├── services/
│   └── (remover todos os serviços complexos)
└── models/ (Prisma simplificado)
    ├── User
    ├── Workout
    ├── Exercise
    └── WorkoutLog
```

### **Frontend (React Simplificado)**
```
frontend/src/
├── components/
│   ├── auth/                     ✅ (manter)
│   ├── onboarding/              ✅ (simplificar)
│   ├── workout-creator/         ✅ (simplificar)
│   ├── dashboard/                ✅ (novo, simples)
│   └── workout-execution/       ✅ (novo, simples)
└── contexts/
    ├── AuthContext.tsx          ✅ (manter)
    └── WorkoutContext.tsx       ✅ (novo, simples)
```

### **Banco de Dados (Prisma Simplificado)**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  age       Int?
  weight    Float?
  height    Float?
  goal      String?  // Objetivo principal
  level     String?  // Nível de experiência
  days      Int?     // Dias disponíveis
  createdAt DateTime @default(now())
  
  workouts  Workout[]
  logs      WorkoutLog[]
}

model Workout {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  exercises   Json     // Array de exercícios
  createdAt   DateTime @default(now())
  
  user WorkoutLog[]
}

model WorkoutLog {
  id        String   @id @default(uuid())
  userId    String
  workoutId String
  completed Boolean  @default(false)
  date      DateTime @default(now())
  duration  Int?     // em minutos
  
  user    User    @relation(fields: [userId], references: [id])
  workout Workout @relation(fields: [workoutId], references: [id])
}
```

---

## 🎯 **FUNCIONALIDADES MVP DETALHADAS**

### **1. Autenticação (Simplificada)**
- Login com email/senha
- Registro básico
- Logout
- Proteção de rotas

### **2. Onboarding (3 Etapas)**
1. **Informações Pessoais**
   - Nome, idade, peso, altura
2. **Objetivo**
   - Hipertrofia, Força, Resistência, Emagrecimento
3. **Disponibilidade**
   - Dias por semana (2-6)
   - Nível (Iniciante/Intermediário/Avançado)

### **3. Criação de Treinos (Simplificada)**
1. **Informações Básicas**
   - Nome do treino
   - Descrição (opcional)
2. **Exercícios**
   - Selecionar por grupo muscular
   - Configurar séries/reps
   - Peso (opcional)
3. **Salvar**
   - Criar treino
   - Adicionar à lista

### **4. Execução de Treinos**
1. **Lista de Treinos**
   - Ver treinos criados
   - Iniciar treino
2. **Durante o Treino**
   - Lista de exercícios
   - Marcar como concluído
   - Timer de descanso (30s, 60s, 90s)
3. **Finalizar**
   - Marcar como concluído
   - Salvar duração

### **5. Dashboard (Simples)**
1. **Estatísticas Básicas**
   - Treinos realizados (total)
   - Streak atual
   - Tempo total de treino
2. **Próximos Treinos**
   - Lista de treinos pendentes
   - Último treino realizado

---

## 📱 **FLUXO DO USUÁRIO MVP**

### **1. Primeiro Acesso**
1. Tela de login/registro
2. Onboarding (3 etapas)
3. Dashboard vazio

### **2. Uso Diário**
1. Dashboard com estatísticas
2. Criar novo treino (se necessário)
3. Executar treino
4. Ver histórico

### **3. Gestão de Treinos**
1. Lista de treinos criados
2. Editar treino existente
3. Executar treino
4. Ver histórico de execuções

---

## 🚀 **IMPLEMENTAÇÃO MVP**

### **Fase 1: Backend Simplificado (1-2 dias)**
- ✅ Manter apenas controllers essenciais
- ✅ Simplificar models do Prisma
- ✅ Remover serviços complexos
- ✅ Manter apenas rotas básicas

### **Fase 2: Frontend Simplificado (2-3 dias)**
- ✅ Simplificar onboarding
- ✅ Criar dashboard básico
- ✅ Simplificar criador de treinos
- ✅ Criar executor de treinos

### **Fase 3: Testes e Refinamento (1 dia)**
- ✅ Testar fluxo completo
- ✅ Corrigir bugs
- ✅ Melhorar UX

---

## 📊 **MÉTRICAS MVP**

### **Objetivos de Validação**
- ✅ Usuário consegue criar um treino
- ✅ Usuário consegue executar um treino
- ✅ Usuário consegue ver seu progresso
- ✅ Sistema é estável e rápido

### **Métricas de Sucesso**
- ✅ Tempo de onboarding < 5 minutos
- ✅ Tempo de criação de treino < 3 minutos
- ✅ Tempo de execução de treino < 1 hora
- ✅ Zero bugs críticos

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Simplificar Backend** - Remover funcionalidades complexas
2. **Simplificar Frontend** - Focar no essencial
3. **Testar MVP** - Validar fluxo completo
4. **Refinar UX** - Melhorar experiência
5. **Preparar v2** - Planejar funcionalidades avançadas

---

## 🏆 **RESULTADO ESPERADO**

Um sistema de treino **simples, funcional e estável** que permite:
- ✅ Criar treinos facilmente
- ✅ Executar treinos sem complicação
- ✅ Acompanhar progresso básico
- ✅ Validar o conceito do produto

**MVP focado na essência: criar, executar e acompanhar treinos!** 🎯
