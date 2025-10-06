# 🔧 GUIA: Corrigir Login Google em Produção

## 🔴 PROBLEMA IDENTIFICADO:
Quando você clica no botão "Login com Google" no site em produção, a tela apenas "pisca" e nada acontece.

## 🎯 CAUSA RAIZ:
O Firebase está bloqueando o login porque o **domínio de produção não está autorizado**.

---

## ✅ SOLUÇÃO PASSO A PASSO:

### 1️⃣ **Acesse o Firebase Console**
🔗 https://console.firebase.google.com/

### 2️⃣ **Selecione o Projeto**
- Clique em: **clickpassagens-dee10**

### 3️⃣ **Vá em Authentication**
- No menu lateral esquerdo, clique em **"Authentication"**

### 4️⃣ **Abra Settings (Configurações)**
- Clique na aba **"Settings"** (ou "Configurações")

### 5️⃣ **Adicione Domínios Autorizados**
- Role até a seção **"Authorized domains"** (Domínios autorizados)
- Você verá que provavelmente só tem `localhost` e `firebase.app`

### 6️⃣ **Clique em "Add domain" (Adicionar domínio)**

Adicione OS SEGUINTES DOMÍNIOS (dependendo de onde seu site está hospedado):

#### Se estiver no Netlify:
```
seu-site.netlify.app
```
(Substitua "seu-site" pelo nome real do seu deploy no Netlify)

#### Se tiver domínio customizado:
```
www.clickpassagens.com.br
clickpassagens.com.br
```

#### Se estiver em outro provedor:
- Vercel: `seu-site.vercel.app`
- Render: `seu-site.onrender.com`
- GitHub Pages: `usuario.github.io`

### 7️⃣ **Salvar**
- Clique em **"Add"** ou **"Adicionar"**
- Os domínios serão adicionados automaticamente

---

## 📋 CHECKLIST DE DOMÍNIOS:

Configure TODOS os domínios onde sua aplicação está rodando:

- [ ] `localhost` (para desenvolvimento) ✅ Já deve estar
- [ ] Domínio do Netlify (se usar)
- [ ] Domínio customizado (se tiver)
- [ ] Subdomínios (www, app, etc)

---

## 🧪 TESTE APÓS CONFIGURAR:

### 1. **Aguarde 1-2 minutos** (propagação das configurações)

### 2. **Limpe o cache do navegador**
   - Pressione `Ctrl + Shift + Delete`
   - Marque "Cache" e "Cookies"
   - Clique em "Limpar dados"

### 3. **Acesse seu site em produção**

### 4. **Abra o Console do DevTools** (F12)

### 5. **Clique em "Login com Google"**

### 6. **Veja o resultado:**
   - ✅ **Sucesso:** Popup do Google abre normalmente
   - ❌ **Erro:** Console mostra: `auth/unauthorized-domain`

---

## 🐛 ERROS COMUNS EM PRODUÇÃO:

### ❌ **Erro: `auth/popup-blocked`**
**Causa:** Navegador bloqueou o popup  
**Solução:** Usuário precisa permitir popups para o site

### ❌ **Erro: `auth/unauthorized-domain`**
**Causa:** Domínio não está nos domínios autorizados  
**Solução:** Adicione o domínio no Firebase Console (passos acima)

### ❌ **Erro: Popup abre mas não fecha**
**Causa:** Problemas com CORS ou headers  
**Solução:** Verifique o arquivo `netlify.toml` (já está configurado)

### ❌ **Erro: Tela pisca mas nada acontece**
**Causa:** Domínio não autorizado OU popup bloqueado  
**Solução:** 
1. Adicione domínio no Firebase
2. Verifique se popups estão permitidos
3. Veja erros no console (F12)

---

## 🔍 DEBUG EM PRODUÇÃO:

### Abra o Console do navegador no site de produção:

1. Pressione **F12**
2. Vá na aba **"Console"**
3. Clique em "Login com Google"
4. Veja as mensagens:

**Se aparecer:**
```
❌ [Firebase] ERRO no login Google:
❌ [Firebase] Código: auth/unauthorized-domain
```
**→ Adicione o domínio no Firebase Console**

**Se aparecer:**
```
❌ [Firebase] Código: auth/popup-blocked
```
**→ Permita popups no navegador**

**Se não aparecer nada:**
**→ As credenciais Firebase podem estar incorretas**

---

## 🌐 CONFIGURAÇÃO PARA MOBILE:

O problema do "piscar" em mobile geralmente é popup bloqueado.

### Solução alternativa para mobile: Usar Redirect

Vou criar uma versão que detecta mobile e usa redirect ao invés de popup:

**IMPORTANTE:** Para mobile funcionar melhor, você pode precisar usar `signInWithRedirect` ao invés de `signInWithPopup`.

---

## 📝 PRÓXIMOS PASSOS:

1. **Me diga qual é o domínio do seu site em produção**
   - Exemplo: `clickpassagens.netlify.app`
   - Ou: `www.clickpassagens.com.br`

2. **Adicione esse domínio no Firebase Console**
   - Siga os passos acima

3. **Teste novamente**
   - Limpe cache
   - Tente login com Google
   - Veja console (F12)

4. **Se ainda não funcionar:**
   - Me envie as mensagens de erro do console
   - Me diga se é Mobile ou Desktop
   - Me diga qual navegador está usando

---

## 🔧 CONFIGURAÇÃO AUTOMÁTICA (Opcional):

Posso criar um script que:
1. Detecta se é mobile
2. Usa redirect em mobile e popup em desktop
3. Melhora a experiência do usuário

Quer que eu implemente isso?

---

**Me diga o domínio de produção que vou te ajudar a configurar!** 🚀
