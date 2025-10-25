# Como Resetar o Banco de Dados no Render

## Problema
As migrations antigas foram criadas para SQLite e usam tipos incompatíveis com PostgreSQL (DATETIME ao invés de TIMESTAMP).

## Solução

### Opção 1: Via Render Dashboard (Recomendado)

1. Acesse seu serviço no Render
2. Vá em **Shell** (Connect Shell)
3. Execute:
```bash
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Opção 2: Via Render Database Dashboard

1. Acesse o banco de dados no Render
2. Vá na aba **SQL**
3. Execute o SQL abaixo:

```sql
-- Drop todas as tabelas
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Exercise" CASCADE;
DROP TABLE IF EXISTS "WorkoutPlan" CASCADE;
DROP TABLE IF EXISTS "WorkoutDay" CASCADE;
DROP TABLE IF EXISTS "WorkoutExercise" CASCADE;
DROP TABLE IF EXISTS "ExerciseLog" CASCADE;
DROP TABLE IF EXISTS "UserStreak" CASCADE;
DROP TABLE IF EXISTS "Achievement" CASCADE;
DROP TABLE IF EXISTS "UserAchievement" CASCADE;
DROP TABLE IF EXISTS "MLTrainingData" CASCADE;
DROP TABLE IF EXISTS "UserFeedback" CASCADE;
DROP TABLE IF EXISTS "MLModel" CASCADE;
DROP TABLE IF EXISTS "SystemMetrics" CASCADE;
```

### Opção 3: Recriar o Database (Mais Simples)

1. No Render Dashboard, vá em **Database**
2. Clique no seu banco PostgreSQL
3. **Settings** → **Danger Zone** → **Delete Database**
4. Crie um novo database PostgreSQL
5. Atualize a `DATABASE_URL` no seu serviço backend

### Depois do Reset

Após resetar o banco, faça um novo deploy:

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
