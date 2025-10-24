# 🎯 MVP v0.01 - Limitações e Funcionalidades Desabilitadas

## 📋 **RESUMO**

Este documento lista todas as funcionalidades que foram **temporariamente desabilitadas** no MVP v0.01 para focar no fluxo essencial: **Cadastro → Onboarding → Criar Treino → Executar → Ver Histórico**.

---

## 🚫 **FUNCIONALIDADES DESABILITADAS**

### **1. Machine Learning Service (Python)**
- **Status:** ❌ Desabilitado
- **Motivo:** Não necessário para MVP
- **Arquivos Afetados:**
  - `ml-service/app/main.py` - Rotas comentadas
  - `backend/src/services/mlApiService.ts` - Fallbacks implementados
- **Reativação:** v0.02

### **2. Sistema de Gamificação**
- **Status:** ❌ Desabilitado
- **Funcionalidades:**
  - Pontuação automática
  - Sistema de níveis
  - Badges automáticos (4 tipos)
  - Verificação de conquistas
- **Arquivos Afetados:**
  - `backend/src/services/gamificationService.ts`
  - `backend/src/services/badgeService.ts`
  - `backend/src/controllers/gamificationController.ts`
  - `backend/src/routes/gamificationRoutes.ts`
- **Reativação:** v0.02

### **3. Análise Avançada de Progresso**
- **Status:** ❌ Desabilitado
- **Funcionalidades:**
  - Detecção de plateaus
  - Análise de consistência avançada
  - Análise de progressão detalhada
  - Cálculo de PRs automáticos
- **Arquivos Afetados:**
  - `backend/src/services/performanceAnalyzer.ts`
  - `backend/src/services/performanceHistoryService.ts`
  - `backend/src/controllers/progressController.ts`
  - `backend/src/routes/progressRoutes.ts`
- **Reativação:** v0.02

### **4. Engine Híbrido de Recomendação**
- **Status:** ⚠️ Simplificado
- **Funcionalidades Desabilitadas:**
  - Collaborative Filtering
  - Content-Based Filtering
  - Performance-Based Filtering
  - Combinação de 4 algoritmos
- **Funcionalidades Mantidas:**
  - Rule-Based Filtering (simplificado)
- **Arquivos Afetados:**
  - `backend/src/services/recommendationEngine.ts`
- **Reativação:** v0.02

---

## ✅ **FUNCIONALIDADES MANTIDAS (MVP v0.01)**

### **1. Autenticação e Perfil**
- ✅ Login/Registro
- ✅ Onboarding com 8 focos de treino
- ✅ Mapeamento PT-EN
- ✅ Perfil básico do usuário

### **2. Sistema de Treinos**
- ✅ Criação de treinos
- ✅ Seleção de exercícios por grupo muscular
- ✅ Configuração de séries/reps
- ✅ Execução de treinos
- ✅ Timer de descanso
- ✅ Histórico básico

### **3. Recomendações Simples**
- ✅ Recomendação baseada em regras
- ✅ 3 métodos principais: Full Body, Upper/Lower, PPL
- ✅ Lógica: Nível + Dias disponíveis

### **4. Progresso Básico**
- ✅ Histórico de treinos
- ✅ Estatísticas simples
- ✅ Lista de treinos realizados

---

## 🔄 **COMO REATIVAR NA v0.02**

### **1. ML Service Python**
```bash
# Descomentar em ml-service/app/main.py:
# from app.routes import recommendations, predictions, training, scientific
# app.include_router(recommendations.router, ...)
```

### **2. Gamificação**
```bash
# Descomentar em backend/src/server.ts:
# import gamificationRoutes from './routes/gamificationRoutes';
# app.use('/api/gamification', gamificationRoutes);
```

### **3. Análise Avançada**
```bash
# Descomentar em backend/src/server.ts:
# import progressRoutes from './routes/progressRoutes';
# app.use('/api/progress', progressRoutes);
```

### **4. Engine Híbrido**
```bash
# Descomentar em backend/src/services/recommendationEngine.ts:
# Todo o código comentado com /* ... */
```

---

## 🎯 **FLUXO MVP v0.01**

### **Jornada do Usuário:**
1. **Cadastro** → Criar conta
2. **Onboarding** → Definir perfil e objetivos
3. **Recomendação** → Receber sugestão de método
4. **Criar Treino** → Montar treino com exercícios
5. **Executar Treino** → Fazer o treino com timer
6. **Ver Histórico** → Acompanhar progresso básico

### **Serviços Necessários:**
- ✅ **Backend TypeScript** (Node.js + Express)
- ✅ **Frontend React** (TypeScript + Vite)
- ❌ **ML Service Python** (não necessário)

---

## 📊 **ESTATÍSTICAS MVP v0.01**

### **Arquivos Modificados:**
- **Backend:** 8 arquivos comentados
- **ML Service:** 1 arquivo modificado
- **Frontend:** 0 arquivos (sem mudanças necessárias)

### **Endpoints Disponíveis:**
- ✅ `/api/exercises` - Exercícios
- ✅ `/api/workouts` - Treinos
- ✅ `/api/users` - Usuários
- ✅ `/api/recommendations` - Recomendações simples
- ❌ `/api/progress` - Desabilitado
- ❌ `/api/gamification` - Desabilitado

### **Funcionalidades Core:**
- ✅ **100%** do fluxo principal funcionando
- ✅ **0%** de perda de código (tudo comentado)
- ✅ **Fácil reativação** na v0.02

---

## 🚀 **PRÓXIMOS PASSOS**

### **v0.02 - "Inteligência Básica"**
- Reativar gamificação
- Reativar análise de progresso
- Reativar ML Service

### **v0.03 - "Machine Learning"**
- Engine híbrido completo
- Predições de performance
- Validação científica

### **v0.04 - "Validação Científica"**
- Integração PubMed
- Estudos científicos
- Análise comparativa

---

## 💡 **NOTAS IMPORTANTES**

1. **Zero Perda de Código:** Todo o código original foi preservado em comentários
2. **Fácil Reativação:** Basta descomentar os arquivos na v0.02
3. **MVP Funcional:** Sistema completo com fluxo essencial
4. **Escalável:** Base sólida para futuras versões

---

**Data de Criação:** 23 de outubro de 2025  
**Versão:** MVP v0.01  
**Status:** ✅ Implementado e Funcional
