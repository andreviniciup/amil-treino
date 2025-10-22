# Treino Backend API

Backend completo para o aplicativo de treinos, incluindo integração com ExerciseDB API, autenticação JWT, gerenciamento de planos de treino e logs de progresso.

## 🚀 Tecnologias

- **Node.js** + **Express** - Server e API REST
- **TypeScript** - Type safety
- **Prisma** - ORM com SQLite
- **ExerciseDB API** (RapidAPI) - Banco de exercícios com imagens/GIFs
- **JWT** + **bcrypt** - Autenticação e segurança
- **node-cache** - Cache de requisições para ExerciseDB

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta RapidAPI com acesso ao ExerciseDB (grátis até 150 requests/dia)

## ⚙️ Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Edite o arquivo `.env` e adicione suas credenciais:

```env
# ExerciseDB API (RapidAPI)
RAPIDAPI_KEY=sua_chave_aqui

# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=troque_por_uma_senha_segura
JWT_EXPIRE=7d
```

#### Como obter a API Key do RapidAPI:

1. Acesse [https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. Crie uma conta gratuita
3. Clique em "Subscribe to Test"
4. Escolha o plano gratuito (150 requests/day)
5. Copie sua `X-RapidAPI-Key` e cole no `.env`

### 3. Configurar o banco de dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar banco de dados e tabelas
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

## 🏃 Executar

### Modo desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Build para produção

```bash
npm run build
npm start
```

Servidor rodando em: `http://localhost:3001`

## 📚 Endpoints da API

### Health Check

```http
GET /health
GET /
```

### Usuários e Autenticação

```http
POST /api/users/register
Body: { email, name, password }

POST /api/users/login
Body: { email, password }

GET /api/users/profile
Headers: { Authorization: Bearer <token> }
```

### Exercícios (ExerciseDB)

```http
GET /api/exercises
GET /api/exercises/search?q=supino
GET /api/exercises/bodypart/:bodyPart
GET /api/exercises/category/:category
GET /api/exercises/:id
POST /api/exercises/cache/clear
```

Categorias disponíveis:
- `musculacao` - Mapeado para: chest, back, legs, shoulders, arms
- `cardio` - Exercícios cardiovasculares
- `yoga`, `mobilidade`, `crossfit`, `pilates`, `natacao`, `lutas`

### Planos de Treino (Requer autenticação)

```http
POST /api/workouts/plans
Body: CreateWorkoutPlanDto (ver types/index.ts)

GET /api/workouts/plans
GET /api/workouts/plans/:id
PUT /api/workouts/plans/:id
DELETE /api/workouts/plans/:id
```

### Logs e Progresso (Requer autenticação)

```http
POST /api/workouts/logs
Body: CreateWorkoutLogDto

GET /api/workouts/logs
GET /api/workouts/logs/:id
GET /api/workouts/stats
```

## 🗂️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (database)
│   ├── controllers/     # Lógica de controle
│   │   ├── userController.ts
│   │   ├── exerciseController.ts
│   │   ├── workoutController.ts
│   │   └── logController.ts
│   ├── services/        # Serviços externos (ExerciseDB)
│   │   └── exerciseDBService.ts
│   ├── routes/          # Definição de rotas
│   │   ├── userRoutes.ts
│   │   ├── exerciseRoutes.ts
│   │   └── workoutRoutes.ts
│   ├── middleware/      # Middlewares (auth, errors)
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── types/           # TypeScript types e DTOs
│   │   └── index.ts
│   └── server.ts        # Entry point
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── migrations/      # Migrations
├── .env                 # Variáveis de ambiente
└── package.json
```

## 🗄️ Modelo de Dados

### User
- Usuário do aplicativo
- Relacionado a: WorkoutPlan, WorkoutLog

### WorkoutPlan
- Plano de treino (ex: "Treino de Hipertrofia - 5x semana")
- Relacionado a: User, Workout[]

### Workout
- Treino específico de um dia (ex: "Segunda - Peito e Tríceps")
- Relacionado a: WorkoutPlan, WorkoutExercise[]

### WorkoutExercise
- Exercício dentro de um treino com configurações
- Inclui: sets, reps, weight, restTime, gifUrl, etc.

### WorkoutLog
- Registro de um treino concluído
- Relacionado a: User, ExerciseLog[]

### ExerciseLog
- Registro de um exercício específico dentro do treino
- Inclui: sets executados, reps, pesos usados

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após fazer login ou registro, você receberá um token que deve ser enviado no header de requisições protegidas:

```http
Authorization: Bearer seu_token_aqui
```

## 🚨 Tratamento de Erros

A API retorna respostas padronizadas:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## 💾 Cache

O ExerciseDB API tem cache de 1 hora para economizar requisições. Para limpar o cache:

```http
POST /api/exercises/cache/clear
```

## 🧪 Desenvolvimento

### Ver logs do Prisma

No arquivo `.env`, altere:
```env
NODE_ENV=development
```

Isso ativa logs detalhados de queries do Prisma.

### Resetar banco de dados

```bash
rm dev.db
npx prisma migrate dev
```

### Visualizar banco de dados

```bash
npm run prisma:studio
```

Abre uma interface visual em `http://localhost:5555`

## 📝 Notas

- O plano gratuito do ExerciseDB permite 150 requests/dia
- O cache ajuda a economizar requests
- SQLite é usado para desenvolvimento, mas o Prisma suporta PostgreSQL, MySQL, etc. para produção
- Altere `JWT_SECRET` em produção para uma senha forte
- Os exercícios do ExerciseDB incluem GIFs animados de demonstração

## 🔗 Links Úteis

- [ExerciseDB API Docs](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)

## 📄 Licença

ISC



