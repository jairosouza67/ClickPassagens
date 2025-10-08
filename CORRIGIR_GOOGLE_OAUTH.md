# 🔥 CORRIGIR CONFIGURAÇÃO GOOGLE OAUTH

## 🚨 PROBLEMA IDENTIFICADO
O Firebase não está recebendo a resposta do Google após o login.
Isso indica que as **URIs de Redirecionamento** não estão configuradas no Google Cloud Console.

---

## 📋 PASSOS PARA CORRIGIR:

### 1. Acesse o Google Cloud Console
🔗 https://console.cloud.google.com/

### 2. Selecione o projeto do Firebase
- Nome do projeto: `clickpassagens-dee10`
- Ou o projeto associado ao Firebase

### 3. Vá em **APIs & Services** > **Credentials** (Credenciais)
Menu lateral esquerdo > "APIs e serviços" > "Credenciais"

### 4. Encontre o OAuth 2.0 Client ID usado pelo Firebase
Procure por algo como:
- "Web client (auto created by Google Service)"
- Ou um Client ID que você criou manualmente

### 5. Clique no Client ID para editar

### 6. Na seção **"Authorized redirect URIs"** (URIs de redirecionamento autorizadas)
Verifique se contém TODAS estas URIs:

```
https://clickpassagens-dee10.firebaseapp.com/__/auth/handler
https://clickpassagens.me/__/auth/handler
https://www.clickpassagens.me/__/auth/handler
https://clickpassagens.netlify.app/__/auth/handler
http://localhost/__/auth/handler
```

### 7. Se alguma URI estiver FALTANDO:
1. Clique em **"ADD URI"** (Adicionar URI)
2. Cole a URI exata (copie e cole do bloco acima)
3. Clique em **"SAVE"** (Salvar)

### 8. IMPORTANTE: Aguarde 5-10 minutos
As mudanças no Google Cloud podem levar alguns minutos para propagar

### 9. Teste novamente o login no celular

---

## ⚠️ FORMATO CORRETO DAS URIs

**CORRETO:** ✅
```
https://clickpassagens.me/__/auth/handler
```

**ERRADO:** ❌
```
https://clickpassagens.me/
https://clickpassagens.me/__/auth
https://clickpassagens.me/auth/handler
```

A URI deve terminar **EXATAMENTE** com `/__/auth/handler`

---

## 🔍 COMO SABER SE ESTÁ CORRETO:

Após adicionar as URIs, a lista deve conter:

```
Authorized redirect URIs
✓ https://clickpassagens-dee10.firebaseapp.com/__/auth/handler
✓ https://clickpassagens.me/__/auth/handler
✓ https://www.clickpassagens.me/__/auth/handler
✓ https://clickpassagens.netlify.app/__/auth/handler
✓ http://localhost/__/auth/handler
```

---

## 📸 ONDE ENCONTRAR NO FIREBASE:

Se você não sabe qual Client ID usar, pode encontrar no Firebase Console:

1. Firebase Console > Authentication
2. Sign-in method > Google
3. Clique em "Web SDK configuration"
4. Copie o "Web client ID"
5. Use esse ID para procurar no Google Cloud Console

---

## 🆘 SE AINDA NÃO FUNCIONAR:

Verifique também:
1. **JavaScript origins autorizadas** (adicione `https://clickpassagens.me`)
2. **Status do OAuth Consent Screen** (deve estar publicado, não em teste)
3. **Usuários de teste** (se estiver em modo teste, seu email deve estar na lista)

---

## 🔗 LINKS ÚTEIS:

- Google Cloud Console: https://console.cloud.google.com/
- Firebase Console: https://console.firebase.google.com/
- Documentação OAuth: https://developers.google.com/identity/protocols/oauth2
