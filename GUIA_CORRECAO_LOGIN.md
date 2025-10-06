# 🔥 GUIA DE CORREÇÃO - PROBLEMAS DE LOGIN

## ✅ PROBLEMA CORRIGIDO:
O arquivo `.env` tinha um APP_ID incorreto. Já foi corrigido para:
```
VITE_FIREBASE_APP_ID=1:334285502963:web:31fe2e939e4bf56aac3a86
```

---

## 🔍 PRÓXIMOS PASSOS PARA TESTAR:

### 1️⃣ Reiniciar o Servidor
```powershell
# Pare o servidor atual (Ctrl+C) e execute:
npm run dev
```

### 2️⃣ Abrir a Página de Teste
Acesse no navegador:
- **Página de teste:** `http://localhost:5173/test_firebase_config.html`
- **Aplicação principal:** `http://localhost:5173`

### 3️⃣ Verificar o Console do Navegador
Pressione `F12` para abrir o DevTools e verifique:
- ✅ Se há erros relacionados ao Firebase
- ✅ Se aparece "Firebase inicializado com sucesso!"
- ❌ Se há erros como "unauthorized-domain" ou "invalid-api-key"

---

## 🔧 SE AINDA NÃO FUNCIONAR, VERIFIQUE NO FIREBASE CONSOLE:

### Passo 1: Acesse o Firebase Console
🔗 https://console.firebase.google.com/

### Passo 2: Selecione o Projeto
- Projeto: **clickpassagens-dee10**

### Passo 3: Configurações do Projeto
1. Clique na **engrenagem** ⚙️ no canto superior esquerdo
2. Vá em **"Configurações do projeto"**
3. Role até **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. **COPIE AS CREDENCIAIS CORRETAS:**

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "clickpassagens-dee10.firebaseapp.com",
  projectId: "clickpassagens-dee10",
  storageBucket: "clickpassagens-dee10.firebasestorage.app",
  messagingSenderId: "334285502963",
  appId: "1:334285502963:web:..." // ← IMPORTANTE: deve começar com "1:"
};
```

### Passo 4: Authentication > Métodos de Login
1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. **Ative os seguintes provedores:**
   - ✅ **Email/Password** (clique, depois "Ativar" e "Salvar")
   - ✅ **Google** (clique, preencha o email de suporte, depois "Salvar")

### Passo 5: Authentication > Domínios Autorizados
1. Ainda em **Authentication**
2. Clique na aba **"Settings"** (Configurações)
3. Role até **"Authorized domains"** (Domínios autorizados)
4. **Adicione se não estiver:**
   - ✅ `localhost`
   - ✅ Seu domínio de produção (se houver)

### Passo 6: Firestore Database
1. No menu lateral, clique em **"Firestore Database"**
2. Se não estiver criado, clique em **"Criar banco de dados"**
3. Escolha **"Modo de produção"** (ou teste, se preferir)
4. Escolha a localização: **us-central** (ou mais próxima)
5. **Configure as regras de segurança:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🐛 ERROS COMUNS E SOLUÇÕES:

### ❌ "auth/popup-blocked"
**Problema:** Navegador bloqueou o popup do Google
**Solução:** Permita popups para localhost nas configurações do navegador

### ❌ "auth/unauthorized-domain"
**Problema:** localhost não está nos domínios autorizados
**Solução:** Adicione `localhost` em Authentication > Settings > Authorized domains

### ❌ "auth/user-not-found"
**Problema:** Tentando fazer login com email que não existe
**Solução:** Primeiro crie uma conta (Sign Up)

### ❌ "auth/wrong-password"
**Problema:** Senha incorreta
**Solução:** Use a senha correta ou redefina

### ❌ "Firebase não configurado"
**Problema:** Variáveis de ambiente não carregadas
**Solução:** Reinicie o servidor (`npm run dev`)

---

## 📝 TESTANDO LOGIN POR EMAIL:

### 1. Criar uma Conta de Teste
```
Email: teste@clickpassagens.com
Senha: teste123
Nome: Usuário Teste
```

### 2. Fazer Login
- Abra `http://localhost:5173`
- Clique em **"Entrar"** ou **"Login"**
- Digite o email e senha
- Clique em **"Entrar"**

### 3. Verificar no Firebase Console
- Vá em **Authentication** > **Users**
- Você deve ver o usuário criado

---

## 🔵 TESTANDO LOGIN COM GOOGLE:

1. Abra `http://localhost:5173`
2. Clique em **"Entrar com Google"**
3. Se aparecer um popup, escolha sua conta Google
4. Se o popup for bloqueado, permita popups no navegador
5. Após o login, você deve estar autenticado

---

## 📊 VERIFICAR SE ESTÁ LOGADO:

### No Console do Navegador (F12):
```javascript
// Copie e cole no console:
firebase.auth().currentUser
```

Se retornar um objeto com `email`, você está logado! ✅
Se retornar `null`, não está logado ❌

---

## 🚀 COMANDOS ÚTEIS:

```powershell
# Reiniciar tudo do zero
npm run dev

# Verificar configuração
.\diagnosticar_firebase.ps1

# Limpar cache do navegador
# Pressione Ctrl+Shift+Delete e limpe cache/cookies
```

---

## 📞 PRECISA DE MAIS AJUDA?

1. **Abra o arquivo:** `test_firebase_config.html` no navegador
2. **Clique nos botões** de teste
3. **Veja os logs** que aparecem na página
4. **Me envie** as mensagens de erro que aparecerem

---

## ✨ CHECKLIST FINAL:

- [ ] Arquivo `.env` tem o APP_ID correto (começa com "1:")
- [ ] Email/Password ativado no Firebase Console
- [ ] Google ativado no Firebase Console
- [ ] `localhost` nos domínios autorizados
- [ ] Firestore Database criado
- [ ] Servidor rodando (`npm run dev`)
- [ ] Testei criar uma conta com email
- [ ] Testei login com Google
- [ ] Verificado no console que o usuário foi criado

Se todos os itens estiverem ✅, o login deve funcionar!
