"""
FastAPI Main Application - ML Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Importar rotas
from app.routes import recommendations, predictions, training, scientific

app = FastAPI(
    title="ML Service - Treino Inteligente",
    description="Serviço de Machine Learning para recomendações científicas de treino",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(recommendations.router, prefix="/api/ml/recommendations", tags=["Recomendações"])
app.include_router(predictions.router, prefix="/api/ml/predict", tags=["Predições"])
app.include_router(training.router, prefix="/api/ml/train", tags=["Treinamento"])
app.include_router(scientific.router, prefix="/api/ml/scientific", tags=["Científico"])

@app.get("/")
async def root():
    return {
        "service": "ML Service - Treino Inteligente",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "recommendations": "/api/ml/recommendations",
            "predictions": "/api/ml/predict",
            "training": "/api/ml/train",
            "scientific": "/api/ml/scientific"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ml-service",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

