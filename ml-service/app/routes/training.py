"""
Rotas de Treinamento de Modelos ML
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import numpy as np
from app.models.recommendation_model import RecommendationModel

router = APIRouter()

# Modelo global
recommendation_model = RecommendationModel()


class TrainingData(BaseModel):
    features: List[List[float]]
    labels: List[int]


def train_recommendation_model_bg(X: np.ndarray, y: np.ndarray):
    """Treina modelo em background"""
    try:
        results = recommendation_model.train(X, y)
        recommendation_model.save()
        print("✓ Modelo treinado e salvo com sucesso")
        return results
    except Exception as e:
        print(f"❌ Erro no treinamento: {e}")
        raise


@router.post("/recommendation-model")
async def train_recommendation_model(
    data: TrainingData,
    background_tasks: BackgroundTasks
):
    """
    Treina o modelo de recomendação com novos dados
    """
    try:
        X = np.array(data.features)
        y = np.array(data.labels)
        
        if len(X) < 100:
            raise HTTPException(
                status_code=400,
                detail="Mínimo de 100 amostras necessárias para treinamento"
            )
        
        # Adicionar ao background tasks
        background_tasks.add_task(train_recommendation_model_bg, X, y)
        
        return {
            "message": "Treinamento iniciado em background",
            "samples": len(X),
            "features": X.shape[1] if len(X) > 0 else 0,
            "status": "training"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-mock-data")
async def generate_mock_training_data():
    """
    Gera dados mock para teste do modelo
    """
    try:
        np.random.seed(42)
        
        # Gerar 1000 amostras de usuários fictícios
        n_samples = 1000
        
        X = []
        y = []
        
        for _ in range(n_samples):
            # Features: age, gender, weight, height, bmi, fitness_level, experience, 
            # available_days, available_time, goals (8), equipment (4)
            age = np.random.randint(18, 65)
            gender = np.random.randint(0, 2)
            weight = np.random.normal(75, 15)
            height = np.random.normal(170, 10)
            bmi = weight / ((height/100) ** 2)
            fitness_level = np.random.randint(0, 3)
            experience = np.random.randint(0, 10)
            available_days = np.random.randint(2, 7)
            available_time = np.random.choice([30, 45, 60, 75, 90])
            
            # Goals (8 one-hot)
            goals = [np.random.randint(0, 2) for _ in range(8)]
            
            # Equipment (4 one-hot)
            equipment = [np.random.randint(0, 2) for _ in range(4)]
            
            features = [age, gender, weight, height, bmi, fitness_level, 
                       experience, available_days, available_time] + goals + equipment
            
            # Label baseado em lógica simples
            if available_days >= 6:
                label = 0  # PPL
            elif available_days >= 4:
                label = 1  # Upper/Lower
            elif available_days >= 3:
                label = 2  # Full Body
            else:
                label = 2  # Full Body
            
            X.append(features)
            y.append(label)
        
        # Treinar modelo
        X_arr = np.array(X)
        y_arr = np.array(y)
        
        results = recommendation_model.train(X_arr, y_arr)
        recommendation_model.save()
        
        return {
            "message": "Modelo treinado com dados mock",
            "samples_generated": n_samples,
            "training_results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models/status")
async def get_models_status():
    """
    Retorna status de todos os modelos
    """
    return {
        "recommendation_model": {
            "trained": recommendation_model.is_trained,
            "type": "Hybrid (RF + GB + NN)"
        },
        "performance_predictor": {
            "trained": False,
            "type": "LSTM"
        },
        "progression_model": {
            "trained": False,
            "type": "Gradient Boosting"
        }
    }

