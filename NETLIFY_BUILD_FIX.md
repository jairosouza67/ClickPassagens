# 🔧 Correção do Build do Netlify

## ❌ **Erro Original:**
```
Deploy did not succeed: Deploy directory 'dist' does not exist
Build script returned non-zero exit code: 2
```

## ✅ **Solução Aplicada:**

### **Problema:**
O `vite.config.js` estava configurado para gerar o build na pasta `static/` ao invés de `dist/`, que é o padrão esperado pelo Netlify.

### **Correção em `vite.config.js`:**

**Antes:**
```javascript
build: {
  outDir: 'static',
  assetsDir: 'assets',
  emptyOutDir: true,
}
```

**Depois:**
```javascript
build: {
  outDir: 'dist',  // Usar 'dist' para compatibilidade com Netlify
  assetsDir: 'assets',
  emptyOutDir: true,
}
```

---

## 📦 **Scripts Atualizados no package.json:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",                    // Build para Netlify (gera em dist/)
    "build:backend": "vite build && npm run copy-to-static",  // Build para backend Flask
    "copy-to-static": "node -e \"require('fs').cpSync('dist', 'static', {recursive: true})\"",
    "preview": "vite preview"
  }
}
```

### **Como usar:**

- **Para Netlify:** `npm run build` (gera em `dist/`)
- **Para Backend Flask:** `npm run build:backend` (gera em `dist/` e copia para `static/`)
- **Desenvolvimento:** `npm run dev`

---

## 🚀 **O que o Netlify vai fazer agora:**

1. **Rodar:** `npm run build`
2. **Gerar pasta:** `dist/`
3. **Deploy:** Servir arquivos de `dist/`
4. **✅ Sucesso!**

---

## ✅ **Teste Local:**

```powershell
# Limpar builds anteriores
Remove-Item -Recurse -Force dist, static/assets -ErrorAction SilentlyContinue

# Build
npm run build

# Verificar se dist/ foi criado
ls dist
```

Você deve ver:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── ...outros arquivos
```

---

## 📊 **Estrutura Final:**

```
ClickPassagens/
├── dist/                    # Build para Netlify (gitignored)
│   ├── index.html
│   └── assets/
├── static/                  # Build para Flask Backend
│   ├── index.html
│   └── assets/
├── src/                     # Código fonte React
├── vite.config.js          # Configurado para dist/
├── netlify.toml            # Configurado para dist/
└── package.json            # Scripts atualizados
```

---

## 🔄 **Próximos Passos:**

### **No Netlify:**

As alterações foram enviadas para o GitHub. O Netlify deve:

1. **Detectar o push** automaticamente
2. **Iniciar novo build**
3. **Rodar:** `npm run build`
4. **Publicar:** Conteúdo de `dist/`
5. **✅ Site no ar!**

Se não iniciar automaticamente:
- Vá no dashboard do Netlify
- Clique em **"Trigger deploy" → "Deploy site"**

---

## 🆘 **Se ainda der erro:**

### **Verificar logs do Netlify:**

1. Dashboard do Netlify
2. Seu site → **"Deploys"**
3. Último deploy → Ver logs completos

### **Possíveis problemas:**

**1. Erro de dependências:**
```bash
# Solução: Limpar cache no Netlify
# Site settings → Build & deploy → Clear cache and retry deploy
```

**2. Erro no build:**
```bash
# Verificar se todas as dependências estão no package.json
npm install
npm run build
```

**3. Variáveis de ambiente faltando:**
```bash
# No Netlify: Site settings → Environment variables
# Adicionar:
VITE_API_BASE_URL=https://clickpassagens-api.onrender.com/api
VITE_APP_MODE=production
```

---

## ✅ **Checklist:**

- [ ] `vite.config.js` com `outDir: 'dist'`
- [ ] Código enviado para GitHub (`git push`)
- [ ] Netlify detectou o push
- [ ] Build iniciado automaticamente
- [ ] Build completou com sucesso
- [ ] Site acessível

---

## 📚 **Configuração do netlify.toml:**

O arquivo já está correto:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

✅ Netlify vai rodar `npm run build` e publicar `dist/`!

---

**🎉 Pronto! O build agora deve funcionar perfeitamente no Netlify!**

**⏱️ Aguarde ~2-3 minutos** para o build completar.

---

## 🔗 **Links Úteis:**

- **Netlify Build Logs:** https://app.netlify.com/teams/[seu-time]/sites/[seu-site]/deploys
- **Vite Build Guide:** https://vitejs.dev/guide/build.html
- **Netlify Deploy Docs:** https://docs.netlify.com/configure-builds/overview/

---

**✅ Todas as correções foram aplicadas e enviadas para o GitHub!**

O Netlify deve fazer o deploy automaticamente agora! 🚀
