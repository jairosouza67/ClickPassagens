# 🚨 ALERTA DE SEGURANÇA - AÇÃO IMEDIATA NECESSÁRIA

## ⚠️ SITUAÇÃO CRÍTICA DETECTADA

GitGuardian detectou **credenciais sensíveis expostas** no repositório GitHub público.

### 🔴 O QUE FOI EXPOSTO

```
❌ Firebase API Key, Auth Domain, Project ID, etc.
❌ Amadeus API Key e Secret
❌ Todas as credenciais do arquivo .env
❌ Histórico do Git contém múltiplos commits com .env
```

### ✅ CORREÇÃO EMERGENCIAL JÁ APLICADA

```
✅ .env removido do controle de versão (git rm --cached .env)
✅ Commit de segurança criado e enviado
✅ .env está no .gitignore (não será mais commitado)
✅ .env continua existindo localmente (não foi deletado)
```

## 🔥 AÇÕES NECESSÁRIAS AGORA (EM ORDEM)

### 1️⃣ REVOGAR CREDENCIAIS FIREBASE (5 min)

```
1. Acesse: https://console.firebase.google.com/
2. Projeto: clickpassagens-3d23e
3. ⚙️ Configurações > Geral > Seus apps
4. Encontre o app Web atual
5. 🗑️ DELETAR o app completamente
6. ➕ Adicionar app > Web > Registrar
7. 📋 Copiar as NOVAS credenciais
8. ✏️ Atualizar .env LOCAL (NUNCA commitar!)
```

### 2️⃣ REVOGAR CREDENCIAIS AMADEUS (5 min)

```
1. Acesse: https://developers.amadeus.com/
2. Login > My Self-Service Workspace
3. Apps > Suas apps
4. 🗑️ DELETAR a app atual
5. ➕ Create new app
6. 📋 Copiar API Key e API Secret
7. ✏️ Atualizar .env LOCAL (NUNCA commitar!)
```

### 3️⃣ LIMPAR HISTÓRICO DO GIT (10 min)

**Opção A - Método Rápido (Recomendado):**
```powershell
# Fazer backup
git branch backup-$(Get-Date -Format 'yyyyMMdd')

# Instalar git-filter-repo
pip install git-filter-repo

# Limpar histórico
git filter-repo --path .env --invert-paths --force

# Adicionar remote
git remote add origin https://github.com/jairosouza67/ClickPassagens.git

# Force push
git push origin --force --all
git push origin --force --tags
```

**Opção B - Método Clássico:**
```powershell
# Ver instruções completas em: GIT_CLEAN_HISTORY.md
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

### 4️⃣ ATUALIZAR .env COM NOVAS CREDENCIAIS (2 min)

**NO SEU COMPUTADOR (nunca commite!):**

```env
# Firebase - NOVAS credenciais
VITE_FIREBASE_API_KEY=XXXXX_NOVA_KEY_AQUI_XXXXX
VITE_FIREBASE_AUTH_DOMAIN=novo-app-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=novo-app-12345
VITE_FIREBASE_STORAGE_BUCKET=novo-app-12345.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Amadeus - NOVAS credenciais
AMADEUS_API_KEY=NOVA_KEY_AQUI
AMADEUS_API_SECRET=NOVO_SECRET_AQUI
```

### 5️⃣ TESTAR APLICAÇÃO (3 min)

```powershell
# Reconstruir frontend
npm run build

# Copiar para static
Copy-Item -Recurse -Force dist/* static/

# Testar backend
python main.py

# No navegador: http://localhost:5173
# Testar login com Google
# Testar busca de voos
```

### 6️⃣ VERIFICAR SUCESSO (2 min)

```powershell
# .env não deve mais aparecer no histórico (deve retornar vazio)
git log --all --full-history --oneline -- .env

# .env deve existir localmente
Test-Path .env
# Deve retornar: True

# .env deve estar no .gitignore
Select-String -Path .gitignore -Pattern "^\.env$"
# Deve retornar: .env
```

## 📋 CHECKLIST COMPLETO

### Etapa 1: Revogar Credenciais
- [ ] Firebase app deletado
- [ ] Novo Firebase app criado
- [ ] Novas credenciais Firebase copiadas
- [ ] Amadeus app deletado
- [ ] Novo Amadeus app criado
- [ ] Novas credenciais Amadeus copiadas

### Etapa 2: Limpar Git
- [ ] Backup criado: `git branch backup-YYYYMMDD`
- [ ] Histórico limpo (git filter-repo OU git filter-branch)
- [ ] Force push concluído
- [ ] Verificado: `git log -- .env` retorna vazio

### Etapa 3: Configurar Localmente
- [ ] .env atualizado com NOVAS credenciais
- [ ] .env NÃO está em staging: `git status` não mostra .env
- [ ] .env está no .gitignore

### Etapa 4: Testar
- [ ] `npm run build` executado com sucesso
- [ ] Build copiado para static/
- [ ] Backend iniciado sem erros
- [ ] Login com Google funciona
- [ ] Busca de voos retorna dados reais

### Etapa 5: Confirmar Segurança
- [ ] GitGuardian parou de alertar (pode demorar algumas horas)
- [ ] `.env` não aparece em `git ls-files`
- [ ] `.env` não aparece no GitHub
- [ ] Aplicação funcionando normalmente

## ⏰ TEMPO TOTAL ESTIMADO

```
Revogar Firebase:        5 min
Revogar Amadeus:         5 min
Limpar histórico Git:   10 min
Atualizar .env:          2 min
Rebuild & Teste:         5 min
Verificações:            3 min
─────────────────────────────
TOTAL:                  30 min
```

## 📚 DOCUMENTAÇÃO CRIADA

Documentos detalhados para cada etapa:

1. **`SECURITY_LEAK_FIX.md`** - Guia completo de correção
2. **`GIT_CLEAN_HISTORY.md`** - Como limpar o histórico do Git
3. **`SECURITY_ALERT_ACTION.md`** - Este resumo executivo

## 🆘 SE PRECISAR DE AJUDA

1. **Antes de começar**: Leia `GIT_CLEAN_HISTORY.md`
2. **Durante limpeza**: Siga os passos UM POR VEZ
3. **Se errar**: Use o backup: `git checkout backup-YYYYMMDD`
4. **Dúvidas**: Consulte os links abaixo

## 🔗 LINKS IMPORTANTES

- [Firebase Console](https://console.firebase.google.com/)
- [Amadeus Developer Portal](https://developers.amadeus.com/)
- [GitHub - Remove Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-filter-repo](https://github.com/newren/git-filter-repo)

## ⚡ COMANDO RÁPIDO (SE TEM PRESSA)

```powershell
# 1. Revogar credenciais manualmente (Firebase + Amadeus)

# 2. Limpar Git
git branch backup-now
pip install git-filter-repo
git filter-repo --path .env --invert-paths --force
git remote add origin https://github.com/jairosouza67/ClickPassagens.git
git push origin --force --all

# 3. Atualizar .env local com novas credenciais

# 4. Testar
npm run build
Copy-Item -Recurse -Force dist/* static/
python main.py

# 5. Verificar
git log --all --oneline -- .env
# Deve retornar vazio
```

## ✅ RESULTADO FINAL ESPERADO

```
✅ Credenciais antigas revogadas (inválidas)
✅ Novas credenciais criadas e configuradas
✅ .env removido do histórico do Git
✅ .env protegido no .gitignore
✅ Histórico limpo no GitHub
✅ Aplicação funcionando com novas credenciais
✅ GitGuardian parou de alertar
✅ Segurança restaurada
```

## 🎯 PRÓXIMOS PASSOS (APÓS CORREÇÃO)

1. **Monitorar**: Verifique email para novos alertas GitGuardian
2. **Prevenir**: Configure git hooks para prevenir commits de .env
3. **Educar**: Leia sobre boas práticas de segurança
4. **Automatizar**: Use ferramentas como `git-secrets` ou `detect-secrets`

---

**⏰ COMECE AGORA! Cada minuto que passa, suas credenciais estão públicas.**

**❓ DÚVIDAS? Leia `SECURITY_LEAK_FIX.md` ou `GIT_CLEAN_HISTORY.md`**
