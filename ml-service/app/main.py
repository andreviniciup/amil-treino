"""
FastAPI Main Application - ML Service - MVP v0.01

MVP v0.01: ML Service desabilitado temporariamente
TODO: Reativar na v0.02
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# MVP v0.01: Rotas complexas desabilitadas temporariamente
# TODO: Reativar na v0.02
# from app.routes import recommendations, predictions, training, scientific

app = FastAPI(
    title="ML Service - Treino Inteligente - MVP v0.01",
    description="Serviço de Machine Learning para recomendações científicas de treino - MVP v0.01",
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

# MVP v0.01: Rotas complexas desabilitadas temporariamente
# TODO: Reativar na v0.02
# app.include_router(recommendations.router, prefix="/api/ml/recommendations", tags=["Recomendações"])
# app.include_router(predictions.router, prefix="/api/ml/predict", tags=["Predições"])
# app.include_router(training.router, prefix="/api/ml/train", tags=["Treinamento"])
# app.include_router(scientific.router, prefix="/api/ml/scientific", tags=["Científico"])

@app.get("/")
async def root():
    return {
        "service": "ML Service - Treino Inteligente",
        "version": "1.0.0",
        "status": "disabled_for_mvp",
        "message": "ML Service não necessário no MVP v0.01",
        "endpoints": {
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "message": "ML Service em modo MVP v0.01",
        "note": "Funcionalidades complexas desabilitadas temporariamente"
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


