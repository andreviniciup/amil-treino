# Script para reorganizar branches sem arquivos desnecessários
# Executar: .\REORGANIZAR-BRANCHES.ps1

Write-Host "🔄 Reorganizando branches sem arquivos desnecessários..." -ForegroundColor Yellow

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json") -and -not (Test-Path "backend/package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

# Verificar status do Git
Write-Host "📋 Verificando status do Git..." -ForegroundColor Cyan
git status

# Verificar branches existentes
Write-Host "🌿 Verificando branches existentes..." -ForegroundColor Cyan
git branch -a

# Deletar branches problemáticas se existirem
Write-Host "🗑️ Removendo branches problemáticas..." -ForegroundColor Yellow
git branch -D v01-mvp 2>$null
git branch -D v02-complete 2>$null

# Voltar para main
Write-Host "🏠 Voltando para branch main..." -ForegroundColor Cyan
git checkout main

# Verificar se .gitignore está atualizado
Write-Host "📝 Verificando .gitignore..." -ForegroundColor Cyan
if (Test-Path ".gitignore") {
    Write-Host "✅ .gitignore encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ .gitignore não encontrado" -ForegroundColor Red
}

# Remover arquivos desnecessários do cache
Write-Host "🧹 Removendo arquivos desnecessários do cache..." -ForegroundColor Yellow
git rm -r --cached ml-service/venv/ 2>$null
git rm -r --cached ml-service/app/__pycache__/ 2>$null
git rm -r --cached ml-service/app/models/__pycache__/ 2>$null
git rm -r --cached ml-service/app/routes/__pycache__/ 2>$null
git rm -r --cached backend/dist/ 2>$null
git rm -r --cached frontend/dist/ 2>$null

# Adicionar .gitignore atualizado
Write-Host "📝 Atualizando .gitignore..." -ForegroundColor Cyan
git add .gitignore

# Commitar mudanças
Write-Host "💾 Commitando mudanças..." -ForegroundColor Cyan
git commit -m "fix: reorganizar branches sem arquivos desnecessários

- Melhorar .gitignore para excluir venv, __pycache__, dist
- Remover arquivos desnecessários do cache do Git
- Preparar branches limpas para v01-mvp e v02-complete
- Evitar commit de arquivos temporários e grandes"

# Criar branch v02-complete (sistema completo)
Write-Host "🌿 Criando branch v02-complete..." -ForegroundColor Cyan
git checkout -b v02-complete

# Criar branch v01-mvp (versão simplificada)
Write-Host "🌿 Criando branch v01-mvp..." -ForegroundColor Cyan
git checkout -b v01-mvp

# Voltar para main
Write-Host "🏠 Voltando para main..." -ForegroundColor Cyan
git checkout main

# Verificar resultado
Write-Host "✅ Verificando resultado..." -ForegroundColor Green
git branch -a

Write-Host "🎉 Reorganização concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Branches disponíveis:" -ForegroundColor Cyan
Write-Host "  - main: Sistema estável atual" -ForegroundColor White
Write-Host "  - v01-mvp: Versão MVP simplificada" -ForegroundColor White
Write-Host "  - v02-complete: Sistema completo" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Como usar:" -ForegroundColor Cyan
Write-Host "  git checkout v01-mvp    # Versão simplificada" -ForegroundColor White
Write-Host "  git checkout v02-complete # Sistema completo" -ForegroundColor White
Write-Host "  git checkout main       # Versão estável" -ForegroundColor White
