# 🏋️ Sistema de Treino - Multi-Versão

Sistema completo de treinos com múltiplas versões organizadas em branches.

## 🌿 **ESTRUTURA DE BRANCHES**

```
main (ou master)
├── v01-mvp          # Versão MVP simplificada
├── v02-complete     # Versão atual (sistema completo)
├── v03-dl           # Versão com Deep Learning
└── develop          # Branch de desenvolvimento
```

## 🎯 **VERSÕES DISPONÍVEIS**

### **📱 v01-mvp** - Versão MVP
- ✅ Sistema simplificado
- ✅ Funcionalidades essenciais
- ✅ Foco em validação do conceito
- 📖 [Documentação v01-mvp](README-v01-mvp.md)

### **🚀 v02-complete** - Sistema Completo
- ✅ Todas as funcionalidades
- ✅ ML Service integrado
- ✅ Gamificação completa
- ✅ Análise de progresso
- 📖 [Documentação v02-complete](README-v02-complete.md)

### **🧠 v03-dl** - Deep Learning
- ✅ LSTM + Transformer + CNN
- ✅ Funcionalidades avançadas
- ✅ IA de última geração
- 📖 [Documentação v03-dl](README-v03-dl.md)

### **🔧 develop** - Desenvolvimento
- ✅ Branch de desenvolvimento
- ✅ Testes e experimentos
- ✅ Integração de novas features

---

## 🚀 **COMO USAR**

### **Alternar Entre Versões**
```bash
# Ver sistema MVP
git checkout v01-mvp
npm run dev  # Backend
npm run dev  # Frontend

# Ver sistema completo
git checkout v02-complete
npm run dev  # Backend
npm run dev  # Frontend
npm run dev  # ML Service

# Ver sistema com Deep Learning
git checkout v03-dl
npm run dev  # Backend
npm run dev  # Frontend
npm run dev  # ML Service (DL)
```

### **Desenvolver Nova Feature**
```bash
# Criar branch de feature a partir de develop
git checkout develop
git checkout -b feature/nova-funcionalidade

# Desenvolver...
git add .
git commit -m "feat: nova funcionalidade"

# Merge para develop
git checkout develop
git merge feature/nova-funcionalidade
```

---

## 📋 **ESTRUTURA DO PROJETO**

```
treino/
├── backend/                 # API Node.js + TypeScript
├── frontend/                # React + TypeScript
├── ml-service/              # Serviço de Machine Learning
├── docs/                    # Documentação
└── scripts/                 # Scripts de desenvolvimento
```

---

## 🛠️ **TECNOLOGIAS**

- **Backend:** Node.js, TypeScript, Prisma, SQLite
- **Frontend:** React, TypeScript, Tailwind CSS
- **ML Service:** Python, FastAPI, scikit-learn, TensorFlow
- **Database:** SQLite (desenvolvimento)

---

## 📚 **DOCUMENTAÇÃO**

- [README Principal](README.md) - Este arquivo
- [v01-mvp](README-v01-mvp.md) - Documentação MVP
- [v02-complete](README-v02-complete.md) - Documentação Sistema Completo
- [v03-dl](README-v03-dl.md) - Documentação Deep Learning
- [Desenvolvimento](docs/DEVELOPMENT.md) - Guia de desenvolvimento

---

## 🤝 **CONTRIBUIÇÃO**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 **LICENÇA**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 **AUTORES**

- **André Vinícius** - *Desenvolvimento inicial* - [@andreviniciup](https://github.com/andreviniciup)

---

## 🙏 **AGRADECIMENTOS**

- Comunidade open source
- Contribuidores do projeto
- Usuários que testam e reportam bugs