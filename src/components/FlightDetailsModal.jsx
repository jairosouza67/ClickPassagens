import React from 'react';
import { X, Plane, Clock, Briefcase, MapPin, Info, Check } from 'lucide-react';
import './FlightDetailsModalModern.css';

const FlightDetailsModal = ({ flight, onClose }) => {
  if (!flight) return null;

  // Mapear códigos IATA para nomes de cidades e aeroportos
  const getAirportInfo = (code) => {
    const airports = {
      'GRU': { city: 'São Paulo', airport: 'Aeroporto Internacional Guarulhos' },
      'GIG': { city: 'Rio de Janeiro', airport: 'Aeroporto Internacional Galeão Antonio Carlos Jobim' },
      'BSB': { city: 'Brasília', airport: 'Aeroporto Internacional de Brasília' },
      'CGH': { city: 'São Paulo', airport: 'Aeroporto de Congonhas' },
      'SDU': { city: 'Rio de Janeiro', airport: 'Aeroporto Santos Dumont' },
    };
    return airports[code] || { city: code, airport: `Aeroporto ${code}` };
  };

  const origemInfo = getAirportInfo(flight.origem);
  const destinoInfo = getAirportInfo(flight.destino);

  // Determinar cor da companhia
  const getAirlineColor = (nome) => {
    const name = nome?.toLowerCase() || '';
    if (name.includes('gol')) return '#ff6b00';
    if (name.includes('azul')) return '#002f87';
    if (name.includes('latam')) return '#e30613';
    if (name.includes('avianca')) return '#e50000';
    if (name.includes('tap')) return '#d30f3a';
    return '#3b82f6';
  };

  const airlineColor = getAirlineColor(flight.companhia?.nome || flight.airline);
  const companhiaNome = flight.companhia?.nome || flight.airline || 'Companhia Aérea';

  return (
    <div className="modal-overlay-modern" onClick={onClose}>
      <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-modern">
          <div className="modal-airline-info">
            <div 
              className="modal-airline-logo" 
              style={{ background: `linear-gradient(135deg, ${airlineColor} 0%, ${airlineColor}dd 100%)` }}
            >
              {flight.companhia?.codigo || companhiaNome.substring(0, 2).toUpperCase()}
            </div>
            <div className="modal-airline-text">
              <h2>{companhiaNome}</h2>
              <div className="modal-flight-badge">
                <span className="badge-rating">7.7</span>
                <span className="badge-text">Muito bom</span>
              </div>
            </div>
          </div>
          
          <div className="modal-flight-info">
            <div className="modal-flight-number">Voo Nº: {flight.voo_numero}</div>
            <div className="modal-aircraft-info">{flight.aircraft || 'Boeing 737-800'}</div>
            <div className="modal-class-info">Classe: {flight.classe || 'Econômica'}</div>
          </div>

          <button className="btn-close-modern" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Flight Route */}
        <div className="modal-flight-route">
          {/* Origem */}
          <div className="route-endpoint">
            <div className="route-date">Seg. 20 Out.</div>
            <div className="route-time">{flight.horario_saida}</div>
            <div className="route-code">{flight.origem}</div>
            <div className="route-city">{origemInfo.city}</div>
            <div className="route-airport">{origemInfo.airport}</div>
          </div>

          {/* Linha do meio */}
          <div className="route-middle">
            <div className="route-duration-label">Duração</div>
            <div className="route-duration-time">{flight.duracao || '1h 5m'}</div>
            <div className="route-line"></div>
          </div>

          {/* Destino */}
          <div className="route-endpoint">
            <div className="route-date">Seg. 20 Out.</div>
            <div className="route-time">{flight.horario_chegada}</div>
            <div className="route-code">{flight.destino}</div>
            <div className="route-city">{destinoInfo.city}</div>
            <div className="route-airport">{destinoInfo.airport}</div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="modal-duration-badge">
          <Clock size={16} />
          <span>Duração: {flight.duracao || '1h 5m'}</span>
        </div>

        <div className="modal-info-note">
          Horários em hora local de cada cidade
        </div>

        {/* Bagagem Section */}
        <div className="modal-section">
          <h3 className="section-title-new">
            <Briefcase size={20} />
            Bagagem
          </h3>
          
          <div className="baggage-list">
            <div className="baggage-item-new">
              <div className="baggage-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="8" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="baggage-info-new">
                <div className="baggage-title-new">Inclui uma mochila ou bolsa</div>
                <div className="baggage-description">Deve caber embaixo do assento dianteiro.</div>
              </div>
            </div>

            <div className="baggage-item-new">
              <div className="baggage-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="6" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="21" r="1" fill="currentColor"/>
                  <circle cx="15" cy="21" r="1" fill="currentColor"/>
                </svg>
              </div>
              <div className="baggage-info-new">
                <div className="baggage-title-new">Inclui bagagem de mão</div>
                <div className="baggage-description">Deve caber no compartimento superior do avião.</div>
              </div>
            </div>

            <div className="baggage-item-new disabled">
              <div className="baggage-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.4">
                  <rect x="5" y="8" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8" cy="22" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="22" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div className="baggage-info-new">
                <div className="baggage-title-new">Não inclui bagagem para despachar</div>
                <div className="baggage-description">Você poderá comprar malas online por um preço exclusivo.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="modal-price-section">
          <div className="price-breakdown">
            <div className="price-row">
              <span className="price-label">Em milhas</span>
              <span className="price-value primary">{flight.milhas_necessarias?.toLocaleString('pt-BR')} milhas</span>
            </div>
            <div className="price-row">
              <span className="price-label">ou em dinheiro</span>
              <span className="price-value">R$ {flight.preco_dinheiro?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            {flight.economia_calculada > 0 && (
              <div className="price-row economy">
                <span className="price-label">Economia usando milhas</span>
                <span className="price-value economy-value">{flight.economia_calculada}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions-modern">
          <button className="btn-action-secondary" onClick={onClose}>
            Voltar
          </button>
          <button className="btn-action-primary">
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
