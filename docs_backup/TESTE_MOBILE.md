# 📱 Teste Mobile - Guia Rápido

## ✅ Correções Aplicadas

1. **Persistência de Sessão**: Configurado `browserLocalPersistence` para manter login em mobile
2. **Detecção Mobile Melhorada**: Detecta user agent + touch + tamanho de tela
3. **Logs de Debug**: Logs detalhados no console para rastrear problemas

## 🧪 Como Testar no Mobile

### Opção 1: Simular Mobile no Desktop (Mais Fácil)

```bash
1. Abra Chrome
2. Pressione F12 (DevTools)
3. Pressione Ctrl+Shift+M (modo mobile)
4. Selecione "iPhone 12 Pro" ou "Galaxy S20"
5. Acesse: http://localhost:5173
6. Clique em "Entrar / Cadastrar"
7. Clique em "Continuar com Google"
```

**O que deve acontecer:**
- ✅ Console mostra: `📱 É Mobile (User Agent)? true`
- ✅ Console mostra: `🔀 Vai usar redirect? true`
- ✅ Console mostra: `🔄 Usando signInWithRedirect...`
- ✅ Página redireciona para Google
- ✅ Você faz login
- ✅ Volta para o app
- ✅ Modal fecha automaticamente
- ✅ Nome aparece no header

### Opção 2: Testar em Mobile Real (Mesma Rede)

```bash
1. No PC, descubra seu IP local:
   ipconfig
   # Procure por "IPv4 Address" (ex: 192.168.1.100)

2. No celular, conecte na mesma rede Wi-Fi

3. No celular, abra Chrome e acesse:
   http://192.168.1.100:5173
   # Use o IP do seu PC

4. Clique em "Entrar / Cadastrar"
5. Clique em "Continuar com Google"
```

**⚠️ IMPORTANTE:** Adicione seu IP local nos domínios autorizados do Firebase!

### Opção 3: Expor via Ngrok (Internet)

```bash
# 1. Instale ngrok: https://ngrok.com/download

# 2. No terminal, rode:
ngrok http 5173

# 3. Copie a URL pública (ex: https://abc123.ngrok.io)

# 4. No Firebase Console:
   - Vá em Authentication > Settings
   - Adicione o domínio ngrok nos domínios autorizados

# 5. No celular, acesse a URL ngrok
```

## 🔍 O Que Verificar no Console

### 1. Quando clicar em "Continuar com Google"

```javascript
✅ Logs esperados:
🔵 Iniciando login com Google...
🔵 User Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0...
📱 É Mobile (User Agent)? true
👆 Tem Touch? true
🔀 Vai usar redirect? true
🔄 Usando signInWithRedirect...
```

### 2. Quando voltar do Google (após login)

```javascript
✅ Logs esperados:
🔄 AuthContext: Verificando redirect result...
🔄 firebase.js: Chamando getRedirectResult...
✅ firebase.js: Usuário do redirect: seu@email.com
✅ firebase.js: handleRedirectResult - Login bem-sucedido!
✅ AuthModal: Login com Google detectado no sessionStorage
✅ AuthModal: Usuário logado, fechando modal
```

### 3. Se der erro

```javascript
❌ Possíveis erros:
❌ auth/popup-blocked - Bloqueador de popup ativo
❌ auth/unauthorized-domain - Domínio não autorizado no Firebase
❌ auth/network-request-failed - Sem internet ou firewall bloqueando
❌ auth/internal-error - Erro no Firebase (verificar configuração)
```

## 🛠️ Solução de Problemas

### Problema: "Popup Bloqueado"
```
Solução: Em mobile, NÃO deve usar popup, deve usar redirect
Verificar: Console deve mostrar "🔄 Usando signInWithRedirect"
```

### Problema: "Unauthorized Domain"
```
Solução:
1. Acesse Firebase Console
2. Authentication > Settings > Authorized domains
3. Adicione:
   - localhost
   - Seu IP local (ex: 192.168.1.100)
   - Domínio ngrok (se estiver usando)
```

### Problema: "Session Não Persiste"
```
Solução:
1. Verifique se o console mostra: ✅ Persistência LOCAL configurada
2. Limpe localStorage: localStorage.clear()
3. Limpe cookies do site
4. Teste novamente
```

### Problema: "Modal Não Fecha"
```
Solução:
1. Verificar se sessionStorage tem 'googleLoginSuccess'
   console.log(sessionStorage.getItem('googleLoginSuccess'))
   
2. Verificar se currentUser está populado:
   console.log(auth.currentUser)
   
3. Forçar fechamento manual:
   sessionStorage.setItem('googleLoginSuccess', 'true')
   # Recarregue a página
```

## 📊 Comandos de Debug no Console

```javascript
// 1. Verificar se está logado
console.log('User:', firebase.auth().currentUser);

// 2. Verificar sessionStorage
console.log('Google Login Success?', sessionStorage.getItem('googleLoginSuccess'));

// 3. Verificar localStorage (onde Firebase salva a sessão)
console.log('Keys:', Object.keys(localStorage));

// 4. Forçar logout
firebase.auth().signOut();

// 5. Limpar tudo e começar do zero
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## ✨ Teste Completo - Checklist

- [ ] Abrir DevTools (F12)
- [ ] Ativar modo mobile (Ctrl+Shift+M)
- [ ] Selecionar dispositivo mobile
- [ ] Acessar http://localhost:5173
- [ ] Verificar console: `✅ Persistência LOCAL configurada`
- [ ] Clicar em "Entrar / Cadastrar"
- [ ] Clicar em "Continuar com Google"
- [ ] Verificar console: `🔄 Usando signInWithRedirect`
- [ ] Fazer login no Google
- [ ] Verificar console: `✅ handleRedirectResult - Login bem-sucedido!`
- [ ] Verificar modal fecha automaticamente
- [ ] Verificar nome aparece no header
- [ ] **RECARREGAR A PÁGINA** (F5)
- [ ] Verificar que continua logado (nome no header)
- [ ] ✅ SUCESSO!

## 🎯 Resultado Esperado

### Desktop
- Usa **popup** (signInWithPopup)
- Modal permanece aberto
- Login rápido (1-2 segundos)

### Mobile
- Usa **redirect** (signInWithRedirect)
- Página redireciona para Google
- Volta para o app após login
- Modal detecta sucesso via sessionStorage
- Modal fecha automaticamente
- **Sessão persiste após recarregar**

## 🚨 Se NADA Funcionar

Me envie estes dados:

1. **Screenshot do console** (todos os logs)
2. **User Agent**:
   ```javascript
   navigator.userAgent
   ```
3. **Detecção mobile**:
   ```javascript
   console.log({
     isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
     isTouch: 'ontouchstart' in window,
     innerWidth: window.innerWidth
   })
   ```
4. **Estado do Firebase**:
   ```javascript
   console.log({
     currentUser: firebase.auth().currentUser,
     sessionStorage: sessionStorage.getItem('googleLoginSuccess'),
     localStorage: Object.keys(localStorage).filter(k => k.includes('firebase'))
   })
   ```
