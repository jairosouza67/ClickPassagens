# 🔑 CONFIGURAR API AMADEUS PARA DADOS REAIS

## 🎯 Objetivo
Configurar credenciais Amadeus para buscar voos **REAIS** com preços e disponibilidade atualizados.

---

## 📋 PASSO 1: Criar Conta Amadeus (GRATUITO)

### 1️⃣ Acesse o Portal de Desenvolvedores

👉 **https://developers.amadeus.com/register**

### 2️⃣ Preencha o Cadastro

- **Email:** seu_email@gmail.com
- **Nome:** Seu Nome
- **Empresa:** ClickPassagens (ou sua empresa)
- **País:** Brasil
- **Finalidade:** Flight Search Application

### 3️⃣ Confirme o Email

Verifique sua caixa de entrada e clique no link de confirmação.

---

## 📋 PASSO 2: Criar Aplicação

### 1️⃣ Faça Login

👉 **https://developers.amadeus.com/signin**

### 2️⃣ Acesse "My Self-Service Workspace"

No painel, clique em **"Create New App"**

### 3️⃣ Preencha os Dados do App

- **App Name:** ClickPassagens
- **App Type:** Flight Search
- **Description:** Sistema de busca e comparação de passagens aéreas

### 4️⃣ Selecione APIs

Marque as APIs que você vai usar:
- ✅ **Flight Offers Search** (essencial)
- ✅ **Flight Inspiration Search** (opcional)
- ✅ **Airport & City Search** (recomendado)

### 5️⃣ Clique em "Create"

---

## 📋 PASSO 3: Copiar Credenciais

Após criar o app, você verá:

```
API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API Secret: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### ⚠️ IMPORTANTE:
- **API Key** e **API Secret** aparecem **UMA VEZ APENAS**
- **Copie e guarde** em local seguro
- Se perder, precisará gerar novas credenciais

---

## 📋 PASSO 4: Configurar no Render

### 1️⃣ Acesse Render Dashboard

👉 **https://dashboard.render.com/**

### 2️⃣ Selecione Seu Serviço

Clique em **"clickpassagens-api"**

### 3️⃣ Vá em "Environment"

No menu lateral esquerdo, clique em **"Environment"**

### 4️⃣ Adicione as Variáveis

Clique em **"Add Environment Variable"** e adicione **TODAS** estas:

#### Variável 1:
```
Key:   AMADEUS_API_KEY
Value: sua_api_key_copiada_do_amadeus
```

#### Variável 2:
```
Key:   AMADEUS_API_SECRET
Value: seu_api_secret_copiado_do_amadeus
```

#### Variável 3:
```
Key:   AMADEUS_BASE_URL
Value: https://test.api.amadeus.com
```

#### Variável 4:
```
Key:   FLIGHT_API_MODE
Value: production
```

#### Variável 5 (Opcional - para não estourar limites):
```
Key:   FLIGHT_API_ALLOW_FALLBACK
Value: true
```

⚠️ **ATENÇÃO:** Use `https://test.api.amadeus.com` primeiro (ambiente de teste - GRATUITO com 2000 chamadas/mês)

Quando estiver pronto para produção, mude para:
```
AMADEUS_BASE_URL: https://api.amadeus.com
```

### 5️⃣ Salvar

Clique em **"Save Changes"**

O Render vai fazer **redeploy automático** (2-3 minutos)

---

## 📋 PASSO 5: Testar

Após o redeploy completar:

### 1️⃣ Aguarde 3 minutos

### 2️⃣ Acesse seu site

👉 **https://clickpassagens.me**

### 3️⃣ Faça uma busca

Exemplo:
- **Origem:** GRU (São Paulo)
- **Destino:** GIG (Rio de Janeiro)
- **Data Ida:** Qualquer data futura
- **Passageiros:** 1

### 4️⃣ Veja Resultados REAIS!

Você verá:
- ✅ Voos com preços reais
- ✅ Horários atualizados
- ✅ Companhias aéreas reais
- ✅ Escalas e durações precisas

---

## 📊 Limites do Plano Gratuito Amadeus

### Test Environment (RECOMENDADO para começar)
- ✅ **2.000 chamadas/mês** GRÁTIS
- ✅ Dados reais de teste
- ✅ Mesma estrutura da API de produção
- ✅ Ideal para desenvolvimento

### Production Environment (quando escalar)
- 💰 Pago por uso
- ✅ Dados 100% em tempo real
- ✅ Sem limites
- ✅ SLA garantido

---

## 🔧 Variáveis Opcionais Úteis

### Para melhor controle de erros:
```
FLIGHT_API_ALLOW_FALLBACK=true
```
☝️ Se a API Amadeus falhar (limite estourado, API fora do ar), usa dados simulados temporariamente

### Para limitar cache:
```
AMADEUS_RATE_LIMIT_ALERT_THRESHOLD=100
```
☝️ Avisa quando estiver perto do limite mensal

---

## 🎯 Resumo - Checklist

- [ ] Criar conta Amadeus: https://developers.amadeus.com/register
- [ ] Confirmar email
- [ ] Criar app no painel
- [ ] Copiar API Key e API Secret
- [ ] Adicionar `AMADEUS_API_KEY` no Render
- [ ] Adicionar `AMADEUS_API_SECRET` no Render
- [ ] Adicionar `AMADEUS_BASE_URL` no Render
- [ ] Adicionar `FLIGHT_API_MODE=production` no Render
- [ ] Salvar e aguardar redeploy (3 min)
- [ ] Testar busca no site
- [ ] Comemorar! 🎉

---

## 🆘 Problemas Comuns

### "API Key inválida"
- ✅ Verifique se copiou corretamente (sem espaços)
- ✅ Confirme que criou o app no Amadeus
- ✅ Certifique-se que confirmou o email

### "Rate limit exceeded"
- ✅ Você atingiu 2000 chamadas no mês
- ✅ Espere próximo mês OU
- ✅ Configure `FLIGHT_API_ALLOW_FALLBACK=true` para usar dados simulados temporariamente

### "No results found"
- ✅ Tente rotas mais populares (GRU-GIG, SAO-RIO)
- ✅ Verifique se a data está no futuro
- ✅ Teste em horário comercial

---

## 📞 Suporte

**Documentação Amadeus:**
https://developers.amadeus.com/self-service/category/flights

**Portal de Desenvolvedores:**
https://developers.amadeus.com/my-apps

---

## 🚀 Próximos Passos

Depois de configurar:

1. **Teste diferentes rotas**
2. **Monitore uso** no painel Amadeus
3. **Ajuste fallback** se necessário
4. **Quando crescer**, migre para Production API

**Me avise quando criar a conta Amadeus!** Vou te ajudar a configurar! 🎯
