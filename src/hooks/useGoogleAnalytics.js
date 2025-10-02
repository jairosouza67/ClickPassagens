import { useEffect } from 'react';

// ID do Google Analytics (você precisa criar uma propriedade GA4)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Substituir com seu ID real

/**
 * Hook para inicializar Google Analytics 4
 * Como usamos sistema de tabs (não react-router), o tracking de page views
 * é feito manualmente via eventos em App.jsx
 */
export const useGoogleAnalytics = () => {
  useEffect(() => {
    // Carrega o script do Google Analytics apenas uma vez
    if (!window.gtag) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // Desativa page view automático, usamos eventos customizados
      });
    }
  }, []);
};

/**
 * Função para rastrear eventos customizados
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * Eventos pré-definidos para o ClickPassagens
 */
export const analytics = {
  // Busca de passagens
  searchFlights: (origin, destination, date) => {
    trackEvent('search_flights', {
      origin,
      destination,
      date,
      timestamp: new Date().toISOString()
    });
  },

  // Visualização de resultado
  viewFlightResult: (flightId, price, airline) => {
    trackEvent('view_flight_result', {
      flight_id: flightId,
      price,
      airline
    });
  },

  // Seleção de plano
  selectPlan: (planName, planPrice) => {
    trackEvent('select_plan', {
      plan_name: planName,
      plan_price: planPrice
    });
  },

  // Contato/Orçamento
  requestQuote: (type) => {
    trackEvent('request_quote', {
      quote_type: type
    });
  },

  // Instalação PWA
  installPWA: () => {
    trackEvent('install_pwa', {
      platform: navigator.platform,
      user_agent: navigator.userAgent
    });
  },

  // Ativação de notificações
  enableNotifications: () => {
    trackEvent('enable_notifications');
  },

  // Compartilhamento
  share: (method) => {
    trackEvent('share', {
      method
    });
  }
};

export default useGoogleAnalytics;
