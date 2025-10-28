# 📋 Implementação Completa do Sistema de Divisão de Treinos

## Status: ⏳ PENDENTE

Data de criação: 28 de outubro de 2025

---

## 🎯 Objetivo Geral

Criar uma lógica consistente onde a **divisão de treino escolhida no onboarding** (ABC, ABCD, etc.) seja respeitada em **todas as partes do aplicativo**: criação de treinos, visualização de treinos, e navegação entre dias.

---

## ✅ O que JÁ está pronto

### 1. OnboardingSplitPage
- ✅ Página criada com 6 opções de divisão
- ✅ Interface bonita com seleção visual
- ✅ Salva no localStorage: `onboarding-split`
- ✅ Integrada no fluxo: training-types → **split** → days → final

**Opções disponíveis:**
- Full Body (3 dias)
- Superior/Inferior (4 dias)
- ABC (3 dias) - Peito/Tríceps | Costas/Bíceps | Pernas/Ombros
- ABCD (4 dias) - Peito/Tríceps | Costas/Bíceps | Pernas | Ombros/Abdômen
- ABCDE (5 dias) - Peito | Costas | Pernas | Ombros | Braços
- ABCDEF (6 dias) - Push | Pull | Legs | Push | Pull | Legs

**Estrutura salva:**
```json
{
  "id": "abc",
  "name": "ABC",
  "days": 3,
  "splits": [
    "A - Peito/Tríceps",
    "B - Costas/Bíceps", 
    "C - Pernas/Ombros"
  ]
}
```

---

## 📝 PRÓXIMOS PASSOS

### 1️⃣ Atualizar OnboardingDaysPage

**Problema atual:**
- Permite selecionar QUALQUER quantidade de dias (1-7)
- Não valida com base na divisão escolhida

**Solução:**
```tsx
// 1. Carregar divisão escolhida
const split = JSON.parse(localStorage.getItem('onboarding-split'))

// 2. Validar seleção
// - Deve selecionar EXATAMENTE split.days dias
// - Exemplo: ABC = precisa selecionar 3 dias

// 3. Criar mapeamento de dias → treinos
const mapping = {
  'Segunda': 'A',
  'Quarta': 'B',
  'Sexta': 'C'
}

// 4. Salvar mapeamento
localStorage.setItem('onboarding-training-days', JSON.stringify({
  selectedDays: ['Segunda', 'Quarta', 'Sexta'],
  mapping: mapping
}))
```

**UI melhorada:**
- Mostrar contador: "Selecione 3 dias (ABC)"
- Desabilitar botão "Avançar" se != 3 dias
- Mostrar preview: "Segunda = A, Quarta = B, Sexta = C"

---

### 2️⃣ Modificar TreinoPage - Navegação entre Treinos

**Problema atual:**
- Mostra apenas "Hoje" com um treino genérico
- Sem navegação entre A, B, C

**Soluções possíveis:**

#### OPÇÃO A: Tabs Horizontais (Recomendado)
```tsx
┌─────────────────────────────────┐
│  [A]  [B]  [C]                 │ ← Tabs clicáveis
│  ────────────────────────────── │
│  Treino A - Peito/Tríceps       │
│  Segunda                        │
│  ────────────────────────────── │
│  📋 Supino Reto - 4x8           │
│  📋 Rosca Direta - 3x12         │
└─────────────────────────────────┘
```

#### OPÇÃO B: Swipe Horizontal (Moderno)
```tsx
┌─────────────────────────────────┐
│  ← [B] | Treino A | [C] →      │
│  ────────────────────────────── │
│  Peito/Tríceps - Segunda        │
│  ────────────────────────────── │
│  📋 Supino Reto - 4x8           │
└─────────────────────────────────┘
```

#### OPÇÃO C: Dropdown (Simples)
```tsx
┌─────────────────────────────────┐
│  📅 Treino A - Segunda    [▼]  │
│  ────────────────────────────── │
│  Peito/Tríceps                  │
│  ────────────────────────────── │
│  📋 Supino Reto - 4x8           │
└─────────────────────────────────┘
```

**Lógica:**
```typescript
// 1. Carregar divisão do perfil do usuário
const userProfile = await workoutApi.getUserProfile()
const split = userProfile.splitConfig // { id: 'abc', days: 3 }

// 2. Buscar treinos criados pelo usuário
const workouts = await workoutApi.getUserPlans()
// Retorna: [
//   { workoutLetter: 'A', dayOfWeek: 'Segunda', exercises: [...] },
//   { workoutLetter: 'B', dayOfWeek: 'Quarta', exercises: [...] },
//   { workoutLetter: 'C', dayOfWeek: 'Sexta', exercises: [...] }
// ]

// 3. Determinar qual é "hoje"
const today = getCurrentDayOfWeek() // 'Segunda'
const todayWorkout = workouts.find(w => w.dayOfWeek === today)
// todayWorkout = Treino A

// 4. Permitir navegação entre A, B, C
const [currentWorkout, setCurrentWorkout] = useState(todayWorkout)
```

---

### 3️⃣ Ajustar CreateWorkoutDay

**Problema atual:**
- Permite criar treino para qualquer dia
- Não valida duplicação de dias
- Não associa à letra do treino (A, B, C)

**Solução:**

```tsx
// 1. Determinar qual treino está criando
const split = userProfile.splitConfig
const existingWorkouts = await workoutApi.getUserPlans()

// Se tem 0 treinos → criando A
// Se tem 1 treino (A) → criando B
// Se tem 2 treinos (A, B) → criando C
const workoutLetter = String.fromCharCode(65 + existingWorkouts.length) // 'A', 'B', 'C'...

// 2. Validar limite
if (existingWorkouts.length >= split.days) {
  showError('Você já criou todos os treinos da sua divisão ABC')
  return
}

// 3. Interface
<div>
  <h2>Criando Treino {workoutLetter}</h2>
  <p>{split.splits[existingWorkouts.length]}</p>
  
  <h3>Escolha o dia para este treino:</h3>
  
  {DAYS_OF_WEEK.map(day => {
    const isUsed = existingWorkouts.some(w => w.dayOfWeek === day)
    
    return (
      <DayButton 
        day={day}
        disabled={isUsed}
        selected={selectedDay === day}
        onClick={() => setSelectedDay(day)}
      />
    )
  })}
  
  {isUsed && <p className="text-red">Já existe treino neste dia</p>}
</div>

// 4. Salvar com letra
await workoutApi.createWorkout({
  ...workoutData,
  workoutLetter: workoutLetter, // 'A', 'B', 'C'
  dayOfWeek: selectedDay,
  splitType: split.id
})
```

---

### 4️⃣ Backend - Salvar Divisão no Perfil

**Schema do Banco:**

```prisma
model UserProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  
  // Dados pessoais existentes
  name            String
  age             Int
  weight          Float
  height          Float
  goal            String?
  
  // ⭐ NOVO: Divisão de treino
  splitType       String?  // 'abc', 'abcd', 'fullbody', 'upper-lower'
  splitDays       Int?     // 3, 4, 5, 6
  splitConfig     Json?    // Objeto completo da divisão
  
  // Mapeamento de dias → treinos
  trainingDays    Json?    // { 'Segunda': 'A', 'Quarta': 'B', 'Sexta': 'C' }
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
}

model WorkoutPlan {
  id              String   @id @default(uuid())
  userId          String
  name            String
  
  // ⭐ NOVO: Identificação do treino na divisão
  workoutLetter   String?  // 'A', 'B', 'C', 'D', 'E', 'F'
  dayOfWeek       String?  // 'Segunda', 'Terça', etc.
  splitType       String?  // Referência à divisão
  
  workouts        Workout[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
}
```

**Migração:**
```prisma
npx prisma migrate dev --name add_training_split_fields
```

**API Endpoints:**

```typescript
// ===== USER PROFILE =====

// PUT /api/users/profile/split
// Salvar divisão escolhida no onboarding
router.put('/profile/split', authenticateUser, async (req, res) => {
  const { splitType, splitDays, splitConfig, trainingDays } = req.body;
  
  const profile = await prisma.userProfile.upsert({
    where: { userId: req.user.id },
    update: {
      splitType,
      splitDays,
      splitConfig,
      trainingDays
    },
    create: {
      userId: req.user.id,
      splitType,
      splitDays,
      splitConfig,
      trainingDays,
      // ... outros campos obrigatórios
    }
  });
  
  res.json(profile);
});

// GET /api/users/profile
// Retornar perfil com divisão
router.get('/profile', authenticateUser, async (req, res) => {
  const profile = await prisma.userProfile.findUnique({
    where: { userId: req.user.id }
  });
  
  res.json(profile);
});

// ===== WORKOUTS =====

// POST /api/workouts
// Criar treino com validação de divisão
router.post('/', authenticateUser, async (req, res) => {
  const { workoutLetter, dayOfWeek, splitType, ...workoutData } = req.body;
  
  // Validar: não permitir mais treinos que a divisão
  const profile = await prisma.userProfile.findUnique({
    where: { userId: req.user.id }
  });
  
  const existingWorkouts = await prisma.workoutPlan.count({
    where: { 
      userId: req.user.id,
      splitType: profile.splitType
    }
  });
  
  if (existingWorkouts >= profile.splitDays) {
    return res.status(400).json({
      error: `Você já criou todos os ${profile.splitDays} treinos da divisão ${profile.splitType.toUpperCase()}`
    });
  }
  
  // Validar: não duplicar dia
  const dayExists = await prisma.workoutPlan.findFirst({
    where: {
      userId: req.user.id,
      dayOfWeek: dayOfWeek
    }
  });
  
  if (dayExists) {
    return res.status(400).json({
      error: `Já existe um treino para ${dayOfWeek}`
    });
  }
  
  // Criar treino
  const workout = await prisma.workoutPlan.create({
    data: {
      ...workoutData,
      workoutLetter,
      dayOfWeek,
      splitType,
      userId: req.user.id
    }
  });
  
  res.json(workout);
});

// GET /api/workouts/by-split
// Buscar treinos da divisão atual do usuário
router.get('/by-split', authenticateUser, async (req, res) => {
  const profile = await prisma.userProfile.findUnique({
    where: { userId: req.user.id }
  });
  
  const workouts = await prisma.workoutPlan.findMany({
    where: {
      userId: req.user.id,
      splitType: profile.splitType
    },
    orderBy: {
      workoutLetter: 'asc'
    },
    include: {
      workouts: {
        include: {
          exercises: true
        }
      }
    }
  });
  
  res.json(workouts);
});
```

---

## 🔄 Fluxo Completo (Ponta a Ponta)

### Cenário: Usuário cria divisão ABC

```
1. ONBOARDING
   └─ Escolhe "ABC" (3 dias)
   └─ Salva localStorage: onboarding-split
   
2. ONBOARDING (Days)
   └─ Seleciona: Segunda, Quarta, Sexta
   └─ Cria mapeamento: { Segunda: 'A', Quarta: 'B', Sexta: 'C' }
   └─ Salva localStorage: onboarding-training-days
   
3. ONBOARDING (Final)
   └─ Envia para backend:
      POST /api/users/profile/split
      {
        splitType: 'abc',
        splitDays: 3,
        splitConfig: { id: 'abc', name: 'ABC', ... },
        trainingDays: { 'Segunda': 'A', 'Quarta': 'B', 'Sexta': 'C' }
      }
   └─ Perfil salvo no banco ✅
   
4. CRIAR PRIMEIRO TREINO
   └─ Entra em /workout/create/intro
   └─ Backend valida: 0 treinos existentes
   └─ Frontend mostra: "Criando Treino A - Peito/Tríceps"
   └─ Usuário escolhe: Segunda
   └─ Salva:
      POST /api/workouts
      {
        name: "Treino A",
        workoutLetter: 'A',
        dayOfWeek: 'Segunda',
        splitType: 'abc',
        exercises: [...]
      }
   └─ Treino A criado ✅
   
5. CRIAR SEGUNDO TREINO
   └─ Backend valida: 1 treino existente (A)
   └─ Frontend mostra: "Criando Treino B - Costas/Bíceps"
   └─ Desabilita botão "Segunda" (já usado)
   └─ Usuário escolhe: Quarta
   └─ Treino B criado ✅
   
6. CRIAR TERCEIRO TREINO
   └─ Backend valida: 2 treinos existentes (A, B)
   └─ Frontend mostra: "Criando Treino C - Pernas/Ombros"
   └─ Desabilita botões "Segunda" e "Quarta"
   └─ Usuário escolhe: Sexta
   └─ Treino C criado ✅
   
7. TENTAR CRIAR QUARTO TREINO
   └─ Backend valida: 3 treinos existentes
   └─ Backend retorna erro 400:
      "Você já criou todos os 3 treinos da divisão ABC"
   └─ Frontend mostra mensagem ❌
   └─ Botão "Criar novo treino" desabilitado
   
8. VER TREINOS (TreinoPage)
   └─ Carrega do backend:
      GET /api/workouts/by-split
   └─ Retorna: [Treino A, Treino B, Treino C]
   └─ Mostra tabs: [A] [B] [C]
   └─ Identifica hoje: Segunda
   └─ Seleciona tab A automaticamente
   └─ Usuário pode navegar: A ↔ B ↔ C
   
9. COMEÇAR TREINO
   └─ Segunda-feira, 07:00
   └─ Abre app → TreinoPage
   └─ Sistema detecta: hoje = Segunda = Treino A
   └─ Mostra: "Treino A - Peito/Tríceps"
   └─ Usuário clica "Iniciar Treino"
   └─ Realiza exercícios...
   └─ Completa treino ✅
   
10. QUARTA-FEIRA
    └─ Abre app → TreinoPage
    └─ Sistema detecta: hoje = Quarta = Treino B
    └─ Mostra: "Treino B - Costas/Bíceps"
    └─ Continua o ciclo...
```

---

## ❓ Decisões Pendentes

### 1. Navegação entre treinos no TreinoPage
**Opções:**
- [ ] A) Tabs horizontais (simples e claro)
- [ ] B) Swipe horizontal (moderno, mobile-first)
- [ ] C) Dropdown (economiza espaço)

**Recomendação:** Opção A ou B

---

### 2. Permitir mudança de divisão?
**Cenários:**
- Usuário começa com ABC, depois quer mudar para ABCDE
- Já tem treinos criados na divisão antiga

**Opções:**
- [ ] A) Não permitir (simplifica lógica)
- [ ] B) Permitir, mas apagar treinos antigos (com confirmação)
- [ ] C) Permitir e manter treinos (migração complexa)

**Recomendação:** Opção A inicialmente, B depois

---

### 3. Lógica de "falta"
**Cenário:**
- Usuário deveria treinar Treino B na Quarta
- Não treinou
- Quinta-feira: mostrar qual treino?

**Opções:**
- [ ] A) Mostrar Treino B (recuperar sessão perdida)
- [ ] B) Seguir calendário (Quinta = nenhum treino, próximo é Sexta = C)
- [ ] C) Perguntar ao usuário

**Recomendação:** Opção B (respeitar calendário), com notificação de falta

---

### 4. Bloqueio de criação de treinos
**Cenário:**
- Usuário já tem A, B, C completos

**Opções:**
- [ ] A) Bloquear criação de novos (obrigar mudar divisão)
- [ ] B) Permitir "editar" treinos existentes
- [ ] C) Permitir criar variações (A1, A2, B1, B2)

**Recomendação:** Opção B (edição)

---

## 📊 Impacto nos Componentes

### Componentes a MODIFICAR:
- ✏️ `OnboardingDaysPage.tsx` - validar quantidade de dias
- ✏️ `OnboardingFinalPage.tsx` - enviar split para backend
- ✏️ `TreinoPage.tsx` - mostrar navegação A/B/C
- ✏️ `CreateWorkoutDay.tsx` - validar dias e atribuir letra
- ✏️ `CreateWorkoutIntro.tsx` - mostrar qual treino está criando
- ✏️ `MyWorkoutsPage.tsx` - agrupar por divisão

### Componentes NOVOS a criar:
- 🆕 `WorkoutTabs.tsx` - navegação entre A/B/C
- 🆕 `SplitIndicator.tsx` - mostrar "Treino A" com ícone
- 🆕 `DaySelector.tsx` - seletor de dias com validação

### Backend/API:
- ✏️ `userController.ts` - adicionar endpoints de split
- ✏️ `workoutController.ts` - validar split ao criar
- ✏️ `schema.prisma` - adicionar campos

---

## 🚀 Ordem de Implementação Recomendada

### FASE 1: Backend (Fundação)
1. Atualizar `schema.prisma`
2. Criar migração
3. Adicionar endpoints `/profile/split`
4. Validar criação de workouts

### FASE 2: Onboarding (Coleta de Dados)
1. Atualizar `OnboardingDaysPage` (validação)
2. Atualizar `OnboardingFinalPage` (envio para backend)
3. Testar fluxo completo

### FASE 3: Visualização (TreinoPage)
1. Criar componente `WorkoutTabs`
2. Integrar tabs no `TreinoPage`
3. Buscar treinos do backend
4. Detectar "treino de hoje"

### FASE 4: Criação (CreateWorkout)
1. Atualizar `CreateWorkoutIntro` (mostrar letra)
2. Atualizar `CreateWorkoutDay` (validação)
3. Enviar `workoutLetter` ao salvar
4. Testar criação de A, B, C

### FASE 5: Polimento
1. Mensagens de erro amigáveis
2. Loading states
3. Testes E2E
4. Documentação

---

## 📝 Notas de Desenvolvimento

### LocalStorage Keys
```typescript
'onboarding-split' // { id, name, days, splits }
'onboarding-days'  // ['Segunda', 'Quarta', 'Sexta']
'onboarding-training-days' // { selectedDays, mapping }
```

### Backend Response Format
```typescript
// GET /api/users/profile
{
  id: "uuid",
  userId: "user-id",
  splitType: "abc",
  splitDays: 3,
  splitConfig: {
    id: "abc",
    name: "ABC",
    days: 3,
    splits: [...]
  },
  trainingDays: {
    "Segunda": "A",
    "Quarta": "B",
    "Sexta": "C"
  }
}

// GET /api/workouts/by-split
[
  {
    id: "workout-1",
    workoutLetter: "A",
    dayOfWeek: "Segunda",
    name: "Treino A",
    workouts: [{
      trainingType: "Peito/Tríceps",
      exercises: [...]
    }]
  },
  // ...
]
```

---

## 🐛 Possíveis Problemas

1. **Múltiplos planos ativos**
   - Solução: Adicionar campo `isActive` em `WorkoutPlan`
   
2. **Mudança de fuso horário**
   - Solução: Trabalhar com dias da semana, não datas
   
3. **Usuário treina fora da divisão**
   - Solução: Permitir treino "extra" sem afetar sequência
   
4. **Conflito localStorage vs Backend**
   - Solução: Backend é fonte da verdade, sempre

---

## ✅ Critérios de Sucesso

- [ ] Usuário escolhe divisão no onboarding
- [ ] Divisão é salva no backend
- [ ] TreinoPage mostra apenas treinos da divisão (A, B, C)
- [ ] Não é possível criar mais treinos que a divisão permite
- [ ] Não é possível duplicar dias
- [ ] Sistema identifica corretamente "treino de hoje"
- [ ] Navegação entre treinos funciona perfeitamente
- [ ] Testes passam

---

## 📚 Referências

- Arquivo: `OnboardingSplitPage.tsx` (já implementado)
- Contexto: `OnboardingContext.tsx`
- API: `workoutApi.ts`
- Schema: `schema.prisma`

---

## 🔗 Links Relacionados

- Issue/Task: [Adicionar aqui quando criar]
- PR: [Adicionar aqui quando criar]
- Design Figma: [Se houver]

---

**Última atualização:** 28 de outubro de 2025  
**Status:** Documentação completa, aguardando implementação  
**Responsável:** [Seu nome]
