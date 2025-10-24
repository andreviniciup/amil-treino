"""
Rotas de Recomendações ML
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.models.recommendation_model_simple import RecommendationModel
import os

router = APIRouter()

# Instância global do modelo
recommendation_model = RecommendationModel()

# Tentar carregar modelo pré-treinado
try:
    if os.path.exists("models/trained/rf_model.pkl"):
        recommendation_model.load()
        print("✓ Modelo de recomendação carregado")
except:
    print("⚠️ Modelo não encontrado, será treinado na primeira requisição")


class UserProfileRequest(BaseModel):
    age: int
    gender: str
    weight: float
    height: float
    fitnessLevel: str
    trainingExperience: int
    primaryGoals: List[str]
    secondaryGoals: List[str] = []
    availableDays: int
    availableTime: int
    equipment: List[str]


class RecommendationResponse(BaseModel):
    recommendations: List[Dict]
    ensemble_confidence: float
    model_agreement: float


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(user_profile: UserProfileRequest):
    """
    Gera recomendações de métodos de treino usando ML
    """
    try:
        if not recommendation_model.is_trained:
            raise HTTPException(
                status_code=503,
                detail="Modelo não treinado. Execute /api/ml/train/recommendation-model primeiro"
            )
        
        # Converter para dict
        user_data = user_profile.dict()
        
        # Fazer predição
        result = recommendation_model.predict(user_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exercises")
async def get_exercise_recommendations(
    user_profile: UserProfileRequest,
    muscle_group: str,
    limit: int = 10
):
    """
    Recomenda exercícios específicos para um grupo muscular
    """
    try:
        # TODO: Implementar modelo de recomendação de exercícios
        # Por enquanto, retorna resposta mock
        
        return {
            "muscle_group": muscle_group,
            "recommendations": [
                {
                    "exercise": f"Exercise {i+1} for {muscle_group}",
                    "confidence": 0.85 - (i * 0.05),
                    "scientific_support": 0.90 - (i * 0.03)
                }
                for i in range(limit)
            ],
            "model_version": "1.0.0",
            "generated_at": "2024-01-01T00:00:00"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_model_status():
    """
    Retorna status do modelo de recomendação
    """
    return {
        "model_loaded": recommendation_model.is_trained,
        "model_type": "Hybrid (RF + GB + NN)",
        "version": "1.0.0",
        "last_trained": "N/A" if not recommendation_model.is_trained else "Loaded from disk"
    }

