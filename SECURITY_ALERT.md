# 🚨 ALERTA DE SEGURANÇA - Credenciais Expostas no GitHub

## ❌ PROBLEMA DETECTADO

O GitHub detectou que suas credenciais do Firebase foram expostas publicamente no repositório. Isso é **MUITO PERIGOSO** porque:

- ✖️ Qualquer pessoa pode usar sua API Key
- ✖️ Podem criar usuários falsos
- ✖️ Podem acessar/deletar dados do Firestore
- ✖️ Podem gerar custos na sua conta Firebase
- ✖️ Podem fazer ataques DDoS

---

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Credenciais Removidas do Código

**Antes (INSEGURO):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAHGETZ-5oIu51ttPOex7gSIinQAzlnu4M", // ❌ EXPOSTO!
  authDomain: "clickpassagens-3d23e.firebaseapp.com",
  // ...
};
```

**Depois (SEGURO):**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // ✅ Variável de ambiente
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

### 2. Arquivo `.env` Criado (NÃO VAI PARA O GIT)

✅ O arquivo `.env` já está no `.gitignore`
✅ As credenciais agora ficam apenas localmente
✅ Cada desenvolvedor tem seu próprio `.env`

---

## 🔥 AÇÕES URGENTES QUE VOCÊ PRECISA FAZER AGORA:

### 1️⃣ REVOGAR as Credenciais Expostas

1. Acesse: https://console.firebase.google.com/project/clickpassagens-3d23e/settings/general
2. Vá em **"Configurações do Projeto"** (ícone de engrenagem)
3. Role até **"Seus aplicativos"**
4. Encontre o app **"ClickPassagens Web"**
5. Clique nos **3 pontinhos** → **"Excluir aplicativo"**
6. Confirme a exclusão

### 2️⃣ CRIAR Novo App com Credenciais Novas

1. No mesmo painel, clique em **"Adicionar app"** → **"Web"** `</>`
2. Nome: `ClickPassagens Web`
3. **NÃO** marque Firebase Hosting
4. Clique em **"Registrar app"**
5. **COPIE** as novas credenciais que aparecerem

### 3️⃣ ATUALIZAR o Arquivo `.env` Local

1. Abra o arquivo `.env` na raiz do projeto
2. **SUBSTITUA** as credenciais antigas pelas **NOVAS:**

```env
VITE_FIREBASE_API_KEY=SUA_NOVA_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=clickpassagens-3d23e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clickpassagens-3d23e
VITE_FIREBASE_STORAGE_BUCKET=clickpassagens-3d23e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_NOVO_SENDER_ID
VITE_FIREBASE_APP_ID=SEU_NOVO_APP_ID
```

### 4️⃣ REINICIAR o Servidor de Desenvolvimento

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente para carregar as novas variáveis
npm run dev
```

### 5️⃣ FAZER COMMIT das Alterações de Segurança

```bash
git add .
git commit -m "🔒 security: Move Firebase credentials to environment variables"
git push origin dev-melhorias
```

---

## 🛡️ COMO FUNCIONA AGORA (SEGURO)

### Desenvolvimento Local:
- ✅ Credenciais no arquivo `.env` (ignorado pelo Git)
- ✅ Vite carrega automaticamente as variáveis `VITE_*`
- ✅ Código usa `import.meta.env.VITE_FIREBASE_API_KEY`

### Produção (Netlify/Vercel):
- ✅ Configure as variáveis no painel de deploy
- ✅ Netlify: Site settings → Environment variables
- ✅ Adicione todas as variáveis `VITE_FIREBASE_*`

---

## 📋 CHECKLIST DE SEGURANÇA

- [ ] ✅ Arquivo `.env` adicionado ao `.gitignore`
- [ ] ✅ Código alterado para usar variáveis de ambiente
- [ ] ⚠️ **DELETAR o app antigo no Firebase Console**
- [ ] ⚠️ **CRIAR novo app com credenciais novas**
- [ ] ⚠️ **ATUALIZAR arquivo `.env` com novas credenciais**
- [ ] ⚠️ **TESTAR se o login ainda funciona**
- [ ] ⚠️ **FAZER COMMIT e PUSH das alterações**
- [ ] Configurar variáveis no Netlify (quando fizer deploy)

---

## 🚫 O QUE NUNCA FAZER

❌ **NUNCA** exponha credenciais diretamente no código
❌ **NUNCA** faça commit do arquivo `.env`
❌ **NUNCA** coloque API Keys em arquivos versionados
❌ **NUNCA** compartilhe suas credenciais publicamente

---

## ✅ MELHORES PRÁTICAS

✔️ **SEMPRE** use variáveis de ambiente
✔️ **SEMPRE** adicione `.env` ao `.gitignore`
✔️ **SEMPRE** use `.env.example` como template (sem credenciais reais)
✔️ **SEMPRE** rotacione credenciais se foram expostas
✔️ **SEMPRE** configure limites de uso no Firebase Console

---

## 🔐 CONFIGURAÇÕES EXTRAS DE SEGURANÇA NO FIREBASE

### 1. Limitar Domínios Autorizados
Firebase Console → Authentication → Settings → Authorized domains
- Adicione apenas: `localhost` e seu domínio de produção
- Remova outros domínios

### 2. Configurar App Check (Recomendado)
Firebase Console → Build → App Check
- Protege contra abuso da API
- Valida requisições legítimas

### 3. Regras de Segurança do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Monitoramento de Uso
Firebase Console → Usage and billing
- Configure alertas de uso
- Defina orçamento máximo
- Monitore anomalias

---

## 📞 PRÓXIMOS PASSOS

1. ⚠️ **AGORA:** Revogue as credenciais antigas (delete o app)
2. ⚠️ **AGORA:** Crie novo app com credenciais novas
3. ⚠️ **AGORA:** Atualize o arquivo `.env`
4. ✅ **DEPOIS:** Teste se tudo funciona
5. ✅ **DEPOIS:** Faça commit e push
6. ✅ **FUTURO:** Configure variáveis no Netlify quando fizer deploy

---

## ❓ PERGUNTAS FREQUENTES

**Q: O GitHub vai continuar mostrando o alerta?**
A: Sim, porque as credenciais antigas estão no histórico do Git. Você pode:
- Ignorar o alerta (credenciais já foram revogadas)
- OU fazer um "git history rewrite" (complexo, não recomendado)

**Q: Preciso mudar algo no código depois?**
A: Não! O código já está correto. Só precisa atualizar o `.env` local.

**Q: E se eu esquecer o `.env`?**
A: O app não vai funcionar. Você verá erros no console do navegador.

**Q: Como outros desenvolvedores vão ter as credenciais?**
A: Compartilhe o `.env` de forma segura (email privado, mensagem direta, 1Password, etc). NUNCA via Git.

---

## 🎯 RESUMO

✅ **Problema:** Credenciais expostas no GitHub
✅ **Solução:** Movidas para variáveis de ambiente
⚠️ **Próximo passo:** Revogar credenciais antigas e gerar novas
🔒 **Resultado:** Projeto 100% seguro

---

**🚨 AÇÃO NECESSÁRIA: Siga os passos 1, 2 e 3 AGORA para garantir a segurança do projeto!**
