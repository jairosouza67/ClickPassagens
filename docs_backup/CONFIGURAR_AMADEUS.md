# 🔧 Configuração Pendente - Dados Reais de Voos

## ⚠️ SITUAÇÃO ATUAL

**Status:** Sistema funcionando com **dados simulados** (fallback)

**Motivo:** API Amadeus não está configurada

---

## 📊 O que está acontecendo agora?

Quando você faz uma busca de passagens, o sistema:

1. ❌ Tenta buscar dados reais na API Amadeus
2. ⚠️ Falha (credenciais não configuradas)
3. ✅ Usa dados simulados realistas (fallback)

**Resultado:** Você vê voos, mas os dados **NÃO SÃO REAIS**.

---

## ✅ Como Ativar Dados REAIS (100% Gratuito)

### Tempo necessário: ~5 minutos

### Passo 1: Criar Conta Amadeus (1 min)

1. Acesse: **https://developers.amadeus.com/register**
2. Preencha:
   - Nome
   - Email
   - Senha
   - País: **Brasil**
3. Confirme o email

### Passo 2: Criar Aplicação (2 min)

1. Login: **https://developers.amadeus.com/signin**
2. Clique: **"My Self-Service Workspace"**
3. Clique: **"Create new app"**
4. Preencha:
   - **App Name:** ClickPassagens
   - **Description:** Sistema de busca de passagens
   - **Real-time Flight Search:** ✅ **MARQUE ESTA OPÇÃO**
5. Clique: **"Create"**

### Passo 3: Copiar Credenciais (30 seg)

Após criar, você verá:

```
API Key: xxxxxxxxxxxxxxxxxxx
API Secret: yyyyyyyyyyyyyyyy
```

**Copie ambos!**

### Passo 4: Configurar no Projeto (1 min)

1. Abra o arquivo **`.env`** (na raiz do projeto)
2. Encontre estas linhas:

```env
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here
```

3. **Substitua** pelos valores que você copiou:

```env
AMADEUS_API_KEY=sua_api_key_copiada_aqui
AMADEUS_API_SECRET=seu_api_secret_copiado_aqui
```

4. **Salve o arquivo** (Ctrl+S)

### Passo 5: Reiniciar Backend (30 seg)

1. Vá no terminal onde o backend está rodando
2. Pressione **Ctrl+C** (para parar)
3. Execute novamente:

```bash
.\.venv\Scripts\Activate.ps1
python main.py
```

---

## 🧪 Testar se Funcionou

### Opção 1 - Via Script de Teste

```bash
.\.venv\Scripts\Activate.ps1
python test_amadeus.py
```

**Resultado esperado:**
```
✅ Token obtido com sucesso!
✅ X voo(s) encontrado(s)!
🎉 SUCESSO! A API Amadeus está configurada corretamente!
```

### Opção 2 - Via Interface Web

1. Acesse: **http://localhost:5173**
2. Faça uma busca:
   - Origem: **GRU**
   - Destino: **GIG**
   - Data: Qualquer data futura
3. Abra o Console do navegador (F12)
4. Procure por:

**Se FUNCIONOU (dados reais):**
```
✅ Amadeus Response Status: 200
✅ Amadeus Response Data: X offers encontradas
```

**Se NÃO funcionou (ainda usando fallback):**
```
⚠️ Credenciais Amadeus NÃO configuradas!
⚠️ Usando dados de fallback realistas
```

---

## 🎁 O que você ganha com Dados REAIS?

| Recurso | Dados Simulados | Dados Reais (Amadeus) |
|---------|-----------------|----------------------|
| **Companhias** | 6-8 fixas | 100+ companhias |
| **Preços** | Estimados | **Reais e atualizados** |
| **Voos** | Fictícios | **Existem de verdade** |
| **Horários** | Aleatórios | **Reais** |
| **Disponibilidade** | Sempre | **Baseada em estoque real** |
| **Custo** | Grátis | **Grátis** (2.000/mês) |

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **GUIA_AMADEUS_API.md** - Guia completo e detalhado
- **test_amadeus.py** - Script de teste
- **Amadeus Docs:** https://developers.amadeus.com/docs

---

## ❓ Problemas Comuns

### "Erro ao obter token: 401"

**Solução:** Credenciais incorretas
- Copie novamente do painel Amadeus
- Verifique se não há espaços extras
- Cole novamente no `.env`

### "Ainda usando dados de fallback"

**Solução:**
1. Verifique se o arquivo `.env` foi salvo
2. Reinicie o backend
3. Execute o teste: `python test_amadeus.py`

### "Nenhum voo encontrado"

**Solução:**
- Use códigos IATA corretos (GRU, GIG, etc.)
- Data deve ser futura
- Tente rotas diferentes

---

## 🎯 Próximos Passos

1. [ ] Criar conta Amadeus
2. [ ] Criar aplicação
3. [ ] Copiar credenciais
4. [ ] Editar `.env`
5. [ ] Reiniciar backend
6. [ ] Testar com `python test_amadeus.py`
7. [ ] Verificar no frontend
8. [ ] ✅ Comemorar! 🎉

---

## ⏱️ Resumo

- **Tempo total:** ~5 minutos
- **Custo:** R$ 0,00 (100% gratuito)
- **Benefício:** Dados REAIS de voos
- **Limite mensal:** 2.000 buscas gratuitas

---

**Está com dúvidas?** Leia o **GUIA_AMADEUS_API.md** (guia completo com mais detalhes)
