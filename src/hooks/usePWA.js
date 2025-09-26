import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado com sucesso: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW falhou ao registrar: ', registrationError);
          });
      });
    }

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Previne o prompt automático
      e.preventDefault();
      // Salva o evento para ser usado depois
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA foi instalado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    // Mostra o prompt de instalação
    deferredPrompt.prompt();

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o PWA');
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    } else {
      console.log('Usuário rejeitou instalar o PWA');
      return false;
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ClickPassagens - Busca de Passagens com Milhas',
          text: 'Encontre as melhores passagens com milhas e economize até 70%!',
          url: window.location.href,
        });
        return true;
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        return false;
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          return true;
        } catch (error) {
          console.log('Erro ao copiar para clipboard:', error);
          return false;
        }
      }
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const sendNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  };

  const isOnline = navigator.onLine;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isStandalone,
    installApp,
    shareApp,
    requestNotificationPermission,
    sendNotification
  };
};
