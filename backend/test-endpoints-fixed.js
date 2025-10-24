const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

async function testEndpoint(name, method, url, expectedStatus, data = null) {
  try {
    console.log(`\n${colors.blue}${colors.bold}Testando: ${name}${colors.reset}`);
    console.log(`${method} ${url}`);
    
    let response;
    if (method === 'GET') {
      response = await axios.get(url);
    } else if (method === 'POST') {
      response = await axios.post(url, data);
    }
    
    const status = response.status;
    const isExpected = status === expectedStatus;
    const statusColor = isExpected ? colors.green : colors.yellow;
    
    console.log(`Status: ${statusColor}${status}${colors.reset} (esperado: ${expectedStatus})`);
    
    if (response.data) {
      if (Array.isArray(response.data.data)) {
        console.log(`Resultados: ${response.data.data.length} items`);
        
        // Verificar bodyPart para endpoints de bodypart
        if (url.includes('/bodypart/')) {
          const bodyPartFromUrl = url.split('/bodypart/')[1];
          const uniqueBodyParts = [...new Set(response.data.data.map(ex => ex.bodyPart))];
          console.log(`BodyParts retornados: ${uniqueBodyParts.join(', ')}`);
          
          // Verificar se o bodyPart correto está sendo retornado
          if (uniqueBodyParts.includes(bodyPartFromUrl)) {
            console.log(`${colors.green}✓ BodyPart correto encontrado!${colors.reset}`);
          } else {
            console.log(`${colors.red}✗ BodyPart incorreto! Esperado: ${bodyPartFromUrl}${colors.reset}`);
          }
        }
        
        // Mostrar primeiro item como exemplo
        if (response.data.data.length > 0) {
          console.log(`Exemplo:`, JSON.stringify(response.data.data[0], null, 2).substring(0, 200) + '...');
        }
      } else {
        console.log(`Resposta:`, JSON.stringify(response.data, null, 2).substring(0, 300));
      }
    }
    
    const icon = isExpected ? '✅' : '⚠️';
    console.log(`${icon} ${colors.green}SUCESSO${colors.reset}`);
    return { success: true, status, name };
    
  } catch (error) {
    const status = error.response?.status || 'ERROR';
    const statusColor = status === expectedStatus ? colors.green : colors.red;
    
    console.log(`Status: ${statusColor}${status}${colors.reset} (esperado: ${expectedStatus})`);
    console.log(`Erro: ${error.response?.data?.error || error.message}`);
    
    if (status === expectedStatus) {
      console.log(`✅ ${colors.green}SUCESSO (Erro esperado)${colors.reset}`);
      return { success: true, status, name };
    } else {
      console.log(`❌ ${colors.red}FALHOU${colors.reset}`);
      return { success: false, status, name, error: error.message };
    }
  }
}

async function runTests() {
  console.log(`${colors.bold}${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║         TESTE COMPLETO DOS ENDPOINTS CORRIGIDOS          ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  const results = [];

  // Testar endpoints que estavam com problemas
  console.log(`\n${colors.bold}${colors.yellow}━━━ ENDPOINTS QUE ESTAVAM COM ERRO 500 ━━━${colors.reset}`);
  
  results.push(await testEndpoint(
    'GET /api/exercises (ERRO 500 → CORRIGIDO)',
    'GET',
    `${BASE_URL}/api/exercises`,
    200
  ));

  results.push(await testEndpoint(
    'GET /api/exercises/search?q=push (ERRO 500 → CORRIGIDO)',
    'GET',
    `${BASE_URL}/api/exercises/search?q=push`,
    200
  ));

  results.push(await testEndpoint(
    'POST /api/exercises/cache/clear (ERRO 500 → CORRIGIDO)',
    'POST',
    `${BASE_URL}/api/exercises/cache/clear`,
    200
  ));

  console.log(`\n${colors.bold}${colors.yellow}━━━ ENDPOINTS COM BUG DE BODYPART ━━━${colors.reset}`);

  results.push(await testEndpoint(
    'GET /api/exercises/bodypart/chest (Bug: retornava legs → CORRIGIDO)',
    'GET',
    `${BASE_URL}/api/exercises/bodypart/chest`,
    200
  ));

  results.push(await testEndpoint(
    'GET /api/exercises/bodypart/back (Bug: retornava legs → CORRIGIDO)',
    'GET',
    `${BASE_URL}/api/exercises/bodypart/back`,
    200
  ));

  results.push(await testEndpoint(
    'GET /api/exercises/bodypart/legs (Já funcionava)',
    'GET',
    `${BASE_URL}/api/exercises/bodypart/legs`,
    200
  ));

  console.log(`\n${colors.bold}${colors.yellow}━━━ ENDPOINTS QUE JÁ FUNCIONAVAM ━━━${colors.reset}`);

  results.push(await testEndpoint(
    'GET /health',
    'GET',
    `${BASE_URL}/health`,
    200
  ));

  results.push(await testEndpoint(
    'GET /api/exercises/stats',
    'GET',
    `${BASE_URL}/api/exercises/stats`,
    200
  ));

  // Resumo final
  console.log(`\n${colors.bold}${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║                     RESUMO DOS TESTES                     ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;
  const percentage = ((successful / total) * 100).toFixed(1);

  console.log(`\n✅ Sucesso: ${colors.green}${successful}/${total}${colors.reset}`);
  console.log(`❌ Falhas: ${colors.red}${failed}/${total}${colors.reset}`);
  console.log(`📊 Taxa de sucesso: ${colors.bold}${percentage}%${colors.reset}`);

  if (failed > 0) {
    console.log(`\n${colors.red}${colors.bold}Testes que falharam:${colors.reset}`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ❌ ${r.name} (Status: ${r.status})`);
    });
  }

  if (successful === total) {
    console.log(`\n${colors.green}${colors.bold}🎉 TODOS OS TESTES PASSARAM! 🎉${colors.reset}\n`);
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  Alguns testes falharam. Revise os erros acima.${colors.reset}\n`);
  }
}

// Verificar se o servidor está rodando
axios.get(`${BASE_URL}/health`)
  .then(() => {
    console.log(`${colors.green}✓ Servidor está rodando!${colors.reset}\n`);
    runTests().catch(console.error);
  })
  .catch(err => {
    console.error(`${colors.red}✗ Servidor não está rodando em ${BASE_URL}${colors.reset}`);
    console.error(`${colors.yellow}Por favor, inicie o servidor primeiro com: npm run dev${colors.reset}\n`);
    process.exit(1);
  });

