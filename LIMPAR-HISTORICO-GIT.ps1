# Script para limpar histórico do Git removendo arquivos grandes
# Executar: .\LIMPAR-HISTORICO-GIT.ps1

Write-Host "🧹 Limpando histórico do Git removendo arquivos grandes..." -ForegroundColor Yellow

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto Git" -ForegroundColor Red
    exit 1
}

# Verificar se há arquivos grandes no histórico
Write-Host "📋 Verificando arquivos grandes no histórico..." -ForegroundColor Cyan
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | Where-Object { $_ -match '^blob' } | ForEach-Object { $parts = $_ -split ' '; [PSCustomObject]@{ Size = [int]$parts[2]; Name = $parts[3..($parts.Length-1)] -join ' ' } } | Sort-Object Size -Descending | Select-Object -First 10

# Criar backup do branch atual
Write-Host "💾 Criando backup do branch main..." -ForegroundColor Cyan
git branch backup-main

# Usar git filter-branch para remover arquivos grandes
Write-Host "🗑️ Removendo arquivos grandes do histórico..." -ForegroundColor Yellow

# Remover ml-service/venv/ do histórico
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch ml-service/venv/' --prune-empty --tag-name-filter cat -- --all

# Remover __pycache__ do histórico
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch ml-service/app/__pycache__/ ml-service/app/models/__pycache__/ ml-service/app/routes/__pycache__/' --prune-empty --tag-name-filter cat -- --all

# Limpar referências
Write-Host "🧹 Limpando referências..." -ForegroundColor Cyan
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Verificar tamanho do repositório
Write-Host "📊 Verificando tamanho do repositório..." -ForegroundColor Cyan
git count-objects -vH

Write-Host "✅ Limpeza do histórico concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Agora você pode fazer push:" -ForegroundColor Cyan
Write-Host "  git push origin main --force" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Use --force apenas se você tem certeza!" -ForegroundColor Red
