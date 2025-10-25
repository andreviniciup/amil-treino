# 🚀 GUIA DE DEPLOY - RAILWAY

## 📋 PREPARAÇÃO DO PROJETO

### 1. Configurar Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="seu-jwt-secret-super-seguro"
NODE_ENV="production"
PORT=3001
ML_SERVICE_URL="https://seu-ml-service.railway.app"
```

#### ML Service (.env)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
PYTHON_ENV="production"
PORT=8000
```

#### Frontend (.env)
```env
VITE_API_URL="https://seu-backend.railway.app"
VITE_ML_SERVICE_URL="https://seu-ml-service.railway.app"
```

### 2. Configurar Scripts de Build

#### Backend (package.json)
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:deploy": "prisma migrate deploy"
  }
}
```

#### Frontend (package.json)
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### ML Service (requirements.txt)
```txt
# Adicionar gunicorn para produção
gunicorn==21.2.0
```

### 3. Criar Dockerfiles (Opcional)

#### Backend/Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

#### ML Service/Dockerfile
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

## 🚀 DEPLOY NO RAILWAY

### 1. Criar Conta no Railway
- Acesse: https://railway.app
- Conecte com GitHub

### 2. Deploy do Backend
```bash
# 1. Criar novo projeto no Railway
# 2. Conectar repositório GitHub
# 3. Selecionar pasta: /backend
# 4. Configurar variáveis de ambiente
# 5. Deploy automático
```

### 3. Deploy do ML Service
```bash
# 1. Adicionar novo serviço no mesmo projeto
# 2. Selecionar pasta: /ml-service
# 3. Configurar variáveis de ambiente
# 4. Deploy automático
```

### 4. Deploy do Frontend
```bash
# 1. Adicionar novo serviço
# 2. Selecionar pasta: /frontend
# 3. Configurar build command: npm run build
# 4. Configurar start command: npm run preview
# 5. Deploy automático
```

### 5. Configurar Database
```bash
# 1. Adicionar PostgreSQL no Railway
# 2. Copiar DATABASE_URL
# 3. Configurar em todos os serviços
# 4. Executar migrations
```

## 🔧 CONFIGURAÇÕES ESPECÍFICAS

### Railway.json (Backend)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

### Railway.json (ML Service)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT"
  }
}
```

### Railway.json (Frontend)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview"
  }
}
```

## 🌐 CONFIGURAÇÃO DE DOMÍNIOS

### 1. Domínios Automáticos
- Backend: `seu-backend.railway.app`
- ML Service: `seu-ml-service.railway.app`
- Frontend: `seu-frontend.railway.app`

### 2. Domínio Customizado (Opcional)
- Comprar domínio
- Configurar DNS
- SSL automático

## 📊 MONITORAMENTO

### 1. Logs
- Acessar Railway Dashboard
- Ver logs em tempo real
- Debug de problemas

### 2. Métricas
- CPU e memória
- Requests por minuto
- Tempo de resposta

## 🔒 SEGURANÇA

### 1. Variáveis de Ambiente
- JWT_SECRET forte
- DATABASE_URL segura
- CORS configurado

### 2. HTTPS
- SSL automático
- Certificados válidos

## 💰 CUSTOS

### Plano Gratuito
- $5 de crédito/mês
- Suficiente para MVP
- Sem cartão de crédito

### Plano Pro
- $20/mês
- Recursos ilimitados
- Suporte prioritário

## 🚨 TROUBLESHOOTING

### Problemas Comuns
1. **Build falha**: Verificar dependências
2. **Database connection**: Verificar DATABASE_URL
3. **CORS errors**: Configurar CORS no backend
4. **ML Service timeout**: Aumentar timeout

### Comandos Úteis
```bash
# Ver logs
railway logs

# Conectar ao banco
railway connect

# Executar migrations
railway run npx prisma migrate deploy
```

## ✅ CHECKLIST FINAL

- [ ] Backend deployado e funcionando
- [ ] ML Service deployado e funcionando  
- [ ] Frontend deployado e funcionando
- [ ] Database configurado
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] SSL funcionando
- [ ] Testes end-to-end passando
- [ ] Monitoramento ativo
- [ ] Backup configurado

## 🎉 RESULTADO FINAL

Seu projeto estará disponível em:
- **Frontend**: https://seu-frontend.railway.app
- **Backend**: https://seu-backend.railway.app
- **ML Service**: https://seu-ml-service.railway.app
- **Database**: PostgreSQL gerenciado

**Tempo estimado**: 2-4 horas
**Custo**: $0-20/mês
**Complexidade**: Baixa
