# Script para fazer push para o Git remoto
# Executar: .\PUSH-TO-GIT.ps1

Write-Host "🚀 Fazendo push para o Git remoto..." -ForegroundColor Yellow

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto Git" -ForegroundColor Red
    exit 1
}

# Verificar status
Write-Host "📋 Verificando status do Git..." -ForegroundColor Cyan
git status

# Adicionar todos os arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Verificar o que será commitado
Write-Host "📋 Verificando mudanças..." -ForegroundColor Cyan
git status --porcelain

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat: sistema completo com .gitignore melhorado

- Sistema de treino inteligente 100% implementado
- ML Service Python com modelos híbridos  
- Sistema de gamificação e progresso
- Frontend React com onboarding corrigido
- .gitignore melhorado para excluir arquivos desnecessários
- 25+ endpoints implementados
- Documentação completa

Funcionalidades:
- Recomendações inteligentes
- Análise de progresso  
- Gamificação com badges
- ML Service científico
- Frontend responsivo"

# Verificar se há remote configurado
Write-Host "🌐 Verificando remote..." -ForegroundColor Cyan
git remote -v

# Fazer push para origin/main
Write-Host "⬆️ Fazendo push para origin/main..." -ForegroundColor Cyan
git push origin main

# Verificar resultado
Write-Host "✅ Push concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Status final:" -ForegroundColor Cyan
git status

Write-Host "🎉 Sistema enviado para o Git remoto com sucesso!" -ForegroundColor Green
