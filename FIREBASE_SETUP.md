# 🔥 Guia de Configuração do Firebase - ClickPassagens

## ✅ Firebase já instalado!
O pacote Firebase SDK já foi instalado com sucesso no projeto.

---

## 📋 Passo a Passo para Configurar

### 1. Criar Projeto no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `ClickPassagens` (ou o que preferir)
4. Desative o Google Analytics (opcional, pode ativar depois)
5. Clique em **"Criar projeto"**

---

### 2. Adicionar App Web ao Projeto

1. No painel do projeto, clique no ícone **Web** `</>`
2. Apelido do app: `ClickPassagens Web`
3. **NÃO** marque "Configure Firebase Hosting" (por enquanto)
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais do Firebase Config que aparecem

---

### 3. Copiar as Credenciais

Você verá algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "clickpassagens-12345.firebaseapp.com",
  projectId: "clickpassagens-12345",
  storageBucket: "clickpassagens-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

**COPIE** todas essas informações!

---

### 4. Colar no Arquivo de Configuração

1. Abra o arquivo: `src/config/firebase.js`
2. Substitua as credenciais DEMO pelas suas:

```javascript
// ANTES (Exemplo DEMO)
const firebaseConfig = {
  apiKey: "AIzaSyDEMO-KEY-SUBSTITUA-PELA-SUA",
  authDomain: "clickpassagens.firebaseapp.com",
  // ...
};

// DEPOIS (Suas credenciais reais)
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...", // ← Cole sua apiKey aqui
  authDomain: "clickpassagens-12345.firebaseapp.com", // ← Cole sua authDomain aqui
  projectId: "clickpassagens-12345", // ← Cole seu projectId aqui
  storageBucket: "clickpassagens-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

---

### 5. Ativar Autenticação no Firebase

1. No console do Firebase, vá em **"Build" > "Authentication"**
2. Clique em **"Get Started"** ou **"Começar"**
3. Vá na aba **"Sign-in method"**
4. Ative os seguintes provedores:

#### ✅ Email/Password (Obrigatório)
- Clique em **"Email/Password"**
- Ative a opção **"Enable"**
- Salve

#### ✅ Google (Opcional mas Recomendado)
- Clique em **"Google"**
- Ative a opção **"Enable"**
- Escolha um **email de suporte** (seu email)
- Salve

---

### 6. Ativar Firestore Database (Para salvar dados dos usuários)

1. No console do Firebase, vá em **"Build" > "Firestore Database"**
2. Clique em **"Create database"**
3. Escolha o modo:
   - **Production mode** (recomendado para produção)
   - **Test mode** (apenas para desenvolvimento - dados ficam públicos!)
4. Escolha a localização: **us-central1** (ou mais próxima de você)
5. Clique em **"Enable"**

#### Configurar Regras de Segurança (IMPORTANTE!)

No Firestore Database, vá em **"Rules"** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orçamentos do usuário
    match /quotes/{quoteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Clique em **"Publish"**.

---

### 7. Testar o Sistema

1. **Reinicie o servidor de desenvolvimento** (se estiver rodando)
2. Acesse o site: `http://localhost:5173`
3. Clique no botão **"Login"**
4. Tente **criar uma conta** com email e senha
5. Tente fazer **login com Google**

---

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação Completo

1. **Registro de Usuário**
   - Email e senha
   - Nome completo
   - Validação de campos
   - Confirmação de senha

2. **Login**
   - Email e senha
   - Login com Google (popup)
   - Mensagens de erro traduzidas

3. **Recuperação de Senha**
   - Email de reset
   - Link mágico do Firebase

4. **Perfil do Usuário**
   - Avatar (foto do Google ou inicial)
   - Nome e email
   - Plano atual (Free, Basic, Premium, Enterprise)
   - Contadores: Buscas e Orçamentos

5. **Menu do Usuário**
   - Dropdown elegante
   - Navegação rápida
   - Estatísticas
   - Logout

---

## 📊 Dados Salvos no Firestore

Quando um usuário se registra, os seguintes dados são salvos:

```javascript
{
  uid: "abc123...",
  email: "usuario@email.com",
  displayName: "João Silva",
  photoURL: "https://...", // Foto do Google
  plan: "free", // Plano inicial
  searches: 0, // Contador de buscas
  quotes: 0, // Contador de orçamentos
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

---

## 🔐 Recursos de Segurança

1. **Senhas Criptografadas** - Firebase cuida disso
2. **Tokens JWT** - Autenticação segura
3. **Regras do Firestore** - Usuários só acessam seus dados
4. **HTTPS Obrigatório** - Em produção
5. **Validação de Email** - Opcional (pode ativar depois)

---

## 🚀 Próximos Passos Opcionais

### Verificação de Email
No console Firebase > Authentication > Templates > Email verification
- Customize o email de verificação
- Ative verificação obrigatória

### Domínio Personalizado
No console Firebase > Authentication > Settings > Authorized domains
- Adicione seu domínio personalizado
- Ex: `www.clickpassagens.com.br`

### Limites de Taxa (Rate Limiting)
No console Firebase > Authentication > Settings
- Configure limites de requisições
- Previne ataques de força bruta

---

## 🐛 Possíveis Erros e Soluções

### ❌ "Firebase: Error (auth/api-key-not-valid)"
**Solução:** Verifique se copiou a apiKey corretamente

### ❌ "Firebase: Error (auth/operation-not-allowed)"
**Solução:** Ative os provedores de login no Firebase Console

### ❌ "Firebase: Error (auth/unauthorized-domain)"
**Solução:** 
1. Vá em Authentication > Settings > Authorized domains
2. Adicione `localhost` e seu domínio

### ❌ "Firebase: Missing or insufficient permissions"
**Solução:** Configure as regras do Firestore corretamente

---

## 📱 Integração com o Sistema

### Auto-preenchimento de Dados

✅ **QuotePage** - Campos preenchidos automaticamente:
- Nome do usuário logado
- Email do usuário logado
- Dados do voo selecionado

✅ **DashboardPage** - Exibe:
- Nome e foto do usuário
- Email
- Estatísticas (buscas, orçamentos)
- Plano atual

✅ **Contadores Automáticos**:
- Cada busca realizada incrementa o contador
- Cada orçamento gerado incrementa o contador

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12) para erros
2. Console do Firebase para logs
3. Regras do Firestore estão corretas
4. Provedores de login estão ativos

---

## ✨ Resumo Visual

```
Firebase Console
    ↓
1. Authentication ativado
    ├── Email/Password: ✅
    └── Google: ✅
    ↓
2. Firestore Database criado
    └── Regras de segurança: ✅
    ↓
3. Credenciais copiadas
    └── Coladas em src/config/firebase.js
    ↓
✅ SISTEMA PRONTO!
```

---

**Pronto! 🎉 O sistema de login está funcionando!**

Agora é só substituir as credenciais e testar!
