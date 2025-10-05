# 🚀 Como Usar o Ambiente de Desenvolvimento

## ✅ SOLUÇÃO APLICADA

### Problema Identificado:
- **Build antigo** em `static/` com lógica de fallback para dados simulados
- **Variáveis de ambiente** permitindo fallback
- **Uso incorreto** de arquivos estáticos ao invés do dev server

### Correções Aplicadas:

1. ✅ **`.env` atualizado:**
   - `FLIGHT_API_MODE=production` (força dados reais)
   - `FLIGHT_API_ALLOW_FALLBACK=false` (sem fallback)
   - `VITE_ENABLE_FAKE_RESULTS=false` (desabilita simulação)

2. ✅ **Build antigo removido:**
   - Pasta `dist/` limpa
   - Pasta `static/assets/` limpa
   - Arquivo `static/index.html` removido

3. ✅ **Scripts criados:**
   - `start_dev.bat` - Inicia backend + frontend corretamente

---

## 🎯 COMO USAR (MODO CORRETO)

### Opção 1: Script Automático (RECOMENDADO)

```powershell
# Execute este script:
.\start_dev.bat
```

O script vai:
1. ✅ Iniciar o backend Python (porta 5001)
2. ✅ Iniciar o frontend Vite (porta 5173)
3. ✅ Configurar proxy automático para a API

### Opção 2: Manual (Duas Janelas de Terminal)

**Terminal 1 - Backend:**
```powershell
.\.venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

---

## 🌐 ACESSAR O SISTEMA

### ✅ CORRETO:
```
http://localhost:5173
```
- Usa o **Vite Dev Server**
- Proxy configurado para `/api` → `http://localhost:5001`
- Hot reload automático
- Dados **REAIS** da API Amadeus

### ❌ INCORRETO:
```
http://localhost:5001/static/
Abrir index.html diretamente
```
- Usa build estático antigo
- Pode ter lógica de fallback
- Sem hot reload
- Possível dados simulados

---

## 🧪 COMO TESTAR

### 1. Abrir DevTools (F12)

### 2. Ir para Aba "Network" (Rede)

### 3. Fazer uma busca:
- **Origem:** GRU (São Paulo - Guarulhos)
- **Destino:** GIG (Rio de Janeiro - Galeão)
- **Data:** Qualquer data futura (ex: amanhã)

### 4. Verificar na Aba Network:

✅ **Requisição correta:**
```
Request URL: http://localhost:5173/api/busca/buscar
Status: 200 OK
Method: POST
```

✅ **Resposta correta (dados reais):**
```json
{
  "success": true,
  "data": {
    "resultados": [
      {
        "numero_voo": "G3-1234",  // ← Número real
        "companhia": "Gol",
        "origem": "GRU",
        "destino": "GIG",
        // ...
      }
    ]
  }
}
```

❌ **Se ver números como "G31000", "G31001"** = dados simulados (problema!)

---

## 🔧 VERIFICAÇÃO DE CONFIGURAÇÃO

### Verificar que está usando dados REAIS:

```powershell
# Ver configurações do .env
Get-Content .env | Select-String "FLIGHT_API"
```

Deve mostrar:
```
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false
VITE_ENABLE_FAKE_RESULTS=false
```

### Verificar backend rodando:

```powershell
Invoke-WebRequest -Uri "http://localhost:5001/api/health" -UseBasicParsing
```

Deve retornar:
```
StatusCode: 200
```

### Verificar frontend rodando:

```powershell
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

Deve retornar:
```
StatusCode: 200
```

---

## 🐛 PROBLEMAS COMUNS

### "Erro ao buscar voos"

**Solução:**
1. Verificar se backend está rodando:
   ```powershell
   curl http://localhost:5001/api/health
   ```

2. Verificar logs do backend no terminal

3. Verificar credenciais Amadeus no `.env`:
   ```
   AMADEUS_API_KEY=cppo2FiXfoOVQ7jyggpCKl0fG8NYH1Pu
   AMADEUS_API_SECRET=AQlRGZdG1Qm3y74f
   ```

### "Dados simulados aparecendo"

**Solução:**
1. Limpar build antigo:
   ```powershell
   Remove-Item -Recurse -Force dist, static/assets
   ```

2. Reiniciar Vite:
   ```powershell
   npm run dev
   ```

3. Limpar cache do navegador (Ctrl + Shift + Delete)

### "CORS Error"

**Solução:**
- Usar `http://localhost:5173` (com proxy)
- NÃO acessar diretamente `http://localhost:5001`

---

## 📊 CHECKLIST FINAL

Antes de testar, confirme:

- [ ] `.env` com `FLIGHT_API_MODE=production`
- [ ] `.env` com `FLIGHT_API_ALLOW_FALLBACK=false`
- [ ] `.env` com `VITE_ENABLE_FAKE_RESULTS=false`
- [ ] Backend rodando em `http://localhost:5001`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Acessando `http://localhost:5173` (NÃO `static/`)
- [ ] DevTools aberto na aba Network
- [ ] Credenciais Amadeus válidas no `.env`

---

## 🎉 PRONTO!

Agora você está usando o ambiente corretamente com:
- ✅ Dados REAIS da API Amadeus
- ✅ Hot reload automático
- ✅ Proxy configurado
- ✅ Sem fallback para dados simulados

**Acesse:** http://localhost:5173
