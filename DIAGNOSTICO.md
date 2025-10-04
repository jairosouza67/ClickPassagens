# 🔍 DIAGNÓSTICO DETALHADO - ClickPassagens

## Data: 03/10/2025 19:23

---

## ✅ STATUS ATUAL DOS COMPONENTES

### Backend (Flask API)
```
Status: ✅ FUNCIONANDO PERFEITAMENTE
Porta: 5001
Host: 0.0.0.0 (acessível de qualquer lugar)
Teste: 20 voos reais retornados
Credenciais Amadeus: VÁLIDAS
```

**Teste realizado:**
```powershell
POST http://127.0.0.1:5001/api/busca/buscar
Resultado: ✅ 20 voos (Gol R$ 103.39)
```

### Frontend (Vite)
```
Status: ⚠️ INSTÁVEL (reiniciando)
Porta: 5174
Host: 0.0.0.0
URLs disponíveis:
  - http://localhost:5174
  - http://192.168.1.113:5174
```

**Problema identificado:**
- Frontend iniciando mas parando em seguida
- Possível conflito de porta ou processo duplicado

---

## 🐛 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema 1: "Site não carrega"

**Sintomas:**
- Página em branco
- Erro de conexão recusada
- Timeout

**Diagnóstico:**
```powershell
# Verificar se frontend está rodando
Test-NetConnection -ComputerName localhost -Port 5174 -InformationLevel Quiet
```

**Solução:**
```powershell
# Parar todos os processos Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Reiniciar frontend
npm run dev
```

### Problema 2: "Busca não retorna resultados"

**Sintomas:**
- Loading infinito
- Erro na requisição
- Mensagem "Nenhum voo encontrado"

**Diagnóstico:**
```powershell
# Verificar se backend está respondendo
Invoke-RestMethod -Uri "http://localhost:5001/api/busca/buscar" -Method POST -ContentType "application/json" -Body '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1}'
```

**Solução A - Backend não responde:**
```powershell
# Reiniciar backend
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
```

**Solução B - CORS error:**
1. Abrir Console do navegador (F12)
2. Verificar aba "Console" ou "Network"
3. Se houver erro CORS, verificar `main.py`:
   ```python
   from flask_cors import CORS
   CORS(app)
   ```

**Solução C - Proxy não funciona:**
Verificar `src/config.js`:
```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'
  : '';  // ← DEVE ESTAR VAZIO em dev
```

### Problema 3: "Erro 404 ou 500"

**Sintomas:**
- Erro HTTP na requisição
- Status code 404/500 no console

**Diagnóstico:**
```powershell
# Testar endpoint diretamente
curl http://localhost:5001/api/busca/buscar -X POST -H "Content-Type: application/json" -d '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1}'
```

**Solução:**
- Verificar logs do backend
- Verificar se rota está registrada em `main.py`
- Verificar se blueprint está correto

### Problema 4: "Erro de credenciais Amadeus"

**Sintomas:**
- Mensagem "credenciais inválidas"
- Erro 401
- Zero resultados

**Diagnóstico:**
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" test_amadeus.py
```

**Resultado esperado:**
```
✓ Token obtido com sucesso
✓ Busca retornou 20 resultados
```

**Solução:**
Verificar `.env`:
```env
AMADEUS_API_KEY=sua_chave_api_amadeus_aqui
AMADEUS_API_SECRET=seu_secret_amadeus_aqui
```

### Problema 5: "Console mostra erros JavaScript"

**Sintomas:**
- Erros em vermelho no console (F12)
- Componentes não renderizam
- Botões não funcionam

**Diagnóstico:**
1. Abrir Console (F12)
2. Ir na aba "Console"
3. Copiar mensagem de erro

**Possíveis erros:**

**A) "Failed to resolve import 'zustand'"**
```powershell
npm install zustand
```

**B) "Cannot find module '@/components/...'"**
```powershell
npm install
```

**C) "Uncaught TypeError: Cannot read property..."**
- Problema no código React
- Verificar arquivo mencionado no erro

### Problema 6: "Funciona em localhost mas não no IP"

**Sintomas:**
- `http://localhost:5174` ✅ funciona
- `http://192.168.1.113:5174` ❌ não funciona

**Diagnóstico:**
```powershell
# Verificar se Vite está expondo na rede
npm run dev
# Deve mostrar: ➜  Network: http://192.168.1.113:5174/
```

**Solução:**
Verificar `vite.config.js`:
```javascript
server: {
  host: '0.0.0.0',  // ← DEVE ESTAR PRESENTE
  port: 5173,
  ...
}
```

**Firewall:**
```powershell
# Permitir porta (executar como Admin)
New-NetFirewallRule -DisplayName "Vite Dev" -Direction Inbound -LocalPort 5174 -Protocol TCP -Action Allow
```

---

## 🧪 CHECKLIST DE DIAGNÓSTICO

Execute estes comandos em ordem:

### 1. Verificar Backend
```powershell
Test-NetConnection -ComputerName localhost -Port 5001 -InformationLevel Quiet
# Deve retornar: True
```

### 2. Testar API Backend
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/busca/buscar" -Method POST -ContentType "application/json" -Body '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1}'
# Deve retornar: objeto JSON com 'success: true'
```

### 3. Verificar Frontend
```powershell
Test-NetConnection -ComputerName localhost -Port 5174 -InformationLevel Quiet
# Deve retornar: True
```

### 4. Acessar no Navegador
```
http://localhost:5174
```

### 5. Abrir Console do Navegador
```
Pressione F12
Vá na aba "Console"
Verifique se há erros em vermelho
```

### 6. Fazer uma Busca
```
Origem: GRU
Destino: GIG
Data: 15/10/2025
Passageiros: 1
```

### 7. Verificar Network (F12)
```
Aba "Network" → Filtrar por "buscar"
Ver se requisição foi feita
Ver status code (deve ser 200)
Ver response (deve ter 'resultados')
```

---

## 📋 COMANDOS ÚTEIS

### Reiniciar Tudo do Zero
```powershell
# Parar todos os processos
Get-Process python,node -ErrorAction SilentlyContinue | Stop-Process -Force

# Aguardar
Start-Sleep -Seconds 2

# Iniciar backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\VS Code\ClickPassagens'; & 'E:/VS Code/ClickPassagens/.venv/Scripts/python' main.py"

# Aguardar backend iniciar
Start-Sleep -Seconds 3

# Iniciar frontend
npm run dev
```

### Ver Logs em Tempo Real

**Backend:**
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
# Deixar rodando e ver mensagens
```

**Frontend:**
```powershell
npm run dev
# Ver mensagens de build e erros
```

### Limpar Cache
```powershell
# Limpar node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
npm install

# Limpar cache do Vite
Remove-Item -Recurse -Force .vite
npm run dev
```

---

## 🆘 PERGUNTAS PARA DIAGNÓSTICO

Por favor, responda:

1. **O site abre no navegador?**
   - [ ] Sim, mostra a página
   - [ ] Não, erro de conexão
   - [ ] Sim, mas página em branco

2. **Consegue ver o formulário de busca?**
   - [ ] Sim
   - [ ] Não
   - [ ] Sim, mas está quebrado

3. **Ao clicar em "Buscar", o que acontece?**
   - [ ] Loading infinito
   - [ ] Nada acontece
   - [ ] Aparece erro na tela
   - [ ] Funciona mas sem resultados

4. **Console do navegador (F12) mostra erros?**
   - [ ] Sim, erros em vermelho
   - [ ] Não, sem erros
   - [ ] Warnings amarelos

5. **Qual navegador está usando?**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Edge
   - [ ] Outro: ___________

6. **Qual URL está acessando?**
   - [ ] http://localhost:5174
   - [ ] http://192.168.1.113:5174
   - [ ] Outra: ___________

---

## 📸 SCREENSHOTS ÚTEIS

Por favor, tire screenshots de:

1. **Console do Navegador (F12)**
   - Aba "Console" com erros (se houver)
   
2. **Network Tab (F12)**
   - Aba "Network" mostrando requisição "buscar"
   - Status code e response

3. **Tela do Site**
   - Como o site está aparecendo

4. **Terminal do Backend**
   - Logs do Flask

5. **Terminal do Frontend**
   - Logs do Vite

---

## ✅ PRÓXIMOS PASSOS

Com base nas suas respostas, posso:

1. Corrigir erro específico do console
2. Ajustar configuração de CORS
3. Corrigir problema de proxy
4. Reinstalar dependências
5. Criar solução alternativa

**Aguardando informações para continuar o diagnóstico...**
