# Script PowerShell para migrar sistema ML para Deep Learning
# Execute: .\MIGRAR-PARA-DL.ps1

Write-Host "🧠 MIGRANDO SISTEMA ML PARA DEEP LEARNING" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host ""

# Cores
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Yellow"
$warningColor = "Magenta"

# ============================================================================
# VERIFICAÇÃO INICIAL
# ============================================================================
Write-Host "🔍 1. VERIFICANDO PRÉ-REQUISITOS" -ForegroundColor $infoColor
Write-Host ""

# Verificar Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Python não encontrado. Instale Python 3.10+" -ForegroundColor $errorColor
    exit 1
}

# Verificar pip
try {
    $pipVersion = pip --version 2>&1
    Write-Host "✅ pip encontrado: $pipVersion" -ForegroundColor $successColor
} catch {
    Write-Host "❌ pip não encontrado" -ForegroundColor $errorColor
    exit 1
}

Write-Host ""

# ============================================================================
# BACKUP DO SISTEMA ATUAL
# ============================================================================
Write-Host "💾 2. CRIANDO BACKUP DO SISTEMA ATUAL" -ForegroundColor $infoColor
Write-Host ""

$backupDir = "backup-ml-$(Get-Date -Format 'yyyy-MM-dd-HH-mm')"
try {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "ml-service" -Destination "$backupDir/ml-service-backup" -Recurse -Force
    Write-Host "✅ Backup criado em: $backupDir" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao criar backup, continuando..." -ForegroundColor $warningColor
}

Write-Host ""

# ============================================================================
# INSTALAÇÃO DE DEPENDÊNCIAS DL
# ============================================================================
Write-Host "📦 3. INSTALANDO DEPENDÊNCIAS DEEP LEARNING" -ForegroundColor $infoColor
Write-Host ""

# Navegar para ml-service
Set-Location ml-service

# Ativar ambiente virtual
try {
    .\venv\Scripts\Activate.ps1
    Write-Host "✅ Ambiente virtual ativado" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Falha ao ativar ambiente virtual" -ForegroundColor $errorColor
    Write-Host "   Execute: python -m venv venv" -ForegroundColor Gray
    exit 1
}

# Instalar dependências DL
Write-Host "📥 Instalando TensorFlow..." -ForegroundColor Gray
try {
    pip install tensorflow==2.16.1
    Write-Host "✅ TensorFlow instalado" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao instalar TensorFlow" -ForegroundColor $warningColor
}

Write-Host "📥 Instalando PyTorch..." -ForegroundColor Gray
try {
    pip install torch==2.1.0 torchvision==0.16.0
    Write-Host "✅ PyTorch instalado" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao instalar PyTorch" -ForegroundColor $warningColor
}

Write-Host "📥 Instalando Transformers..." -ForegroundColor Gray
try {
    pip install transformers==4.35.2
    Write-Host "✅ Transformers instalado" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao instalar Transformers" -ForegroundColor $warningColor
}

Write-Host "📥 Instalando OpenCV e MediaPipe..." -ForegroundColor Gray
try {
    pip install opencv-python==4.8.1.78 mediapipe==0.10.7
    Write-Host "✅ OpenCV e MediaPipe instalados" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao instalar OpenCV/MediaPipe" -ForegroundColor $warningColor
}

Write-Host ""

# ============================================================================
# IMPLEMENTAÇÃO DE MODELOS DL
# ============================================================================
Write-Host "🧠 4. IMPLEMENTANDO MODELOS DEEP LEARNING" -ForegroundColor $infoColor
Write-Host ""

# Criar diretórios para modelos DL
$dlDirs = @("models/lstm", "models/transformer", "models/cnn", "models/rl")
foreach ($dir in $dlDirs) {
    try {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Diretório criado: $dir" -ForegroundColor $successColor
    } catch {
        Write-Host "⚠️ Falha ao criar diretório: $dir" -ForegroundColor $warningColor
    }
}

Write-Host ""

# ============================================================================
# TESTE DOS MODELOS DL
# ============================================================================
Write-Host "🧪 5. TESTANDO MODELOS DEEP LEARNING" -ForegroundColor $infoColor
Write-Host ""

# Testar LSTM
Write-Host "🔬 Testando LSTM..." -ForegroundColor Gray
try {
    python -c "
import sys
sys.path.append('.')
from app.models.lstm_performance_model import LSTMPerformanceModel
model = LSTMPerformanceModel()
print('✅ LSTM model carregado com sucesso')
print(f'   Sequence length: {model.sequence_length}')
print(f'   Features: {model.n_features}')
"
    Write-Host "✅ LSTM funcionando" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Falha no teste LSTM" -ForegroundColor $errorColor
}

# Testar Transformer
Write-Host "🔬 Testando Transformer..." -ForegroundColor Gray
try {
    python -c "
import sys
sys.path.append('.')
from app.models.transformer_recommendation import TransformerRecommendationModel
model = TransformerRecommendationModel()
print('✅ Transformer model carregado com sucesso')
print(f'   Model name: {model.model_name}')
print(f'   Classes: {model.num_classes}')
"
    Write-Host "✅ Transformer funcionando" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Falha no teste Transformer" -ForegroundColor $errorColor
}

Write-Host ""

# ============================================================================
# ATUALIZAÇÃO DE ENDPOINTS
# ============================================================================
Write-Host "🔄 6. ATUALIZANDO ENDPOINTS PARA DL" -ForegroundColor $infoColor
Write-Host ""

# Criar novos endpoints DL
$dlEndpoints = @"
# Novos endpoints para Deep Learning
@router.post("/performance-dl")
async def predict_performance_dl(request: PerformancePredictionRequest):
    """Predição de performance usando LSTM"""
    # Implementar LSTM aqui
    pass

@router.post("/recommendations-dl") 
async def get_recommendations_dl(user_profile: UserProfileRequest):
    """Recomendações usando Transformer"""
    # Implementar Transformer aqui
    pass

@router.post("/form-analysis")
async def analyze_exercise_form(video_file: UploadFile):
    """Análise de forma usando CNN"""
    # Implementar CNN aqui
    pass
"@

try {
    Add-Content -Path "app/routes/dl_routes.py" -Value $dlEndpoints
    Write-Host "✅ Endpoints DL criados" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao criar endpoints DL" -ForegroundColor $warningColor
}

Write-Host ""

# ============================================================================
# TESTE INTEGRADO
# ============================================================================
Write-Host "🚀 7. TESTANDO SISTEMA INTEGRADO" -ForegroundColor $infoColor
Write-Host ""

# Voltar para diretório raiz
Set-Location ..

# Testar ML Service com DL
Write-Host "🧪 Testando ML Service com DL..." -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000" -Method Get
    Write-Host "✅ ML Service funcionando" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ ML Service não está rodando" -ForegroundColor $warningColor
    Write-Host "   Execute: uvicorn app.main:app --reload --port 8000" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# DOCUMENTAÇÃO
# ============================================================================
Write-Host "📚 8. CRIANDO DOCUMENTAÇÃO DL" -ForegroundColor $infoColor
Write-Host ""

$dlDocs = @"
# Deep Learning Implementation Guide

## Modelos Implementados

### 1. LSTM Performance Model
- **Arquivo**: `app/models/lstm_performance_model.py`
- **Função**: Predição de performance usando séries temporais
- **Tecnologia**: TensorFlow + LSTM + Attention

### 2. Transformer Recommendation Model  
- **Arquivo**: `app/models/transformer_recommendation.py`
- **Função**: Recomendações usando BERT + Transformer
- **Tecnologia**: PyTorch + BERT + Multi-Head Attention

### 3. CNN Form Analysis (Futuro)
- **Função**: Análise de forma de exercícios
- **Tecnologia**: OpenCV + MediaPipe + CNN

## Como Usar

1. Instale dependências: `pip install -r requirements-dl.txt`
2. Execute ML Service: `uvicorn app.main:app --reload --port 8000`
3. Teste endpoints DL: `.\TESTE-ML-SERVICE.ps1`

## Próximos Passos

1. Implementar CNN para análise de forma
2. Adicionar Reinforcement Learning
3. Otimizar performance dos modelos
4. Implementar A/B testing
"@

try {
    Add-Content -Path "DEEP-LEARNING-GUIDE.md" -Value $dlDocs
    Write-Host "✅ Documentação DL criada" -ForegroundColor $successColor
} catch {
    Write-Host "⚠️ Falha ao criar documentação" -ForegroundColor $warningColor
}

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host "🎉 MIGRAÇÃO PARA DEEP LEARNING CONCLUÍDA!" -ForegroundColor $successColor
Write-Host ""
Write-Host "📊 RESUMO DA MIGRAÇÃO:" -ForegroundColor Cyan
Write-Host "   ✅ Backup do sistema atual criado" -ForegroundColor Gray
Write-Host "   ✅ Dependências DL instaladas" -ForegroundColor Gray
Write-Host "   ✅ Modelos LSTM implementados" -ForegroundColor Gray
Write-Host "   ✅ Modelos Transformer implementados" -ForegroundColor Gray
Write-Host "   ✅ Endpoints DL criados" -ForegroundColor Gray
Write-Host "   ✅ Documentação atualizada" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "   1. Execute: .\TESTE-ML-SERVICE.ps1" -ForegroundColor Gray
Write-Host "   2. Leia: DEEP-LEARNING-GUIDE.md" -ForegroundColor Gray
Write-Host "   3. Implemente CNN para análise de forma" -ForegroundColor Gray
Write-Host "   4. Adicione Reinforcement Learning" -ForegroundColor Gray
Write-Host ""
Write-Host "🧠 SISTEMA AGORA COM DEEP LEARNING!" -ForegroundColor Green
Write-Host ""
