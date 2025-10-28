# 🤖 Auto-Seed em Produção - v0.01 ATUALIZADO

## 🎯 Nova Abordagem: Seed INTELIGENTE Durante o Build

O sistema agora popula o banco **automaticamente** durante o build no Render, **sem APIs externas** e **sem necessidade de acesso ao shell**!

## 🔄 Como Funciona Agora

### Fluxo Automático no Render

```
1. Push para GitHub
   ↓
2. Render detecta mudanças
   ↓
3. Executa: npm install
   ↓
4. Executa: npm run build
   ├── prisma generate          (Gera Prisma Client)
   ├── prisma migrate deploy    (Aplica migrations)
   ├── tsc                      (Compila TypeScript)
   ├── npm run postbuild        (Scripts auxiliares)
   └── npm run auto-seed        ← 🆕 NOVO!
       ├── Verifica contagem de exercícios
       ├── Se > 50 → PULA (banco já populado)
       └── Se < 50 → POPULA automaticamente
   ↓
5. Inicia: npm start
   ↓
6. Servidor pronto com exercícios disponíveis ✅
```

## 📦 Script de Auto-Seed

**Arquivo:** `scripts/auto-seed-production.js`

### Lógica Inteligente:

1. **Verifica contagem** de exercícios no banco
2. **Se > 50 exercícios:**
   - ✅ Pula seed (banco já tem dados)
   - ⚡ Build continua rápido
3. **Se < 50 exercícios:**
   - 🚀 Inicia seed automático
   - 📁 Tenta usar `data/exercises.json` (se existir)
   - � Se não existir → cria 30 exercícios básicos (fallback)
4. **Verifica resultado** e exibe logs
5. **Finaliza** sem falhar o build

### Outputs Esperados

**Cenário 1: Banco já populado (>50 exercícios)**
```bash
[Build] > npm run auto-seed
[Build] 🔍 Verificando estado do banco de dados...
[Build] 📊 Exercícios no banco: 873
[Build] ✅ Banco já possui exercícios suficientes. Seed não necessário.
[Build] ✔ Build completed successfully (30 seconds)
```

**Cenário 2: Banco vazio - Seed com JSON**
```bash
[Build] > npm run auto-seed
[Build] 🔍 Verificando estado do banco de dados...
[Build] 📊 Exercícios no banco: 0
[Build] ⚠️  Banco com poucos exercícios! Iniciando seed automático...
[Build] 📁 Encontrado arquivo exercises.json, usando dados locais...
[Build] 📦 Carregando 873 exercícios do JSON...
[Build]    ✓ 100 exercícios criados...
[Build]    ✓ 200 exercícios criados...
[Build]    ... (continua)
[Build]    ✓ 873 exercícios criados...
[Build] ✅ Seed do JSON concluído: 873 criados, 0 já existiam
[Build] 📊 Total no banco: 873
[Build] 🎉 Banco populado com sucesso!
[Build] ✔ Build completed successfully (2 minutes)
```

**Cenário 3: Banco vazio - Seed com exercícios básicos (fallback)**
```bash
[Build] > npm run auto-seed
[Build] 🔍 Verificando estado do banco de dados...
[Build] 📊 Exercícios no banco: 0
[Build] ⚠️  Banco com poucos exercícios! Iniciando seed automático...
[Build] ⚠️  Arquivo exercises.json não encontrado.
[Build] 💡 Criando exercícios básicos para garantir funcionamento...
[Build] 📦 Criando 30 exercícios básicos...
[Build]    ✓ Supino Reto
[Build]    ✓ Supino Inclinado
[Build]    ✓ Supino Declinado
[Build]    ✓ Crucifixo
[Build]    ✓ Flexão
[Build]    ✓ Barra Fixa
[Build]    ... (continua)
[Build] ✅ Exercícios básicos criados com sucesso!
[Build] 📊 Total no banco: 30
[Build] 🎉 Banco populado com sucesso!
[Build] ✔ Build completed successfully (45 seconds)
```

## 📦 Exercícios Básicos (Fallback)

Quando não há arquivo `data/exercises.json`, o script cria **30 exercícios essenciais**:

### Por Grupo Muscular:

**Peito (5):**
- Supino Reto, Supino Inclinado, Supino Declinado, Crucifixo, Flexão

**Costas (5):**
- Barra Fixa, Remada Curvada, Remada Unilateral, Pulldown, Levantamento Terra

**Pernas (6):**
- Agachamento, Leg Press, Cadeira Extensora, Mesa Flexora, Stiff, Panturrilha em Pé

**Ombros (4):**
- Desenvolvimento, Elevação Lateral, Elevação Frontal, Crucifixo Invertido

**Braços (6):**
- Rosca Direta, Rosca Alternada, Rosca Martelo, Tríceps Testa, Tríceps Corda, Mergulho

**Abdômen (4):**
- Abdominal, Prancha, Abdominal Oblíquo, Elevação de Pernas

### Estrutura de Cada Exercício:
```javascript
{
  externalId: 'basic-supino-reto',
  name: 'Supino Reto',
  bodyPart: 'peito',
  equipment: 'barra',
  gifUrl: 'https://cdn.jsdelivr.net/gh/andreviniciup/amil-treino-images@main/exercises/supino-reto/0.jpg',
  target: 'peitoral maior',
  secondaryMuscles: [],
  instructions: [
    'Posicione-se corretamente',
    'Execute o movimento de forma controlada',
    'Mantenha a técnica adequada',
    'Respire corretamente durante o exercício'
  ],
  source: 'manual'
}
```

## 🚀 Deploy no Render

### Configuração Necessária (One-time)

**1. Variável de Ambiente:**
```
DATABASE_URL=postgresql://user:pass@host:5432/database
```

**2. Build Command:**
```bash
npm run build
```
_(Já inclui o auto-seed)_

**3. Start Command:**
```bash
npm start
```

### O Que Acontece no Deploy:

1. ✅ **Código atualizado** - Pull do GitHub
2. ✅ **Dependências** - `npm install`
3. ✅ **Build** - `npm run build`
   - Prisma generate
   - Prisma migrate deploy
   - TypeScript compile
   - **Auto-seed** ← 🆕 Popula banco se vazio
4. ✅ **Start** - Servidor inicia com dados disponíveis

### Tempo Estimado:

| Cenário | Tempo de Build |
|---------|----------------|
| Banco já populado | ~30 segundos |
| Seed com JSON (873 ex) | ~2 minutos |
| Seed básico (30 ex) | ~45 segundos |

## ✅ Vantagens da Nova Abordagem

### Antes (Seed Manual):
- ❌ Precisava acessar Render Shell
- ❌ Executar comando manualmente
- ❌ Esperar 5-10 minutos
- ❌ Deploy ficava incompleto até seed manual

### Agora (Auto-Seed):
- ✅ Totalmente automático
- ✅ Sem acesso ao shell necessário
- ✅ Inteligente (não repete se já tiver dados)
- ✅ Rápido (30-120 segundos)
- ✅ Deploy completo e funcional imediatamente

## 🧪 Testando Localmente

### Teste 1: Banco Vazio
```bash
cd backend

# Resetar banco
npx prisma migrate reset --force

# Testar auto-seed
npm run auto-seed

# Esperado:
# 📊 Exercícios no banco: 0
# ⚠️  Iniciando seed automático...
# 📦 Criando 30 exercícios básicos...
# ✅ Seed concluído! Total: 30
```

### Teste 2: Banco Populado
```bash
# Executar auto-seed novamente
npm run auto-seed

# Esperado:
# 📊 Exercícios no banco: 30
# ✅ Banco já possui exercícios suficientes.
```

### Teste 3: Build Completo
```bash
# Simular build do Render
npm run build

# Deve executar:
# - prisma generate ✓
# - prisma migrate deploy ✓
# - tsc ✓
# - postbuild ✓
# - auto-seed ✓ (se banco vazio)
```

## 📝 Adicionando os 873 Exercícios Completos

Se quiser usar todos os exercícios com imagens do jsDelivr:

### Opção 1: Via JSON (Recomendado)
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
