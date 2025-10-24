# Script para alternar entre branches do sistema de treino
# Uso: .\switch-branches.ps1 [branch-name]

param(
    [Parameter(Position=0)]
    [ValidateSet("main", "v01-mvp", "v02-complete", "v03-dl", "develop")]
    [string]$Branch = "main"
)

Write-Host "Alternando para branch: $Branch" -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "Erro: Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

# Alternar para a branch especificada
try {
    git checkout $Branch
    Write-Host "Branch $Branch ativada com sucesso!" -ForegroundColor Green
    
    # Mostrar informações da branch
    Write-Host "`nInformacoes da branch:" -ForegroundColor Cyan
    git log --oneline -5
    
    # Mostrar próximos passos baseado na branch
    switch ($Branch) {
        "main" {
            Write-Host "`nBranch principal - Sistema estavel" -ForegroundColor Yellow
            Write-Host "Para executar: npm run dev (backend) + npm run dev (frontend)" -ForegroundColor White
        }
        "v01-mvp" {
            Write-Host "`nMVP v01 - Sistema simplificado" -ForegroundColor Yellow
            Write-Host "Para executar:" -ForegroundColor White
            Write-Host "  Backend: cd backend; npm run dev" -ForegroundColor White
            Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
        }
        "v02-complete" {
            Write-Host "`nSistema completo v02 - Todas as funcionalidades" -ForegroundColor Yellow
            Write-Host "Para executar:" -ForegroundColor White
            Write-Host "  Backend: cd backend; npm run dev" -ForegroundColor White
            Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
            Write-Host "  ML Service: cd ml-service; uvicorn app.main:app --reload" -ForegroundColor White
        }
        "v03-dl" {
            Write-Host "`nDeep Learning v03 - IA avancada" -ForegroundColor Yellow
            Write-Host "Para executar:" -ForegroundColor White
            Write-Host "  Backend: cd backend; npm run dev" -ForegroundColor White
            Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
            Write-Host "  ML Service: cd ml-service; uvicorn app.main:app --reload" -ForegroundColor White
            Write-Host "  Jupyter: cd ml-service; jupyter lab" -ForegroundColor White
        }
        "develop" {
            Write-Host "`nBranch de desenvolvimento - Testes e experimentos" -ForegroundColor Yellow
            Write-Host "Para executar: npm run dev (backend) + npm run dev (frontend)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "Erro ao alternar para branch $Branch" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`nPronto para trabalhar na branch $Branch!" -ForegroundColor Green