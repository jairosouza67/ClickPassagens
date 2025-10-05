// Configuração da API
// Em produção, aponta para o backend no Render
// Em desenvolvimento, usa URL completa do localhost

// Prioridade:
// 1. VITE_API_BASE_URL do .env
// 2. Fallback para Render em produção
// 3. Localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_BASE_URL 
  || (import.meta.env.PROD 
    ? 'https://clickpassagens.onrender.com'
    : 'http://localhost:5001');

// Remover /api se já estiver na URL base
const cleanedURL = API_URL.replace(/\/api$/, '');

export { cleanedURL as API_URL };
