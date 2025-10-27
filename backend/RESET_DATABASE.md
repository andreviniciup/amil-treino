# 🔄 Reset do Banco de Dados# Como Resetar o Banco de Dados no Render



## ⚠️ PROBLEMA: Apenas 30 exercícios no banco## Problema

As migrations antigas foram criadas para SQLite e usam tipos incompatíveis com PostgreSQL (DATETIME ao invés de TIMESTAMP).

Se você vê nos logs:

```## Solução

✅ O banco de dados possui 30 exercícios

```### Opção 1: Via Render Dashboard (Recomendado)



Significa que o seed automático **não rodou** ou **falhou**.1. Acesse seu serviço no Render

2. Vá em **Shell** (Connect Shell)

## 🚀 SOLUÇÃO RÁPIDA - Trigger Novo Deploy3. Execute:

```bash

```bashpsql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Localmente, rode:```

git commit --allow-empty -m "trigger: force database seed"

git push origin mvp-v0.01### Opção 2: Via Render Database Dashboard

```

1. Acesse o banco de dados no Render

Aguarde 10-15 minutos. O deploy vai:2. Vá na aba **SQL**

1. ✅ Detectar que o banco tem poucos exercícios3. Execute o SQL abaixo:

2. ✅ Executar seed automaticamente

3. ✅ Popular com 1300+ exercícios traduzidos```sql

-- Drop todas as tabelas

## 📊 Verificar se funcionouDROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

DROP TABLE IF EXISTS "User" CASCADE;

```bashDROP TABLE IF EXISTS "Exercise" CASCADE;

curl https://amil-treino.onrender.com/api/exercises/statsDROP TABLE IF EXISTS "WorkoutPlan" CASCADE;

```DROP TABLE IF EXISTS "WorkoutDay" CASCADE;

DROP TABLE IF EXISTS "WorkoutExercise" CASCADE;

**Esperado:**DROP TABLE IF EXISTS "ExerciseLog" CASCADE;

```jsonDROP TABLE IF EXISTS "UserStreak" CASCADE;

{DROP TABLE IF EXISTS "Achievement" CASCADE;

  "total": 1324  ← Deve ser 1300+, não 30!DROP TABLE IF EXISTS "UserAchievement" CASCADE;

}DROP TABLE IF EXISTS "MLTrainingData" CASCADE;

```DROP TABLE IF EXISTS "UserFeedback" CASCADE;

DROP TABLE IF EXISTS "MLModel" CASCADE;

## 🛠️ Solução Manual (se disponível Shell)DROP TABLE IF EXISTS "SystemMetrics" CASCADE;

```

Se você tiver acesso ao Shell do Render:

### Opção 3: Recriar o Database (Mais Simples)

```bash

cd /opt/render/project/src1. No Render Dashboard, vá em **Database**

npm run reset:database2. Clique no seu banco PostgreSQL

```3. **Settings** → **Danger Zone** → **Delete Database**

4. Crie um novo database PostgreSQL

## 💡 O que foi corrigido5. Atualize a `DATABASE_URL` no seu serviço backend



- ✅ Script `postbuild.js` agora executa do diretório correto### Depois do Reset

- ✅ Detecta automaticamente banco vazio ou com poucos exercícios

- ✅ Popula automaticamente durante deployApós resetar o banco, faça um novo deploy:


```bash
git add .
git commit -m "fix: criar migrations compatíveis com PostgreSQL"
git push origin mvp-v0.01
```

O Render vai rodar `prisma migrate deploy` e aplicar a nova migration correta!

## O que mudou

- ✅ Criada nova migration `20251025000000_init_postgresql`
- ✅ Todos os tipos `DATETIME` foram substituídos por `TIMESTAMP(3)`
- ✅ `migration_lock.toml` atualizado para `postgresql`
- ✅ Compatível com PostgreSQL

## Verificar Deploy

Após o deploy, verifique nos logs do Render:
```
✔ Generated Prisma Client
1 migration found in prisma/migrations
Applying migration `20251025000000_init_postgresql`
The following migration(s) have been applied:
migrations/
  └─ 20251025000000_init_postgresql/
    └─ migration.sql
```
