"""
Modelo LSTM Avançado para Predição de Performance
Implementa Deep Learning para análise de séries temporais de treino
"""

import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Attention, MultiHeadAttention, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import os
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import json


class LSTMPerformanceModel:
    """
    Modelo LSTM avançado para predição de performance de exercícios
    Usa Deep Learning para análise de séries temporais
    """
    
    def __init__(self, sequence_length: int = 30, n_features: int = 10):
        self.sequence_length = sequence_length
        self.n_features = n_features
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.training_history = None
        
    def build_model(self) -> Model:
        """
        Constrói modelo LSTM com Attention Mechanism
        """
        # Input layer
        inputs = Input(shape=(self.sequence_length, self.n_features))
        
        # LSTM Stack com Dropout
        lstm1 = LSTM(128, return_sequences=True, dropout=0.2, recurrent_dropout=0.2)(inputs)
        lstm2 = LSTM(64, return_sequences=True, dropout=0.2, recurrent_dropout=0.2)(lstm1)
        lstm3 = LSTM(32, return_sequences=True, dropout=0.2)(lstm2)
        
        # Attention Mechanism
        attention = MultiHeadAttention(
            num_heads=8,
            key_dim=32,
            dropout=0.1
        )(lstm3, lstm3)
        
        # Global Average Pooling
        pooled = tf.keras.layers.GlobalAveragePooling1D()(attention)
        
        # Dense Layers
        dense1 = Dense(64, activation='relu')(pooled)
        dropout1 = Dropout(0.3)(dense1)
        dense2 = Dense(32, activation='relu')(dropout1)
        dropout2 = Dropout(0.2)(dense2)
        
        # Outputs múltiplos
        weight_output = Dense(1, activation='linear', name='weight')(dropout2)
        reps_output = Dense(1, activation='linear', name='reps')(dropout2)
        confidence_output = Dense(1, activation='sigmoid', name='confidence')(dropout2)
        
        # Criar modelo
        self.model = Model(
            inputs=inputs,
            outputs=[weight_output, reps_output, confidence_output]
        )
        
        # Compilar modelo
        self.model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss={
                'weight': 'mse',
                'reps': 'mse',
                'confidence': 'binary_crossentropy'
            },
            loss_weights={
                'weight': 1.0,
                'reps': 0.8,
                'confidence': 0.5
            },
            metrics=['mae']
        )
        
        return self.model
    
    def prepare_data(self, history_data: List[Dict]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepara dados para treinamento LSTM
        """
        if len(history_data) < self.sequence_length:
            raise ValueError(f"Mínimo de {self.sequence_length} registros necessários")
        
        # Converter para DataFrame
        df = pd.DataFrame(history_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Features: weight, reps, sets, rpe, duration, day_of_week, month, etc.
        features = []
        targets_weight = []
        targets_reps = []
        targets_confidence = []
        
        for i in range(self.sequence_length, len(df)):
            # Sequência de features
            seq_features = []
            for j in range(i - self.sequence_length, i):
                row = df.iloc[j]
                feature_vector = [
                    row['weight'],
                    row['reps'],
                    row['sets'],
                    row.get('rpe', 7),  # RPE padrão se não disponível
                    row.get('duration', 60),  # Duração padrão
                    row['date'].dayofweek,
                    row['date'].month,
                    row['date'].day,
                    row['date'].hour if 'hour' in row else 18,  # Hora padrão
                    row.get('rest_time', 120)  # Tempo de descanso
                ]
                seq_features.append(feature_vector)
            
            features.append(seq_features)
            
            # Targets (próxima sessão)
            next_row = df.iloc[i]
            targets_weight.append(next_row['weight'])
            targets_reps.append(next_row['reps'])
            targets_confidence.append(1.0)  # Confiança baseada em consistência
        
        X = np.array(features)
        y_weight = np.array(targets_weight)
        y_reps = np.array(targets_reps)
        y_confidence = np.array(targets_confidence)
        
        # Normalizar features
        X_reshaped = X.reshape(-1, self.n_features)
        X_scaled = self.scaler.fit_transform(X_reshaped)
        X_scaled = X_scaled.reshape(X.shape)
        
        return X_scaled, (y_weight, y_reps, y_confidence)
    
    def train(self, history_data: List[Dict], validation_split: float = 0.2) -> Dict:
        """
        Treina o modelo LSTM
        """
        try:
            # Preparar dados
            X, (y_weight, y_reps, y_confidence) = self.prepare_data(history_data)
            
            # Construir modelo se não existir
            if self.model is None:
                self.build_model()
            
            # Callbacks
            callbacks = [
                EarlyStopping(
                    monitor='val_loss',
                    patience=10,
                    restore_best_weights=True
                ),
                ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.5,
                    patience=5,
                    min_lr=1e-7
                )
            ]
            
            # Treinar modelo
            history = self.model.fit(
                X, 
                {
                    'weight': y_weight,
                    'reps': y_reps,
                    'confidence': y_confidence
                },
                validation_split=validation_split,
                epochs=100,
                batch_size=32,
                callbacks=callbacks,
                verbose=1
            )
            
            self.training_history = history.history
            self.is_trained = True
            
            # Salvar modelo
            self.save()
            
            return {
                'status': 'success',
                'epochs_trained': len(history.history['loss']),
                'final_loss': history.history['loss'][-1],
                'val_loss': history.history['val_loss'][-1],
                'model_architecture': 'LSTM + Attention',
                'features_used': self.n_features,
                'sequence_length': self.sequence_length
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def predict(self, history_data: List[Dict], days_ahead: int = 1) -> Dict:
        """
        Prediz performance futura
        """
        if not self.is_trained:
            raise ValueError("Modelo não treinado. Execute train() primeiro")
        
        # Preparar última sequência
        if len(history_data) < self.sequence_length:
            raise ValueError(f"Mínimo de {self.sequence_length} registros necessários")
        
        # Pegar última sequência
        last_sequence = history_data[-self.sequence_length:]
        
        # Converter para formato do modelo
        seq_features = []
        for record in last_sequence:
            feature_vector = [
                record['weight'],
                record['reps'],
                record['sets'],
                record.get('rpe', 7),
                record.get('duration', 60),
                pd.to_datetime(record['date']).dayofweek,
                pd.to_datetime(record['date']).month,
                pd.to_datetime(record['date']).day,
                pd.to_datetime(record['date']).hour if 'hour' in record else 18,
                record.get('rest_time', 120)
            ]
            seq_features.append(feature_vector)
        
        X = np.array([seq_features])
        X_scaled = self.scaler.transform(X.reshape(-1, self.n_features))
        X_scaled = X_scaled.reshape(X.shape)
        
        # Fazer predição
        predictions = self.model.predict(X_scaled)
        
        weight_pred = predictions[0][0][0]
        reps_pred = predictions[1][0][0]
        confidence_pred = predictions[2][0][0]
        
        return {
            'predicted_weight': float(weight_pred),
            'predicted_reps': int(round(reps_pred)),
            'confidence': float(confidence_pred),
            'model_type': 'LSTM + Attention',
            'prediction_date': (datetime.now() + timedelta(days=days_ahead)).isoformat(),
            'features_used': self.n_features,
            'sequence_length': self.sequence_length
        }
    
    def save(self, model_dir: str = "models/lstm"):
        """
        Salva modelo e scaler
        """
        os.makedirs(model_dir, exist_ok=True)
        
        if self.model:
            self.model.save(f"{model_dir}/lstm_model.h5")
        
        joblib.dump(self.scaler, f"{model_dir}/scaler.pkl")
        
        # Salvar metadados
        metadata = {
            'sequence_length': self.sequence_length,
            'n_features': self.n_features,
            'is_trained': self.is_trained,
            'trained_at': datetime.now().isoformat()
        }
        
        with open(f"{model_dir}/metadata.json", 'w') as f:
            json.dump(metadata, f)
    
    def load(self, model_dir: str = "models/lstm"):
        """
        Carrega modelo e scaler
        """
        if os.path.exists(f"{model_dir}/lstm_model.h5"):
            from tensorflow.keras.models import load_model
            self.model = load_model(f"{model_dir}/lstm_model.h5")
            self.scaler = joblib.load(f"{model_dir}/scaler.pkl")
            self.is_trained = True
            return True
        return False
    
    def get_model_summary(self) -> Dict:
        """
        Retorna resumo do modelo
        """
        if self.model:
            return {
                'model_type': 'LSTM + Attention',
                'is_trained': self.is_trained,
                'sequence_length': self.sequence_length,
                'n_features': self.n_features,
                'total_params': self.model.count_params(),
                'architecture': 'LSTM(128) -> LSTM(64) -> LSTM(32) -> Attention -> Dense(64) -> Dense(32) -> Outputs'
            }
        return {'model_type': 'LSTM + Attention', 'is_trained': False}


# Exemplo de uso
if __name__ == "__main__":
    # Criar modelo
    model = LSTMPerformanceModel(sequence_length=30, n_features=10)
    
    # Dados de exemplo
    sample_data = [
        {
            'date': '2024-01-01',
            'weight': 80,
            'reps': 10,
            'sets': 3,
            'rpe': 7
        },
        # ... mais dados
    ]
    
    # Treinar modelo
    results = model.train(sample_data)
    print("Resultados do treinamento:", results)
    
    # Fazer predição
    prediction = model.predict(sample_data)
    print("Predição:", prediction)
