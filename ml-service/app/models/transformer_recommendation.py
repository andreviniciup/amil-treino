"""
Modelo Transformer para Recomendações de Treino
Implementa Deep Learning com Attention Mechanism para recomendações personalizadas
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel, BertTokenizer, BertModel
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
import json
import os
from datetime import datetime


class TransformerRecommendationModel:
    """
    Modelo Transformer para recomendação de métodos de treino
    Usa BERT + Transformer customizado para análise de perfil do usuário
    """
    
    def __init__(self, model_name: str = "bert-base-uncased", num_classes: int = 7):
        self.model_name = model_name
        self.num_classes = num_classes
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Carregar BERT
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.bert = BertModel.from_pretrained(model_name)
        
        # Transformer customizado
        self.transformer = None
        self.classifier = None
        self.is_trained = False
        
        # Métodos de treino
        self.training_methods = [
            "PPL (Push/Pull/Legs)",
            "Upper/Lower Split",
            "Full Body",
            "Push/Pull/Legs",
            "Bro Split",
            "Powerlifting",
            "Bodybuilding"
        ]
    
    def build_model(self, hidden_dim: int = 768, num_heads: int = 8, num_layers: int = 6):
        """
        Constrói modelo Transformer customizado
        """
        class TrainingRecommendationTransformer(nn.Module):
            def __init__(self, bert_model, hidden_dim, num_heads, num_layers, num_classes):
                super().__init__()
                self.bert = bert_model
                self.hidden_dim = hidden_dim
                
                # Transformer layers
                encoder_layer = nn.TransformerEncoderLayer(
                    d_model=hidden_dim,
                    nhead=num_heads,
                    dim_feedforward=hidden_dim * 4,
                    dropout=0.1,
                    batch_first=True
                )
                self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
                
                # Classifier head
                self.classifier = nn.Sequential(
                    nn.Linear(hidden_dim, hidden_dim // 2),
                    nn.ReLU(),
                    nn.Dropout(0.3),
                    nn.Linear(hidden_dim // 2, hidden_dim // 4),
                    nn.ReLU(),
                    nn.Dropout(0.2),
                    nn.Linear(hidden_dim // 4, num_classes)
                )
                
                # Attention weights para interpretabilidade
                self.attention_weights = nn.Linear(hidden_dim, 1)
            
            def forward(self, input_ids, attention_mask):
                # BERT encoding
                bert_outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
                sequence_output = bert_outputs.last_hidden_state
                
                # Transformer encoding
                transformer_output = self.transformer(sequence_output, src_key_padding_mask=~attention_mask.bool())
                
                # Global attention pooling
                attention_scores = self.attention_weights(transformer_output)
                attention_weights = F.softmax(attention_scores, dim=1)
                pooled_output = torch.sum(transformer_output * attention_weights, dim=1)
                
                # Classification
                logits = self.classifier(pooled_output)
                
                return logits, attention_weights
        
        self.model = TrainingRecommendationTransformer(
            self.bert, hidden_dim, num_heads, num_layers, self.num_classes
        ).to(self.device)
        
        return self.model
    
    def encode_user_profile(self, user_data: Dict) -> torch.Tensor:
        """
        Converte perfil do usuário em texto e depois em embeddings
        """
        # Criar texto descritivo do perfil
        profile_text = self._create_profile_text(user_data)
        
        # Tokenizar
        inputs = self.tokenizer(
            profile_text,
            return_tensors='pt',
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)
        
        return inputs
    
    def _create_profile_text(self, user_data: Dict) -> str:
        """
        Cria texto descritivo do perfil do usuário
        """
        text_parts = []
        
        # Informações básicas
        text_parts.append(f"User is {user_data.get('age', 25)} years old")
        text_parts.append(f"Gender: {user_data.get('gender', 'Not specified')}")
        text_parts.append(f"Weight: {user_data.get('weight', 70)} kg")
        text_parts.append(f"Height: {user_data.get('height', 170)} cm")
        
        # Nível de fitness
        fitness_level = user_data.get('fitnessLevel', 'Beginner')
        text_parts.append(f"Fitness level: {fitness_level}")
        
        # Experiência
        experience = user_data.get('trainingExperience', 0)
        text_parts.append(f"Training experience: {experience} years")
        
        # Objetivos
        goals = user_data.get('primaryGoals', [])
        if goals:
            text_parts.append(f"Primary goals: {', '.join(goals)}")
        
        secondary_goals = user_data.get('secondaryGoals', [])
        if secondary_goals:
            text_parts.append(f"Secondary goals: {', '.join(secondary_goals)}")
        
        # Disponibilidade
        days = user_data.get('availableDays', 3)
        text_parts.append(f"Available training days: {days} per week")
        
        time_per_session = user_data.get('availableTime', 60)
        text_parts.append(f"Time per session: {time_per_session} minutes")
        
        # Equipamentos
        equipment = user_data.get('equipment', [])
        if equipment:
            text_parts.append(f"Available equipment: {', '.join(equipment)}")
        
        # Histórico de lesões (se disponível)
        injuries = user_data.get('injuryHistory', [])
        if injuries:
            text_parts.append(f"Injury history: {', '.join(injuries)}")
        
        return ". ".join(text_parts) + "."
    
    def predict(self, user_data: Dict) -> Dict:
        """
        Prediz método de treino recomendado
        """
        if not self.is_trained:
            # Se não treinado, usar lógica baseada em regras
            return self._rule_based_recommendation(user_data)
        
        try:
            # Preparar dados
            inputs = self.encode_user_profile(user_data)
            
            # Fazer predição
            with torch.no_grad():
                logits, attention_weights = self.model(
                    inputs['input_ids'], 
                    inputs['attention_mask']
                )
                
                probabilities = F.softmax(logits, dim=1)
                predicted_class = torch.argmax(probabilities, dim=1).item()
                confidence = torch.max(probabilities, dim=1)[0].item()
            
            # Interpretabilidade
            attention_scores = attention_weights[0].cpu().numpy()
            
            return {
                'recommended_method': self.training_methods[predicted_class],
                'confidence': float(confidence),
                'all_probabilities': probabilities[0].cpu().numpy().tolist(),
                'method_ranking': self._get_method_ranking(probabilities[0]),
                'reasoning': self._generate_reasoning(user_data, predicted_class, confidence),
                'model_type': 'Transformer + BERT',
                'attention_weights': attention_scores.tolist()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'fallback': self._rule_based_recommendation(user_data)
            }
    
    def _rule_based_recommendation(self, user_data: Dict) -> Dict:
        """
        Recomendação baseada em regras (fallback)
        """
        days = user_data.get('availableDays', 3)
        goals = user_data.get('primaryGoals', [])
        experience = user_data.get('trainingExperience', 0)
        
        # Lógica baseada em regras
        if days >= 6:
            method_idx = 0  # PPL
        elif days >= 4:
            method_idx = 1  # Upper/Lower
        elif days >= 3:
            method_idx = 2  # Full Body
        else:
            method_idx = 2  # Full Body
        
        # Ajustar baseado em objetivos
        if 'Powerlifting' in goals:
            method_idx = 5  # Powerlifting
        elif 'Bodybuilding' in goals:
            method_idx = 6  # Bodybuilding
        
        return {
            'recommended_method': self.training_methods[method_idx],
            'confidence': 0.7,
            'reasoning': f"Baseado em {days} dias disponíveis e objetivos: {', '.join(goals)}",
            'model_type': 'Rule-based (fallback)'
        }
    
    def _get_method_ranking(self, probabilities: torch.Tensor) -> List[Dict]:
        """
        Retorna ranking de todos os métodos
        """
        probs = probabilities.cpu().numpy()
        sorted_indices = np.argsort(probs)[::-1]
        
        ranking = []
        for i, idx in enumerate(sorted_indices):
            ranking.append({
                'rank': i + 1,
                'method': self.training_methods[idx],
                'probability': float(probs[idx])
            })
        
        return ranking
    
    def _generate_reasoning(self, user_data: Dict, predicted_class: int, confidence: float) -> str:
        """
        Gera explicação para a recomendação
        """
        method = self.training_methods[predicted_class]
        days = user_data.get('availableDays', 3)
        goals = user_data.get('primaryGoals', [])
        
        reasoning_parts = []
        
        # Baseado em disponibilidade
        if days >= 6:
            reasoning_parts.append(f"Com {days} dias disponíveis, você pode seguir um split mais específico")
        elif days >= 4:
            reasoning_parts.append(f"Com {days} dias, um split Upper/Lower é ideal")
        else:
            reasoning_parts.append(f"Com {days} dias, treinos Full Body são mais eficientes")
        
        # Baseado em objetivos
        if goals:
            reasoning_parts.append(f"Seus objetivos ({', '.join(goals)}) são compatíveis com {method}")
        
        # Baseado em confiança
        if confidence > 0.8:
            reasoning_parts.append("Esta recomendação tem alta confiança baseada em padrões similares")
        elif confidence > 0.6:
            reasoning_parts.append("Esta recomendação é adequada para seu perfil")
        else:
            reasoning_parts.append("Considere ajustar seus objetivos ou disponibilidade para melhor personalização")
        
        return ". ".join(reasoning_parts) + "."
    
    def train(self, training_data: List[Dict], validation_split: float = 0.2) -> Dict:
        """
        Treina o modelo Transformer
        """
        try:
            # Preparar dados
            X_text, y_labels = self._prepare_training_data(training_data)
            
            # Construir modelo se não existir
            if self.model is None:
                self.build_model()
            
            # Dividir dados
            split_idx = int(len(X_text) * (1 - validation_split))
            X_train, X_val = X_text[:split_idx], X_text[split_idx:]
            y_train, y_val = y_labels[:split_idx], y_labels[split_idx:]
            
            # Preparar tensores
            train_inputs = self._prepare_batch(X_train)
            val_inputs = self._prepare_batch(X_val)
            
            # Otimizador e loss
            optimizer = torch.optim.AdamW(self.model.parameters(), lr=2e-5)
            criterion = nn.CrossEntropyLoss()
            
            # Treinamento
            self.model.train()
            train_losses = []
            val_losses = []
            
            for epoch in range(10):  # 10 epochs
                # Training
                optimizer.zero_grad()
                train_logits, _ = self.model(
                    train_inputs['input_ids'], 
                    train_inputs['attention_mask']
                )
                train_loss = criterion(train_logits, torch.tensor(y_train).to(self.device))
                train_loss.backward()
                optimizer.step()
                
                # Validation
                with torch.no_grad():
                    val_logits, _ = self.model(
                        val_inputs['input_ids'], 
                        val_inputs['attention_mask']
                    )
                    val_loss = criterion(val_logits, torch.tensor(y_val).to(self.device))
                
                train_losses.append(train_loss.item())
                val_losses.append(val_loss.item())
            
            self.is_trained = True
            self.save()
            
            return {
                'status': 'success',
                'epochs_trained': 10,
                'final_train_loss': train_losses[-1],
                'final_val_loss': val_losses[-1],
                'model_type': 'Transformer + BERT',
                'training_samples': len(training_data)
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def _prepare_training_data(self, training_data: List[Dict]) -> Tuple[List[str], List[int]]:
        """
        Prepara dados para treinamento
        """
        X_text = []
        y_labels = []
        
        for data in training_data:
            # Texto do perfil
            profile_text = self._create_profile_text(data['user_profile'])
            X_text.append(profile_text)
            
            # Label (método de treino)
            method_name = data['recommended_method']
            if method_name in self.training_methods:
                y_labels.append(self.training_methods.index(method_name))
            else:
                y_labels.append(0)  # Default to PPL
        
        return X_text, y_labels
    
    def _prepare_batch(self, texts: List[str]) -> Dict:
        """
        Prepara batch de textos para o modelo
        """
        inputs = self.tokenizer(
            texts,
            return_tensors='pt',
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)
        
        return inputs
    
    def save(self, model_dir: str = "models/transformer"):
        """
        Salva modelo
        """
        os.makedirs(model_dir, exist_ok=True)
        
        if self.model:
            torch.save(self.model.state_dict(), f"{model_dir}/transformer_model.pth")
        
        # Salvar metadados
        metadata = {
            'model_name': self.model_name,
            'num_classes': self.num_classes,
            'is_trained': self.is_trained,
            'training_methods': self.training_methods,
            'trained_at': datetime.now().isoformat()
        }
        
        with open(f"{model_dir}/metadata.json", 'w') as f:
            json.dump(metadata, f)
    
    def load(self, model_dir: str = "models/transformer"):
        """
        Carrega modelo
        """
        if os.path.exists(f"{model_dir}/transformer_model.pth"):
            if self.model is None:
                self.build_model()
            
            self.model.load_state_dict(torch.load(f"{model_dir}/transformer_model.pth", map_location=self.device))
            self.is_trained = True
            return True
        return False


# Exemplo de uso
if __name__ == "__main__":
    # Criar modelo
    model = TransformerRecommendationModel()
    
    # Dados de exemplo
    user_data = {
        'age': 25,
        'gender': 'Masculino',
        'weight': 75,
        'height': 175,
        'fitnessLevel': 'Intermediário',
        'trainingExperience': 2,
        'primaryGoals': ['Hipertrofia', 'Força'],
        'availableDays': 5,
        'availableTime': 60,
        'equipment': ['Barra', 'Halteres']
    }
    
    # Fazer predição
    prediction = model.predict(user_data)
    print("Recomendação:", prediction)
