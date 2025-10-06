# 🔍 Debug Google Login - Guia Prático

## 🎯 ABORDAGEM NOVA - SIMPLIFICADA

Removi toda a complexidade de mobile/redirect e vou usar **APENAS POPUP** para todos os dispositivos.

### O que mudou:

1. **Removido**: Detecção de mobile/tablet
2. **Removido**: signInWithRedirect
3. **Removido**: sessionStorage flags
4. **Removido**: handleRedirectResult
5. **Mantido**: APENAS signInWithPopup (mais simples)

---

## 🧪 TESTE PASSO A PASSO

### 1. Abra o Console do Navegador
```
F12 > Console
```

### 2. Limpe o Cache
```
Ctrl+Shift+Delete > Limpar tudo
```

### 3. Recarregue a Página
```
Ctrl+F5 (hard reload)
```

### 4. Clique em "Continuar com Google"

### 5. Observe os Logs

**Logs Esperados (SUCESSO):**
```
🔵 [loginWithGoogle] Iniciando login com Google...
🔵 [loginWithGoogle] Auth object: {...}
🔵 [loginWithGoogle] Google Provider: {...}
🪟 [loginWithGoogle] Usando signInWithPopup...
✅ [loginWithGoogle] Popup concluído!
✅ [loginWithGoogle] User: {...}
📄 [loginWithGoogle] Verificando documento do usuário...
📝 [loginWithGoogle] Criando novo documento... (ou "Documento já existe")
✅ [loginWithGoogle] Documento criado!
✅ [loginWithGoogle] Login bem-sucedido!
🔵 [AuthContext.googleLogin] Resultado: {success: true, user: {...}}
✅ [AuthContext.googleLogin] Sucesso!
✅ [AuthModal.handleGoogleLogin] Sucesso!
```

**Logs de ERRO (se falhar):**
```
❌ [loginWithGoogle] ERRO CAPTURADO:
❌ [loginWithGoogle] Tipo: FirebaseError
❌ [loginWithGoogle] Código: auth/XXXXX
❌ [loginWithGoogle] Mensagem: XXXXX
❌ [loginWithGoogle] Stack: ...
```

---

## ❌ POSSÍVEIS ERROS

### Erro 1: Popup Bloqueado
```
Código: auth/popup-blocked
Solução: Permitir popups nas configurações do navegador
```

### Erro 2: Domínio Não Autorizado
```
Código: auth/unauthorized-domain
Solução:
1. Acesse Firebase Console
2. Authentication > Settings > Authorized domains
3. Adicione: localhost e 127.0.0.1
```

### Erro 3: Popup Fechado
```
Código: auth/popup-closed-by-user
Solução: Usuário fechou a janela, tente novamente
```

### Erro 4: Configuração Firebase Inválida
```
Mensagem: Firebase configuration is missing
Solução: Verificar .env tem todas as variáveis VITE_FIREBASE_*
```

---

## 🔧 VERIFICAÇÕES

### 1. Verificar Credenciais Firebase
```javascript
// Cole no console:
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
```

**Deve mostrar** valores reais, NÃO "undefined"

### 2. Verificar Auth Object
```javascript
// Cole no console:
console.log('Auth:', firebase.auth());
console.log('Current User:', firebase.auth().currentUser);
```

**Deve mostrar** objeto Auth válido

### 3. Verificar Popups
```javascript
// Cole no console:
window.open('about:blank', '_blank', 'width=500,height=600');
```

**Deve abrir** uma nova janela popup

Se NÃO abrir: popups estão bloqueados!

---

## 🛠️ CORREÇÕES RÁPIDAS

### Se popup está bloqueado:

**Chrome:**
```
1. Ícone de cadeado (ou "i") na barra de endereços
2. Configurações do site
3. Pop-ups e redirecionamentos > Permitir
```

**Firefox:**
```
1. Ícone de escudo na barra de endereços
2. Desativar bloqueio de pop-ups
```

**Edge:**
```
1. Configurações (...)
2. Configurações do site
3. Pop-ups e redirecionamentos > Permitir
```

### Se domínio não autorizado:

```
1. Firebase Console: https://console.firebase.google.com/
2. Selecione projeto
3. Authentication > Settings
4. Role até "Authorized domains"
5. Clique "+ Add domain"
6. Adicione: localhost
7. Adicione: 127.0.0.1
8. Salve
```

---

## 📝 CHECKLIST DE DEBUG

- [ ] Console aberto (F12)
- [ ] Cache limpo (Ctrl+Shift+Delete)
- [ ] Página recarregada (Ctrl+F5)
- [ ] Popups permitidos no navegador
- [ ] Domínio autorizado no Firebase
- [ ] .env tem todas variáveis VITE_FIREBASE_*
- [ ] Build atualizado (npm run build)
- [ ] Backend rodando (porta 5001)

---

## 🎯 SE AINDA NÃO FUNCIONAR

Copie e cole no console, depois envie o resultado:

```javascript
console.log('=== DEBUG INFO ===');
console.log('1. Firebase Config:');
console.log('   API Key:', import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...');
console.log('   Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('   Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

console.log('2. Auth Status:');
try {
  console.log('   Auth object exists:', !!firebase.auth());
  console.log('   Current user:', firebase.auth().currentUser);
} catch(e) {
  console.log('   Error:', e.message);
}

console.log('3. Popup Test:');
try {
  const testPopup = window.open('', '_blank', 'width=1,height=1');
  if (testPopup) {
    console.log('   Popups: ALLOWED ✅');
    testPopup.close();
  } else {
    console.log('   Popups: BLOCKED ❌');
  }
} catch(e) {
  console.log('   Popups: BLOCKED ❌');
}

console.log('4. Network:');
console.log('   Online:', navigator.onLine);

console.log('5. Browser:');
console.log('   User Agent:', navigator.userAgent);
```

---

**⏰ Próxima ação:**
1. Rebuild frontend: `npm run build`
2. Copiar para static: `Copy-Item -Recurse -Force dist/* static/`
3. Testar no navegador
4. Observar logs no console
