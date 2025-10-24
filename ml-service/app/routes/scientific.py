"""
Rotas para Dados Científicos e Validação
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
from datetime import datetime

router = APIRouter()


class ScientificSearchRequest(BaseModel):
    keywords: List[str]
    limit: int = 10


class ValidationRequest(BaseModel):
    recommendation: str
    context: str


@router.post("/search")
async def search_scientific_articles(request: ScientificSearchRequest):
    """
    Busca artigos científicos no PubMed
    """
    try:
        # Construir query
        query = " AND ".join(request.keywords)
        
        # PubMed API (E-utilities)
        base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        params = {
            "db": "pubmed",
            "term": query,
            "retmax": request.limit,
            "retmode": "json"
        }
        
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        pmids = data.get("esearchresult", {}).get("idlist", [])
        
        return {
            "query": query,
            "total_results": len(pmids),
            "pmids": pmids,
            "search_date": datetime.now().isoformat(),
            "source": "PubMed"
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Erro ao acessar PubMed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate")
async def validate_recommendation(request: ValidationRequest):
    """
    Valida uma recomendação baseado em evidência científica
    """
    try:
        # TODO: Implementar validação real com NLP e base de conhecimento
        # Por enquanto, retorna validação mock
        
        # Simular busca de evidências
        confidence = 0.85  # Mock
        studies_found = 42  # Mock
        
        return {
            "recommendation": request.recommendation,
            "is_scientifically_supported": True,
            "confidence": confidence,
            "evidence_level": "A",
            "studies_found": studies_found,
            "key_findings": [
                "Múltiplos estudos confirmam eficácia",
                "Meta-análises suportam a recomendação",
                "Baixo risco de lesão documentado"
            ],
            "sources": [
                {"pmid": "12345678", "title": "Study on training methods"},
                {"pmid": "87654321", "title": "Meta-analysis of workout programs"}
            ],
            "validated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract")
async def extract_data_from_paper(pdf_url: str):
    """
    Extrai dados estruturados de um paper científico
    """
    try:
        # TODO: Implementar extração real com PyPDF2 e NLP
        # Por enquanto, retorna dados mock
        
        return {
            "pdf_url": pdf_url,
            "extracted_data": {
                "title": "Example Scientific Paper",
                "authors": ["Smith, J.", "Doe, J."],
                "year": 2023,
                "findings": [
                    "Finding 1: Training frequency impacts results",
                    "Finding 2: Progressive overload is essential"
                ],
                "methods": ["Push/Pull/Legs", "Upper/Lower"],
                "effectiveness_scores": {
                    "PPL": 0.89,
                    "Upper/Lower": 0.85
                }
            },
            "extraction_confidence": 0.82,
            "extracted_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


