# 🚨 CONFIGURAÇÃO URGENTE - ClickPassagens

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **Chave Amadeus Revogada**
A Amadeus revogou sua chave antiga porque ela estava exposta no GitHub:
- **Chave revogada**: `cppo2FiXfoOVQ7jyggpCKl0fG8NYH1Pu`
- **Motivo**: Exposição pública no repositório GitHub
- **Ação necessária**: Gerar nova chave e configurar corretamente

### 2. **Firebase Não Configurado**
O sistema de login não funciona porque o Firebase não está configurado:
- **Status**: Credenciais ausentes no arquivo `.env`
- **Impacto**: Login e cadastro não funcionam
- **Ação necessária**: Configurar credenciais do Firebase

### 3. **Sistema de Busca Inoperante**
Devido à revogação da chave Amadeus, as buscas não funcionam:
- **Causa**: API Amadeus rejeitando requisições
- **Impacto**: Nenhuma busca de passagens funciona
- **Ação necessária**: Configurar nova chave

---

## ✅ SOLUÇÃO COMPLETA

### PASSO 1: Configurar Nova Chave Amadeus (OBRIGATÓRIO)

#### 1.1 Acessar Portal Amadeus
1. Acesse: https://developers.amadeus.com/
2. Faça login com suas credenciais
3. Vá em **"My Self-Service Workspace"**
4. Clique no seu aplicativo

#### 1.2 Gerar Nova Chave
1. Clique em **"Renew API Key"** ou **"Create New App"**
2. Copie as novas credenciais:
   - **API Key** (começa com letras/números aleatórios)
   - **API Secret** (senha secreta)

#### 1.3 Configurar no .env
Edite o arquivo `.env` na raiz do projeto:

```env
# Substitua pelas suas NOVAS credenciais
AMADEUS_API_KEY=SUA_NOVA_API_KEY_AQUI
AMADEUS_API_SECRET=SEU_NOVO_API_SECRET_AQUI
```

**⚠️ IMPORTANTE**: 
- Nunca commite o arquivo `.env` no Git
- Ele já está no `.gitignore`
- Guarde suas credenciais em local seguro

---

### PASSO 2: Configurar Firebase (OBRIGATÓRIO para Login)

#### 2.1 Criar/Acessar Projeto Firebase
1. Acesse: https://console.firebase.google.com/
2. Crie um novo projeto ou use existente:
   - Nome sugerido: `clickpassagens`
   - Ative Google Analytics (opcional)

#### 2.2 Adicionar Aplicativo Web
1. No console do Firebase, clique em **"Adicionar app"**
2. Selecione **"Web"** (ícone </> )
3. Dê um nome: `ClickPassagens Web`
4. **NÃO** marque "Firebase Hosting"
5. Clique em **"Registrar app"**

#### 2.3 Copiar Credenciais
Você verá um código JavaScript com as credenciais. Copie os valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← Copie isso
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

#### 2.4 Configurar no .env
Edite o arquivo `.env` e adicione:

```env
# Firebase - Substitua pelos seus valores
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### 2.5 Ativar Autenticação
No console Firebase:
1. Vá em **"Authentication"** (Autenticação)
2. Clique em **"Get Started"**
3. Na aba **"Sign-in method"**:
   - Ative **"Email/Password"**
   - Ative **"Google"**

#### 2.6 Configurar Firestore
1. Vá em **"Firestore Database"**
2. Clique em **"Create database"**
3. Escolha **"Start in test mode"** (para desenvolvimento)
4. Selecione a região mais próxima (ex: `southamerica-east1`)

#### 2.7 Adicionar Domínios Autorizados
1. Em **"Authentication"** → **"Settings"** → **"Authorized domains"**
2. Adicione:
   - `localhost` (já deve estar)
   - Seu domínio de produção (se tiver)

---

### PASSO 3: Testar Configuração

#### 3.1 Reiniciar Servidor
```powershell
# Pare os servidores rodando (Ctrl+C)

# Inicie novamente
npm run dev
```

E em outro terminal:
```powershell
python main.py
```

#### 3.2 Testar Login
1. Abra: http://localhost:5173
2. Clique em **"Entrar"**
3. Tente:
   - ✅ Criar nova conta com email
   - ✅ Login com Google
   - ✅ Login com email/senha

#### 3.3 Testar Busca
1. Após fazer login
2. Preencha o formulário de busca:
   - **Origem**: GRU (São Paulo)
   - **Destino**: GIG (Rio de Janeiro)
   - **Data**: Amanhã ou depois
   - **Passageiros**: 1 adulto
3. Clique em **"Buscar"**
4. Verifique se retorna resultados

---

## 🔍 VERIFICAÇÃO DE ERROS

### Abrir Console do Navegador
1. Pressione **F12** no navegador
2. Vá na aba **"Console"**
3. Procure por erros em vermelho

### Erros Comuns e Soluções

#### ❌ "Firebase não configurado"
**Solução**: Configure as variáveis `VITE_FIREBASE_*` no `.env`

#### ❌ "Credenciais Amadeus não configuradas"
**Solução**: Configure `AMADEUS_API_KEY` e `AMADEUS_API_SECRET` no `.env`

#### ❌ "auth/unauthorized-domain"
**Solução**: Adicione o domínio em Firebase → Authentication → Authorized domains

#### ❌ "Invalid API key"
**Solução**: Verifique se copiou a chave corretamente, sem espaços extras

#### ❌ "Failed to fetch"
**Solução**: Verifique se o backend Python está rodando na porta 5001

---

## 📋 CHECKLIST FINAL

Marque quando concluir cada item:

### Amadeus API
- [ ] Acessei https://developers.amadeus.com/
- [ ] Gerei nova API Key e Secret
- [ ] Configurei no arquivo `.env`
- [ ] Testei busca de passagens

### Firebase
- [ ] Criei/acessei projeto em https://console.firebase.google.com/
- [ ] Registrei aplicativo Web
- [ ] Copiei todas as 6 credenciais
- [ ] Configurei no arquivo `.env`
- [ ] Ativei Email/Password em Authentication
- [ ] Ativei Google em Authentication
- [ ] Criei Firestore Database
- [ ] Testei login com email
- [ ] Testei login com Google

### Segurança
- [ ] Arquivo `.env` NÃO está commitado no Git
- [ ] `.gitignore` inclui `.env`
- [ ] Removi chaves antigas da documentação
- [ ] Guardei credenciais em local seguro

### Testes
- [ ] Backend rodando sem erros
- [ ] Frontend rodando sem erros
- [ ] Login funcionando
- [ ] Busca retornando resultados
- [ ] Nenhum erro no console do navegador

---

## 🆘 SUPORTE

### Se ainda houver problemas:

1. **Verifique os logs**:
   - Terminal do backend (Python)
   - Terminal do frontend (Vite)
   - Console do navegador (F12)

2. **Arquivos de referência**:
   - `.env.example` - Exemplo de configuração
   - `GUIA_AMADEUS_API.md` - Guia detalhado da API Amadeus
   - `FIREBASE_SETUP.md` - Setup completo do Firebase

3. **Teste individual**:
   ```powershell
   # Testar Amadeus
   python test_amadeus_real.py
   ```

---

## ⚡ SOLUÇÃO RÁPIDA (5 MINUTOS)

### Para quem tem pressa:

```powershell
# 1. Gere nova chave Amadeus em: https://developers.amadeus.com/

# 2. Configure projeto Firebase em: https://console.firebase.google.com/

# 3. Edite o arquivo .env com TODAS as credenciais:
notepad .env

# 4. Reinicie os servidores:
# Terminal 1:
npm run dev

# Terminal 2 (novo):
python main.py

# 5. Teste: http://localhost:5173
```

---

## 🎯 PRÓXIMOS PASSOS

Após configurar tudo:

1. **Teste completo do sistema**
2. **Configure variáveis no Render** (para produção)
3. **Configure variáveis no Netlify** (para produção)
4. **Faça backup das credenciais** (em local seguro, NÃO no Git)
5. **Documente seu ambiente** (para referência futura)

---

**✅ Configuração concluída = Sistema 100% funcional!**
