# 📋 Mapeamento Completo de UI/UX - Treino App

## 📅 Data: 08/11/2025

---

## 🎯 ÍNDICE

1. [Páginas e Rotas](#1-páginas-e-rotas)
2. [Componentes Principais](#2-componentes-principais)
3. [Botões e Ações](#3-botões-e-ações)
4. [Inputs e Formulários](#4-inputs-e-formulários)
5. [Fluxos de Navegação](#5-fluxos-de-navegação)
6. [Funcionalidades por Página](#6-funcionalidades-por-página)
7. [ContextualMenuBar (Menu Inferior)](#7-contextualmenubar-menu-inferior)
8. [Estados e Interações](#8-estados-e-interações)
9. [Design System](#9-design-system)

---

## 1. PÁGINAS E ROTAS

### 1.1 Páginas Públicas (Não Autenticadas)

#### **Splash Screen** (`/`)
- **Descrição**: Tela inicial com logo da aplicação
- **Elementos**:
  - Logo/Imagem da aplicação
  - Texto "amli"
- **Ações**: Navegação automática para `/landing` após 2.5s
- **Design**: Fundo escuro

#### **Landing Page** (`/landing`)
- **Descrição**: Página inicial para usuários não autenticados
- **Elementos**:
  - Background decorativo com gradientes coloridos
  - Texto: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
- **Botões**:
  1. **"criar conta"** (Amarelo `#FDCB1A`)
     - Navega para `/register`
  2. **"entrar"** (Azul `#288B9F`)
     - Navega para `/login`
- **Design**: Fundo `#181818` com máscaras SVG decorativas

#### **Login Page** (`/login`)
- **Descrição**: Página de autenticação
- **Inputs**:
  1. **Email** (`type="email"`)
     - Placeholder: vazio
     - Label: "email"
     - Estilo: Fundo `rgba(0,0,0,0.2)`, bordas arredondadas
  2. **Senha** (`type="password"`)
     - Placeholder: vazio
     - Label: "senha"
     - Estilo: Fundo `rgba(0,0,0,0.2)`, bordas arredondadas
- **Botões**:
  1. **"entrar"** (Fundo `#1c1c1c`)
     - Ação: Submete formulário de login
     - Validação: Verifica se email e senha estão preenchidos
     - Erro: Mostra mensagem de erro se login falhar
- **Textos**:
  - Termos e condições (texto pequeno)
- **Design**: Fundo `#288B9F` (azul)

#### **Register Page** (`/register`)
- **Descrição**: Página de registro de novo usuário
- **Similar ao Login Page** (estrutura similar)

---

### 1.2 Páginas de Onboarding

#### **Onboarding Personal Info** (`/onboarding/personal-info`)
- **Descrição**: Coleta informações pessoais do usuário
- **Inputs**: Nome, idade, etc.

#### **Onboarding Goal** (`/onboarding/goal`)
- **Descrição**: Seleção de objetivo do treino
- **Botões de Seleção**:
  - Grid 2x2 com opções de objetivos
  - Estados: Selecionado (fundo `#1c1c1c`) / Não selecionado (fundo `rgba(0,0,0,0.2)`)
- **Botão**:
  - **"Avançar"** (Fundo `#1c1c1c`)

#### **Onboarding Training Types** (`/onboarding/training-types`)
- **Descrição**: Seleção de tipos de treino preferidos

#### **Onboarding Split** (`/onboarding/split`)
- **Descrição**: Configuração de divisão de treino

#### **Onboarding Days** (`/onboarding/days`)
- **Descrição**: Seleção de dias da semana para treinar

#### **Onboarding Final** (`/onboarding/final`)
- **Descrição**: Tela final do onboarding

---

### 1.3 Páginas Principais (Autenticadas)

#### **Home** (`/home`)
- **Descrição**: Dashboard principal do usuário
- **Elementos**:
  - Header: "Hey, {nome do usuário}!"
  - Texto: "hoje você tem {X} treino{s} planejado{s}!"
  - Seção "hoje" com cards de treinos do dia
- **Cards de Treino**:
  - Estrutura:
    - Nome do treino
    - Tipo de treino (ex: "Geral")
    - Tags de grupos musculares (máx 2)
    - Duração estimada (ex: "30 min")
  - Ação: Clique navega para `/treino-id` ou `/treino/:workoutPlanId`
- **Design**: Fundo `#181818`

#### **Workout List** (`/workout-list`)
- **Descrição**: Lista completa de todos os treinos organizados por dia
- **Header**:
  - Título: "meus treinos"
  - Botão: **"Criar treino"** (Fundo `#D0FD1A`, texto `#202020`)
    - Navega para `/workout/create/intro`
- **Estrutura**:
  - Agrupamento por dia da semana (Segunda, Terça, etc.)
  - Cards de treino por dia (similar ao Home)
- **Estado Vazio**:
  - Ícone de haltere
  - Texto: "Nenhum treino criado ainda"
  - Texto secundário: "Crie seu primeiro treino para começar"

#### **TreinoIdPage** (`/treino/:workoutPlanId` ou `/treino-id`)
- **Descrição**: Detalhes do treino do dia com lista de exercícios
- **Elementos**:
  - Header do treino (WorkoutHeader)
    - Nome do treino
    - Tipo de treino
    - Imagem do grupo muscular principal
  - Carrossel de grupos musculares (MuscleGroupCarousel)
  - Lista de exercícios (ExercisesList)
    - Cards de exercícios (ExerciseCard)
- **Botões**:
  - **"fazer exercicio"** (em cada ExerciseCard)
    - Navega para página do exercício
- **Nota**: O botão "iniciar treino" está no WorkoutActionBar (menubar contextual), não nesta página
- **Estados**:
  - Exercícios completados: Mostram check verde
  - Exercícios pendentes: Mostram número de séries
- **Design**: Fundo `#181818`

#### **ExerciseIdPage** (`/treino/:workoutPlanId/:workoutId/:exerciseId` ou `/exercise-id`)
- **Descrição**: Página de execução do exercício
- **Elementos**:
  - **BackButton**: Botão voltar (canto superior esquerdo)
  - **ExerciseHeader**:
    - Nome do exercício
    - Imagens GIF do exercício (antes/depois)
  - **ExerciseSeriesList**:
    - Lista de séries (SeriesCard)
    - Cada série pode estar em estado: `active`, `pending`, `completed`
- **Funcionalidades**:
  - Edição de reps, peso e tempo de descanso por série
  - Iniciar timer de descanso
  - Completar série
  - Slide-to-complete quando todas as séries estão completas
- **Design**: Fundo `#181818`

#### **TreinoTempoDescansoPage** (`/treino/:workoutPlanId/:workoutId/:exerciseId/descanso` ou `/treino-tempo-descanso`)
- **Descrição**: Página de descanso entre séries
- **Elementos**:
  - Timer de descanso
  - Botão para pular descanso
- **Design**: Fundo escuro

#### **WorkoutCompletionPage** (`/workout-completion`)
- **Descrição**: Tela de conclusão do treino
- **Elementos**:
  - **Header de Congratulação**:
    - Ícone de troféu animado
    - Título: "Parabéns!"
    - Texto: "Você completou o {nome do treino}"
  - **Grid de Estatísticas** (2x2):
    1. **Personal Record** (se houver)
       - Nome do exercício
       - Valor do PR
    2. **Sequência (Streak)**
       - Número de semanas
    3. **Duração**
       - Tempo total do treino
       - Meta (se houver)
    4. **Volume Total**
       - Total em kg
  - **Linha do Tempo do Treino**:
    - Gráfico visual de progresso
    - Marcadores: Início, Meio, Fim
  - **Link** (se houver melhorias):
    - "Ver {X} exercício{s} atualizado{s}"
  - **Botão**:
    - **"Finalizar"** (Fundo branco)
      - Navega para `/home`
- **Design**: Gradiente verde (`from-[#4f6c25] via-[#3d5620] to-[#2a3d15]`)

#### **StreakPage** (`/streak`)
- **Descrição**: Página de histórico e sequência de treinos
- **Elementos**:
  - **DynamicStreak**: Componente de calendário/streak
  - **WorkoutDayPopup**: Popup ao clicar em um dia
    - Mostra treinos completados no dia
    - Informações: Nome do treino, duração, hora de conclusão
- **Design**: Fundo `#181818`

---

### 1.4 Páginas de Criação de Treino

#### **Create Workout Intro** (`/workout/create/intro`)
- **Descrição**: Introdução ao criador de treino

#### **Create Workout Type** (`/workout/create/type`)
- **Descrição**: Seleção do tipo de treino

#### **Create Workout Name** (`/workout/create/name`)
- **Descrição**: Nome do treino
- **Input**: Campo de texto para nome

#### **Create Workout Muscles** (`/workout/create/muscles`)
- **Descrição**: Seleção de grupos musculares

#### **Create Workout Exercises** (`/workout/create/exercises`)
- **Descrição**: Seleção de exercícios

#### **Create Workout Day** (`/workout/create/day`)
- **Descrição**: Seleção de dia da semana

#### **Create Workout Config** (`/workout/create/config`)
- **Descrição**: Configuração de séries, reps, peso

#### **Create Workout Ready** (`/workout/create/ready`)
- **Descrição**: Confirmação e criação do treino

---

## 2. COMPONENTES PRINCIPAIS

### 2.1 ContextualMenuBar
Menu inferior contextual que muda baseado na página atual.

#### **NavigationMenuBar**
- **Quando aparece**: Páginas principais (home, streak, workout-list, my-workouts)
- **Botões**:
  1. **Home** (ícone)
  2. **Streak** (ícone)
  3. **Treino** (ícone)
  4. **Sair** (ícone)
- **Design**: Fundo `rgba(36,36,36,0.7)` com blur, bordas arredondadas

#### **WorkoutActionBar**
- **Quando aparece**: Página de detalhes do treino (TreinoIdPage)
- **Elementos**:
  - Nome do treino
  - Timer do treino (se ativo)
  - Botão **"iniciar treino"** (se não iniciado)
  - Botão **"parar treino"** (se ativo)

#### **ExerciseCompleteBar**
- **Quando aparece**: Página do exercício (ExerciseIdPage)
- **Estados**:
  1. **Timer apenas** (quando séries não estão todas completas)
     - Mostra apenas o tempo do treino
  2. **Slide-to-complete** (quando todas as séries estão completas)
     - Barra arrastável horizontal
     - Texto: "marcar como concluido" → "omo concluido"
     - Threshold: 85% do caminho
     - Ao completar: Chama `onCompleteExercise()`
  3. **Concluído** (quando exercício foi completado)
     - Barra com gradiente colorido
     - Texto: "concluido"
- **Design**: Fundo `#222222`, barra `#F0D471`

#### **RestTimerBar**
- **Quando aparece**: Página de descanso
- **Elementos**: Timer de descanso

---

### 2.2 ExerciseCard
Card de exercício na lista do treino.

- **Estados**:
  1. **Pendente** (não completado)
     - Clicável para expandir
     - Mostra nome e número de séries
     - Ao expandir: Mostra detalhes de cada série
  2. **Completado**
     - Fundo `#202020`
     - Check verde `#6D9F28`
     - Mostra melhoria (se houver)
     - Não expansível

- **Ações**:
  - Clique no header: Expande/colapsa
  - Clique no card: Navega para página do exercício

---

### 2.3 SeriesCard
Card de série individual do exercício.

- **Estados**:
  1. **Active** (série atual)
     - Fundo `#202020`
     - Mostra número da série, reps, peso
     - Botões:
       - **"iniciar"**: Inicia timer de descanso
       - **Tempo de descanso**: Clicável para editar
     - Campos editáveis (ao clicar):
       - Reps: Botões +/- para ajustar
       - Peso: Botões +/- para ajustar
       - Tempo de descanso: Botões +/- para ajustar (incrementos de 5s)
     - Botão **"confirmar"**: Fecha editor e salva valores
  2. **Pending** (série futura)
     - Fundo `#202020` com opacidade 60%
     - Mostra número da série, reps, peso
     - Não interativo
  3. **Completed** (série completada)
     - Fundo verde `#6D9F28`
     - Texto branco/verde escuro
     - Check verde
     - Mostra reps e peso finais

- **Interações**:
  - Clique em reps: Abre editor de reps
  - Clique em peso: Abre editor de peso
  - Clique em tempo: Abre editor de tempo
  - Botões +/-: Ajustam valores
  - Botão "iniciar": Inicia descanso e marca série como completada

---

### 2.4 BackButton
Botão de voltar (canto superior esquerdo).

- **Ação**: Navega para página anterior
- **Design**: Ícone de seta, fundo transparente

---

## 3. BOTÕES E AÇÕES

### 3.1 Botões de Navegação

| Botão | Localização | Ação | Design |
|-------|------------|------|--------|
| **Home** | NavigationMenuBar | Navega para `/home` | Ícone, fundo cinza quando ativo |
| **Streak** | NavigationMenuBar | Navega para `/streak` | Ícone, fundo cinza quando ativo |
| **Treino** | NavigationMenuBar | Navega para `/workout-list` | Ícone, fundo cinza quando ativo |
| **Sair** | NavigationMenuBar | Faz logout | Ícone, hover vermelho |
| **Voltar** | BackButton | Navega para página anterior | Ícone de seta |

### 3.2 Botões de Ação Principal

| Botão | Localização | Ação | Design |
|-------|------------|------|--------|
| **entrar** | LoginPage | Submete login | Fundo `#1c1c1c`, texto branco |
| **criar conta** | LandingPage | Navega para `/register` | Fundo `#FDCB1A`, texto `#1c1c1c` |
| **entrar** | LandingPage | Navega para `/login` | Fundo `#288B9F`, texto branco |
| **Criar treino** | WorkoutList | Navega para `/workout/create/intro` | Fundo `#D0FD1A`, texto `#202020` |
| **iniciar treino** | WorkoutActionBar (menubar contextual) | Inicia timer e navega para primeiro exercício | Aparece na TreinoIdPage via menubar |
| **fazer exercicio** | TreinoIdPage | Navega para página do exercício | Em cada ExerciseCard |
| **iniciar** | SeriesCard (active) | Inicia timer de descanso e completa série | Fundo `#D9D9D9`, texto preto |
| **confirmar** | SeriesCard (editor) | Salva valores e fecha editor | Fundo `#70C0D1`, texto `#202020` |
| **Finalizar** | WorkoutCompletionPage | Navega para `/home` | Fundo branco, texto `#1c1c1c` |

### 3.3 Botões de Edição

| Botão | Localização | Ação | Design |
|-------|------------|------|--------|
| **+** (Reps) | SeriesCard editor | Aumenta reps em 1 | Fundo `#70C0D1` |
| **-** (Reps) | SeriesCard editor | Diminui reps em 1 | Fundo `#70C0D1` |
| **+** (Peso) | SeriesCard editor | Aumenta peso em 1kg | Fundo `#70C0D1` |
| **-** (Peso) | SeriesCard editor | Diminui peso em 1kg | Fundo `#70C0D1` |
| **+** (Tempo) | SeriesCard editor | Aumenta tempo em 5s | Fundo `#70C0D1` |
| **-** (Tempo) | SeriesCard editor | Diminui tempo em 5s | Fundo `#70C0D1` |

### 3.4 Botões de Seleção

| Botão | Localização | Ação | Design |
|-------|------------|------|--------|
| **Objetivos** | OnboardingGoalPage | Seleciona objetivo | Grid 2x2, fundo muda quando selecionado |
| **Tipos de Treino** | OnboardingTrainingTypesPage | Seleciona tipo | Similar aos objetivos |

---

## 4. INPUTS E FORMULÁRIOS

### 4.1 Inputs de Texto

| Input | Localização | Tipo | Validação | Design |
|-------|------------|------|-----------|--------|
| **Email** | LoginPage | `email` | Obrigatório | Fundo `rgba(0,0,0,0.2)`, bordas arredondadas |
| **Senha** | LoginPage | `password` | Obrigatório | Fundo `rgba(0,0,0,0.2)`, bordas arredondadas |
| **Nome do Treino** | CreateWorkoutName | `text` | - | - |

### 4.2 Inputs Numéricos (via Botões +/-)

| Input | Localização | Tipo | Incremento | Design |
|-------|------------|------|------------|--------|
| **Reps** | SeriesCard | Numérico | ±1 | Botões +/- com display central |
| **Peso** | SeriesCard | Numérico | ±1kg | Botões +/- com display central |
| **Tempo de Descanso** | SeriesCard | Numérico | ±5s | Botões +/- com display central |

### 4.3 Seleções

| Seleção | Localização | Tipo | Design |
|---------|------------|------|--------|
| **Objetivos** | OnboardingGoalPage | Múltipla escolha | Grid de botões |
| **Tipos de Treino** | OnboardingTrainingTypesPage | Múltipla escolha | Grid de botões |
| **Dias da Semana** | OnboardingDaysPage | Múltipla escolha | Grid de botões |
| **Grupos Musculares** | CreateWorkoutMuscles | Múltipla escolha | Grid de botões |
| **Exercícios** | CreateWorkoutExercises | Múltipla escolha | Lista de exercícios |

---

## 5. FLUXOS DE NAVEGAÇÃO

### 5.1 Fluxo de Autenticação

```
Splash (/) 
  → Landing (/landing)
    → Login (/login) → Home (/home)
    → Register (/register) → Onboarding → Home
```

### 5.2 Fluxo de Treino

```
Home (/home)
  → WorkoutList (/workout-list)
    → TreinoIdPage (/treino/:workoutPlanId)
      → ExerciseIdPage (/treino/:workoutPlanId/:workoutId/:exerciseId)
        → TreinoTempoDescansoPage (/treino/:workoutPlanId/:workoutId/:exerciseId/descanso)
          → ExerciseIdPage (próximo exercício)
            → ... (repete até último exercício)
              → WorkoutCompletionPage (/workout-completion)
                → Home (/home)
```

### 5.3 Fluxo de Criação de Treino

```
WorkoutList (/workout-list)
  → CreateWorkoutIntro (/workout/create/intro)
    → CreateWorkoutType (/workout/create/type)
      → CreateWorkoutName (/workout/create/name)
        → CreateWorkoutMuscles (/workout/create/muscles)
          → CreateWorkoutExercises (/workout/create/exercises)
            → CreateWorkoutDay (/workout/create/day)
              → CreateWorkoutConfig (/workout/create/config)
                → CreateWorkoutReady (/workout/create/ready)
                  → WorkoutList (/workout-list)
```

---

## 6. FUNCIONALIDADES POR PÁGINA

### 6.1 Home (`/home`)

**Funcionalidades**:
- Exibe saudação personalizada
- Mostra quantidade de treinos do dia
- Lista treinos do dia atual
- Navegação para detalhes do treino

**Interações**:
- Clique em card de treino → Navega para TreinoIdPage

---

### 6.2 WorkoutList (`/workout-list`)

**Funcionalidades**:
- Lista todos os treinos agrupados por dia
- Botão para criar novo treino
- Estado vazio com mensagem

**Interações**:
- Clique em card de treino → Navega para TreinoIdPage
- Clique em "Criar treino" → Navega para CreateWorkoutIntro

---

### 6.3 TreinoIdPage (`/treino/:workoutPlanId`)

**Funcionalidades**:
- Exibe header do treino com grupo muscular
- Carrossel de grupos musculares
- Lista de exercícios com status
- Timer do treino (quando ativo) - exibido no WorkoutActionBar

**Interações**:
- Clique em exercício → Navega para ExerciseIdPage
- Clique em exercício completado → Mostra detalhes (não navega)

**Nota**: O botão "iniciar treino" está no WorkoutActionBar (menubar contextual inferior), não na página em si

---

### 6.4 ExerciseIdPage (`/treino/:workoutPlanId/:workoutId/:exerciseId`)

**Funcionalidades**:
- Exibe nome e imagens do exercício
- Lista de séries com estados (active, pending, completed)
- Edição de reps, peso e tempo de descanso
- Timer de descanso
- Slide-to-complete quando todas as séries estão completas
- Navegação automática após completar exercício

**Interações**:
- Clique em reps/peso/tempo → Abre editor
- Botões +/- → Ajustam valores
- Botão "confirmar" → Salva valores
- Botão "iniciar" → Inicia descanso e completa série
- Slide-to-complete → Completa exercício e navega

**Estados**:
- Série active: Editável, pode iniciar descanso
- Série pending: Não editável, aguardando
- Série completed: Verde, não editável

---

### 6.5 WorkoutCompletionPage (`/workout-completion`)

**Funcionalidades**:
- Exibe congratulação
- Mostra estatísticas do treino:
  - Personal Records
  - Sequência (Streak)
  - Duração
  - Volume Total
- Linha do tempo visual
- Link para exercícios atualizados (se houver)

**Interações**:
- Clique em "Finalizar" → Navega para Home
- Clique em link de exercícios → Navega para página de progresso

---

### 6.6 StreakPage (`/streak`)

**Funcionalidades**:
- Calendário visual de treinos
- Popup ao clicar em dia com detalhes dos treinos

**Interações**:
- Clique em dia → Abre popup com treinos do dia
- Clique fora do popup → Fecha popup

---

## 7. CONTEXTUALMENUBAR (MENU INFERIOR)

### 7.1 NavigationMenuBar
**Aparece em**: Home, Streak, WorkoutList, MyWorkouts

**Botões**:
1. Home (ícone casa)
2. Streak (ícone calendário)
3. Treino (ícone haltere)
4. Sair (ícone logout)

**Design**: Fundo `rgba(36,36,36,0.7)` com blur, bordas arredondadas `999px`

---

### 7.2 WorkoutActionBar
**Aparece em**: TreinoIdPage

**Elementos**:
- Nome do treino
- Timer (quando ativo)
- Botão "iniciar treino" / "parar treino"

---

### 7.3 ExerciseCompleteBar
**Aparece em**: ExerciseIdPage

**Estados**:
1. **Timer apenas**: Quando séries não estão todas completas
2. **Slide-to-complete**: Quando todas as séries estão completas
3. **Concluído**: Quando exercício foi completado

---

### 7.4 RestTimerBar
**Aparece em**: TreinoTempoDescansoPage

**Elementos**: Timer de descanso

---

## 8. ESTADOS E INTERAÇÕES

### 8.1 Estados de Série

| Estado | Cor | Interatividade | Ações Disponíveis |
|--------|-----|----------------|-------------------|
| **active** | `#202020` | Total | Editar reps/peso/tempo, iniciar descanso |
| **pending** | `#202020` (60% opacidade) | Nenhuma | Nenhuma |
| **completed** | `#6D9F28` (verde) | Nenhuma | Nenhuma |

### 8.2 Estados de Exercício

| Estado | Visual | Ações |
|--------|--------|-------|
| **Pendente** | Card expansível | Expandir, navegar para exercício |
| **Completado** | Card com check verde | Expandir (só visualização) |

### 8.3 Estados de Treino

| Estado | Visual | Ações |
|--------|--------|-------|
| **Não iniciado** | Botão "iniciar treino" | Iniciar treino |
| **Em andamento** | Timer ativo, botão "parar treino" | Parar treino |
| **Completado** | Mensagem "Treino Concluído Hoje" | Visualização apenas |

---

## 9. DESIGN SYSTEM

### 9.1 Cores Principais

| Cor | Hex | Uso |
|-----|-----|-----|
| **Fundo Principal** | `#181818` | Background da maioria das páginas |
| **Fundo Cards** | `#202020` | Cards de exercícios, séries |
| **Fundo Cards Secundário** | `#2C2C2C` | Cards de treinos |
| **Verde Sucesso** | `#6D9F28` | Séries completadas, checks |
| **Verde Escuro** | `#43690F` | Detalhes de séries completadas |
| **Amarelo** | `#FDCB1A` | Botões de ação, highlights |
| **Azul** | `#288B9F` | Botões de ação, links |
| **Cinza Claro** | `#D9D9D9` | Botões secundários |
| **Cinza Médio** | `#484848` | Textos secundários, bordas |
| **Cinza Escuro** | `#252525` | Bordas, detalhes |

### 9.2 Tipografia

- **Fonte**: Alexandria (Regular, Medium, Bold)
- **Tamanhos**:
  - Títulos: `24px`, `28px`, `32px`
  - Texto normal: `14px`, `16px`, `18px`
  - Texto pequeno: `10px`, `12px`
- **Cores de texto**:
  - Principal: `#FFFFFF` (branco)
  - Secundário: `#C1C1C1`, `#484848`
  - Destaque: `#FDCB1A`, `#6D9F28`

### 9.3 Espaçamentos

- **Padding padrão**: `20px` (px-5)
- **Gap entre elementos**: `10px`, `20px`
- **Border radius**:
  - Cards: `20px`, `28px`, `35px`
  - Botões: `999px` (totalmente arredondado)
  - Inputs: `999px`

### 9.4 Componentes Reutilizáveis

1. **BackButton**: Botão voltar padronizado
2. **ExerciseCard**: Card de exercício
3. **SeriesCard**: Card de série
4. **ContextualMenuBar**: Menu inferior contextual
5. **WorkoutHeader**: Header do treino
6. **MuscleGroupCarousel**: Carrossel de grupos musculares

---

## 10. STORIES DE USUÁRIO

### 10.1 Como Usuário, eu quero...

1. **Fazer login na aplicação**
   - Acessar `/login`
   - Preencher email e senha
   - Clicar em "entrar"
   - Ser redirecionado para `/home`

2. **Ver meus treinos do dia**
   - Acessar `/home`
   - Ver lista de treinos planejados para hoje
   - Clicar em um treino para ver detalhes

3. **Iniciar um treino**
   - Acessar `/treino/:workoutPlanId`
   - Ver lista de exercícios
   - Clicar em "iniciar treino"
   - Ser redirecionado para primeiro exercício

4. **Completar uma série**
   - Acessar página do exercício
   - Ver série ativa
   - (Opcional) Ajustar reps/peso
   - Clicar em "iniciar" para completar série
   - Aguardar descanso ou pular

5. **Completar um exercício**
   - Completar todas as séries
   - Ver barra "slide-to-complete"
   - Arrastar barra até o final
   - Ser redirecionado para próximo exercício ou conclusão

6. **Ver conclusão do treino**
   - Completar último exercício
   - Ver página de conclusão com estatísticas
   - Clicar em "Finalizar"
   - Ser redirecionado para `/home`

7. **Criar um novo treino**
   - Acessar `/workout-list`
   - Clicar em "Criar treino"
   - Preencher informações nas etapas
   - Confirmar criação
   - Ver treino na lista

8. **Ver histórico de treinos**
   - Acessar `/streak`
   - Ver calendário com treinos completados
   - Clicar em um dia para ver detalhes

---

## 11. OBSERVAÇÕES DE DESIGN

### 11.1 Pontos Fortes
- Design consistente e moderno
- Cores bem definidas
- Navegação intuitiva
- Feedback visual claro (cores para estados)

### 11.2 Pontos de Atenção
- Alguns textos placeholder ("What is Lorem Ipsum?")
- Alguns componentes podem precisar de melhor responsividade
- Estados de loading podem ser melhorados visualmente

---

## 12. CONCLUSÃO

Este documento mapeia todas as funcionalidades, botões, inputs, páginas e fluxos da aplicação Treino App. Use este documento como referência para:
- Implementação de novas funcionalidades
- Correção de bugs
- Melhorias de UX/UI
- Documentação para novos desenvolvedores

---

**Última atualização**: 08/11/2025
**Versão**: 1.0

