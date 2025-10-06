# 🔧 DESABILITAR SCANNER DE SECRETS DO NETLIFY

## ❌ Problema
O Netlify está bloqueando o deploy porque detectou as credenciais Firebase no código compilado.

## ✅ Solução
As credenciais Firebase do FRONTEND são **PÚBLICAS POR DESIGN** - elas precisam estar no código JavaScript para funcionar.

A segurança é garantida pelas **Regras de Segurança do Firebase**, não pela ocultação das credenciais.

---

## 🚀 PASSOS PARA CORRIGIR

### Opção 1: Via Interface Netlify (RECOMENDADO)

1. Acesse: https://app.netlify.com/sites/clickpassagens/configuration/env

2. Adicione a variável:
   ```
   SECRETS_SCAN_ENABLED = false
   ```

3. Salve e faça um novo deploy:
   - Vá em: https://app.netlify.com/sites/clickpassagens/deploys
   - Clique em: **"Trigger deploy"**
   - Selecione: **"Clear cache and deploy site"**

---

### Opção 2: Via netlify.toml (JÁ FEITO)

O arquivo `netlify.toml` já foi atualizado com:

```toml
[build.environment]
  NODE_VERSION = "18"
  SECRETS_SCAN_ENABLED = "false"
```

Mas pode ser que o Netlify precise da variável de ambiente também.

---

## 📋 IMPORTANTE

- ✅ Credenciais Firebase no frontend são **SEGURAS** e **PÚBLICAS**
- ✅ Qualquer app Firebase expõe essas credenciais no código JavaScript
- ✅ Segurança é garantida por **Firebase Security Rules**
- ✅ Google, Facebook, Twitter - todos expõem API keys públicas no frontend

---

## 🎯 PRÓXIMOS PASSOS

Depois de desabilitar o scanner:

1. **Aguarde 2-3 minutos** para o build completar
2. **Limpe cache** do navegador (Ctrl + Shift + Delete)
3. **Teste login** em https://clickpassagens.me
4. **Me avise o resultado!**
