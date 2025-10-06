# 🔒 ALERTA DE SEGURANÇA - Credenciais Expostas

**Data:** 03/10/2025  
**Severidade:** 🔴 **CRÍTICA**  
**Status:** ✅ **CORREÇÕES APLICADAS - AÇÃO IMEDIATA NECESSÁRIA**

---

## 🚨 PROBLEMA IDENTIFICADO

O GitGuardian detectou **credenciais sensíveis expostas** no repositório GitHub:

- ❌ **AMADEUS_API_KEY** exposta em arquivos de documentação
- ❌ **AMADEUS_API_SECRET** exposta em arquivos de documentação  
- ❌ **FIREBASE_API_KEY** exposta no código
- ❌ Histórico do Git contém versões anteriores com credenciais

---

## ⚠️ RISCOS

### 1. API Amadeus
- **Risco:** Uso não autorizado da sua conta Amadeus
- **Impacto:** Cobranças inesperadas, esgotamento de quota
- **Exposição:** Credenciais visíveis em commits públicos

### 2. Firebase
- **Risco:** Acesso não autorizado ao banco de dados
- **Impacto:** Vazamento de dados de usuários, alterações maliciosas
- **Exposição:** Configuração visível no código

---

## ✅ CORREÇÕES JÁ APLICADAS

### 1. Arquivos de Documentação Limpos ✅
- ✅ `SOLUCAO_COMPLETA.md` - Credenciais removidas
- ✅ `SOLUCAO_FINAL.md` - Credenciais removidas
- ✅ `VERIFICACAO_CONFIGURACAO.md` - Credenciais removidas

### 2. Arquivo `.env.example` Atualizado ✅
- ✅ Placeholders genéricos criados
- ✅ Avisos de segurança adicionados
- ✅ Instruções claras para desenvolvedores

### 3. `.gitignore` Verificado ✅
- ✅ `.env` já está sendo ignorado
- ✅ Arquivos sensíveis protegidos

---

## 🔥 AÇÕES IMEDIATAS NECESSÁRIAS

### 1️⃣ REVOGAR E RECRIAR CREDENCIAIS AMADEUS (URGENTE!)

**🚨 As credenciais expostas foram:**
- ❌ API Key: `VJeodXGsEmTrl3Uo9Aels8pp1AFKDVxD`
- ❌ API Secret: `N3oIh3zf8qnPsWbc`

**Passos para revogar:**

1. **Acessar:** https://developers.amadeus.com/my-apps
2. **Login** na sua conta Amadeus
3. **Localizar** a aplicação atual
4. **Deletar/Revogar** as credenciais antigas
5. **Criar nova aplicação** ou gerar novas chaves
6. **Copiar** as novas credenciais
7. **Atualizar** APENAS o arquivo `.env` local:

```bash
# Edite o arquivo .env (NÃO commite!)
AMADEUS_API_KEY=SUA_NOVA_CHAVE_AQUI
AMADEUS_API_SECRET=SEU_NOVO_SECRET_AQUI
```

### 2️⃣ VERIFICAR FIREBASE

**As credenciais Firebase expostas:**
- API Key: `AIzaSyAHGETZ-5oIu51ttPOex7gSIinQAzlnu4M`
- Project ID: `clickpassagens-3d23e`

**Opções:**

**Opção A - Proteger Firebase (Recomendado):**
1. Acessar: https://console.firebase.google.com/
2. Abrir projeto `clickpassagens-3d23e`
3. Ir em: **Authentication** → **Sign-in method**
4. Configurar **domínios autorizados**
5. Ir em: **Firestore Database** → **Regras**
6. Configurar **regras de segurança** rigorosas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Negar acesso por padrão
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Opção B - Recriar Projeto (Mais Seguro):**
1. Criar novo projeto Firebase
2. Configurar autenticação e regras
3. Migrar dados (se houver)
4. Atualizar `.env` com novas credenciais

---

## 📋 CHECKLIST DE SEGURANÇA

### ✅ Imediato (Fazer AGORA):
- [ ] ✅ Arquivos de documentação limpos (JÁ FEITO)
- [ ] ✅ `.env.example` criado (JÁ FEITO)
- [ ] 🔥 Revogar credenciais antigas da Amadeus
- [ ] 🔥 Criar novas credenciais da Amadeus
- [ ] 🔥 Configurar regras de segurança Firebase
- [ ] Atualizar arquivo `.env` local
- [ ] Testar aplicação com novas credenciais

### Curto Prazo:
- [ ] Configurar alertas de segurança no GitHub
- [ ] Revisar todos os commits anteriores
- [ ] Treinar equipe sobre boas práticas

---

## 🛡️ BOAS PRÁTICAS

### ❌ NUNCA FAÇA:
```bash
# Nunca adicione .env ao Git
git add .env  # ❌ ERRADO!

# Nunca coloque credenciais em código
const key = "VJeodXGsEmTrl3Uo9Aels8pp1AFKDVxD"  # ❌ ERRADO!
```

### ✅ SEMPRE FAÇA:
```bash
# Use .env.example como template
cp .env.example .env

# Use variáveis de ambiente
const key = import.meta.env.VITE_FIREBASE_API_KEY  # ✅ CORRETO!

# Verifique antes de commitar
git status
# .env NÃO deve aparecer na lista
```

---

## 🆘 SUPORTE

### Precisa de ajuda?

1. **Amadeus Support:** https://developers.amadeus.com/support
2. **Firebase Support:** https://firebase.google.com/support
3. **GitHub Security:** https://docs.github.com/en/code-security

### Recursos Adicionais:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitGuardian](https://www.gitguardian.com/)
- [How to remove secrets from Git](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## ✅ APÓS APLICAR AS CORREÇÕES

Confirme que:
- ✅ Credenciais antigas foram revogadas
- ✅ Novas credenciais criadas e funcionando
- ✅ Arquivo `.env` atualizado (e NÃO commitado)
- ✅ Aplicação testada e funcionando
- ✅ Regras de segurança Firebase configuradas

---

**⚡ PRIORIDADE MÁXIMA:** Revogue as credenciais antigas AGORA!  
**Tempo estimado:** 15-30 minutos  
**Dificuldade:** Baixa

🔒 **Segurança em primeiro lugar!**
