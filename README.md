# 🏋️ Treino App

Sistema completo de gerenciamento de treinos com interface moderna e funcionalidades avançadas.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Registro e login de usuários
- Onboarding completo com informações pessoais
- Proteção de rotas e middleware de autenticação

### ✅ Criação de Treinos
- Interface intuitiva para criação de treinos
- Seleção de exercícios por categoria
- Configuração de séries, repetições e descanso
- Séries de aquecimento opcionais

### ✅ Sistema de Exercícios
- **6 Modalidades:** Musculação, Cardio, Yoga, Pilates, Abdominal, Corrida
- **APIs Integradas:** ExerciseDB (RapidAPI), Wger, Unsplash
- **Sistema Híbrido:** Cache + banco interno + APIs externas
- **Imagens:** Busca automática de imagens dos exercícios

### ✅ Performance e Cache
- Cache automático com NodeCache
- Sincronização em background
- Expansão automática da base de dados
- Limpeza de duplicatas

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express.js**
- **TypeScript** para tipagem
- **Prisma** + **SQLite** para banco de dados
- **JWT** para autenticação
- **NodeCache** para cache em memória
- **Axios** para requisições HTTP

### Frontend
- **React** + **TypeScript**
- **Vite** para build
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Axios** para comunicação com API

### APIs Externas
- **ExerciseDB** (RapidAPI) - Exercícios de musculação
- **Wger** - API gratuita de exercícios
- **Unsplash** - Imagens dos exercícios

## 📁 Estrutura do Projeto

```
treino/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Middlewares
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços de negócio
│   │   ├── types/          # Tipos TypeScript
│   │   └── server.ts       # Servidor principal
│   ├── prisma/             # Schema do banco
│   └── package.json
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos React
│   │   ├── services/       # Serviços de API
│   │   └── imports/        # Páginas principais
│   └── package.json
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run dev
```
API rodando em: `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Interface rodando em: `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` no backend com:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="seu_jwt_secret_aqui"

# RapidAPI
RAPIDAPI_KEY="sua_rapidapi_key_aqui"

# Unsplash
UNSPLASH_ACCESS_KEY="sua_unsplash_key_aqui"
```

## 📊 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Exercícios
- `GET /api/exercises` - Listar exercícios
- `GET /api/exercises/categories` - Categorias
- `GET /api/exercises/modal/:category` - Por modalidade
- `POST /api/exercises/expand` - Expandir base de dados

### Treinos
- `GET /api/workouts/plans` - Planos de treino
- `POST /api/workouts/plans` - Criar plano
- `GET /api/workouts/logs` - Logs de treino
- `POST /api/workouts/logs` - Registrar treino

## 🎯 Funcionalidades Testadas

✅ **Criação de usuário** com onboarding completo  
✅ **Criação de treino** de perna com 6 exercícios  
✅ **Séries de aquecimento** para os 3 primeiros exercícios  
✅ **Sistema híbrido** funcionando perfeitamente  
✅ **Cache automático** ativo  
✅ **6 modalidades** de exercícios disponíveis  

## 📈 Performance

- **Cache inteligente** com TTL configurável
- **Sincronização automática** em background
- **Expansão da base** de dados automática
- **Limpeza de duplicatas** automática

## 🔒 Segurança

- **JWT** para autenticação
- **Middleware** de proteção de rotas
- **Validação** de dados de entrada
- **Tratamento** de erros robusto

## 📝 Licença

Este projeto é de uso pessoal/educacional.

---

**Desenvolvido com ❤️ para facilitar a gestão de treinos!**
