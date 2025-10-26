# 🤖 Auto-Seed em Produção

## Como Funciona

O sistema agora **popula o banco automaticamente** após o build no Render!

### Fluxo Automático

```
1. Push para GitHub
   ↓
2. Render detecta mudanças
   ↓
3. Executa: npm install
   ↓
4. Executa: npm run build
   ├── prisma generate
   ├── prisma migrate deploy
   ├── tsc (compila TypeScript)
   └── npm run postbuild ← NOVO!
       ├── Verifica se banco tem exercícios
       └── Se vazio, executa seed automaticamente
   ↓
5. Inicia: npm start
```

## Script de Post-Build

O arquivo `scripts/postbuild.js`:

- ✅ **Verifica** se o banco já tem exercícios
- ✅ **Executa seed** automaticamente se banco vazio
- ✅ **Não falha** o deploy se seed falhar (continua mesmo com erro)
- ✅ **Logs detalhados** de todo o processo

### Output Esperado

**Se banco vazio:**
```
🔍 Verificando se precisa popular banco de dados...
📊 Exercícios no banco: 0

🚀 Banco vazio! Iniciando seed de exercícios...
⏱️  Isso pode demorar 5-10 minutos...

🔄 Buscando exercícios da API ExerciseDB...
✅ 1324 exercícios encontrados
💾 Inserindo exercícios traduzidos no banco...
  ⏳ 100/1324 exercícios inseridos...
  ⏳ 200/1324 exercícios inseridos...
  ...
✅ Seed concluído!
```

**Se banco já populado:**
```
🔍 Verificando se precisa popular banco de dados...
📊 Exercícios no banco: 1324

✅ Banco já possui exercícios. Seed não necessário.
💡 Para atualizar exercícios, execute: npm run seed:exercises:api
```

## Vantagens

- 🚀 **Zero configuração manual** no Render
- ⚡ **Deploy totalmente automatizado**
- 🔄 **Idempotente** (não duplica dados)
- 🛡️ **Seguro** (não falha deploy se seed falhar)
- 📊 **Transparente** (logs claros do processo)

## Comandos Manuais (se necessário)

```bash
# Forçar seed novamente (atualizar exercícios)
npm run seed:exercises:api

# Verificar se seed rodou
curl https://amil-treino.onrender.com/api/exercises/stats
```

## Troubleshooting

### Seed não executou?

**Verificar logs do Render:**
1. Painel do Render
2. Aba "Logs"
3. Procurar por "🔍 Verificando se precisa popular banco"

### Seed falhou mas deploy funcionou?

**Isso é esperado!** O sistema não falha o deploy se o seed falhar.

Execute manualmente (se tiver acesso ao Shell):
```bash
npm run seed:exercises:api
```

### Quer forçar novo seed?

**Deletar exercícios e fazer redeploy:**
```sql
-- No Prisma Studio ou psql
DELETE FROM "Exercise" WHERE source = 'exercisedb';
```

Então:
```bash
# Trigger redeploy
git commit --allow-empty -m "trigger redeploy"
git push origin mvp-v0.01
```

## Tempo de Deploy

- **Primeiro deploy** (com seed): ~8-15 minutos
- **Deploys seguintes** (banco já populado): ~3-5 minutos

## Monitoramento

Após deploy, verifique:
```bash
# Quantos exercícios tem?
curl https://amil-treino.onrender.com/api/exercises/stats

# Deve retornar:
{
  "success": true,
  "data": {
    "total": 1324,
    "bySource": [...],
    "byBodyPart": [...]
  }
}
```

## Arquivos Envolvidos

```
backend/
├── package.json          # Script "postbuild" adicionado
├── scripts/
│   └── postbuild.js     # Script que verifica e popula banco
└── src/scripts/
    └── seedExercisesFromAPI.ts  # Seed de exercícios
```

## Fluxo de Desenvolvimento

```bash
# Desenvolvimento local (sem auto-seed)
npm run dev

# Build local (COM auto-seed se banco vazio)
npm run build

# Produção (Render - COM auto-seed se banco vazio)
git push origin mvp-v0.01
```

## Próximo Deploy

Basta fazer push:
```bash
git add .
git commit -m "sua mensagem"
git push origin mvp-v0.01
```

O resto é **AUTOMÁTICO**! 🎉
