import { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Download, Smartphone, Share } from 'lucide-react';
import { usePWA } from '../hooks/usePWA.js';

export default function PWAInstallButton() {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isStandalone,
    installApp,
    shareApp,
    sendNotification
  } = usePWA();

  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Erro na instalação:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShare = async () => {
    await shareApp();
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

      {/* Indicador de Status Online/Offline */}
      {!isOnline && (
        <Badge variant="destructive" className="ml-2">
          Offline
        </Badge>
      )}
    </div>
  );
}
