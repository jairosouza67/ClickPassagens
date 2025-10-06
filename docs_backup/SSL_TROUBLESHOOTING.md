# 🔒 Troubleshooting SSL Certificate - ClickPassagens.me

## 🎯 Problema Atual
Erro: **"We could not provision a Let's Encrypt certificate for your custom domain"**

Baseado no guia oficial: https://answers.netlify.com/t/support-guide-troubleshooting-ssl-certificate-errors/39865

---

## ✅ Status Atual (Verificado)

### DNS Propagação
- ✅ A Record apontando para `75.2.60.5` (correto)
- ✅ Sem registros AAAA (IPv6) - OK
- ⏳ Aguardando propagação global (100%)

---

## 🔧 PASSOS OBRIGATÓRIOS NO NAMECHEAP

### 1. Verificar configuração DNS

Acesse: https://ap.www.namecheap.com/domains/domaincontrolpanel/clickpassagens.me/advancedns

#### ✅ Deve ter APENAS estes registros:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A Record** | `@` | `75.2.60.5` | Automatic |
| **CNAME Record** | `www` | `clickpassagens.netlify.app` | Automatic |

#### ❌ REMOVER se existir:

- ❌ **AAAA Records** (IPv6) - Netlify não suporta
- ❌ **Múltiplos A Records** - Deixe apenas um
- ❌ **Parking Page redirects** - Remova
- ❌ **URL Redirect Records** - Remova

---

### 2. Desabilitar DNSSEC (IMPORTANTE!)

⚠️ **Netlify NÃO suporta DNSSEC** - isso pode bloquear o SSL!

**Como desabilitar:**

1. Acesse: https://ap.www.namecheap.com/domains/domaincontrolpanel/clickpassagens.me/domain
2. Role até a seção **"DNSSEC"**
3. Se estiver **ENABLED** (habilitado), clique em **"Manage"**
4. Clique em **"Delete DNSSEC"** ou **"Disable DNSSEC"**
5. Salve as alterações

---

### 3. Verificar CAA Records

CAA records podem bloquear Let's Encrypt.

**Como verificar:**

1. No Namecheap, vá em **Advanced DNS**
2. Procure por registros do tipo **"CAA"**
3. Se existir, certifique-se que permite Let's Encrypt:
   ```
   0 issue "letsencrypt.org"
   ```
4. Ou simplesmente **REMOVA todos os CAA records** (recomendado)

---

## 🌐 Verificação de Propagação DNS

### Ferramentas Online:

1. **DNSChecker.org** (PRINCIPAL):
   - A Record: https://dnschecker.org/#A/clickpassagens.me
   - CNAME: https://dnschecker.org/#CNAME/www.clickpassagens.me
   - **Aguarde até ter ✅ verde em TODOS os locais (100%)**

2. **Let's Debug** (Diagnóstico SSL):
   - https://letsdebug.net/clickpassagens.me
   - Mostra exatamente o que está bloqueando o SSL

3. **DNSViz** (Verificar DNSSEC):
   - https://dnsviz.net/d/clickpassagens.me/dnssec/
   - Certifique-se que não há DNSSEC ativo

---

## ⏱️ Tempo de Propagação

### Comportamento do Netlify:
- ✅ **Primeiras 24h**: Tenta provisionar SSL a cada **10 minutos**
- ⏳ **Após 24h**: Tenta provisionar a cada **1 hora** (por mais 2 dias)

### Se não funcionar em 24h:
- ❌ Há um problema de configuração DNS
- 🔧 Siga os passos de troubleshooting acima

---

## 🎯 Checklist Final

Antes de aguardar a propagação, certifique-se:

- [ ] Apenas 1 A Record (`@` → `75.2.60.5`)
- [ ] CNAME do www (`www` → `clickpassagens.netlify.app`)
- [ ] Sem AAAA Records (IPv6)
- [ ] DNSSEC **DESABILITADO** no Namecheap
- [ ] Sem CAA Records bloqueando Let's Encrypt
- [ ] Sem URL Redirects ou Parking Pages
- [ ] DNS propagado 100% globalmente (DNSChecker verde)

---

## 🔄 Após Corrigir DNS

### No Netlify:

1. Vá em: **Site settings → Domain management → HTTPS**
2. Se aparecer botão **"Verify DNS configuration"**, clique nele
3. Se não aparecer, aguarde - Netlify tenta automaticamente a cada 10 min

### Monitoramento:

Execute este comando para verificar quando o SSL estiver ativo:

```powershell
Invoke-WebRequest -Uri "https://clickpassagens.me" -Method Head
```

Quando funcionar, você verá: `StatusCode: 200` ✅

---

## 🆘 Se Nada Funcionar

Após 48 horas, se o SSL não provisionar:

1. Abra um ticket no Netlify Support Forum
2. Inclua:
   - Nome do site: `clickpassagens.netlify.app`
   - Usando: **External DNS (Namecheap)**
   - Passos já realizados
   - Print dos registros DNS do Namecheap
   - Resultado do Let's Debug

---

## 📚 Referências Oficiais

- [Troubleshooting SSL Certificate Errors](https://answers.netlify.com/t/support-guide-troubleshooting-ssl-certificate-errors/39865)
- [Configure External DNS](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/)
- [Netlify DNS Troubleshooting](https://docs.netlify.com/domains-https/troubleshooting-tips/)

---

**Última atualização:** 2025-10-01
