# 🌱 Seed de Produção - Popular Banco Diretamente

Este script permite popular o banco de dados de **produção** diretamente da sua máquina local, sem depender do deploy automático do Render.

## 🎯 Por que usar este método?

- ✅ **Mais rápido**: Executa localmente sem limitações de timeout
- ✅ **Mais confiável**: Não depende do ambiente de produção
- ✅ **Mais controle**: Você vê o progresso em tempo real
- ✅ **Uma única vez**: Roda apenas quando necessário

---

## 📋 Pré-requisitos

1. Ter o Node.js instalado
2. Ter a URL do banco de produção PostgreSQL
3. Ter a chave da API do RapidAPI (ExerciseDB)

---

## ⚙️ Configuração

### 1. Criar arquivo `.env` no diretório `backend/`

```env
# URL do banco de produção (PostgreSQL no Render)
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# Chave da API ExerciseDB
RAPIDAPI_KEY="sua-chave-aqui"
RAPIDAPI_BASE_URL="https://exercisedb.p.rapidapi.com"
```

### 2. Instalar dependências (se ainda não instalou)

```bash
cd backend
npm install
```

---

## 🚀 Executar o Seed

### Método 1: Comando npm (recomendado)

```bash
npm run seed:production
```

### Método 2: Direto com ts-node

```bash
npx ts-node scripts/seed-production.ts
```

---

## 📊 O que o script faz?

1. **Conecta no banco de produção** usando a `DATABASE_URL` do `.env`
2. **Verifica quantos exercícios existem** atualmente
3. **Busca ~1324 exercícios da API ExerciseDB** (10 requisições, uma por bodyPart)
4. **Traduz tudo para português** (nomes, equipamentos, músculos)
5. **Remove exercícios antigos** da API (mantém os internos)
6. **Insere os novos exercícios** traduzidos
7. **Mostra o resultado** com estatísticas

---

## 📝 Exemplo de Saída

```
🚀 SEED DE PRODUÇÃO - Popula banco diretamente

📍 DATABASE_URL: postgresql://treino_user:***@dpg-xxx.oregon-postgr...

🔌 Testando conexão com o banco...
✅ Conectado ao banco de dados

📊 Exercícios atuais no banco: 10

🔄 Buscando exercícios da API ExerciseDB...
💡 Estratégia: Buscar por cada parte do corpo

📥 Buscando: back...
   ✅ 156 exercícios
📥 Buscando: cardio...
   ✅ 51 exercícios
📥 Buscando: chest...
   ✅ 102 exercícios
📥 Buscando: lower arms...
   ✅ 21 exercícios
📥 Buscando: lower legs...
   ✅ 48 exercícios
📥 Buscando: neck...
   ✅ 45 exercícios
📥 Buscando: shoulders...
   ✅ 123 exercícios
📥 Buscando: upper arms...
   ✅ 195 exercícios
📥 Buscando: upper legs...
   ✅ 301 exercícios
📥 Buscando: waist...
   ✅ 282 exercícios

✅ Total: 1324 exercícios

🗑️  Limpando exercícios antigos da API...
✅ 10 exercícios removidos

💾 Inserindo exercícios traduzidos...
   📈 Progresso: 50/1324 (3.8%)
   📈 Progresso: 100/1324 (7.6%)
   📈 Progresso: 150/1324 (11.3%)
   ...
   📈 Progresso: 1300/1324 (98.2%)

============================================================
✅ SEED CONCLUÍDO COM SUCESSO!
============================================================
📊 Inseridos: 1324
❌ Falhas: 0
📈 Total no banco: 1324
============================================================

🔤 Exemplos de exercícios:
  • Abdominal Crunch
    - Parte: Abdômen | Equipamento: Peso Corporal
  • Agachamento Com Barra
    - Parte: Coxas | Equipamento: Barra
  • Barra Fixa Supinada
    - Parte: Costas | Equipamento: Peso Corporal
  • Elevação Lateral
    - Parte: Ombros | Equipamento: Halter
  • Rosca Direta
    - Parte: Bíceps/Tríceps | Equipamento: Barra

✅ Banco de produção populado com sucesso!

🎉 Script finalizado!
```

---

## ⏱️ Tempo de Execução

- **Buscar API**: ~5 segundos (10 requisições × 500ms)
- **Inserir no banco**: ~2-3 minutos (1324 exercícios)
- **Total**: **~3-4 minutos** ⚡

---

## 🔒 Segurança

- ✅ O `.env` **NÃO** é commitado no Git (está no `.gitignore`)
- ✅ A `DATABASE_URL` fica apenas na sua máquina
- ✅ O script pede confirmação se o banco já tiver muitos exercícios

---

## 🔄 Quando usar novamente?

- Quando adicionar novos exercícios na API ExerciseDB
- Se o banco de produção for resetado
- Para atualizar traduções ou correções

---

## ❓ Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
npm run seed:production
```

### Erro: "RAPIDAPI_KEY não configurada"

Verifique se o arquivo `.env` existe e contém a chave:
```env
RAPIDAPI_KEY="sua-chave-aqui"
```

### Erro de conexão com o banco

Verifique se a `DATABASE_URL` está correta. Ela deve seguir o formato:
```
postgresql://user:password@host:port/database?sslmode=require
```

Você pode pegar a URL completa no dashboard do Render em:
**Database → Internal Database URL**

---

## 🎉 Pronto!

Depois de executar o script, seu banco de produção terá **1324 exercícios traduzidos** e prontos para uso!
