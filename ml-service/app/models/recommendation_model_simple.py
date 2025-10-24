"""
Modelo de Recomendação Simplificado
Usa apenas scikit-learn (sem TensorFlow)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
import joblib
import os
from typing import Dict, List, Tuple
from datetime import datetime


class RecommendationModel:
    """
    Modelo híbrido simplificado para recomendação de métodos de treino
    """
    
    def __init__(self):
        self.rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.gb_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        self.nn_model = MLPClassifier(
            hidden_layer_sizes=(128, 64, 32),
            activation='relu',
            solver='adam',
            max_iter=1000,
            random_state=42
        )
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
        
        # One-hot encoding para objetivos secundários
        secondary_goals = user_data.get('secondaryGoals', [])
        for goal in goal_types:
            features.append(1 if goal in secondary_goals else 0)
        
        # Equipamentos disponíveis
        equipment = user_data.get('equipment', [])
        equipment_types = ['Barra', 'Halteres', 'Máquinas', 'Cabo', 'Corpo Livre']
        for eq in equipment_types:
            features.append(1 if eq in equipment else 0)
        
        return np.array(features)
    
    def generate_mock_data(self, n_samples: int = 1000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Gera dados mock para treinamento
        """
        np.random.seed(42)
        
        X = []
        y = []
        
        # Métodos de treino disponíveis
        methods = ['PPL', 'Upper/Lower', 'Full Body', 'Bro Split', 'PHUL', 'Híbrido', 'Push/Pull']
        
        for _ in range(n_samples):
            # Gerar dados do usuário
            user_data = {
                'age': np.random.randint(18, 60),
                'gender': np.random.choice(['Masculino', 'Feminino']),
                'weight': np.random.uniform(50, 120),
                'height': np.random.uniform(150, 200),
                'fitnessLevel': np.random.choice(['Iniciante', 'Intermediário', 'Avançado']),
                'trainingExperience': np.random.uniform(0, 10),
                'availableDays': np.random.randint(2, 7),
                'availableTime': np.random.randint(30, 120),
                'primaryGoals': np.random.choice(goal_types, size=np.random.randint(1, 4), replace=False).tolist(),
                'secondaryGoals': np.random.choice(goal_types, size=np.random.randint(0, 3), replace=False).tolist(),
                'equipment': np.random.choice(equipment_types, size=np.random.randint(1, 4), replace=False).tolist()
            }
            
            # Criar features
            features = self.create_features(user_data)
            X.append(features)
            
            # Método recomendado baseado em regras simples
            if user_data['availableDays'] >= 5:
                method = np.random.choice(['PPL', 'Upper/Lower', 'PHUL'])
            elif user_data['availableDays'] >= 3:
                method = np.random.choice(['Upper/Lower', 'Full Body', 'Híbrido'])
            else:
                method = np.random.choice(['Full Body', 'Push/Pull'])
            
            y.append(method)
        
        return np.array(X), np.array(y)
    
    def train(self, X: np.ndarray = None, y: np.ndarray = None) -> Dict:
        """
        Treina o modelo híbrido
        """
        if X is None or y is None:
            print("Gerando dados mock para treinamento...")
            X, y = self.generate_mock_data(1000)
        
        # Normalizar features
        X_scaled = self.scaler.fit_transform(X)
        
        # Dividir dados
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Treinar modelos
        print("Treinando Random Forest...")
        self.rf_model.fit(X_train, y_train)
        
        print("Treinando Gradient Boosting...")
        self.gb_model.fit(X_train, y_train)
        
        print("Treinando Neural Network...")
        self.nn_model.fit(X_train, y_train)
        
        # Avaliar modelos
        rf_score = self.rf_model.score(X_test, y_test)
        gb_score = self.gb_model.score(X_test, y_test)
        nn_score = self.nn_model.score(X_test, y_test)
        
        self.is_trained = True
        
        return {
            'rf_score': rf_score,
            'gb_score': gb_score,
            'nn_score': nn_score,
            'n_samples': len(X),
            'n_features': X.shape[1]
        }
    
    def predict(self, user_data: Dict) -> Dict:
        """
        Faz predição usando o modelo híbrido
        """
        if not self.is_trained:
            # Se não treinado, usar dados mock
            X, y = self.generate_mock_data(100)
            self.train(X, y)
        
        # Criar features
        features = self.create_features(user_data)
        features_scaled = self.scaler.transform([features])
        
        # Predições individuais
        rf_pred = self.rf_model.predict(features_scaled)[0]
        gb_pred = self.gb_model.predict(features_scaled)[0]
        nn_pred = self.nn_model.predict(features_scaled)[0]
        
        # Probabilidades
        rf_proba = self.rf_model.predict_proba(features_scaled)[0]
        gb_proba = self.gb_model.predict_proba(features_scaled)[0]
        nn_proba = self.nn_model.predict_proba(features_scaled)[0]
        
        # Ensemble (votação majoritária)
        predictions = [rf_pred, gb_pred, nn_pred]
        ensemble_pred = max(set(predictions), key=predictions.count)
        
        return {
            'ensemble_prediction': ensemble_pred,
            'rf_prediction': rf_pred,
            'gb_prediction': gb_pred,
            'nn_prediction': nn_pred,
            'confidence': np.mean([rf_proba.max(), gb_proba.max(), nn_proba.max()])
        }
    
    def save_model(self, filepath: str = None):
        """
        Salva o modelo treinado
        """
        if filepath is None:
            filepath = f"models/recommendation_model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.joblib"
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'rf_model': self.rf_model,
            'gb_model': self.gb_model,
            'nn_model': self.nn_model,
            'scaler': self.scaler,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        print(f"Modelo salvo em: {filepath}")
    
    def load_model(self, filepath: str):
        """
        Carrega um modelo salvo
        """
        model_data = joblib.load(filepath)
        
        self.rf_model = model_data['rf_model']
        self.gb_model = model_data['gb_model']
        self.nn_model = model_data['nn_model']
        self.scaler = model_data['scaler']
        self.is_trained = model_data['is_trained']
        
        print(f"Modelo carregado de: {filepath}")


# Instância global do modelo
recommendation_model = RecommendationModel()

