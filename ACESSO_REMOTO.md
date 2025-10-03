# 🌐 ACESSO REMOTO - ClickPassagens

## ✅ PROBLEMA RESOLVIDO!

O site agora pode ser acessado de **qualquer navegador** (Chrome, Firefox, Edge, etc.) e de **qualquer dispositivo na mesma rede**.

---

## 🔧 MUDANÇAS REALIZADAS

### 1. Frontend (Vite) - Exposto na Rede
**Arquivo:** `vite.config.js`

**Antes:**
```javascript
server: {
  proxy: { ... }
}
```

**Depois:**
```javascript
server: {
  host: '0.0.0.0',    // ← Aceita conexões de qualquer IP
  port: 5173,
  strictPort: false,
  proxy: { ... }
}
```

### 2. API Config - Proxy Relativo
**Arquivo:** `src/config.js`

**Antes:**
```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'
  : 'http://localhost:5001';  // ← Problema: só funciona em localhost
```

**Depois:**
```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'
  : '';  // ← Solução: usa proxy relativo
```

**Como funciona:**
- Frontend faz requisição para `/api/busca/buscar`
- Vite proxy redireciona para `http://localhost:5001/api/busca/buscar`
- Funciona de qualquer lugar!

---

## 🌍 COMO ACESSAR

### Opção 1: Mesmo PC (Localhost)
```
http://localhost:5174
```

### Opção 2: Outros Dispositivos na Mesma Rede
```
http://192.168.1.113:5174
```

**⚠️ Importante:** Use o IP que aparece no terminal do Vite:
```
➜  Network: http://192.168.1.113:5174/  ← USE ESTE
```

### Opção 3: Outro PC na Mesma Rede WiFi
```
http://192.168.1.113:5174
```

---

## 🧪 TESTE COMPLETO

### 1. Verificar Servidores Rodando

**Backend (Flask):**
```powershell
netstat -ano | findstr :5001
```
Deve mostrar: `TCP    0.0.0.0:5001`

**Frontend (Vite):**
```powershell
netstat -ano | findstr :5174
```
Deve mostrar: `TCP    0.0.0.0:5174`

### 2. Acessar de Diferentes Navegadores

**Chrome:**
```
http://192.168.1.113:5174
```

**Firefox:**
```
http://192.168.1.113:5174
```

**Edge:**
```
http://192.168.1.113:5174
```

**Safari (Mac/iPhone):**
```
http://192.168.1.113:5174
```

### 3. Fazer uma Busca

1. Clique em "**Busca**"
2. Preencha:
   - Origem: **GRU**
   - Destino: **GIG**
   - Data: **15/10/2025**
   - Passageiros: **1**
3. Clique em "**Buscar**"
4. Aguarde 5-10 segundos
5. ✅ Deve exibir **20 voos reais**

---

## 🔍 VERIFICAÇÃO DE REDE

### Ver IP do Servidor:
```powershell
ipconfig | Select-String "IPv4"
```

**Resultado esperado:**
```
Endereço IPv4. . . . . . . .  . . . . . . . : 192.168.1.113
```

### Testar Conexão de Outro PC:
```powershell
Test-NetConnection -ComputerName 192.168.1.113 -Port 5174
```

**Resultado esperado:**
```
TcpTestSucceeded : True
```

### Ver URLs Disponíveis:
```powershell
npm run dev
```

**Saída:**
```
➜  Local:   http://localhost:5174/
➜  Network: http://192.168.1.113:5174/  ← COMPARTILHE ESTE
➜  Network: http://172.22.144.1:5174/
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Problema 1: "Não consigo acessar de outro PC"

**Possíveis causas:**

1. **Firewall bloqueando a porta**
   ```powershell
   # Verificar firewall
   Get-NetFirewallRule | Where-Object {$_.Enabled -eq 'True' -and $_.Direction -eq 'Inbound'} | Select-Object DisplayName, Enabled
   
   # Adicionar regra se necessário (como admin)
   New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5174 -Protocol TCP -Action Allow
   New-NetFirewallRule -DisplayName "Flask Backend" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
   ```

2. **IP errado**
   - Verifique: `ipconfig | Select-String "IPv4"`
   - Use o IP que está na **mesma rede** do outro dispositivo

3. **Porta errada**
   - Veja no terminal do Vite qual porta está sendo usada
   - Pode ser 5173, 5174 ou 5175

### Problema 2: "Frontend carrega mas API não funciona"

**Solução:**
```powershell
# Verificar se backend está escutando em 0.0.0.0
netstat -ano | findstr :5001
```

Deve mostrar: `0.0.0.0:5001` (não `127.0.0.1:5001`)

Se mostrar `127.0.0.1:5001`, o backend precisa ser configurado para escutar em todos os endereços.

### Problema 3: "Erro CORS"

**Verificar:**
```powershell
# Ver logs do backend
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
```

**No arquivo `main.py` deve ter:**
```python
from flask_cors import CORS
...
CORS(app)
```

### Problema 4: "Funciona em localhost mas não no IP"

**Causa:** Você está usando URL absoluta em vez de proxy relativo.

**Solução já aplicada:**
- `src/config.js` agora usa `API_URL = ''` em desenvolvimento
- Isso faz o Vite usar proxy relativo
- Funciona de qualquer endereço!

---

## 📱 ACESSAR DE CELULAR (Mesma WiFi)

### Android:
1. Conecte o celular na **mesma WiFi** do PC
2. Abra o Chrome/Firefox
3. Digite: `http://192.168.1.113:5174`
4. Pronto! O site deve carregar

### iPhone:
1. Conecte o iPhone na **mesma WiFi** do PC
2. Abra o Safari
3. Digite: `http://192.168.1.113:5174`
4. Adicione à tela inicial se quiser

---

## 🎯 CHECKLIST FINAL

Antes de acessar de outro dispositivo:

- [ ] Backend rodando (`python main.py`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Firewall permite portas 5001 e 5174
- [ ] Ambos os dispositivos na mesma rede WiFi
- [ ] Usando o IP correto (veja `ipconfig`)
- [ ] Porta correta (veja terminal do Vite)

---

## 📊 ARQUITETURA ATUAL

```
┌─────────────────────────────────────────────┐
│  Qualquer Dispositivo (Chrome, Firefox)     │
│  http://192.168.1.113:5174                  │
└─────────────────┬───────────────────────────┘
                  │
                  │ Acesso via Rede
                  ▼
┌─────────────────────────────────────────────┐
│  Frontend (Vite) - Porta 5174               │
│  Host: 0.0.0.0 (todas as redes)             │
│                                             │
│  Proxy: /api/* → localhost:5001/api/*      │
└─────────────────┬───────────────────────────┘
                  │
                  │ Proxy Interno
                  ▼
┌─────────────────────────────────────────────┐
│  Backend (Flask) - Porta 5001               │
│  Host: 0.0.0.0 (todas as redes)             │
│                                             │
│  API: /api/busca/buscar                     │
│  Amadeus API (voos reais)                   │
└─────────────────────────────────────────────┘
```

---

## 🌟 VANTAGENS DA SOLUÇÃO

### ✅ Proxy Relativo
- **Funciona de qualquer lugar** (localhost, IP, domínio)
- **Sem CORS issues** (mesma origem aparente)
- **Fácil deploy** (só mudar API_URL em produção)

### ✅ Host 0.0.0.0
- **Acessível na rede local**
- **Testável em múltiplos dispositivos**
- **Simula ambiente de produção**

### ✅ Porta Dinâmica
- **Se 5173 ocupada, tenta 5174**
- **Flexível** para desenvolvimento
- **Evita conflitos**

---

## 🎉 RESUMO

**ANTES:** Funcionava apenas em `http://localhost:5174` (Simple Browser)

**AGORA:** Funciona em:
- ✅ `http://localhost:5174` (mesmo PC)
- ✅ `http://192.168.1.113:5174` (outros PCs/celulares)
- ✅ Qualquer navegador (Chrome, Firefox, Edge, Safari)
- ✅ Qualquer dispositivo na mesma rede WiFi

**Compartilhe este link com qualquer pessoa na mesma rede:**
```
http://192.168.1.113:5174
```

---

**✅ PRONTO PARA USAR!** Agora você pode testar de qualquer navegador e dispositivo! 🚀
