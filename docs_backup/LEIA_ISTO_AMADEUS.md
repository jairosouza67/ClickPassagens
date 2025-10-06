# ⚠️ DADOS DE VOOS - CONFIGURAÇÃO NECESSÁRIA

## 📊 Situação Atual

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Status Atual: ⚠️  DADOS SIMULADOS (Fallback)          │
│                                                         │
│  Motivo: Amadeus API não está configurada              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Quando você faz uma busca de passagens agora:
- ❌ Sistema tenta usar API Amadeus (dados reais)
- ⚠️ Falha (credenciais não configuradas)
- ✅ Retorna dados simulados (fallback)

**Resultado:** Voos são exibidos, mas **NÃO SÃO REAIS**

---

## 🎯 Solução Rápida (5 minutos)

### 📖 Abra um destes guias:

| Arquivo | Descrição | Tempo |
|---------|-----------|-------|
| **`CONFIGURAR_AMADEUS.md`** | ⚡ Guia rápido e direto | 5 min |
| **`GUIA_AMADEUS_API.md`** | 📚 Guia completo e detalhado | 10 min |

### 🚀 Passo a Passo Resumido:

```
1️⃣  Acesse: https://developers.amadeus.com/register
2️⃣  Crie conta GRATUITA (sem cartão)
3️⃣  Crie uma aplicação
4️⃣  Copie: API Key + API Secret
5️⃣  Cole no arquivo .env
6️⃣  Reinicie o backend
7️⃣  Teste: python test_amadeus.py
```

---

## ✨ O que você ganha?

### Comparação:

| Recurso | Dados Simulados ❌ | Dados Reais ✅ |
|---------|-------------------|---------------|
| Companhias | 6-8 fixas | **100+** |
| Preços | Estimados | **Reais** |
| Voos | Fictícios | **Existem** |
| Horários | Aleatórios | **Reais** |
| Custo | Grátis | **Grátis** |
| Limite/mês | Ilimitado | 2.000 |

---

## 📂 Arquivos de Ajuda

Criamos 4 arquivos para facilitar:

```
📄 .env                      ← Variáveis configuradas (precisa das credenciais)
📄 CONFIGURAR_AMADEUS.md     ← ⚡ GUIA RÁPIDO (COMECE AQUI)
📄 GUIA_AMADEUS_API.md       ← 📚 Guia completo
📄 test_amadeus.py           ← 🧪 Script de teste
```

---

## 🧪 Como Testar

Depois de configurar, teste assim:

```bash
# Ativar ambiente virtual
.\.venv\Scripts\Activate.ps1

# Executar teste
python test_amadeus.py
```

**Resultado esperado:**
```
✅ Token obtido com sucesso!
✅ 10 voo(s) encontrado(s)!
🎉 SUCESSO! A API Amadeus está configurada corretamente!
```

---

## ❓ FAQ Rápido

**P: É pago?**  
R: NÃO! 100% gratuito (2.000 buscas/mês)

**P: Precisa de cartão?**  
R: NÃO! Apenas email para cadastro

**P: Quanto tempo leva?**  
R: ~5 minutos seguindo o guia

**P: E se eu não configurar?**  
R: Sistema continua funcionando, mas com dados simulados

**P: Os dados simulados são realistas?**  
R: SIM! São bem próximos da realidade, mas não são reais

---

## 🎯 Próximo Passo

### 👉 Abra agora: `CONFIGURAR_AMADEUS.md`

Ou clique aqui (se estiver no VSCode):  
[→ Abrir Guia de Configuração](./CONFIGURAR_AMADEUS.md)

---

**Dúvidas?** Todos os guias têm informações completas e troubleshooting!
