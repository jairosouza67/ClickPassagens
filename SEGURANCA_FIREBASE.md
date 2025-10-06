# 🔐 AÇÃO DE SEGURANÇA NECESSÁRIA

## ⚠️ PROBLEMA DETECTADO:
O GitHub detectou que suas credenciais Firebase foram expostas no arquivo `test_firebase_config.html` que foi commitado no repositório.

## ✅ JÁ FIZ:
1. ✅ Removi o arquivo do Git
2. ✅ Atualizei o `.gitignore` para evitar futuros problemas
3. ✅ Commit da correção

## 🚨 VOCÊ PRECISA FAZER AGORA:

### 1. **ROTACIONAR AS CHAVES NO FIREBASE** (URGENTE!)

Suas credenciais antigas estão expostas no GitHub. Você precisa gerar novas credenciais:

#### Passo a Passo:

1. **Acesse o Firebase Console:**
   - URL: https://console.firebase.google.com/
   - Selecione: `clickpassagens-dee10`

2. **Vá em Configurações do Projeto:**
   - Clique na engrenagem ⚙️ no canto superior esquerdo
   - Clique em "Configurações do projeto"

3. **Role até "Seus aplicativos"**
   - Você verá seu app Web atual

4. **OPÇÃO 1 - Criar novo app (RECOMENDADO):**
   - Clique em "Adicionar app" > "Web" (</>)
   - Nome: `ClickPassagens-Web-Secure`
   - ✅ Marque "Configurar também o Firebase Hosting"
   - Clique em "Registrar app"
   - **COPIE AS NOVAS CREDENCIAIS**

5. **OPÇÃO 2 - Resetar chaves do app atual:**
   - Clique no app atual
   - Procure opção de resetar/rotacionar chaves
   - (Depende da interface do Firebase)

### 2. **ATUALIZAR O ARQUIVO `.env`**

Depois de gerar novas credenciais, atualize o arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=NOVA_CHAVE_AQUI
VITE_FIREBASE_AUTH_DOMAIN=clickpassagens-dee10.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clickpassagens-dee10
VITE_FIREBASE_STORAGE_BUCKET=clickpassagens-dee10.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=334285502963
VITE_FIREBASE_APP_ID=NOVO_APP_ID_AQUI
```

### 3. **FAZER PUSH DAS CORREÇÕES**

```powershell
git push origin master
```

### 4. **DELETAR O APP ANTIGO (OPCIONAL mas RECOMENDADO)**

No Firebase Console:
- Vá em Configurações do projeto > Seus aplicativos
- Clique no app antigo (aquele com credenciais expostas)
- Exclua o app

---

## 📝 BOAS PRÁTICAS DE SEGURANÇA:

### ✅ **O QUE FAZER:**
1. ✅ Sempre use variáveis de ambiente (`.env`)
2. ✅ Nunca commite arquivos `.env` no Git
3. ✅ Use `.gitignore` para proteger arquivos sensíveis
4. ✅ Rotacione chaves se forem expostas
5. ✅ Configure regras de segurança no Firebase

### ❌ **O QUE NÃO FAZER:**
1. ❌ Nunca coloque credenciais direto no código
2. ❌ Nunca commite arquivos de teste com credenciais
3. ❌ Nunca compartilhe chaves em screenshots/prints
4. ❌ Nunca deixe `.env` público

---

## 🔒 CONFIGURAR REGRAS DE SEGURANÇA DO FIREBASE:

### Firestore Rules (Recomendado):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem acessar seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dados públicos (se necessário)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firebase Authentication:
- Limite tentativas de login
- Configure domínios autorizados apenas para seus domínios
- Ative apenas os provedores necessários

---

## 📋 CHECKLIST DE SEGURANÇA:

- [ ] Acessei o Firebase Console
- [ ] Criei um novo app Web OU resetei as chaves
- [ ] Copiei as novas credenciais
- [ ] Atualizei o arquivo `.env`
- [ ] **NÃO** commitei o `.env` (já está no .gitignore)
- [ ] Testei se o login funciona com as novas credenciais
- [ ] Fiz push das correções (git push)
- [ ] Deletei o app antigo (opcional)
- [ ] Configurei regras de segurança no Firestore

---

## 🆘 PRECISA DE AJUDA?

Se tiver dúvidas sobre como rotacionar as chaves, me avise!

**IMPORTANTE:** O arquivo `.env` nunca deve ser commitado. Ele já está protegido pelo `.gitignore` agora.
