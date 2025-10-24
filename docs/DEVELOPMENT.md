# 🔧 Guia de Desenvolvimento

Guia completo para desenvolvimento do sistema de treinos.

## 🌿 **ESTRUTURA DE BRANCHES**

### **Branches Principais**
- `main` - Versão estável e funcional
- `v01-mvp` - Versão MVP simplificada
- `v02-complete` - Sistema completo atual
- `v03-dl` - Versão com Deep Learning
- `develop` - Branch de desenvolvimento

### **Branches de Feature**
- `feature/nome-da-feature` - Nova funcionalidade
- `bugfix/nome-do-bug` - Correção de bug
- `hotfix/nome-do-hotfix` - Correção urgente

## 🚀 **WORKFLOW DE DESENVOLVIMENTO**

### **1. Criar Nova Feature**
```bash
# Alternar para develop
git checkout develop
git pull origin develop

# Criar branch de feature
git checkout -b feature/nova-funcionalidade

# Desenvolver...
git add .
git commit -m "feat: implementar nova funcionalidade"

# Push da feature
git push origin feature/nova-funcionalidade
```

### **2. Merge para Develop**
```bash
# Voltar para develop
git checkout develop

# Merge da feature
git merge feature/nova-funcionalidade

# Push para develop
git push origin develop
```

### **3. Deploy para Produção**
```bash
# Merge develop para main
git checkout main
git merge develop
git push origin main
```

## 🛠️ **CONFIGURAÇÃO DO AMBIENTE**

### **Pré-requisitos**
- Node.js 18+
- Python 3.8+
- Git
- VS Code (recomendado)

### **Instalação**
```bash
# Clonar repositório
git clone https://github.com/andreviniciup/amil-treino.git
cd amil-treino

# Instalar dependências
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../ml-service && pip install -r requirements.txt
```

### **Configuração do VS Code**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.pylint"
  ]
}
```

## 📁 **ESTRUTURA DO PROJETO**

```
treino/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Serviços
│   │   ├── routes/          # Rotas
│   │   ├── middleware/      # Middlewares
│   │   └── types/           # Tipos TypeScript
│   ├── prisma/              # Schema do banco
│   └── tests/               # Testes
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Contextos
│   │   ├── services/        # Serviços
│   │   └── utils/           # Utilitários
│   └── tests/               # Testes
├── ml-service/              # Serviço de ML
│   ├── app/
│   │   ├── models/          # Modelos de ML
│   │   ├── routes/          # Rotas da API
│   │   └── services/        # Serviços
│   └── tests/               # Testes
├── docs/                    # Documentação
└── scripts/                 # Scripts de desenvolvimento
```

## 🧪 **TESTES**

### **Backend**
```bash
cd backend
npm test                    # Testes unitários
npm run test:integration    # Testes de integração
npm run test:e2e           # Testes end-to-end
```

### **Frontend**
```bash
cd frontend
npm test                    # Testes unitários
npm run test:integration    # Testes de integração
npm run test:e2e           # Testes end-to-end
```

### **ML Service**
```bash
cd ml-service
python -m pytest          # Testes unitários
python -m pytest --cov    # Testes com cobertura
```

## 🔍 **LINTING E FORMATAÇÃO**

### **Backend**
```bash
cd backend
npm run lint              # ESLint
npm run format            # Prettier
```

### **Frontend**
```bash
cd frontend
npm run lint              # ESLint
npm run format            # Prettier
```

### **ML Service**
```bash
cd ml-service
python -m black .         # Formatação
python -m flake8 .        # Linting
```

## 📊 **BANCO DE DADOS**

### **Desenvolvimento**
```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma db push

# Visualizar banco
npx prisma studio
```

### **Produção**
```bash
# Criar migração
npx prisma migrate dev --name nome-da-migracao

# Deploy
npx prisma migrate deploy
```

## 🚀 **DEPLOY**

### **Desenvolvimento**
```bash
# Usar scripts de desenvolvimento
npm run dev
```

### **Produção**
```bash
# Build
npm run build

# Deploy
npm run start
```

### **Docker**
```bash
# Build da imagem
docker build -t treino-app .

# Executar container
docker run -p 3000:3000 treino-app
```

## 📝 **CONVENÇÕES DE CÓDIGO**

### **Commits**
```bash
# Formato: tipo(escopo): descrição
git commit -m "feat(auth): adicionar login com Google"
git commit -m "fix(workout): corrigir bug na criação de treinos"
git commit -m "docs(readme): atualizar documentação"
```

### **Tipos de Commit**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Tarefas de manutenção

### **Nomenclatura**
- **Arquivos:** kebab-case (`user-controller.ts`)
- **Componentes:** PascalCase (`UserController`)
- **Variáveis:** camelCase (`userName`)
- **Constantes:** UPPER_SNAKE_CASE (`API_URL`)

## 🔄 **ALTERNÂNCIA ENTRE BRANCHES**

### **Script Automático**
```bash
# Usar script PowerShell
.\switch-branches.ps1 v01-mvp
.\switch-branches.ps1 v02-complete
.\switch-branches.ps1 v03-dl
```

### **Manual**
```bash
# Alternar para branch
git checkout v01-mvp

# Ver branches disponíveis
git branch -a

# Criar nova branch
git checkout -b feature/nova-feature
```

## 🐛 **DEBUGGING**

### **Backend**
```bash
# Debug com Node.js
node --inspect src/server.ts

# Debug com VS Code
# Usar configuração de debug no launch.json
```

### **Frontend**
```bash
# Debug com React DevTools
# Instalar extensão no navegador
```

### **ML Service**
```bash
# Debug com Python
python -m pdb app/main.py

# Debug com VS Code
# Usar configuração de debug Python
```

## 📚 **DOCUMENTAÇÃO**

### **Código**
- Comentários em português
- JSDoc para funções
- README em cada diretório

### **API**
- Swagger/OpenAPI
- Exemplos de uso
- Códigos de erro

### **Componentes**
- Props e tipos
- Exemplos de uso
- Estados possíveis

## 🤝 **CONTRIBUIÇÃO**

### **1. Fork do Projeto**
```bash
# Fork no GitHub
# Clonar seu fork
git clone https://github.com/seu-usuario/amil-treino.git
```

### **2. Configurar Remote**
```bash
# Adicionar remote original
git remote add upstream https://github.com/andreviniciup/amil-treino.git
```

### **3. Sincronizar**
```bash
# Buscar mudanças
git fetch upstream

# Merge para main
git checkout main
git merge upstream/main
```

### **4. Criar Feature**
```bash
# Criar branch
git checkout -b feature/sua-feature

# Desenvolver...
git add .
git commit -m "feat: sua feature"

# Push
git push origin feature/sua-feature
```

### **5. Pull Request**
- Criar PR no GitHub
- Descrever mudanças
- Adicionar screenshots se necessário

## 📞 **SUPORTE**

### **Canais de Suporte**
- GitHub Issues
- Discord (se disponível)
- Email da equipe

### **Reportar Bugs**
1. Verificar se já existe issue
2. Criar nova issue com template
3. Incluir logs e screenshots
4. Descrever passos para reproduzir

### **Sugerir Features**
1. Verificar se já existe sugestão
2. Criar issue com template
3. Descrever benefícios
4. Incluir mockups se possível

---

**Última atualização:** $(date)  
**Versão:** 1.0.0
