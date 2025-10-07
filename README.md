# ✈️ ClickPassagens

Sistema completo de busca e comparação de passagens aéreas com integração de APIs reais e sistema de milhas.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Solução de Problemas](#solução-de-problemas)
- [Funcionalidades](#funcionalidades)

---

## 🎯 Sobre o Projeto

ClickPassagens é uma plataforma web para busca, comparação e emissão de passagens aéreas com foco em otimização de milhas. O sistema integra APIs reais de voos (Amadeus) e oferece funcionalidades de cálculo de milhas, comparação de preços e geração de orçamentos.

### Características Principais

- 🔐 **Autenticação completa** (Email/Senha + Google OAuth)
- ✈️ **Busca de voos reais** via API Amadeus
- 💰 **Cálculo automático de milhas** e comparação de preços
- 📊 **Sistema de orçamentos** com geração de PDF/Word
- 📱 **PWA** (Progressive Web App) - instalável em dispositivos móveis
- 🎨 **Interface responsiva** e moderna

---

## 🚀 Tecnologias

### Frontend
- **React** 18.2.0 + Vite
- **TailwindCSS** para estilização
- **Firebase** Authentication
- **Lucide React** para ícones
- **ShadcN/UI** componentes

### Backend
- **Python** 3.11+
- **Flask** framework web
- **SQLAlchemy** ORM
- **Gunicorn** servidor WSGI
- **SQLite** banco de dados

### APIs Externas
- **Amadeus API** - Busca de voos reais (2.000 chamadas/mês grátis)
- **Firebase Authentication** - Sistema de login

### Deploy
- **Frontend**: Netlify
- **Backend**: Render.com
- **Domínio**: clickpassagens.me

---

## 🏗️ Arquitetura

```
ClickPassagens/
├── src/                    # Código React (Frontend)
│   ├── components/         # Componentes React
│   ├── contexts/          # Context API (Auth, etc)
│   ├── hooks/             # Custom hooks
│   ├── services/          # APIs e serviços (Python Backend)
│   └── routes/            # Rotas do Flask
├── public/                # Assets públicos
├── database/              # Banco SQLite
├── .env                   # Variáveis de ambiente (LOCAL)
└── dist/                  # Build de produção
```

### Fluxo de Dados

1. **Usuário** → Frontend (React/Netlify)
2. **Frontend** → Backend API (Flask/Render)
3. **Backend** → API Amadeus (Busca voos)
4. **Backend** → SQLite (Salva buscas/orçamentos)
5. **Dados** → Frontend (Exibição)

---

## ⚙️ Configuração

### 1️⃣ Variáveis de Ambiente

#### Frontend (.env)
```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx

# Backend API
VITE_API_BASE_URL=https://clickpassagens-api.onrender.com
VITE_APP_MODE=production
```

#### Backend (Render Environment Variables)
```env
# Amadeus API (https://developers.amadeus.com)
AMADEUS_API_KEY=sua_api_key
AMADEUS_API_SECRET=seu_api_secret
AMADEUS_BASE_URL=https://test.api.amadeus.com

# Configuração
FLIGHT_API_MODE=production
FLASK_ENV=production
SECRET_KEY=chave_secreta_aleatoria
```

### 2️⃣ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/jairosouza67/ClickPassagens.git
cd ClickPassagens

# Frontend
npm install

# Backend (Python)
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Inicializar banco de dados
python init_db.py
```

### 3️⃣ Executar Localmente

```bash
# Frontend (porta 5173)
npm run dev

# Backend (porta 5000)
python main.py
```

---

## 🌐 Deploy

### Netlify (Frontend)

1. **Conectar repositório GitHub**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables:** Adicionar todas `VITE_*` do `.env`
4. **Importante:** Adicionar `SECRETS_SCAN_ENABLED=false`

### Render (Backend)

1. **Criar Web Service**
2. **Build command:** `pip install -r requirements.txt`
3. **Start command:** `bash start.sh`
4. **Environment Variables:** Adicionar variáveis do backend
5. **Importante:** Fazer redeploy após adicionar variáveis

---

## 🔧 Solução de Problemas

### 🚨 Login não funciona em produção

**Problema:** Tela pisca ao clicar em "Login com Google"

**Solução:**
1. Verificar Firebase Console → Authentication → Authorized domains
2. Adicionar domínio: `clickpassagens.me` e `www.clickpassagens.me`
3. Verificar se variáveis `VITE_FIREBASE_*` estão no Netlify
4. Limpar cache do navegador (Ctrl + Shift + Delete)

### 🚨 Busca retorna 0 resultados

**Problema:** API retorna `success: true` mas `resultados: []`

**Causas possíveis:**

1. **Credenciais Amadeus não configuradas**
   - Verificar se `AMADEUS_API_KEY` e `AMADEUS_API_SECRET` estão no Render
   - Testar credenciais em https://developers.amadeus.com

2. **Limite de API excedido**
   - Plano gratuito: 2.000 chamadas/mês
   - Solução temporária: `FLIGHT_API_MODE=simulated`

3. **Render não fez redeploy**
   - Após adicionar variáveis, forçar redeploy manual
   - Render → Manual Deploy → Deploy latest commit

**Como debugar:**
```bash
# Testar API diretamente
curl -X POST https://clickpassagens-api.onrender.com/api/busca/buscar \
  -H "Content-Type: application/json" \
  -d '{"origem":"GRU","destino":"GIG","data_ida":"2025-12-01","passageiros":1}'
```

### 🚨 Netlify bloqueia deploy (Secrets detected)

**Problema:** `Secrets scanning found secrets in build`

**Solução:**
1. Netlify → Site settings → Environment variables
2. Adicionar: `SECRETS_SCAN_ENABLED = false`
3. **Explicação:** Credenciais Firebase do frontend são públicas por design (segurança vem das Firebase Rules)

### 🚨 CORS Error

**Problema:** `Access-Control-Allow-Origin` error

**Solução:**
1. Verificar `netlify.toml` → proxy configurado corretamente
2. Backend deve permitir origem `clickpassagens.me`
3. Verificar se `VITE_API_BASE_URL` aponta para Render correto

### 🚨 Build falha no Netlify

**Problema:** `Build script returned non-zero exit code`

**Causas comuns:**
1. Variáveis de ambiente faltando
2. Importações incorretas
3. Dependências desatualizadas

**Solução:**
```bash
# Testar build localmente
npm run build

# Ver logs detalhados no Netlify
Netlify → Deploys → Ver log completo
```

---

## 🎯 Funcionalidades

### 1. Sistema de Autenticação

- ✅ Login com Email/Senha
- ✅ Login com Google (popup desktop, redirect mobile)
- ✅ Recuperação de senha
- ✅ Persistência de sessão
- ✅ Firestore para dados do usuário

### 2. Busca de Voos

- ✅ Integração com API Amadeus (voos reais)
- ✅ Busca inteligente com datas alternativas (±3 dias)
- ✅ Filtros: companhia, preço, horário, escalas
- ✅ Ordenação: menor preço, menor duração, menos escalas
- ✅ Fallback para dados simulados (modo desenvolvimento)

### 3. Sistema de Milhas

- ✅ Cálculo automático de milhas necessárias
- ✅ Comparação: comprar milhas vs pagar em dinheiro
- ✅ Tabela de valores de milheiro por companhia
- ✅ Comissões configuráveis

### 4. Orçamentos

- ✅ Geração de orçamentos personalizados
- ✅ Export PDF com branding
- ✅ Export Word (DOCX)
- ✅ Histórico de orçamentos
- ✅ Compartilhamento

### 5. PWA (Progressive Web App)

- ✅ Instalável em iOS/Android
- ✅ Funciona offline (cache de assets)
- ✅ Ícones e splash screens
- ✅ Manifest configurado

---

## 📊 Monitoramento

### Logs Importantes

**Render (Backend):**
- `ERROR in flight_api: Credenciais Amadeus não configuradas` → Adicionar vars ambiente
- `Token Amadeus obtido com sucesso` → API funcionando
- `20 voos encontrados` → Tudo OK!

**Netlify (Frontend):**
- `Secrets scanning found secrets` → Adicionar `SECRETS_SCAN_ENABLED=false`
- `Build succeeded` → Deploy OK
- `auth/api-key-not-valid` → Verificar Firebase credentials

### Testes Rápidos

```bash
# Testar backend
curl https://clickpassagens-api.onrender.com/api/health

# Testar busca
curl -X POST https://clickpassagens-api.onrender.com/api/busca/buscar \
  -H "Content-Type: application/json" \
  -d '{"origem":"GRU","destino":"GIG","data_ida":"2025-12-01","passageiros":1}'
```

---

## 🔐 Segurança

- ✅ Credenciais em variáveis de ambiente (nunca no código)
- ✅ Firebase Security Rules configuradas
- ✅ HTTPS obrigatório em produção
- ✅ Secrets scan configurado
- ✅ CORS configurado corretamente

---

## 📞 Suporte

**Problemas comuns já documentados acima. Para novos problemas:**

1. Verificar logs do Render e Netlify
2. Testar APIs diretamente
3. Verificar variáveis de ambiente
4. Limpar cache do navegador
5. Forçar novo deploy

---

## 📝 Licença

Projeto proprietário - ClickPassagens © 2025

---

## 🔗 Links Úteis

- **Site:** https://clickpassagens.me
- **API Backend:** https://clickpassagens-api.onrender.com
- **Firebase Console:** https://console.firebase.google.com
- **Amadeus API:** https://developers.amadeus.com
- **Netlify Dashboard:** https://app.netlify.com
- **Render Dashboard:** https://dashboard.render.com

---

**Última atualização:** Outubro 2025
