# 🔥 Remover .env do Histórico do Git - COMANDO RÁPIDO

## ⚠️ ATENÇÃO: Este processo reescreve o histórico do Git!

### 📋 Pré-requisitos

1. **Fazer backup primeiro**:
   ```powershell
   git branch backup-before-cleaning-$(Get-Date -Format 'yyyyMMdd-HHmmss')
   ```

2. **Garantir que você é o único trabalhando no repositório**:
   - Avise todos os colaboradores
   - Eles precisarão fazer `git pull --rebase` depois

3. **Ter git-filter-repo instalado** (mais rápido que filter-branch):
   ```powershell
   # Opção 1: Via pip
   pip install git-filter-repo
   
   # Opção 2: Via Chocolatey
   choco install git-filter-repo
   ```

## 🚀 COMANDO ÚNICO - Método Moderno (Recomendado)

```powershell
# 1. Fazer backup
git branch backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')

# 2. Remover .env de TODO o histórico
git filter-repo --path .env --invert-paths --force

# 3. Adicionar remote novamente (filter-repo remove)
git remote add origin https://github.com/jairosouza67/ClickPassagens.git

# 4. Force push
git push origin --force --all
git push origin --force --tags
```

## 🛠️ COMANDO ÚNICO - Método Clássico (Se não tiver git-filter-repo)

```powershell
# 1. Fazer backup
git branch backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')

# 2. Remover .env do histórico
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

# 3. Limpar refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push origin --force --all
git push origin --force --tags
```

## ✅ Verificação

```powershell
# Verificar se .env ainda existe no histórico (deve retornar vazio)
git log --all --full-history --oneline -- .env

# Verificar se .env existe localmente (deve retornar o caminho)
Test-Path .env

# Verificar se .env está no .gitignore (deve retornar "True")
Select-String -Path .gitignore -Pattern "^\.env$" -Quiet
```

## 📝 Checklist Pós-Limpeza

- [ ] git log não mostra mais commits com .env
- [ ] Arquivo .env ainda existe localmente (não foi deletado do disco)
- [ ] .env está no .gitignore
- [ ] Force push concluído
- [ ] GitGuardian parou de alertar (pode demorar algumas horas)

## 🔴 IMPORTANTE: O Que Fazer Depois

### 1. Revogar Credenciais Expostas

**Firebase:**
```
https://console.firebase.google.com/
→ Projeto clickpassagens-3d23e
→ Configurações > Seus apps
→ DELETAR app atual
→ Criar NOVO app
→ Copiar novas credenciais para .env local
```

**Amadeus:**
```
https://developers.amadeus.com/
→ My Self-Service Workspace
→ DELETAR app atual
→ Criar NOVO app
→ Copiar novas credenciais para .env local
```

### 2. Atualizar .env Local

```env
# NOVAS credenciais (nunca commite este arquivo!)
VITE_FIREBASE_API_KEY=NOVA_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=novo-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=novo-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=novo-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=NOVO_SENDER_ID
VITE_FIREBASE_APP_ID=NOVO_APP_ID

AMADEUS_API_KEY=NOVA_KEY_AQUI
AMADEUS_API_SECRET=NOVO_SECRET_AQUI
```

### 3. Testar Aplicação

```powershell
# Reconstruir frontend
npm run build

# Copiar para static
Copy-Item -Recurse -Force dist/* static/

# Testar backend
python main.py
```

### 4. Avisar Colaboradores

Se houver outros desenvolvedores:

```
⚠️ ATENÇÃO EQUIPE:

O histórico do Git foi reescrito para remover credenciais expostas.

AÇÃO NECESSÁRIA:
1. Fazer backup de suas alterações locais
2. Deletar pasta local do projeto
3. Clonar novamente: git clone https://github.com/jairosouza67/ClickPassagens.git
4. Recriar arquivo .env com NOVAS credenciais (solicite ao responsável)
5. Aplicar suas alterações novamente

OU (se souber o que está fazendo):
git fetch origin
git reset --hard origin/dev-melhorias
```

## 🆘 Se Algo Der Errado

```powershell
# Restaurar do backup
git checkout backup-YYYYMMDD-HHMMSS

# Ver lista de backups
git branch | Select-String "backup"

# Deletar backup após confirmar que tudo funciona
git branch -D backup-YYYYMMDD-HHMMSS
```

## 📊 Estatísticas

Após limpar, você pode ver quanto espaço foi economizado:

```powershell
# Antes (anote o tamanho)
git count-objects -vH

# Depois da limpeza
git count-objects -vH

# Comparar
```

## ⏰ Tempo Estimado

- Backup: 10 segundos
- Limpeza do histórico: 1-5 minutos (depende do tamanho do repositório)
- Force push: 30 segundos - 2 minutos
- Revogar credenciais: 10 minutos
- Configurar novas: 5 minutos
- Testar: 5 minutos

**TOTAL: ~20-30 minutos**

## 🎯 Resultado Final

```
✅ .env removido do histórico do Git
✅ .env continua existindo localmente (não foi deletado do disco)
✅ .env está no .gitignore
✅ Histórico do Git reescrito e enviado ao GitHub
✅ Credenciais antigas revogadas
✅ Novas credenciais configuradas localmente
✅ Aplicação funcionando com novas credenciais
✅ GitGuardian parou de alertar
```

## 🔗 Links Úteis

- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [GitHub - Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) (alternativa)
