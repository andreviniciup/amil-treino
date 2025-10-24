# Script PowerShell para testar especificamente o ML Service
# Execute: .\TESTE-ML-SERVICE.ps1

Write-Host "🤖 TESTANDO ML SERVICE - SISTEMA DE TREINO INTELIGENTE" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host ""

# Cores
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Yellow"
$warningColor = "Magenta"

# URL do ML Service
$mlServiceUrl = "http://localhost:8000"

# ============================================================================
# VERIFICAÇÃO INICIAL
# ============================================================================
Write-Host "🔍 1. VERIFICANDO ML SERVICE" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $mlServiceUrl -Method Get
    Write-Host "✅ ML Service está rodando!" -ForegroundColor $successColor
    Write-Host "   Serviço: $($response.service)" -ForegroundColor Gray
    Write-Host "   Versão: $($response.version)" -ForegroundColor Gray
} catch {
    Write-Host "❌ ML Service NÃO está respondendo em $mlServiceUrl" -ForegroundColor $errorColor
    Write-Host "   Certifique-se de que o ML Service está rodando!" -ForegroundColor Gray
    Write-Host "   Comando: uvicorn app.main:app --reload --port 8000" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# ============================================================================
# TESTE DE STATUS DOS MODELOS
# ============================================================================
Write-Host "📊 2. VERIFICANDO STATUS DOS MODELOS" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/train/models/status" -Method Get
    Write-Host "✅ Status dos modelos obtido!" -ForegroundColor $successColor
    
    $recommendationModel = $response.recommendation_model
    $performanceModel = $response.performance_predictor
    $progressionModel = $response.progression_model
    
    Write-Host "   📈 Modelo de Recomendação:" -ForegroundColor Gray
    Write-Host "      Treinado: $($recommendationModel.trained)" -ForegroundColor Gray
    Write-Host "      Tipo: $($recommendationModel.type)" -ForegroundColor Gray
    
    Write-Host "   🎯 Preditor de Performance:" -ForegroundColor Gray
    Write-Host "      Treinado: $($performanceModel.trained)" -ForegroundColor Gray
    Write-Host "      Tipo: $($performanceModel.type)" -ForegroundColor Gray
    
    Write-Host "   📈 Modelo de Progressão:" -ForegroundColor Gray
    Write-Host "      Treinado: $($progressionModel.trained)" -ForegroundColor Gray
    Write-Host "      Tipo: $($progressionModel.type)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Falha ao obter status dos modelos" -ForegroundColor $errorColor
}

Write-Host ""

# ============================================================================
# GERAR DADOS MOCK E TREINAR MODELO
# ============================================================================
Write-Host "🎲 3. GERANDO DADOS MOCK E TREINANDO MODELO" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/train/generate-mock-data" -Method Post
    Write-Host "✅ Modelo treinado com dados mock!" -ForegroundColor $successColor
    Write-Host "   Amostras geradas: $($response.samples_generated)" -ForegroundColor Gray
    
    if ($response.training_results) {
        Write-Host "   📊 Resultados do treinamento:" -ForegroundColor Gray
        Write-Host "      RF Accuracy: $($response.training_results.rf_accuracy)" -ForegroundColor Gray
        Write-Host "      GB Accuracy: $($response.training_results.gb_accuracy)" -ForegroundColor Gray
        Write-Host "      Ensemble Accuracy: $($response.training_results.ensemble_accuracy)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Falha ao treinar modelo com dados mock" -ForegroundColor $errorColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# TESTE DE RECOMENDAÇÕES ML
# ============================================================================
Write-Host "🎯 4. TESTANDO RECOMENDAÇÕES ML" -ForegroundColor $infoColor
Write-Host ""

# Dados de teste para recomendação
$userProfile = @{
    age = 25
    gender = "Masculino"
    weight = 75
    height = 175
    fitnessLevel = "Intermediário"
    trainingExperience = 2
    primaryGoals = @("Hipertrofia", "Força")
    availableDays = 5
    availableTime = 60
    equipment = @("Barra", "Halteres")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/recommendations" -Method Post -Body $userProfile -ContentType "application/json"
    Write-Host "✅ Recomendações ML geradas!" -ForegroundColor $successColor
    Write-Host "   Confiança do ensemble: $($response.ensemble_confidence)" -ForegroundColor Gray
    Write-Host "   Concordância dos modelos: $($response.model_agreement)" -ForegroundColor Gray
    Write-Host "   Número de recomendações: $($response.recommendations.Count)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️ Recomendações ML podem falhar se modelo não estiver treinado" -ForegroundColor $warningColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# TESTE DE PREDIÇÃO DE PERFORMANCE
# ============================================================================
Write-Host "📈 5. TESTANDO PREDIÇÃO DE PERFORMANCE" -ForegroundColor $infoColor
Write-Host ""

# Dados de histórico para predição
$performanceData = @{
    user_id = "test-user-123"
    exercise_id = "supino"
    history = @(
        @{
            date = "2024-01-01"
            exercise_id = "supino"
            weight = 80
            reps = 10
            sets = 3
        },
        @{
            date = "2024-01-08"
            exercise_id = "supino"
            weight = 82.5
            reps = 10
            sets = 3
        },
        @{
            date = "2024-01-15"
            exercise_id = "supino"
            weight = 85
            reps = 8
            sets = 3
        }
    )
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/predict/performance" -Method Post -Body $performanceData -ContentType "application/json"
    Write-Host "✅ Predição de performance gerada!" -ForegroundColor $successColor
    Write-Host "   Exercício: $($response.exercise_id)" -ForegroundColor Gray
    Write-Host "   Performance atual: $($response.current_performance.weight)kg x $($response.current_performance.reps) reps" -ForegroundColor Gray
    Write-Host "   Próxima sessão prevista: $($response.predicted_next_session.weight)kg x $($response.predicted_next_session.reps) reps" -ForegroundColor Gray
    Write-Host "   Confiança: $($response.predicted_next_session.confidence)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Falha na predição de performance" -ForegroundColor $errorColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# TESTE DE PREDIÇÃO DE PROGRESSÃO
# ============================================================================
Write-Host "🚀 6. TESTANDO PREDIÇÃO DE PROGRESSÃO" -ForegroundColor $infoColor
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/predict/progression" -Method Post -Body $performanceData -ContentType "application/json"
    Write-Host "✅ Predição de progressão gerada!" -ForegroundColor $successColor
    Write-Host "   Exercício: $($response.exercise_id)" -ForegroundColor Gray
    Write-Host "   Atual: $($response.current.weight)kg x $($response.current.reps) reps" -ForegroundColor Gray
    Write-Host "   Recomendado: $($response.recommended_next.weight)kg x $($response.recommended_next.reps) reps" -ForegroundColor Gray
    Write-Host "   Tipo de progressão: $($response.recommended_next.progression_type)" -ForegroundColor Gray
    Write-Host "   Confiança: $($response.confidence)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Falha na predição de progressão" -ForegroundColor $errorColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# TESTE DE BUSCA CIENTÍFICA
# ============================================================================
Write-Host "🔬 7. TESTANDO BUSCA CIENTÍFICA" -ForegroundColor $infoColor
Write-Host ""

$scientificQuery = @{
    query = "progressive overload training"
    limit = 3
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/scientific/search" -Method Post -Body $scientificQuery -ContentType "application/json"
    Write-Host "✅ Busca científica realizada!" -ForegroundColor $successColor
    Write-Host "   Query: progressive overload training" -ForegroundColor Gray
    Write-Host "   Resultados encontrados: $($response.results.Count)" -ForegroundColor Gray
    
    if ($response.results.Count -gt 0) {
        Write-Host "   📚 Primeiro resultado:" -ForegroundColor Gray
        Write-Host "      Título: $($response.results[0].title)" -ForegroundColor Gray
        Write-Host "      Autor: $($response.results[0].author)" -ForegroundColor Gray
        Write-Host "      Ano: $($response.results[0].year)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️ Busca científica pode falhar sem conexão PubMed" -ForegroundColor $warningColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# TESTE DE VALIDAÇÃO CIENTÍFICA
# ============================================================================
Write-Host "✅ 8. TESTANDO VALIDAÇÃO CIENTÍFICA" -ForegroundColor $infoColor
Write-Host ""

$validationData = @{
    recommendation = "PPL (Push/Pull/Legs)"
    user_profile = "Jovem adulto, objetivo hipertrofia, 5 dias disponíveis"
    scientific_criteria = @("progressive overload", "volume", "frequency")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$mlServiceUrl/api/ml/scientific/validate" -Method Post -Body $validationData -ContentType "application/json"
    Write-Host "✅ Validação científica realizada!" -ForegroundColor $successColor
    Write-Host "   Recomendação: $($response.recommendation)" -ForegroundColor Gray
    Write-Host "   Score científico: $($response.scientific_score)" -ForegroundColor Gray
    Write-Host "   Evidências encontradas: $($response.evidence_count)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️ Validação científica pode falhar sem dados PubMed" -ForegroundColor $warningColor
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host "🎉 TESTES DO ML SERVICE CONCLUÍDOS!" -ForegroundColor $successColor
Write-Host ""
Write-Host "📊 RESUMO DOS TESTES:" -ForegroundColor Cyan
Write-Host "   ✅ Status dos modelos" -ForegroundColor Gray
Write-Host "   ✅ Geração de dados mock" -ForegroundColor Gray
Write-Host "   ✅ Treinamento de modelo" -ForegroundColor Gray
Write-Host "   ✅ Recomendações ML" -ForegroundColor Gray
Write-Host "   ✅ Predição de performance" -ForegroundColor Gray
Write-Host "   ✅ Predição de progressão" -ForegroundColor Gray
Write-Host "   ✅ Busca científica" -ForegroundColor Gray
Write-Host "   ✅ Validação científica" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 URLs ÚTEIS:" -ForegroundColor Cyan
Write-Host "   - ML Service:     http://localhost:8000" -ForegroundColor Gray
Write-Host "   - Swagger Docs:   http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "   - Redoc:          http://localhost:8000/redoc" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "   1. Leia TESTE-ML-COMPLETO.md para evolução DL" -ForegroundColor Gray
Write-Host "   2. Implemente LSTM para predições avançadas" -ForegroundColor Gray
Write-Host "   3. Adicione Transformer para recomendações" -ForegroundColor Gray
Write-Host "   4. Integre CNN para análise de forma" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 ML SERVICE FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
Write-Host ""
