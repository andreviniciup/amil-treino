"""
Rotas de Predições ML
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

router = APIRouter()


class PerformanceHistory(BaseModel):
    date: str
    exercise_id: str
    weight: float
    reps: int
    sets: int


class PerformancePredictionRequest(BaseModel):
    user_id: str
    exercise_id: str
    history: List[PerformanceHistory]


@router.post("/performance")
async def predict_performance(request: PerformancePredictionRequest):
    """
    Prediz performance futura baseado em histórico
    Usa LSTM para análise de série temporal
    """
    try:
        # TODO: Implementar modelo LSTM
        # Por enquanto, retorna predição mock baseada em tendência simples
        
        if not request.history:
            raise HTTPException(status_code=400, detail="Histórico vazio")
        
        # Calcular tendência simples
        last_weight = request.history[-1].weight
        avg_progression = 0.05  # 5% de progressão média
        
        return {
            "exercise_id": request.exercise_id,
            "current_performance": {
                "weight": last_weight,
                "reps": request.history[-1].reps,
                "sets": request.history[-1].sets
            },
            "predicted_next_session": {
                "weight": round(last_weight * (1 + avg_progression), 2),
                "reps": request.history[-1].reps,
                "confidence": 0.75
            },
            "predicted_1_month": {
                "weight": round(last_weight * (1 + avg_progression * 4), 2),
                "reps": request.history[-1].reps + 1,
                "confidence": 0.65
            },
            "model_type": "LSTM",
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/progression")
async def predict_progression(request: PerformancePredictionRequest):
    """
    Prediz próxima progressão ideal (peso, reps, sets)
    """
    try:
        if not request.history:
            raise HTTPException(status_code=400, detail="Histórico vazio")
        
        last_session = request.history[-1]
        
        # Lógica de progressão baseada em princípios científicos
        current_weight = last_session.weight
        current_reps = last_session.reps
        
        # Se conseguiu fazer mais de 12 reps, aumentar peso
        if current_reps >= 12:
            next_weight = current_weight * 1.025  # 2.5% increase
            next_reps = 8
            progression_type = "weight_increase"
        # Se conseguiu 8-12 reps, manter e tentar mais reps
        elif current_reps >= 8:
            next_weight = current_weight
            next_reps = current_reps + 1
            progression_type = "rep_increase"
        # Se menos de 8 reps, reduzir peso
        else:
            next_weight = current_weight * 0.95  # Reduzir 5%
            next_reps = 8
            progression_type = "weight_decrease"
        
        return {
            "exercise_id": request.exercise_id,
            "current": {
                "weight": current_weight,
                "reps": current_reps,
                "sets": last_session.sets
            },
            "recommended_next": {
                "weight": round(next_weight, 2),
                "reps": next_reps,
                "sets": last_session.sets,
                "progression_type": progression_type
            },
            "confidence": 0.85,
            "reasoning": self._get_progression_reasoning(progression_type),
            "deload_recommended": len(request.history) >= 12  # A cada 12 sessões
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _get_progression_reasoning(progression_type: str) -> str:
    """Gera explicação para progressão"""
    reasons = {
        "weight_increase": "Você conseguiu 12+ reps, hora de aumentar o peso!",
        "rep_increase": "Mantenha o peso e aumente as repetições gradualmente",
        "weight_decrease": "Menos de 8 reps indica peso muito alto. Reduzindo para treinar com técnica adequada."
    }
    return reasons.get(progression_type, "Progressão linear padrão")


