# ⚠️ PROBLEMA IDENTIFICADO: Credenciais Amadeus Inválidas

## Data: 03/10/2025
## Status: ❌ BLOQUEADO

---

## Problema

A pesquisa de passagens não está retornando nenhum resultado porque **as credenciais da API Amadeus estão inválidas**.

### Erro Técnico:
```
401 - {
    "error":"invalid_client",
    "error_description": "Client credentials are invalid",
    "code": 38187
}
```

### Credenciais Atuais (INVÁLIDAS):
- **API Key:** `AoATfe0sPMzg72ncrmG9bt9tcGUnN2VP`
- **API Secret:** `hQA70UwEupt7yl8r`
- **Endpoint:** `https://test.api.amadeus.com`

---

## Causa Raiz

Possíveis causas para credenciais inválidas:

1. ✅ **Credenciais expostas publicamente** → Amadeus pode ter revogado automaticamente
2. **Credenciais digitadas incorretamente** → Verificar espaços ou caracteres extras
3. **Credenciais para ambiente errado** → Produção vs Teste
4. **Aplicativo deletado/desativado** no portal Amadeus
5. **Credenciais expiradas** → Verificar validade no portal

---

## Solução

### 1. Acessar Portal Amadeus
👉 https://developers.amadeus.com/my-apps

### 2. Verificar Status da Aplicação
- ✅ Confirmar se o app "ClickPassagens" está ativo
- ✅ Verificar ambiente (Test vs Production)

### 3. Gerar Novas Credenciais

**Opção A: Usar o mesmo app (se existir)**
1. Login no portal Amadeus
2. Ir em "My Apps"
3. Selecionar "ClickPassagens" (ou criar novo)
4. Clicar em "Reset API Secret" ou "Regenerate Credentials"
5. Copiar novas credenciais

**Opção B: Criar novo app**
1. Clicar em "Create New App"
2. Nome: `ClickPassagens`
3. Descrição: `Sistema de busca de passagens com milhas`
4. Selecionar APIs necessárias:
   - ✅ Flight Offers Search
   - ✅ Flight Offers Price
   - ✅ Flight Create Orders (opcional)
5. Ambiente: **Self-Service** (Test)
6. Gerar credenciais

### 4. Atualizar .env

Após obter novas credenciais válidas:

```bash
AMADEUS_API_KEY=<NOVA_API_KEY_AQUI>
AMADEUS_API_SECRET=<NOVO_API_SECRET_AQUI>
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

### 5. Testar Novamente

```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" test_amadeus.py
```

Se o teste passar, reiniciar o backend:
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
```

---

## Workaround Temporário

**Enquanto as credenciais não forem corrigidas**, o fallback está ATIVADO:

```env
FLIGHT_API_ALLOW_FALLBACK=true
```

Isso significa que o site irá:
- ✅ Tentar buscar da API Amadeus primeiro
- ⚠️ Se falhar, usar dados simulados realistas
- ℹ️ Exibir banner informando que são dados de demonstração

**Para desativar dados simulados após corrigir credenciais:**
```env
FLIGHT_API_ALLOW_FALLBACK=false
```

---

## Comandos Úteis

### Testar credenciais:
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" test_amadeus.py
```

### Verificar configuração atual:
```powershell
Get-Content .env | Select-String -Pattern "AMADEUS"
```

### Logs do backend:
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
```

---

## Próximos Passos

1. ⚠️ **URGENTE:** Obter credenciais válidas do Amadeus
2. Atualizar `.env` com novas credenciais
3. Executar `test_amadeus.py` para validar
4. Desativar fallback (`FLIGHT_API_ALLOW_FALLBACK=false`)
5. Reiniciar backend
6. Testar busca real no site

---

## Segurança

⚠️ **LEMBRETE:** As credenciais antigas foram expostas nesta conversa e devem ser:
1. Deletadas do portal Amadeus (se possível)
2. Substituídas por novas
3. Mantidas SECRETAS (nunca comitar no Git)

---

**Status Atual:** Sistema funcionando com dados simulados (fallback ativo)  
**Bloqueio:** Aguardando credenciais válidas do Amadeus para dados reais
