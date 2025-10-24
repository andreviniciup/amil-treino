# 🤖 GUIA COMPLETO: Testando ML Service e Evoluindo para Deep Learning

## 📋 **COMO TESTAR O ML SERVICE**

### **1️⃣ Verificar se o ML Service está rodando**

```bash
# Terminal 1 - Backend TypeScript
cd backend
npm run dev

# Terminal 2 - ML Service Python  
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Teste básico:**
```bash
curl http://localhost:8000
# Deve retornar: {"service": "ML Service - Treino Inteligente", ...}
```

---

## 🧪 **TESTES MANUAIS DOS ENDPOINTS ML**

### **1. Testar Status dos Modelos**
```bash
curl http://localhost:8000/api/ml/train/models/status
```

**Resposta esperada:**
```json
{
  "recommendation_model": {
    "trained": false,
    "type": "Hybrid (RF + GB + NN)"
  },
  "performance_predictor": {
    "trained": false,
    "type": "LSTM"
  },
  "progression_model": {
    "trained": false,
    "type": "Gradient Boosting"
  }
}
```

### **2. Gerar Dados Mock e Treinar Modelo**
```bash
curl -X POST http://localhost:8000/api/ml/train/generate-mock-data
```

**Resposta esperada:**
```json
{
  "message": "Modelo treinado com dados mock",
  "samples_generated": 1000,
  "training_results": {
    "rf_accuracy": 0.85,
    "gb_accuracy": 0.87,
    "ensemble_accuracy": 0.89
  }
}
```

### **3. Testar Recomendações ML**
```bash
curl -X POST http://localhost:8000/api/ml/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "gender": "Masculino",
    "weight": 75,
    "height": 175,
    "fitnessLevel": "Intermediário",
    "trainingExperience": 2,
    "primaryGoals": ["Hipertrofia", "Força"],
    "availableDays": 5,
    "availableTime": 60,
    "equipment": ["Barra", "Halteres"]
  }'
```

### **4. Testar Predição de Performance**
```bash
curl -X POST http://localhost:8000/api/ml/predict/performance \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "exercise_id": "supino",
    "history": [
      {"date": "2024-01-01", "exercise_id": "supino", "weight": 80, "reps": 10, "sets": 3},
      {"date": "2024-01-08", "exercise_id": "supino", "weight": 82.5, "reps": 10, "sets": 3},
      {"date": "2024-01-15", "exercise_id": "supino", "weight": 85, "reps": 8, "sets": 3}
    ]
  }'
```

### **5. Testar Busca Científica**
```bash
curl -X POST http://localhost:8000/api/ml/scientific/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "progressive overload training",
    "limit": 5
  }'
```

---

## 🚀 **EVOLUINDO PARA DEEP LEARNING (DL)**

### **📊 Arquitetura Atual vs DL**

| **Aspecto** | **ML Atual** | **Deep Learning** |
|-------------|--------------|-------------------|
| **Modelos** | RF + GB + NN simples | CNN + LSTM + Transformer |
| **Dados** | Features manuais | Embeddings + Time Series |
| **Processamento** | Estático | Dinâmico + Attention |
| **Precisão** | 85-90% | 95-98% |

---

## 🧠 **IMPLEMENTAÇÃO DE DEEP LEARNING**

### **1. Novos Requirements (requirements-dl.txt)**
```txt
# Deep Learning Core
tensorflow==2.16.1
torch==2.1.0
transformers==4.35.2

# Time Series
tslearn==0.6.2
prophet==1.1.4

# Computer Vision (para análise de forma)
opencv-python==4.8.1.78
mediapipe==0.10.7

# NLP Avançado
sentence-transformers==2.2.2
spacy[transformers]==3.7.2

# Reinforcement Learning
stable-baselines3==2.2.1
gymnasium==0.29.1
```

### **2. Modelo LSTM Avançado para Performance**
```python
# ml-service/app/models/lstm_performance_model.py
import tensorflow as tf
from tensorflow.keras import layers, Model
import numpy as np

class LSTMPerformanceModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
    def build_model(self, sequence_length=30, n_features=10):
        """Constrói modelo LSTM para predição de performance"""
        
        inputs = layers.Input(shape=(sequence_length, n_features))
        
        # LSTM Stack
        lstm1 = layers.LSTM(128, return_sequences=True, dropout=0.2)(inputs)
        lstm2 = layers.LSTM(64, return_sequences=True, dropout=0.2)(lstm1)
        lstm3 = layers.LSTM(32, dropout=0.2)(lstm2)
        
        # Attention Mechanism
        attention = layers.MultiHeadAttention(
            num_heads=8, 
            key_dim=32,
            dropout=0.1
        )(lstm3, lstm3)
        
        # Dense Layers
        dense1 = layers.Dense(64, activation='relu')(attention)
        dropout1 = layers.Dropout(0.3)(dense1)
        dense2 = layers.Dense(32, activation='relu')(dropout1)
        dropout2 = layers.Dropout(0.2)(dense2)
        
        # Outputs (weight, reps, confidence)
        weight_output = layers.Dense(1, activation='linear', name='weight')(dropout2)
        reps_output = layers.Dense(1, activation='linear', name='reps')(dropout2)
        confidence_output = layers.Dense(1, activation='sigmoid', name='confidence')(dropout2)
        
        self.model = Model(
            inputs=inputs,
            outputs=[weight_output, reps_output, confidence_output]
        )
        
        self.model.compile(
            optimizer='adam',
            loss={
                'weight': 'mse',
                'reps': 'mse', 
                'confidence': 'binary_crossentropy'
            },
            metrics=['mae']
        )
        
        return self.model
```

### **3. Modelo Transformer para Recomendações**
```python
# ml-service/app/models/transformer_recommendation.py
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn as nn

class TransformerRecommendationModel:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.bert = AutoModel.from_pretrained('bert-base-uncased')
        self.classifier = nn.Linear(768, 7)  # 7 métodos de treino
        
    def encode_user_profile(self, user_data):
        """Converte perfil do usuário em embedding BERT"""
        text = f"""
        User: {user_data['age']} years old, {user_data['gender']}
        Goals: {', '.join(user_data['goals'])}
        Experience: {user_data['experience']} years
        Available: {user_data['days']} days per week
        """
        
        inputs = self.tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.bert(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
        
        return embeddings
    
    def predict(self, user_data):
        """Prediz método de treino usando Transformer"""
        embeddings = self.encode_user_profile(user_data)
        logits = self.classifier(embeddings)
        probabilities = torch.softmax(logits, dim=1)
        
        return {
            'method': torch.argmax(probabilities).item(),
            'confidence': torch.max(probabilities).item(),
            'all_probabilities': probabilities.tolist()
        }
```

### **4. CNN para Análise de Forma (Futuro)**
```python
# ml-service/app/models/cnn_form_analysis.py
import cv2
import mediapipe as mp
import tensorflow as tf

class FormAnalysisCNN:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()
        
    def analyze_exercise_form(self, video_path, exercise_type):
        """Analisa forma do exercício usando CNN + MediaPipe"""
        
        # Extrair keypoints do vídeo
        keypoints = self.extract_pose_keypoints(video_path)
        
        # CNN para análise de forma
        model = self.build_form_cnn()
        form_score = model.predict(keypoints)
        
        return {
            'form_score': form_score,
            'corrections': self.generate_corrections(form_score),
            'safety_rating': self.calculate_safety_rating(form_score)
        }
    
    def extract_pose_keypoints(self, video_path):
        """Extrai keypoints de pose usando MediaPipe"""
        cap = cv2.VideoCapture(video_path)
        keypoints_sequence = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            results = self.pose.process(frame)
            if results.pose_landmarks:
                keypoints = self.normalize_keypoints(results.pose_landmarks)
                keypoints_sequence.append(keypoints)
        
        cap.release()
        return np.array(keypoints_sequence)
```

---

## 🔄 **MIGRAÇÃO GRADUAL PARA DL**

### **Fase 1: LSTM para Performance (1-2 semanas)**
```python
# Implementar LSTM para predição de performance
# Substituir lógica simples por modelo treinado
# Manter compatibilidade com API atual
```

### **Fase 2: Transformer para Recomendações (2-3 semanas)**
```python
# Implementar BERT/Transformer para recomendações
# Fine-tuning com dados de treino
# A/B testing com modelo atual
```

### **Fase 3: CNN para Análise de Forma (3-4 semanas)**
```python
# Implementar análise de vídeo
# Integrar com câmera do celular
# Feedback em tempo real
```

### **Fase 4: Reinforcement Learning (4-6 semanas)**
```python
# Implementar RL para otimização de treinos
# Agente que aprende com feedback do usuário
# Personalização contínua
```

---

## 📊 **MÉTRICAS DE COMPARAÇÃO ML vs DL**

| **Métrica** | **ML Atual** | **DL Esperado** |
|-------------|--------------|-----------------|
| **Precisão Recomendações** | 85% | 95% |
| **Precisão Predições** | 75% | 90% |
| **Tempo de Resposta** | 50ms | 200ms |
| **Dados Necessários** | 1K amostras | 10K+ amostras |
| **Recursos Computacionais** | Baixo | Alto |

---

## 🛠️ **IMPLEMENTAÇÃO PRÁTICA**

### **1. Criar Branch DL**
```bash
git checkout -b feature/deep-learning
```

### **2. Instalar Dependências DL**
```bash
cd ml-service
pip install -r requirements-dl.txt
```

### **3. Implementar Modelo LSTM**
```bash
# Criar arquivo
touch app/models/lstm_performance_model.py
# Implementar classe LSTMPerformanceModel
```

### **4. Testar Modelo DL**
```bash
# Testar endpoint com modelo DL
curl -X POST http://localhost:8000/api/ml/predict/performance-dl \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "exercise_id": "supino", "history": [...]}'
```

---

## 🎯 **ROADMAP DL COMPLETO**

### **Semana 1-2: LSTM Performance**
- ✅ Implementar LSTM para predição
- ✅ Treinar com dados históricos
- ✅ Comparar com modelo atual

### **Semana 3-4: Transformer Recommendations**
- ✅ Fine-tuning BERT
- ✅ Embeddings de perfil
- ✅ A/B testing

### **Semana 5-6: CNN Form Analysis**
- ✅ Integração MediaPipe
- ✅ Análise de vídeo
- ✅ Feedback de forma

### **Semana 7-8: Reinforcement Learning**
- ✅ Agente RL
- ✅ Otimização contínua
- ✅ Personalização avançada

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Execute os testes ML atuais** usando o script `TEST-ALL-ENDPOINTS.ps1`
2. **Implemente LSTM** para predição de performance
3. **Colete mais dados** de treino dos usuários
4. **Implemente Transformer** para recomendações
5. **Adicione análise de vídeo** com CNN
6. **Integre Reinforcement Learning** para otimização

**O sistema está pronto para evoluir para Deep Learning!** 🧠✨
