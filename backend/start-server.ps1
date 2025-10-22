# Script para iniciar o servidor com variáveis de ambiente
$env:DATABASE_URL="file:./dev.db"
$env:JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
$env:PORT="3001"

Write-Host "Starting server with environment variables..."
Write-Host "DATABASE_URL: $env:DATABASE_URL"
Write-Host "JWT_SECRET: $env:JWT_SECRET"
Write-Host "PORT: $env:PORT"

npx ts-node src/server.ts


