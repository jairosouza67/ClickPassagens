import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Componente para gerenciar notificações push do PWA
 */
export default function PushNotifications() {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta notificações
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Verifica se já está inscrito
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeUser = async () => {
    try {
      // Solicita permissão
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        alert('Permissão de notificação negada. Você pode alterar isso nas configurações do navegador.');
        return;
      }

      // Registra para push notifications
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID public key (você precisa gerar isso)
      // Para gerar: https://web.dev/push-notifications-web-push-protocol/
      const vapidPublicKey = 'VAPID_PUBLIC_KEY_AQUI'; // Substituir com sua chave real
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(subscription);

      // Enviar subscription para o backend
      await fetch('https://clickpassagens.onrender.com/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      alert('✅ Notificações ativadas! Você receberá alertas sobre novas ofertas.');

    } catch (error) {
      console.error('Erro ao se inscrever em notificações:', error);
      alert('Erro ao ativar notificações. Tente novamente.');
    }
  };

  const unsubscribeUser = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);

        // Notificar o backend
        await fetch('https://clickpassagens.onrender.com/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });

        alert('✅ Notificações desativadas.');
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      alert('Erro ao desativar notificações.');
    }
  };

  if (!isSupported) {
    return null; // Não exibe o botão se não houver suporte
  }

  return (
    <div className="flex items-center gap-2">
      {subscription ? (
        <Button
          onClick={unsubscribeUser}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <BellOff className="h-4 w-4" />
          <span className="hidden sm:inline">Desativar notificações</span>
        </Button>
      ) : (
        <Button
          onClick={subscribeUser}
          variant="default"
          size="sm"
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Ativar notificações</span>
        </Button>
      )}
    </div>
  );
}
