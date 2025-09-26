import { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Download, Smartphone, Share, Bell } from 'lucide-react';
import { usePWA } from '../hooks/usePWA.js';

export default function PWAInstallButton() {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isStandalone,
    installApp,
    shareApp,
    requestNotificationPermission,
    sendNotification
  } = usePWA();

  const [isInstalling, setIsInstalling] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        // Mostrar prompt para notificações após instalação
        setShowNotificationPrompt(true);
      }
    } catch (error) {
      console.error('Erro na instalação:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShare = async () => {
    const success = await shareApp();
    if (success) {
      sendNotification('Link copiado!', {
        body: 'O link do ClickPassagens foi copiado para sua área de transferência.',
        tag: 'share-success'
      });
    }
  };

  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendNotification('Notificações ativadas!', {
        body: 'Você receberá alertas sobre as melhores ofertas de milhas.',
        tag: 'notification-enabled'
      });
    }
    setShowNotificationPrompt(false);
  };

  // Se já está instalado como PWA, mostrar indicador
  if (isInstalled || isStandalone) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Smartphone className="h-3 w-3 mr-1" />
          App Instalado
        </Badge>
        {!isOnline && (
          <Badge variant="destructive">
            Offline
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Botão de Instalação */}
      {isInstallable && (
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          variant="outline"
          size="sm"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          {isInstalling ? (
            <>
              <Download className="h-4 w-4 mr-2 animate-pulse" />
              Instalando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Instalar App
            </>
          )}
        </Button>
      )}

      {/* Botão de Compartilhar */}
      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
      >
        <Share className="h-4 w-4 mr-2" />
        Compartilhar
      </Button>

      {/* Prompt para Notificações */}
      {showNotificationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Ativar Notificações?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Receba alertas sobre as melhores ofertas de passagens com milhas diretamente no seu dispositivo.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleNotificationPermission}
                className="flex-1"
              >
                Ativar
              </Button>
              <Button
                onClick={() => setShowNotificationPrompt(false)}
                variant="outline"
                className="flex-1"
              >
                Agora não
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Status Online/Offline */}
      {!isOnline && (
        <Badge variant="destructive" className="ml-2">
          Offline
        </Badge>
      )}
    </div>
  );
}
