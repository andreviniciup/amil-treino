# 🧠 ML Service - Sistema de Machine Learning Científico

Serviço Python separado para Machine Learning e análise de dados científicos.

## 📚 Stack Tecnológica

- **Python 3.10+**
- **FastAPI** - API REST de alta performance
- **scikit-learn** - Modelos de ML tradicionais
- **TensorFlow/Keras** - Deep Learning
- **pandas** - Manipulação de dados
- **numpy** - Computação numérica
- **scipy** - Análise científica
- **requests** - Integração com APIs externas (PubMed, CrossRef)

## 🏗️ Arquitetura

```
ml-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── models/
│   │   ├── __init__.py
│   │   ├── recommendation_model.py
│   │   ├── performance_predictor.py
│   │   └── progression_model.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── data_extractor.py
│   │   ├── scientific_api.py
│   │   ├── ml_trainer.py
│   │   └── validator.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── recommendations.py
│   │   ├── predictions.py
│   │   └── training.py
│   └── utils/
│       ├── __init__.py
│       ├── preprocessing.py
│       └── feature_engineering.py
├── datasets/
│   ├── raw/
│   ├── processed/
│   └── papers/
├── models/
│   ├── trained/
│   └── checkpoints/
├── notebooks/
│   └── exploratory_analysis.ipynb
├── requirements.txt
├── Dockerfile
└── .env
```

## 🚀 Instalação

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 🔥 Executar

```bash
uvicorn app.main:app --reload --port 8000
```

## 📡 API Endpoints

### Recomendações
- `POST /api/ml/recommendations` - Gerar recomendações baseadas em ML
- `POST /api/ml/recommendations/exercises` - Recomendar exercícios

### Predições
- `POST /api/ml/predict/performance` - Prever performance futura
- `POST /api/ml/predict/progression` - Prever próxima progressão

### Treinamento
- `POST /api/ml/train/recommendation-model` - Treinar modelo de recomendação
- `POST /api/ml/train/performance-model` - Treinar modelo de performance
- `GET /api/ml/models/status` - Status dos modelos

### Dados Científicos
- `POST /api/ml/scientific/extract` - Extrair dados de papers
- `GET /api/ml/scientific/search` - Buscar artigos científicos
- `POST /api/ml/scientific/validate` - Validar recomendação cientificamente

## 🔗 Integração com Backend TypeScript

O backend TypeScript consome esta API Python:

```typescript
// backend/src/services/mlApiService.ts
const response = await axios.post('http://localhost:8000/api/ml/recommendations', {
  userId: 'xxx',
  userProfile: {...},
  trainingHistory: [...]
});
```

## 📊 Modelos Implementados

1. **Recommendation Model** - Random Forest + Neural Network híbrido
2. **Performance Predictor** - LSTM para séries temporais
3. **Progression Model** - Gradient Boosting para regressão
4. **Scientific Validator** - NLP para validação de evidências

## 🧪 Datasets Científicos

Os datasets são extraídos de:
- PubMed (via API)
- CrossRef (via API)
- ExerciseDB
- Estudos manuais em PDF

## 🎯 Métricas de Qualidade

- Accuracy: >85%
- Precision: >80%
- Recall: >80%
- F1-Score: >82%
- Scientific Confidence: >70%


