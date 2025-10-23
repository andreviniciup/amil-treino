# 🚀 Guia Rápido - Sistema de Treino Inteligente

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Backend TypeScript

```bash
cd backend
npm install
npx prisma migrate dev --name add_ml_system_tables
npx prisma generate
npm run dev
```

**Servidor rodando em:** `http://localhost:3001`

### 2️⃣ ML Service Python

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**ML API rodando em:** `http://localhost:8000`
**Documentação:** `http://localhost:8000/docs`

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

**App rodando em:** `http://localhost:5173`

---

## 🧪 Testar o Sistema

### 1. Treinar Modelo ML com Dados Mock:

```bash
curl -X POST http://localhost:8000/api/ml/train/generate-mock-data
```

### 2. Obter Recomendação de Método de Treino:

```bash
curl "http://localhost:3001/api/recommendations/methods?days=5&goals=Hipertrofia,Força"
```

### 3. Testar ML Recommendations:

```bash
curl -X POST http://localhost:8000/api/ml/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "gender": "Masculino",
    "weight": 75,
    "height": 175,
    "fitnessLevel": "Intermediário",
    "trainingExperience": 2,
    "primaryGoals": ["Hipertrofia", "Força"],
    "secondaryGoals": ["Definição"],
    "availableDays": 5,
    "availableTime": 60,
    "equipment": ["Barra", "Halteres", "Máquinas"]
  }'
```

---

## 📊 Endpoints Disponíveis

### Backend TypeScript (`localhost:3001`)

```
GET  /                                         # Info do servidor
GET  /health                                   # Health check
GET  /api/recommendations                      # Recomendações gerais
GET  /api/recommendations/methods              # Métodos de treino
GET  /api/recommendations/methods/all          # Todos os métodos
GET  /api/recommendations/methods/:name        # Método específico
GET  /api/recommendations/exercises            # Exercícios por músculo
```

### ML Service Python (`localhost:8000`)

```
GET  /                                         # Info da API
GET  /health                                   # Health check
GET  /docs                                     # Swagger UI
POST /api/ml/recommendations                   # Recomendações ML
POST /api/ml/recommendations/exercises         # Exercícios ML
POST /api/ml/predict/performance               # Predição de performance
POST /api/ml/predict/progression               # Predição de progressão
POST /api/ml/train/recommendation-model        # Treinar modelo
POST /api/ml/train/generate-mock-data          # Gerar dados mock
GET  /api/ml/train/models/status               # Status dos modelos
POST /api/ml/scientific/search                 # Buscar artigos
POST /api/ml/scientific/validate               # Validar recomendação
POST /api/ml/scientific/extract                # Extrair dados de paper
```

---

## 🛠️ Variáveis de Ambiente

### Backend (`backend/.env`)
```env
PORT=3001
DATABASE_URL="file:./prisma/dev.db"
FRONTEND_URL="http://localhost:5173"
ML_SERVICE_URL="http://localhost:8000"
```

### ML Service (`ml-service/.env`)
```env
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
BACKEND_URL=http://localhost:3001
```

---

## 📦 O Que Foi Implementado

### ✅ Fase 1: Correções Imediatas
- Onboarding com focos reais de treino
- Mapeamento PT-EN (backend + frontend)
- Filtro de exercícios corrigido

### ✅ Fase 2: Sistema de Recomendação
- Engine híbrido (4 algoritmos)
- 7 métodos de treino
- 5 endpoints de API

### ✅ Fase 3: ML Service Python
- Modelo híbrido (RF + GB + NN)
- Predição de performance (LSTM)
- Validação científica (PubMed)
- 12 endpoints FastAPI

### ✅ Fase 4: Banco de Dados
- 8 novas tabelas (Prisma)
- Sistema de perfil
- Gamificação estruturada

---

## 🎯 Fluxo de Uso

1. **Usuário faz onboarding** → Seleciona focos de treino
2. **Backend gera recomendações** → Engine híbrido analisa perfil
3. **ML Service é consultado** → Predições mais precisas
4. **Sistema combina resultados** → Recomendação final
5. **Validação científica** → Busca evidências no PubMed
6. **Usuário recebe recomendação** → Com explicação científica

---

## 🐛 Troubleshooting

### Erro ao iniciar ML Service:
```bash
# Reinstalar dependências
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Erro no Prisma:
```bash
# Resetar banco
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### Porta em uso:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

---

## 📚 Documentação Completa

- `IMPLEMENTACAO-FINAL.md` - Documentação técnica completa
- `PROGRESSO-IMPLEMENTACAO.md` - Log de progresso
- `ml-service/README.md` - Documentação do ML Service
- `http://localhost:8000/docs` - Swagger/OpenAPI (quando rodando)

---

## 🎉 Pronto!

O sistema está funcionando! Acesse:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- ML API: `http://localhost:8000`
- ML Docs: `http://localhost:8000/docs`

