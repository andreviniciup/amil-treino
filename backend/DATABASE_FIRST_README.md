# Sistema de Exercícios - Database First

## Visão Geral

O sistema agora armazena todos os exercícios **traduzidos para português** diretamente no banco de dados PostgreSQL. Isso elimina a dependência de APIs externas em runtime e garante:

- ✅ **Performance**: Consultas diretas ao banco são muito mais rápidas
- ✅ **Confiabilidade**: Não depende de disponibilidade de APIs externas
- ✅ **Consistência**: Todos os nomes estão em português
- ✅ **Custo**: Reduz chamadas para APIs pagas

## Arquitetura

```
ExerciseDB API (RapidAPI)
        ↓
  [Seed Script] ← Executa uma vez
        ↓
  [PostgreSQL Database] ← Armazena exercícios traduzidos
        ↓
  [Backend API] ← Consulta banco diretamente
        ↓
  [Frontend] ← Recebe dados em português
```

## Como Funciona

### 1. Seed dos Exercícios

Execute o script de seed para popular o banco com exercícios traduzidos:

```bash
cd backend
npm run seed:exercises:api
```

Este script irá:
1. Buscar ~1300+ exercícios da ExerciseDB API
2. Traduzir automaticamente para português:
   - Nomes dos exercícios
   - Partes do corpo (chest → Peito, back → Costas, etc.)
   - Equipamentos (barbell → Barra, dumbbell → Halter, etc.)
   - Músculos alvo (biceps → Bíceps, quads → Quadríceps, etc.)
3. Salvar no banco de dados com todas as informações

**⚠️ Importante**: 
- O seed só precisa ser executado **uma vez** por ambiente
- Para produção, execute após o deploy no Render
- O script remove exercícios antigos da API antes de inserir novos

### 2. Serviço de Banco de Dados

O novo serviço `databaseExerciseService.ts` fornece:

```typescript
// Buscar todos os exercícios (já traduzidos)
await databaseExerciseService.getAllExercises()

// Buscar por parte do corpo (em português)
await databaseExerciseService.getExercisesByBodyPart('Peito')

// Buscar por equipamento (em português)
await databaseExerciseService.getExercisesByEquipment('Barra')

// Pesquisar exercícios
await databaseExerciseService.searchExercises('agachamento')

// Estatísticas
await databaseExerciseService.getStats()
```

### 3. Endpoints da API

Todos os endpoints continuam funcionando, mas agora retornam dados do banco:

```
GET /api/exercises              - Lista todos os exercícios
GET /api/exercises/bodypart/:part  - Exercícios por parte do corpo
GET /api/exercises/search?q=...    - Pesquisa de exercícios
GET /api/exercises/:id             - Detalhes de um exercício
GET /api/exercises/stats           - Estatísticas
```

## Traduções Implementadas

### Partes do Corpo
- `back` → **Costas**
- `chest` → **Peito**
- `shoulders` → **Ombros**
- `upper arms` → **Bíceps/Tríceps**
- `lower arms` → **Antebraços**
- `upper legs` → **Coxas**
- `lower legs` → **Panturrilhas**
- `waist` → **Abdômen**
- `cardio` → **Cardio**
- `neck` → **Pescoço**

### Equipamentos Comuns
- `barbell` → **Barra**
- `dumbbell` → **Halter**
- `body weight` → **Peso Corporal**
- `cable` → **Cabo/Polia**
- `kettlebell` → **Kettlebell**
- `smith machine` → **Smith Machine**
- `resistance band` → **Faixa de Resistência**
- `medicine ball` → **Bola Medicinal**

### Músculos Alvo
- `biceps` → **Bíceps**
- `triceps` → **Tríceps**
- `quads` → **Quadríceps**
- `hamstrings` → **Posteriores de Coxa**
- `glutes` → **Glúteos**
- `pectorals` → **Peitorais**
- `lats` → **Dorsais**
- `delts` → **Deltoides**
- `abs` → **Abdômen**
- `calves` → **Panturrilhas**

## Ambiente de Desenvolvimento

### Requisitos
```env
# .env
RAPIDAPI_KEY=sua-chave-aqui
RAPIDAPI_HOST=exercisedb.p.rapidapi.com
RAPIDAPI_BASE_URL=https://exercisedb.p.rapidapi.com
DATABASE_URL=postgresql://...
```

### Comandos Úteis

```bash
# Popular banco com exercícios
npm run seed:exercises:api

# Verificar dados no Prisma Studio
npm run prisma:studio

# Ver estatísticas
curl http://localhost:3001/api/exercises/stats
```

## Produção (Render)

### Setup Inicial

1. **Deploy do backend** com as variáveis de ambiente configuradas no `render.yaml`

2. **Executar seed via Render Shell**:
   ```bash
   # No painel do Render, abra o Shell
   cd /opt/render/project/src
   npm run seed:exercises:api
   ```

3. **Verificar dados**:
   ```bash
   curl https://seu-backend.onrender.com/api/exercises/stats
   ```

### Atualizações Futuras

Para atualizar os exercícios (novos da API):
```bash
# Conectar no Shell do Render
npm run seed:exercises:api
```

Isso irá:
- Remover exercícios antigos da API
- Inserir novos exercícios atualizados
- Manter exercícios internos intactos

## Schema do Banco

```prisma
model Exercise {
  id               String   @id @default(uuid())
  externalId       String?  // ID da ExerciseDB
  name             String   // Nome em português
  bodyPart         String   // Parte do corpo em português
  equipment        String   // Equipamento em português
  gifUrl           String?  // URL do GIF
  target           String?  // Músculo alvo em português
  secondaryMuscles String?  // JSON array
  instructions     String?  // JSON array
  source           String   // 'exercisedb' ou 'internal'
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@unique([externalId, source])
  @@index([bodyPart])
  @@index([source])
}
```

## Vantagens da Nova Abordagem

| Aspecto | Antes (API em Runtime) | Depois (Database First) |
|---------|----------------------|------------------------|
| **Latência** | ~500-1000ms | ~10-50ms |
| **Disponibilidade** | Depende da API | 99.9% (banco) |
| **Custo** | Por requisição | Uma vez no seed |
| **Idioma** | Tradução no frontend | Já em português |
| **Offline** | ❌ | ✅ (após seed) |
| **Cache** | Necessário | Opcional |

## Troubleshooting

### Erro: RAPIDAPI_KEY não configurada
```bash
# Verifique se o .env tem a chave
cat backend/.env | grep RAPIDAPI_KEY
```

### Seed falha na metade
```bash
# O script já limpa exercícios antigos antes de inserir
# Pode executar novamente sem problemas
npm run seed:exercises:api
```

### Exercícios não aparecem no frontend
```bash
# Verifique se o seed foi executado
curl http://localhost:3001/api/exercises/stats

# Deve retornar: { total: 1300+, bySource: [...], ... }
```

## Próximos Passos

- [ ] Adicionar mais traduções personalizadas de nomes
- [ ] Implementar sistema de exercícios customizados por usuário
- [ ] Cache Redis para queries mais pesadas (opcional)
- [ ] Sincronização automática semanal com a API
