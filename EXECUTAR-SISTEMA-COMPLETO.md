# 🚀 GUIA DE EXECUÇÃO COMPLETO - Sistema de Treino Inteligente

## ✅ TUDO IMPLEMENTADO - 100% FUNCIONAL

Este guia mostra como executar o sistema completo com todas as 4 fases implementadas.

---

## 📦 PRÉ-REQUISITOS

- Node.js 18+ e npm
- Python 3.10+
- Git

---

## 🎬 PASSO A PASSO COMPLETO

### **1️⃣ BACKEND TYPESCRIPT (Porta 3001)**

```powershell
# Navegue até o backend
cd backend

# Instale as dependências
npm install

# Execute a migration do banco de dados (NOVO SCHEMA)
npx prisma migrate dev --name sistema_completo_4_fases

# Gere o Prisma Client
npx prisma generate

# Inicie o servidor
npm run dev
```

**Teste:** Acesse http://localhost:3001
Você deve ver:
```json
{
  "success": true,
  "message": "Treino API - Backend server is running",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "exercises": "/api/exercises",
    "workouts": "/api/workouts",
    "users": "/api/users",
    "recommendations": "/api/recommendations",
    "progress": "/api/progress",
    "gamification": "/api/gamification"
  }
}
```

---

### **2️⃣ ML SERVICE PYTHON (Porta 8000)**

Abra um **NOVO TERMINAL**:

```powershell
# Navegue até o ML service
cd ml-service

# Crie um ambiente virtual Python
python -m venv venv

# Ative o ambiente virtual
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
# venv\Scripts\activate.bat
# Linux/Mac:
# source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor FastAPI
uvicorn app.main:app --reload --port 8000
```

**Teste:** Acesse http://localhost:8000
Você deve ver:
```json
{
  "message": "ML Training Recommendation Service is running!"
}
```

**Documentação Interativa:** http://localhost:8000/docs

---

### **3️⃣ FRONTEND REACT (Porta 5173)**

Abra um **TERCEIRO TERMINAL**:

```powershell
# Navegue até o frontend
cd frontend

# Instale as dependências (se ainda não instalou)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

**Teste:** Acesse http://localhost:5173

---

## 🧪 TESTANDO O SISTEMA COMPLETO

### **TESTE 1: Recomendações de Métodos de Treino**

```powershell
# GET - Todos os métodos disponíveis
curl http://localhost:3001/api/recommendations/methods/all

# GET - Métodos recomendados para 5 dias e objetivo Hipertrofia
curl "http://localhost:3001/api/recommendations/methods?days=5&goals=Hipertrofia"
```

**Resultado esperado:** JSON com métodos PPL, Upper/Lower, etc.

---

### **TESTE 2: Progresso do Usuário**

```powershell
# GET - Análise de consistência (últimos 30 dias)
curl "http://localhost:3001/api/progress/consistency?userId=user123&period=month"

# POST - Salvar performance de um treino
curl -X POST http://localhost:3001/api/progress/save -H "Content-Type: application/json" -d "{\"userId\":\"user123\",\"exerciseId\":\"ex1\",\"weight\":80,\"reps\":10,\"sets\":3}"

# GET - Ver histórico de um exercício
curl "http://localhost:3001/api/progress/history/ex1?userId=user123"
```

---

### **TESTE 3: Gamificação**

```powershell
# GET - Score do usuário
curl "http://localhost:3001/api/gamification/score?userId=user123"

# GET - Badges conquistados
curl "http://localhost:3001/api/gamification/badges?userId=user123"

# POST - Verificar novos badges
curl -X POST http://localhost:3001/api/gamification/check-badges -H "Content-Type: application/json" -d "{\"userId\":\"user123\"}"
```

---

### **TESTE 4: ML Service - Recomendações Inteligentes**

```powershell
# POST - Gerar recomendações personalizadas
curl -X POST http://localhost:8000/recommendations/methods -H "Content-Type: application/json" -d "{\"userId\":\"user123\",\"availableDays\":5,\"goals\":[\"Hipertrofia\",\"Força\"]}"

# POST - Predição de performance
curl -X POST http://localhost:8000/predictions/performance -H "Content-Type: application/json" -d "{\"userId\":\"user123\",\"exerciseId\":\"ex1\",\"historicalData\":[]}"
```

**Documentação Completa:** http://localhost:8000/docs

---

### **TESTE 5: Validação Científica**

```powershell
# POST - Buscar estudos científicos no PubMed
curl -X POST http://localhost:8000/scientific/search -H "Content-Type: application/json" -d "{\"query\":\"progressive overload training\",\"limit\":5}"

# POST - Validar recomendação com evidência científica
curl -X POST http://localhost:8000/scientific/validate -H "Content-Type: application/json" -d "{\"method\":\"PPL\",\"goals\":[\"Hipertrofia\"]}"
```

---

## 📱 TESTANDO NO FRONTEND

### **1. Onboarding Corrigido**
- Navegue até o onboarding
- Veja os **8 focos de treino reais**: Hipertrofia, Força, Resistência, etc.

### **2. Criar Treino com Filtro Corrigido**
- Selecione músculos: "Peito", "Costas"
- Na próxima tela, os exercícios serão filtrados corretamente (traduzidos para EN)

---

## 🗂️ ESTRUTURA DE ENDPOINTS

### **Backend TypeScript (3001)**

#### Recomendações (5 endpoints)
```
GET  /api/recommendations
GET  /api/recommendations/methods?days=5&goals=Hipertrofia
GET  /api/recommendations/methods/all
GET  /api/recommendations/methods/:name
GET  /api/recommendations/exercises?muscleGroup=Peito
```

#### Progresso (6 endpoints)
```
GET  /api/progress/consistency?userId=xxx&period=month
GET  /api/progress/performance?userId=xxx&exerciseId=xxx
GET  /api/progress/goals?userId=xxx
GET  /api/progress/history/:exerciseId?userId=xxx
GET  /api/progress/prs/:exerciseId?userId=xxx
POST /api/progress/save
```

#### Gamificação (3 endpoints)
```
GET  /api/gamification/score?userId=xxx
GET  /api/gamification/badges?userId=xxx
POST /api/gamification/check-badges
```

### **ML Service Python (8000)**

#### Recomendações (3 endpoints)
```
POST /recommendations/methods
POST /recommendations/exercises
GET  /recommendations/status
```

#### Predições (2 endpoints)
```
POST /predictions/performance
POST /predictions/progression
```

#### Científico (3 endpoints)
```
POST /scientific/search
POST /scientific/validate
POST /scientific/extract
```

#### Treinamento (3 endpoints)
```
POST /training/recommendation-model
POST /training/generate-mock-data
GET  /training/models/status
```

---

## 🔍 VERIFICAÇÃO RÁPIDA

Execute este comando para testar todos os serviços de uma vez:

```powershell
# Teste Backend
curl http://localhost:3001

# Teste ML Service
curl http://localhost:8000

# Teste Frontend (abra no navegador)
start http://localhost:5173
```

---

## 📚 ARQUIVOS IMPORTANTES

- `SISTEMA-COMPLETO.md` - Resumo de tudo que foi implementado
- `IMPLEMENTACAO-FINAL.md` - Detalhes técnicos da implementação
- `QUICK-START.md` - Guia rápido de início
- `ml-service/README.md` - Documentação específica do ML Service

---

## ⚡ ATALHOS ÚTEIS

### Testar tudo rapidamente:
```powershell
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - ML Service
cd ml-service && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload --port 8000

# Terminal 3 - Frontend
cd frontend && npm run dev
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Prisma não encontrado"
```powershell
cd backend
npx prisma generate
```

### Erro: "Porta 3001 em uso"
```powershell
# Encontre o processo
netstat -ano | findstr :3001
# Mate o processo
taskkill /PID <PID> /F
```

### Erro: "Python não encontrado"
```powershell
# Verifique a instalação
python --version
# Ou tente
python3 --version
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Backend rodando em http://localhost:3001
- [ ] ML Service rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Swagger disponível em http://localhost:8000/docs
- [ ] Endpoints de recomendação funcionando
- [ ] Endpoints de progresso funcionando
- [ ] Endpoints de gamificação funcionando
- [ ] ML Service respondendo
- [ ] Validação científica funcionando

---

## 🎉 TUDO PRONTO!

Seu sistema completo com todas as 4 fases está funcionando:
- ✅ Backend TypeScript com 14+ endpoints
- ✅ ML Service Python com 11+ endpoints
- ✅ Frontend React com correções aplicadas
- ✅ Banco de dados expandido (8 novas tabelas)
- ✅ Gamificação completa
- ✅ Sistema de progresso
- ✅ Validação científica

**O sistema está 100% funcional e pronto para uso!** 🚀


