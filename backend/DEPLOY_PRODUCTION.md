# 🚀 Deploy em Produção - Guia Completo

## ✅ Checklist de Deploy

### 1. Verificar Variáveis de Ambiente no Render

No painel do Render (https://dashboard.render.com), adicione/verifique estas variáveis:

```bash
# Database
DATABASE_URL=postgresql://treino_db_user:...@dpg-d3udtchr0fns73f4q7ag-a.oregon-postgres.render.com/treino_db

# Security
JWT_SECRET=seu-jwt-secret-forte-aqui

# Frontend
FRONTEND_URL=https://frontend-2t7iujpqn-andreviniciups-projects.vercel.app

# RapidAPI (para seed)
RAPIDAPI_KEY=2206ac6aa5msh83d4d102127c2cbp1311dajsnf515e6c2463a
RAPIDAPI_HOST=exercisedb.p.rapidapi.com
RAPIDAPI_BASE_URL=https://exercisedb.p.rapidapi.com

# ExerciseDB Endpoints
EXERCISEDB_EXERCISES_URL=https://exercisedb.p.rapidapi.com/exercises
EXERCISEDB_TARGET_LIST_URL=https://exercisedb.p.rapidapi.com/exercises/targetList
EXERCISEDB_BODYPART_LIST_URL=https://exercisedb.p.rapidapi.com/exercises/bodyPartList
EXERCISEDB_EQUIPMENT_LIST_URL=https://exercisedb.p.rapidapi.com/exercises/equipmentList

# Wger API (Fallback)
WGER_BASE_URL=https://wger.de/api/v2

# ML Service (opcional por enquanto)
ML_SERVICE_URL=https://seu-ml-service.onrender.com

# Ambiente
NODE_ENV=production
PORT=3001
```

### 2. Fazer Deploy das Mudanças

```bash
# Commitar e fazer push
git add -A
git commit -m "feat: add database-first exercise system with translations"
git push origin mvp-v0.01
```

O Render vai fazer deploy automaticamente.

### 3. Executar Migrations no Render

1. Acesse o painel do Render
2. Vá em seu serviço **treino-backend**
3. Clique em **Shell** (ícone de terminal)
4. Execute:

```bash
cd /opt/render/project/src
npm run prisma:generate
npx prisma migrate deploy
```

### 4. Executar Seed dos Exercícios

Ainda no Shell do Render:

```bash
npm run seed:exercises:api
```

Isso vai:
- ✅ Buscar ~1300+ exercícios da ExerciseDB
- ✅ Traduzir tudo para português
- ✅ Salvar no PostgreSQL do Render
- ⏱️ Demora ~5-10 minutos

**Output esperado:**
```
🚀 Iniciando seed de exercícios...

🔄 Buscando exercícios da API ExerciseDB...
✅ 1324 exercícios encontrados

📊 Estatísticas da API:
- Total: 1324 exercícios
- Por parte do corpo:
  • back: 116
  • cardio: 48
  • chest: 67
  • lower arms: 41
  ...

🗑️  Limpando exercícios antigos da API...
✅ 0 exercícios antigos removidos

💾 Inserindo exercícios traduzidos no banco...
  ⏳ 100/1324 exercícios inseridos...
  ⏳ 200/1324 exercícios inseridos...
  ...
  
✅ Seed concluído!

📈 Resumo:
  • Inseridos: 1324
  • Falhas: 0
  • Total no banco: 1324

🔤 Exemplos de traduções:

  • Agachamento Com Barra
    - Parte: Coxas
    - Equipamento: Barra
    - Alvo: Quadríceps

  • Supino Reto Com Halter
    - Parte: Peito
    - Equipamento: Halter
    - Alvo: Peitorais
```

### 5. Testar API em Produção

```bash
# Testar endpoint de exercícios
curl https://amil-treino.onrender.com/api/exercises/stats

# Deve retornar algo como:
{
  "success": true,
  "data": {
    "total": 1324,
    "bySource": [
      { "source": "exercisedb", "_count": 1324 }
    ],
    "byBodyPart": [
      { "bodyPart": "Costas", "_count": 116 },
      { "bodyPart": "Peito", "_count": 67 },
      { "bodyPart": "Ombros", "_count": 82 },
      ...
    ]
  }
}
```

```bash
# Testar busca de exercícios por parte do corpo
curl https://amil-treino.onrender.com/api/exercises/bodypart/Peito

# Testar busca geral
curl https://amil-treino.onrender.com/api/exercises/search?q=agachamento
```

### 6. Verificar Frontend

1. Acesse: https://frontend-2t7iujpqn-andreviniciups-projects.vercel.app
2. Faça login
3. Vá em **Criar Treino**
4. Selecione músculos
5. Avance para página de exercícios
6. **Deve aparecer exercícios em português** sem barra de busca

### 7. Troubleshooting

#### Seed falha com erro de API
```bash
# Verificar se RAPIDAPI_KEY está configurada
echo $RAPIDAPI_KEY

# Se estiver vazia, adicionar no painel do Render
```

#### Migrations falham
```bash
# Resetar migrations (cuidado, apaga dados!)
npx prisma migrate reset --force
npx prisma migrate deploy
```

#### Exercícios não aparecem
```bash
# Verificar se seed rodou
curl https://amil-treino.onrender.com/api/exercises/stats

# Se total=0, rodar seed novamente
npm run seed:exercises:api
```

#### Frontend não mostra exercícios
- Verificar console do navegador
- Verificar se backend está respondendo
- Verificar CORS (FRONTEND_URL configurado?)

## 📋 Resumo dos Comandos

```bash
# 1. Push código
git add -A
git commit -m "feat: database-first exercise system"
git push origin mvp-v0.01

# 2. No Shell do Render
npm run prisma:generate
npx prisma migrate deploy
npm run seed:exercises:api

# 3. Testar
curl https://amil-treino.onrender.com/api/exercises/stats
```

## 🎯 Resultado Final

Após o deploy:
- ✅ Backend responde em https://amil-treino.onrender.com
- ✅ PostgreSQL com 1300+ exercícios em português
- ✅ Frontend consome dados do banco
- ✅ Sem dependência de APIs externas em runtime
- ✅ Latência reduzida de ~500ms para ~50ms
- ✅ Custo reduzido (1 chamada de API vs milhares)

## 🔄 Atualizações Futuras

Para adicionar novos exercícios da API:

```bash
# No Shell do Render
npm run seed:exercises:api
```

Isso vai atualizar com os exercícios mais recentes da ExerciseDB.

## ⚠️ Importante

- O seed **deve** ser executado **depois** do deploy
- O seed **só precisa** rodar **uma vez** por ambiente
- Se rodar novamente, vai **substituir** os exercícios da API
- Exercícios **internos** (source='internal') **não** são afetados
