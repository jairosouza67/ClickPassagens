# 🔥 VERIFICAR DOMÍNIOS AUTORIZADOS NO FIREBASE

## ⚠️ PROBLEMA CRÍTICO
O Firebase não está conseguindo processar a autenticação após o redirect do Google.
Isso indica que o domínio `clickpassagens.me` não está autorizado.

## 📋 PASSOS PARA CORRIGIR:

### 1. Acesse o Firebase Console
🔗 https://console.firebase.google.com/

### 2. Selecione o projeto `clickpassagens-dee10`

### 3. Vá em **Authentication** (no menu lateral esquerdo)

### 4. Clique na aba **Settings** (Configurações)

### 5. Role até **Authorized domains** (Domínios autorizados)

### 6. Verifique se os seguintes domínios estão na lista:
- ✅ `clickpassagens.me`
- ✅ `www.clickpassagens.me`
- ✅ `clickpassagens.netlify.app`
- ✅ `localhost` (para desenvolvimento)

### 7. Se `clickpassagens.me` NÃO estiver na lista:
1. Clique em **"Add domain"** (Adicionar domínio)
2. Digite: `clickpassagens.me`
3. Clique em **Add** (Adicionar)
4. Repita para `www.clickpassagens.me`

### 8. Aguarde 5 minutos para as mudanças propagarem

### 9. Teste novamente o login no celular

---

## 🔍 COMO SABER SE ESTÁ CORRETO:

Após adicionar os domínios, a lista deve conter:
```
- clickpassagens-dee10.firebaseapp.com (padrão)
- clickpassagens.me ← DEVE TER ESTE
- www.clickpassagens.me ← E ESTE TAMBÉM
- clickpassagens.netlify.app
- localhost
```

---

## ⚡ OBSERVAÇÕES IMPORTANTES:

1. **Sem `clickpassagens.me`** = Login não funciona neste domínio
2. **Apenas com `clickpassagens.netlify.app`** = Login só funciona no domínio Netlify
3. **É necessário adicionar AMBOS** `clickpassagens.me` E `www.clickpassagens.me`

---

## 📸 SCREENSHOT DO QUE DEVE APARECER:

Você deve ver uma lista assim:

```
Authorized domains
These domains are allowed to host the sign-in widget.

✓ clickpassagens-dee10.firebaseapp.com
✓ clickpassagens.me
✓ www.clickpassagens.me  
✓ clickpassagens.netlify.app
✓ localhost

[Add domain]
```
