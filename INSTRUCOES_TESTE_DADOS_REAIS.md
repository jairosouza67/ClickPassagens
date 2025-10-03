# 🔍 INSTRUÇÕES DE TESTE - Dados Reais da Amadeus

## ✅ CONFIRMAÇÃO: A API ESTÁ RETORNANDO DADOS REAIS!

Teste realizado via curl mostrou que o backend está funcionando perfeitamente:

```json
{
  "voo_numero": "2044",  // ✅ VOO REAL (Gol 2044)
  "preco_dinheiro": 103.39,  // ✅ PREÇO REAL
  "companhia": { "codigo": "G3", "nome": "Gol" }
}
```

---

## 🧪 COMO TESTAR NO NAVEGADOR

### Passo 1: Abrir DevTools
1. Abra: **http://localhost:5173**
2. Pressione **F12** para abrir DevTools
3. Vá para aba **Console**

### Passo 2: Fazer uma Busca
1. Preencha o formulário:
   - **Origem:** GRU (São Paulo - Guarulhos)
   - **Destino:** GIG (Rio de Janeiro - Galeão)  
   - **Data de ida:** 15/10/2025 (qualquer data futura)
   - **Passageiros:** 1
   - **Classe:** Econômica

2. Clique em **"Buscar Voos"**

### Passo 3: Verificar no Console
Você deve ver:

```javascript
// ✅ CORRETO - Requisição sendo feita:
Fazendo requisição para: http://localhost:5001/api/busca/buscar

// ✅ CORRETO - Dados recebidos:
Dados recebidos: { success: true, data: { resultados: [...] } }

// ✅ CORRETO - Resultados processados:
Resultados processados: [
  {
    voo_numero: "2044",  // ← REAL (não G31000)
    preco_dinheiro: 103.39,  // ← REAL (não R$ 315.00)
    companhia: { codigo: "G3", nome: "Gol" }
  },
  // ... mais voos
]
```

### Passo 4: Verificar na Tela
Os cartões de voos devem mostrar:

✅ **DADOS REAIS (correto):**
- Voo: **G3-2044**, **LA-3340**, **G3-1922**
- Preço: **R$ 103,39**, **R$ 211,72**
- Horários: 06:00, 09:30, 14:00 (variados)

❌ **DADOS SIMULADOS (errado - não deve aparecer):**
- Voo: **G31000**, **G31100**, **AD2000**
- Preço: **R$ 315,00**, **R$ 450,00** (valores redondos)
- Horários: sempre 06:00, 08:00, 10:00

---

## 🔍 VERIFICAÇÃO NO NETWORK

1. **Aba Network** (DevTools)
2. Procure requisição: **buscar**
3. Clique nela
4. Veja a **Response**:

```json
{
  "success": true,
  "data": {
    "busca_id": 65,
    "resultados": [
      {
        "voo_numero": "2044",  // ← VOO REAL
        "preco_dinheiro": 103.39,  // ← PREÇO REAL
        "horario_saida": "06:00",
        "horario_chegada": "07:05",
        "companhia": {
          "codigo": "G3",
          "nome": "Gol"
        }
      }
    ]
  }
}
```

---

## ⚠️ SE AINDA VIR DADOS SIMULADOS

### Problema: Cache do Navegador

**Solução 1: Hard Refresh**
- Windows: `Ctrl + Shift + R` ou `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Solução 2: Limpar Cache**
1. Abrir DevTools (F12)
2. Clique com botão direito no ícone de **Reload** (atualizar página)
3. Selecione **"Empty Cache and Hard Reload"**

**Solução 3: Modo Anônimo**
1. Abra uma janela anônima/privada
2. Acesse: http://localhost:5173
3. Faça a busca

---

## 📊 TESTE DIRETO NA API

Para confirmar 100% que a API está funcionando:

```powershell
# PowerShell - Testar API diretamente
Invoke-WebRequest -Method POST `
  -Uri 'http://localhost:5001/api/busca/buscar' `
  -ContentType 'application/json' `
  -Body '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1,"usuario_id":1}' `
  -UseBasicParsing
```

Você deve ver na resposta:
```json
"voo_numero": "2044"  // ← VOO REAL
"preco_dinheiro": 103.39  // ← PREÇO REAL
```

---

## ✅ CHECKLIST

Marque conforme verifica:

### Backend
- [x] Servidor rodando na porta 5001
- [x] API Amadeus retornando dados reais
- [x] Teste curl mostra voos reais (G3-2044)
- [x] Preços específicos (R$ 103.39)

### Frontend  
- [ ] Acessando http://localhost:5173
- [ ] DevTools aberto (F12)
- [ ] Console mostra requisição para /api/busca/buscar
- [ ] Console mostra voos reais (não G31000)
- [ ] Tela mostra voos com números reais
- [ ] Preços são específicos (não valores redondos)

---

## 🎯 RESULTADO ESPERADO

Quando tudo estiver correto, você verá na tela:

```
┌─────────────────────────────────────────┐
│ GOL - Voo G3-2044                       │
│ 06:00 ──────► 07:05                    │
│ GRU           GIG                       │
│                                         │
│ 💰 R$ 103,39  ✈️ 5.169 milhas         │
│ 💵 Economia: R$ 25,85                  │
│ ✓ Voo direto · 1h5min                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ LATAM - Voo LA-3340                     │
│ 07:00 ──────► 08:00                    │
│ GRU           GIG                       │
│                                         │
│ 💰 R$ 211,72  ✈️ 10.586 milhas        │
│ 💵 Economia: R$ 52,93                  │
│ ✓ Voo direto · 1h                      │
└─────────────────────────────────────────┘
```

**NÃO deve aparecer:**
- Voos G31000, G31100, AD2000 (números gerados)
- Preços R$ 315,00, R$ 450,00 (valores redondos)

---

## 🆘 SUPORTE

Se mesmo após limpar cache ainda vir dados simulados:

1. **Verificar arquivo servido:**
   ```powershell
   # Ver data do arquivo
   Get-Item static/assets/index-*.js | Select-Object Name, LastWriteTime
   ```

2. **Forçar rebuild:**
   ```powershell
   npm run build
   Copy-Item -Recurse -Force dist/* static/
   ```

3. **Reiniciar servidores:**
   ```powershell
   # Parar tudo
   Get-Process python,node -ErrorAction SilentlyContinue | Stop-Process -Force
   
   # Iniciar backend
   python main.py
   
   # Iniciar frontend
   npm run dev
   ```

---

## ✨ STATUS ATUAL

✅ **Backend:** Funcionando - Retorna dados REAIS da Amadeus  
✅ **API:** Teste confirmado - Voos G3-2044, LA-3340 (reais)  
⚠️ **Frontend:** Cache limpo - Pronto para teste no navegador

**Abra http://localhost:5173 e teste agora!** 🚀
