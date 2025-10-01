// Configuração da API
// Em produção, aponta para o backend no Render
// Em desenvolvimento, usa localhost

const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'
  : 'http://localhost:5001';

export { API_URL };
