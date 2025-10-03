# 🔍 GUIA DE DEBUG - ENCONTRAR O PROBLEMA

## ✅ FRONTEND RODANDO
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.113:5173/
```

---

## 📋 SIGA ESTES PASSOS:

### 1. Abra o Navegador
```
Chrome, Firefox ou Edge
```

### 2. Acesse
```
http://localhost:5173
```

### 3. Abra o Console do Desenvolvedor
```
Pressione F12
Ou clique com botão direito → Inspecionar
Vá na aba "Console"
```

### 4. Faça uma Busca
```
Origem: GRU
Destino: GIG
Data de Ida: 2025-10-15
Passageiros: 1
```

### 5. Clique em "Buscar Passagens"

### 6. OBSERVE OS LOGS NO CONSOLE

Você deve ver algo assim:

```javascript
🔍 Iniciando busca...
📍 URL: /api/busca/buscar
📦 Body: {origem: "GRU", destino: "GIG", data_ida: "2025-10-15", ...}
📡 Response status: 200
📡 Response ok: true
📥 Dados recebidos: {success: true, data: {...}}
📥 Success: true
📥 Resultados count: 20
✅ Chamando onSearchSubmit com 20 resultados
🎯 handleBuscaCompleta chamado!
📊 Resultados recebidos: Array(20)
📊 É array? true
📊 Quantidade: 20
✅ Estado atualizado - navegando para resultados
🏁 Busca finalizada
```

---

## 🐛 POSSÍVEIS PROBLEMAS E O QUE FAZER:

### Cenário A: Você vê "❌ Erro na busca"
**Significado:** Requisição falhou

**O que fazer:**
1. Copie a mensagem de erro completa
2. Me envie aqui
3. Veja se aparece erro CORS

### Cenário B: Você vê "⚠️ Nenhum resultado encontrado"
**Significado:** API retornou 0 resultados

**O que fazer:**
1. Verifique se backend está rodando:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5001
   ```
2. Me avise

### Cenário C: Você NÃO vê nenhum log
**Significado:** Código não está executando

**O que fazer:**
1. Verifique se está na aba "Console" (F12)
2. Limpe o console (🚫 clear console)
3. Tente novamente
4. Me diga se ainda não aparece nada

### Cenário D: Logs aparecem mas não navega para resultados
**Significado:** Problema na navegação/estado

**O que fazer:**
1. Me envie screenshot dos logs
2. Veja se aparece "🎯 handleBuscaCompleta chamado!"
3. Veja a quantidade de resultados

---

## 📸 INFORMAÇÕES QUE PRECISO:

Por favor, me envie:

1. **Screenshot do Console (F12)** com todos os logs
2. **Qual mensagem aparece** (se houver erro)
3. **Se navegou para aba "Resultados"** ou ficou na mesma tela
4. **Se apareceu loading** (indicador de carregamento)

---

## 🎯 O QUE ESPERAR:

### ✅ SE FUNCIONAR:
- Logs no console mostrando 20 resultados
- Navegação automática para aba "Resultados"
- Lista de voos aparecendo na tela

### ❌ SE NÃO FUNCIONAR:
- Erro no console em vermelho
- Mensagem de erro na tela
- Ou apenas volta para tela inicial sem fazer nada

---

## 🚀 ACESSO RÁPIDO:

**Frontend:** http://localhost:5173  
**Console:** Pressione F12

**Aguardando você testar e me enviar os logs...** 🔍
