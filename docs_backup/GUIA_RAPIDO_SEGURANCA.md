# 🔐 GUIA RÁPIDO: Revogar Credenciais Expostas

## ⏱️ Tempo: 5 minutos | Prioridade: 🔴 CRÍTICA

---

## 🎯 PASSO A PASSO

### PASSO 1: Revogar Amadeus (2 min)

```
1. Abra: https://developers.amadeus.com/my-apps
2. Faça login
3. Encontre sua aplicação
4. Clique em "Delete" ou "Regenerate Keys"
5. Confirme
```

**✅ Pronto! Credenciais antigas revogadas.**

---

### PASSO 2: Criar Novas Credenciais (2 min)

```
1. Ainda em https://developers.amadeus.com/my-apps
2. Crie nova aplicação (ou use a mesma)
3. Copie:
   - Client ID (API Key)
   - Client Secret
```

**✅ Pronto! Novas credenciais criadas.**

---

### PASSO 3: Atualizar .env Local (1 min)

```bash
# Abra o arquivo .env (NÃO .env.example)
# Cole suas NOVAS credenciais:

AMADEUS_API_KEY=SUA_NOVA_API_KEY_AQUI
AMADEUS_API_SECRET=SEU_NOVO_SECRET_AQUI
```

**⚠️ IMPORTANTE:** NÃO commite o arquivo `.env`!

**✅ Pronto! Arquivo atualizado.**

---

### PASSO 4: Testar (1 min)

```bash
# Teste se funciona
python test_amadeus.py
```

**Deve aparecer:**
```
✅ Token obtido com sucesso
✅ Busca retornou 20 resultados
```

**✅ Pronto! Tudo funcionando.**

---

## ✅ CHECKLIST RÁPIDO

- [ ] Acessei developers.amadeus.com
- [ ] Revoquei credenciais antigas
- [ ] Criei novas credenciais
- [ ] Atualizei arquivo `.env`
- [ ] Testei com `python test_amadeus.py`
- [ ] Funcionou! ✓

---

## ❓ DÚVIDAS COMUNS

### "Onde fica o arquivo .env?"
```
ClickPassagens/
├── .env          ← ESTE ARQUIVO (edite aqui)
├── .env.example  ← Template (NÃO edite)
└── ...
```

### "Posso commitar o .env?"
**NÃO!** ❌ Nunca! O `.gitignore` já protege, mas verifique:
```bash
git status
# .env NÃO deve aparecer
```

### "E o Firebase?"
Por enquanto está protegido por regras. Veja `SECURITY_ALERT.md` para melhorar.

---

## 🆘 PRECISA DE AJUDA?

- **Amadeus:** https://developers.amadeus.com/support
- **Documentação:** `SECURITY_ALERT.md`

---

**Boa sorte! 🚀**
