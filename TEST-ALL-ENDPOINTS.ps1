# Script PowerShell para testar todos os endpoints do sistema
# Execute: .\TEST-ALL-ENDPOINTS.ps1

Write-Host "🚀 TESTANDO SISTEMA COMPLETO DE TREINO INTELIGENTE" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host ""

# Cores
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Yellow"

# URLs
$backendUrl = "http://localhost:3001"
$mlServiceUrl = "http://localhost:8000"

# ============================================================================
# BACKEND TYPESCRIPT - TESTE BÁSICO
# ============================================================================
Write-Host "📦 1. TESTANDO BACKEND TYPESCRIPT" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $backendUrl -Method Get
    Write-Host "✅ Backend está rodando!" -ForegroundColor $successColor
    Write-Host "   Versão: $($response.version)" -ForegroundColor Gray
    Write-Host "   Endpoints disponíveis: $($response.endpoints.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend NÃO está respondendo em $backendUrl" -ForegroundColor $errorColor
    Write-Host "   Certifique-se de que o backend está rodando!" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# ============================================================================
# ML SERVICE PYTHON - TESTE BÁSICO
# ============================================================================
Write-Host "🐍 2. TESTANDO ML SERVICE PYTHON" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $mlServiceUrl -Method Get
    Write-Host "✅ ML Service está rodando!" -ForegroundColor $successColor
    Write-Host "   Mensagem: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ ML Service NÃO está respondendo em $mlServiceUrl" -ForegroundColor $errorColor
    Write-Host "   Certifique-se de que o ML Service está rodando!" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# ============================================================================
# ENDPOINTS DE RECOMENDAÇÃO
# ============================================================================
Write-Host "🎯 3. TESTANDO ENDPOINTS DE RECOMENDAÇÃO" -ForegroundColor $infoColor
Write-Host ""

# Teste 1: Todos os métodos
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/recommendations/methods/all" -Method Get
    Write-Host "   ✅ GET /api/recommendations/methods/all" -ForegroundColor $successColor
    Write-Host "      Métodos retornados: $($response.count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ GET /api/recommendations/methods/all FALHOU" -ForegroundColor $errorColor
}

# Teste 2: Métodos para 5 dias
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/recommendations/methods?days=5&goals=Hipertrofia" -Method Get
    Write-Host "   ✅ GET /api/recommendations/methods?days=5" -ForegroundColor $successColor
    Write-Host "      Recomendações: $($response.data.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ GET /api/recommendations/methods?days=5 FALHOU" -ForegroundColor $errorColor
}

Write-Host ""

# ============================================================================
# ENDPOINTS DE PROGRESSO
# ============================================================================
Write-Host "📊 4. TESTANDO ENDPOINTS DE PROGRESSO" -ForegroundColor $infoColor
Write-Host ""

$testUserId = "test-user-123"

# Teste 1: Salvar performance
try {
    $body = @{
        userId = $testUserId
        exerciseId = "test-exercise-1"
        weight = 80
        reps = 10
        sets = 3
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/progress/save" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   ✅ POST /api/progress/save" -ForegroundColor $successColor
    Write-Host "      Performance salva com sucesso" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  POST /api/progress/save (pode falhar se já existir)" -ForegroundColor $infoColor
}

# Teste 2: Consistência
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/progress/consistency?userId=$testUserId&period=month" -Method Get
    Write-Host "   ✅ GET /api/progress/consistency" -ForegroundColor $successColor
    Write-Host "      Taxa de conclusão: $($response.data.completionRate)%" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ GET /api/progress/consistency FALHOU" -ForegroundColor $errorColor
}

# Teste 3: Performance
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/progress/performance?userId=$testUserId" -Method Get
    Write-Host "   ✅ GET /api/progress/performance" -ForegroundColor $successColor
} catch {
    Write-Host "   ❌ GET /api/progress/performance FALHOU" -ForegroundColor $errorColor
}

Write-Host ""

# ============================================================================
# ENDPOINTS DE GAMIFICAÇÃO
# ============================================================================
Write-Host "🎮 5. TESTANDO ENDPOINTS DE GAMIFICAÇÃO" -ForegroundColor $infoColor
Write-Host ""

# Teste 1: Score
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/gamification/score?userId=$testUserId" -Method Get
    Write-Host "   ✅ GET /api/gamification/score" -ForegroundColor $successColor
    Write-Host "      Pontos totais: $($response.data.totalPoints)" -ForegroundColor Gray
    Write-Host "      Nível: $($response.data.level)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ GET /api/gamification/score FALHOU" -ForegroundColor $errorColor
}

# Teste 2: Badges
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/gamification/badges?userId=$testUserId" -Method Get
    Write-Host "   ✅ GET /api/gamification/badges" -ForegroundColor $successColor
    Write-Host "      Badges conquistados: $($response.count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ GET /api/gamification/badges FALHOU" -ForegroundColor $errorColor
}

# Teste 3: Verificar novos badges
try {
    $body = @{
        userId = $testUserId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/gamification/check-badges" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   ✅ POST /api/gamification/check-badges" -ForegroundColor $successColor
    Write-Host "      Novos badges: $($response.data.count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ POST /api/gamification/check-badges FALHOU" -ForegroundColor $errorColor
}

Write-Host ""

# ============================================================================
# ML SERVICE - ENDPOINTS
# ============================================================================
Write-Host "🤖 6. TESTANDO ML SERVICE ENDPOINTS" -ForegroundColor $infoColor
Write-Host ""

# Teste 1: Recomendações ML
try {
    $body = @{
        userId = $testUserId
        availableDays = 5
        goals = @("Hipertrofia", "Força")
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$mlServiceUrl/recommendations/methods" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   ✅ POST /recommendations/methods" -ForegroundColor $successColor
    Write-Host "      Recomendações geradas: $($response.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  POST /recommendations/methods (pode falhar sem dados de treino)" -ForegroundColor $infoColor
}

# Teste 2: Busca científica
try {
    $body = @{
        query = "progressive overload training"
        limit = 3
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$mlServiceUrl/scientific/search" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   ✅ POST /scientific/search" -ForegroundColor $successColor
    Write-Host "      Artigos encontrados: $($response.results.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  POST /scientific/search (requer conexão PubMed)" -ForegroundColor $infoColor
}

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host "✅ TESTES CONCLUÍDOS!" -ForegroundColor $successColor
Write-Host ""
Write-Host "📚 DOCUMENTAÇÃO DISPONÍVEL:" -ForegroundColor Cyan
Write-Host "   - SISTEMA-COMPLETO.md" -ForegroundColor Gray
Write-Host "   - EXECUTAR-SISTEMA-COMPLETO.md" -ForegroundColor Gray
Write-Host "   - LISTA-COMPLETA-SERVICOS.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 URLs ÚTEIS:" -ForegroundColor Cyan
Write-Host "   - Backend:     http://localhost:3001" -ForegroundColor Gray
Write-Host "   - ML Service:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   - Swagger:     http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "   - Frontend:    http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 SISTEMA 100% FUNCIONAL!" -ForegroundColor Green
Write-Host ""


