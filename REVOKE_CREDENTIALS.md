# ⚠️ IMPORTANTE: CREDENCIAIS EXPOSTAS - AÇÃO NECESSÁRIA

## 🔥 AÇÃO IMEDIATA REQUERIDA

Suas credenciais da API Amadeus foram expostas neste repositório e **DEVEM** ser revogadas imediatamente.

### Credenciais Expostas (NÃO USE MAIS):
- API Key: `VJeodXGsEmTrl3Uo9Aels8pp1AFKDVxD` ❌
- API Secret: `N3oIh3zf8qnPsWbc` ❌

---

## 📝 O QUE FAZER AGORA (5 minutos)

### 1. Revogar Credenciais Antigas
1. Acesse: https://developers.amadeus.com/my-apps
2. Faça login
3. Encontre sua aplicação
4. **Delete** ou **Regenerate** as credenciais antigas

### 2. Criar Novas Credenciais
1. Crie uma nova aplicação (ou use a mesma)
2. Copie a nova API Key e Secret
3. Atualize seu arquivo `.env` LOCAL:

```bash
# Arquivo: .env (NÃO COMMITAR!)
AMADEUS_API_KEY=sua_nova_chave_aqui
AMADEUS_API_SECRET=seu_novo_secret_aqui
```

### 3. Testar
```bash
# Teste se está funcionando
python test_amadeus.py
```

---

## ✅ Arquivos Corrigidos

- ✅ `SOLUCAO_COMPLETA.md` - Credenciais removidas
- ✅ `SOLUCAO_FINAL.md` - Credenciais removidas  
- ✅ `VERIFICACAO_CONFIGURACAO.md` - Credenciais removidas
- ✅ `.env.example` - Criado com placeholders seguros

---

## 🛡️ Para Prevenir no Futuro

1. **NUNCA** adicione `.env` ao Git:
   ```bash
   # Verificar se .env está sendo ignorado
   git check-ignore .env  # Deve retornar: .env
   ```

2. **SEMPRE** use `.env.example`:
   ```bash
   # Template sem credenciais reais
   cp .env.example .env
   ```

3. **SEMPRE** use variáveis de ambiente:
   ```python
   # ✅ CORRETO
   api_key = config('AMADEUS_API_KEY')
   
   # ❌ ERRADO
   api_key = "VJeodXGsEmTrl3Uo9Aels8pp1AFKDVxD"
   ```

---

## 📖 Leia Mais

Detalhes completos em: **[SECURITY_ALERT.md](./SECURITY_ALERT.md)**

---

**Tempo necessário:** 5-10 minutos  
**Prioridade:** 🔴 CRÍTICA  
**Data:** 03/10/2025
