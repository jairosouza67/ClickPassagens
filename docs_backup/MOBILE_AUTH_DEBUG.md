# 🔍 Debug - Autenticação Mobile

## Como Debugar o Problema Mobile

### 1️⃣ Abrir Console no Mobile (via Chrome DevTools)

```bash
# No PC:
1. Abra Chrome
2. Vá para chrome://inspect
3. No celular, ative "Depuração USB" nas opções de desenvolvedor
4. Conecte o celular via USB
5. No Chrome do PC, clique em "Inspect" no dispositivo
```

### 2️⃣ Simular Mobile no Desktop

```bash
1. Abra http://localhost:5173
2. Pressione F12 (DevTools)
3. Pressione Ctrl+Shift+M (modo mobile)
4. Selecione um dispositivo (ex: iPhone 12 Pro)
5. Recarregue a página
```

### 3️⃣ Verificar Logs no Console

Procure por esses logs quando clicar em "Continuar com Google":

```
✅ Logs esperados (sucesso):
🔵 Iniciando login com Google...
📱 É Mobile (User Agent)? true
👆 Tem Touch? true
🔀 Vai usar redirect? true
🔄 Usando signInWithRedirect...
✅ firebase.js: handleRedirectResult - Login bem-sucedido!
✅ AuthModal: Login com Google detectado no sessionStorage
```

```
❌ Se aparecer isso (erro):
❌ Erro no login com Google: popup-blocked
❌ Erro no login com Google: unauthorized-domain
❌ Erro no login com Google: network-request-failed
```

### 4️⃣ Verificar Configuração Firebase

No [Firebase Console](https://console.firebase.google.com):

1. Acesse seu projeto
2. Vá em **Authentication** > **Sign-in method**
3. Clique em **Google** (deve estar ✅ Ativado)
4. Role até **Domínios autorizados**
5. Verifique se tem:
   - `localhost`
   - `clickpassagens.com.br` (se tiver domínio)
   - Qualquer outro domínio que você use

### 5️⃣ Testar Passo a Passo

1. **No mobile (ou simulador):**
   ```
   - Abra http://localhost:5173
   - Abra o console (F12 > Console)
   - Clique em "Entrar / Cadastrar"
   - Clique em "Continuar com Google"
   ```

2. **O que DEVE acontecer:**
   ```
   - Redireciona para página do Google
   - Você faz login
   - Volta para http://localhost:5173
   - Modal fecha automaticamente
   - Nome aparece no header
   ```

3. **Se NÃO funcionar, verificar:**
   ```
   - sessionStorage tem 'googleLoginSuccess'?
   - currentUser está null ou preenchido?
   - handleRedirectResult() foi chamado?
   - getRedirectResult() retornou algo?
   ```

### 6️⃣ Comandos para Debug

```javascript
// Cole no console do navegador:

// Verificar se tem usuário logado
console.log('User:', firebase.auth().currentUser);

// Verificar sessionStorage
console.log('Session:', sessionStorage.getItem('googleLoginSuccess'));

// Forçar logout
firebase.auth().signOut();

// Verificar token
firebase.auth().currentUser?.getIdToken().then(token => console.log('Token:', token));
```

### 7️⃣ Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Popup bloqueado | Bloqueador de popup ativo | Permitir popups no site |
| Redirect não volta | Domínio não autorizado | Adicionar domínio no Firebase |
| Session não persiste | localStorage bloqueado | Verificar configurações de privacidade |
| Modal não fecha | JavaScript desabilitado | Verificar console por erros |

### 8️⃣ Forçar Modo Mobile (para testar)

Adicione isso temporariamente no `firebase.js` linha 117:

```javascript
// TEMPORÁRIO - FORÇAR REDIRECT (remover depois)
const useRedirect = true; // Sempre usar redirect
```

### 9️⃣ Verificar Network

No DevTools > Network:
- Procure por chamadas para `google.com`
- Procure por chamadas para `firebaseapp.com`
- Verifique se há erros 403, 401, CORS

### 🔟 Últimas Verificações

```bash
# 1. Verificar se .env está correto
cat .env

# 2. Reconstruir frontend
npm run build

# 3. Copiar para static
Copy-Item -Recurse -Force dist/* static/

# 4. Reiniciar servidor
# Ctrl+C no terminal do backend
python main.py
```

## 📱 Teste Rápido

1. Abra no mobile: http://localhost:5173
2. Clique em Login
3. Cole no console:
```javascript
navigator.userAgent
```
4. Deve mostrar algo como: "Mozilla/5.0 (iPhone..."
5. Clique em "Continuar com Google"
6. Veja os logs no console

## 🆘 Se Nada Funcionar

Me envie:
1. Screenshot do console (F12)
2. User Agent do navegador
3. Mensagem de erro exata
4. Está testando em mobile real ou simulador?
