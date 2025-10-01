# 🔧 Guia de Configuração - Features Avançadas

## 📊 Google Analytics

### 1. Criar Propriedade GA4

1. Acesse: https://analytics.google.com/
2. Clique em **Admin** (canto inferior esquerdo)
3. Clique em **+ Create Property**
4. Preencha:
   - **Property name:** ClickPassagens
   - **Timezone:** (GMT-03:00) Brasília
   - **Currency:** Brazilian Real (R$)
5. Clique em **Next**
6. Selecione **Business category:** Travel
7. Clique em **Create**
8. Aceite os termos

### 2. Obter Measurement ID

1. Em **Admin → Data Streams**
2. Clique em **Add stream → Web**
3. Preencha:
   - **Website URL:** https://clickpassagens.me
   - **Stream name:** ClickPassagens Website
4. Clique em **Create stream**
5. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 3. Adicionar ao Projeto

Edite o arquivo: `src/hooks/useGoogleAnalytics.js`

```javascript
// Linha 4: Substitua pelo seu Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← Cole seu ID aqui
```

---

## 🔔 Push Notifications (Web Push)

### 1. Gerar VAPID Keys

Execute no terminal:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Ou use online: https://web-push-codelab.glitch.me/

Você receberá:
```
Public Key: BEL...abc123
Private Key: xyz...789
```

### 2. Adicionar Public Key no Frontend

Edite: `src/components/PushNotifications.jsx`

```javascript
// Linha 63: Substitua pela sua Public Key
const vapidPublicKey = 'BEL...abc123'; // ← Cole sua chave pública aqui
```

### 3. Criar Endpoint no Backend

Adicione em `main.py`:

```python
from pywebpush import webpush, WebPushException
import json

# Suas VAPID Keys
VAPID_PRIVATE_KEY = "xyz...789"
VAPID_PUBLIC_KEY = "BEL...abc123"
VAPID_CLAIMS = {
    "sub": "mailto:contato@clickpassagens.me"
}

# Armazenar subscriptions (use banco de dados em produção)
subscriptions = []

@app.route('/api/push/subscribe', methods=['POST'])
def push_subscribe():
    subscription = request.json
    subscriptions.append(subscription)
    return jsonify({"success": True})

@app.route('/api/push/unsubscribe', methods=['POST'])
def push_unsubscribe():
    endpoint = request.json.get('endpoint')
    subscriptions[:] = [s for s in subscriptions if s.get('endpoint') != endpoint]
    return jsonify({"success": True})

@app.route('/api/push/send', methods=['POST'])
def push_send():
    """Enviar notificação para todos os inscritos"""
    data = request.json
    message = data.get('message', 'Nova oferta disponível!')
    
    for subscription in subscriptions:
        try:
            webpush(
                subscription_info=subscription,
                data=json.dumps({
                    "title": "ClickPassagens",
                    "body": message,
                    "url": "https://clickpassagens.me"
                }),
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
        except WebPushException as e:
            print(f"Erro ao enviar push: {e}")
    
    return jsonify({"success": True, "sent": len(subscriptions)})
```

### 4. Instalar Dependências

```bash
pip install pywebpush
```

Adicione em `requirements.txt`:
```
pywebpush==1.14.0
```

---

## 🎨 Personalizar Cores do Tema PWA

### 1. Editar manifest.json

Já configurado com:
- **theme_color:** `#3B82F6` (Azul principal)
- **background_color:** `#ffffff` (Fundo branco)

### 2. Personalizar Cores

Edite `manifest.json`:

```json
{
  "theme_color": "#3B82F6",        // Cor da barra de status (Android)
  "background_color": "#ffffff",   // Cor da splash screen
  // ...
}
```

### 3. Cores Disponíveis no Projeto

- **Azul Principal:** `#3B82F6` (aviation-blue)
- **Dourado:** `#FFD700` (aviation-gold)
- **Roxo:** `#8B5CF6`
- **Verde:** `#10B981`

---

## 📱 Testar Push Notifications Localmente

### 1. Permitir HTTPS Local (opcional)

```bash
npm install -g mkcert
mkcert -install
mkcert localhost
```

### 2. Testar Notificação

No console do navegador (F12):

```javascript
// Verificar se está registrado
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(sub => {
    console.log('Subscription:', sub);
  });
});

// Enviar notificação de teste
navigator.serviceWorker.ready.then(registration => {
  registration.showNotification('Teste', {
    body: 'Notificação de teste!',
    icon: '/icon-192x192.png'
  });
});
```

---

## 🎯 Eventos Rastreados (Google Analytics)

### Eventos Automáticos:
- ✅ Page views (mudança de rota)
- ✅ Tab changes (troca de abas)

### Eventos Customizados Implementados:
- 🔍 `search_flights` - Busca de passagens
- ✈️ `view_flight_result` - Visualização de resultado
- 💳 `select_plan` - Seleção de plano
- 📧 `request_quote` - Solicitação de orçamento
- 📱 `install_pwa` - Instalação do PWA
- 🔔 `enable_notifications` - Ativação de notificações
- 🔗 `share` - Compartilhamento

### Como Usar nos Componentes:

```javascript
import { analytics } from './hooks/useGoogleAnalytics';

// Exemplo: Rastrear clique em plano
const handleSelectPlan = (plan) => {
  analytics.selectPlan(plan.nome, plan.preco);
};
```

---

## ✅ Checklist de Implementação

### Google Analytics:
- [ ] Criar propriedade GA4
- [ ] Obter Measurement ID
- [ ] Adicionar ID em `useGoogleAnalytics.js`
- [ ] Testar no Google Analytics Real-Time

### Push Notifications:
- [ ] Gerar VAPID keys
- [ ] Adicionar public key no frontend
- [ ] Implementar endpoints no backend
- [ ] Instalar pywebpush
- [ ] Testar notificação

### Cores do Tema:
- [x] Configurado no manifest.json
- [x] Ícones criados
- [x] Splash screen configurada

---

## 🚀 Deploy

Após configurar:

```bash
# Frontend
git add .
git commit -m "feat: Add Google Analytics and Push Notifications"
git push origin master

# Backend (se modificou)
# O Render vai fazer deploy automaticamente via GitHub
```

---

## 📊 Monitorar Analytics

- **Real-Time:** https://analytics.google.com/ → Reports → Realtime
- **Events:** Reports → Events
- **Users:** Reports → User → User attributes

---

## 🆘 Troubleshooting

### Notificações não aparecem:
1. Verifique permissões no navegador
2. Teste em HTTPS (localhost não funciona para push)
3. Verifique console do browser (F12)

### Analytics não rastreia:
1. Verifique se o Measurement ID está correto
2. Use bloqueador de ads desabilitado
3. Aguarde 24h para dados aparecerem (Real-Time é imediato)

### Service Worker não atualiza:
1. Desregistrar: Application → Service Workers → Unregister
2. Limpar cache: Application → Clear storage
3. Recarregar com Ctrl+Shift+R

---

**Documentação oficial:**
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Web Push](https://web.dev/push-notifications-overview/)
- [PWA Manifest](https://web.dev/add-manifest/)
