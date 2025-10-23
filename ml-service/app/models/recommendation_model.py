"""
Modelo de Recomendação Híbrido
Combina Random Forest, Gradient Boosting e Neural Network
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from tensorflow import keras
from tensorflow.keras import layers
import joblib
import os
from typing import Dict, List, Tuple
from datetime import datetime


class RecommendationModel:
    """
    Modelo híbrido para recomendação de métodos de treino e exercícios
    """
    
    def __init__(self):
        self.rf_model = None
        self.gb_model = None
        self.nn_model = None
        self.scaler = StandardScaler()
        self.feature_names = []
        self.is_trained = False
        
    def create_features(self, user_data: Dict) -> np.ndarray:
        """
        Cria features a partir dos dados do usuário
        """
        features = []
        
        # Features demográficas
        features.append(user_data.get('age', 25))
        features.append(1 if user_data.get('gender') == 'Masculino' else 0)
        features.append(user_data.get('weight', 75))
        features.append(user_data.get('height', 175))
        
        # BMI
        height_m = user_data.get('height', 175) / 100
        weight = user_data.get('weight', 75)
        bmi = weight / (height_m ** 2)
        features.append(bmi)
        
        # Nível de fitness (encoded)
        fitness_level = user_data.get('fitnessLevel', 'Intermediário')
        level_map = {'Iniciante': 0, 'Intermediário': 1, 'Avançado': 2}
        features.append(level_map.get(fitness_level, 1))
        
        # Experiência de treino (anos)
        features.append(user_data.get('trainingExperience', 1))
        
        # Disponibilidade
        features.append(user_data.get('availableDays', 3))
        features.append(user_data.get('availableTime', 60))
        
        # One-hot encoding para objetivos principais
        primary_goals = user_data.get('primaryGoals', [])
        goal_types = ['Hipertrofia', 'Força', 'Resistência', 'Definição', 
                     'Perda de Peso', 'Condicionamento', 'Reabilitação', 'Performance']
        for goal in goal_types:
            features.append(1 if goal in primary_goals else 0)
        
        # Equipamentos disponíveis (one-hot)
        equipment_types = ['Barra', 'Halteres', 'Máquinas', 'Peso Corporal']
        available_equipment = user_data.get('equipment', [])
        for eq in equipment_types:
            features.append(1 if eq in available_equipment else 0)
        
        return np.array(features).reshape(1, -1)
    
    def build_neural_network(self, input_dim: int) -> keras.Model:
        """
        Constrói rede neural para recomendações
        """
        model = keras.Sequential([
            layers.Dense(128, activation='relu', input_dim=input_dim),
            layers.Dropout(0.3),
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(32, activation='relu'),
            layers.Dense(8, activation='softmax')  # 7 métodos de treino
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def train(self, X: np.ndarray, y: np.ndarray) -> Dict:
        """
        Treina os 3 modelos
        """
        print("🏋️ Iniciando treinamento dos modelos...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Normalizar features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        results = {}
        
        # 1. Random Forest
        print("🌳 Treinando Random Forest...")
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.rf_model.fit(X_train_scaled, y_train)
        rf_score = self.rf_model.score(X_test_scaled, y_test)
        results['random_forest_accuracy'] = rf_score
        print(f"   ✓ Random Forest Accuracy: {rf_score:.4f}")
        
        # 2. Gradient Boosting
        print("📈 Treinando Gradient Boosting...")
        self.gb_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.gb_model.fit(X_train_scaled, y_train)
        gb_score = self.gb_model.score(X_test_scaled, y_test)
        results['gradient_boosting_accuracy'] = gb_score
        print(f"   ✓ Gradient Boosting Accuracy: {gb_score:.4f}")
        
        # 3. Neural Network
        print("🧠 Treinando Neural Network...")
        self.nn_model = self.build_neural_network(X_train_scaled.shape[1])
        
        # Convert labels to one-hot
        y_train_onehot = keras.utils.to_categorical(y_train)
        y_test_onehot = keras.utils.to_categorical(y_test)
        
        history = self.nn_model.fit(
            X_train_scaled, y_train_onehot,
            epochs=50,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
        
        nn_score = self.nn_model.evaluate(X_test_scaled, y_test_onehot, verbose=0)[1]
        results['neural_network_accuracy'] = nn_score
        print(f"   ✓ Neural Network Accuracy: {nn_score:.4f}")
        
        # Ensemble accuracy
        ensemble_score = (rf_score + gb_score + nn_score) / 3
        results['ensemble_accuracy'] = ensemble_score
        print(f"\n🎯 Ensemble Accuracy: {ensemble_score:.4f}")
        
        self.is_trained = True
        results['trained_at'] = datetime.now().isoformat()
        
        return results
    
    def predict(self, user_data: Dict) -> Dict:
        """
        Faz predição usando ensemble dos 3 modelos
        """
        if not self.is_trained:
            raise Exception("Modelo não treinado. Execute train() primeiro.")
        
        # Criar features
        X = self.create_features(user_data)
        X_scaled = self.scaler.transform(X)
        
        # Predições dos 3 modelos
        rf_pred = self.rf_model.predict_proba(X_scaled)[0]
        gb_pred = self.gb_model.predict_proba(X_scaled)[0]
        nn_pred = self.nn_model.predict(X_scaled)[0]
        
        # Ensemble (média ponderada)
        ensemble_pred = (rf_pred * 0.3 + gb_pred * 0.3 + nn_pred * 0.4)
        
        # Métodos de treino (labels)
        methods = [
            'PPL (Push/Pull/Legs)',
            'Upper/Lower',
            'Full Body',
            'Bro Split',
            'PHUL (Power Hypertrophy Upper Lower)',
            'Upper/Lower + PPL Híbrido',
            'Full Body Split (5x/semana)'
        ]
        
        # Top 3 recomendações
        top_indices = np.argsort(ensemble_pred)[-3:][::-1]
        
        recommendations = []
        for idx in top_indices:
            if idx < len(methods):
                recommendations.append({
                    'method': methods[idx],
                    'confidence': float(ensemble_pred[idx]),
                    'rf_score': float(rf_pred[idx]),
                    'gb_score': float(gb_pred[idx]),
                    'nn_score': float(nn_pred[idx])
                })
        
        return {
            'recommendations': recommendations,
            'ensemble_confidence': float(np.max(ensemble_pred)),
            'model_agreement': float(np.std([rf_pred[top_indices[0]], 
                                             gb_pred[top_indices[0]], 
                                             nn_pred[top_indices[0]]]))
        }
    
    def save(self, path: str = "models/trained"):
        """
        Salva os modelos treinados
        """
        os.makedirs(path, exist_ok=True)
        
        # Salvar modelos sklearn
        joblib.dump(self.rf_model, f"{path}/rf_model.pkl")
        joblib.dump(self.gb_model, f"{path}/gb_model.pkl")
        joblib.dump(self.scaler, f"{path}/scaler.pkl")
        
        # Salvar NN
        self.nn_model.save(f"{path}/nn_model.h5")
        
        print(f"✓ Modelos salvos em {path}")
    
    def load(self, path: str = "models/trained"):
        """
        Carrega modelos treinados
        """
        self.rf_model = joblib.load(f"{path}/rf_model.pkl")
        self.gb_model = joblib.load(f"{path}/gb_model.pkl")
        self.scaler = joblib.load(f"{path}/scaler.pkl")
        self.nn_model = keras.models.load_model(f"{path}/nn_model.h5")
        
        self.is_trained = True
        print(f"✓ Modelos carregados de {path}")

