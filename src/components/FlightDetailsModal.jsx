import React from 'react';
import { X, Plane, Clock, Briefcase, Utensils, Wifi, Tv, User, Star } from 'lucide-react';
import './FlightDetailsModal.css';

const FlightDetailsModal = ({ flight, onClose }) => {
  if (!flight) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          fill={i < fullStars ? '#fbbf24' : 'none'}
          color="#fbbf24"
        />
      );
    }
    return stars;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-flight">
          <button className="btn-close-modal" onClick={onClose}>
            <X size={24} />
          </button>
          
          <div className="airline-header-modal">
            <div className="airline-logo-big" style={{ 
              backgroundColor: flight.companhia === 'GOL' ? '#ff6600' :
                             flight.companhia === 'AZUL' ? '#003d7a' :
                             flight.companhia === 'LATAM' ? '#d40d32' : '#d40d32'
            }}>
              {flight.companhia}
            </div>
            <div className="airline-info-modal">
              <h2>{flight.companhia} Airlines</h2>
              <p>Voo {flight.numeroVoo || 'G3 1234'}</p>
            </div>
          </div>
          
          <div className="price-badge-modal">
            R$ {flight.precoTotal ? flight.precoTotal.toFixed(2) : '0.00'}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-flight">
          {/* Flight Timeline */}
          <div className="section-modal">
            <h3 className="section-title-modal">
              <Plane size={24} /> Itinerário
            </h3>
            <div className="flight-timeline-modal">
              <div className="timeline-row-modal">
                <div className="timeline-point-modal">
                  <div className="timeline-time-modal">
                    {flight.horarioPartida || '08:00'}
                  </div>
                  <div className="timeline-airport-modal">
                    {flight.origem}
                  </div>
                  <div className="timeline-city-modal">
                    {flight.origem === 'GRU' ? 'São Paulo' :
                     flight.origem === 'GIG' ? 'Rio de Janeiro' :
                     flight.origem === 'BSB' ? 'Brasília' : flight.origem}
                  </div>
                  <span className="timeline-terminal-modal">Terminal 2</span>
                </div>

                <div className="timeline-middle-modal">
                  <div className="timeline-duration-modal">
                    {flight.duracao || '2h 15min'}
                  </div>
                  <div className="timeline-line-modal">
                    <div className="timeline-plane-modal">✈️</div>
                  </div>
                  <div className="timeline-stops-modal">
                    {flight.paradas === 0 ? 'Direto' : `${flight.paradas} parada(s)`}
                  </div>
                </div>

                <div className="timeline-point-modal">
                  <div className="timeline-time-modal">
                    {flight.horarioChegada || '10:15'}
                  </div>
                  <div className="timeline-airport-modal">
                    {flight.destino}
                  </div>
                  <div className="timeline-city-modal">
                    {flight.destino === 'GRU' ? 'São Paulo' :
                     flight.destino === 'GIG' ? 'Rio de Janeiro' :
                     flight.destino === 'BSB' ? 'Brasília' : flight.destino}
                  </div>
                  <span className="timeline-terminal-modal">Terminal 1</span>
                </div>
              </div>

              {flight.paradas > 0 && (
                <div className="layover-info-modal">
                  ⚠️ <strong>Conexão:</strong> 1h 45min em Guarulhos (GRU)
                </div>
              )}
            </div>
          </div>

          {/* Flight Information */}
          <div className="section-modal">
            <h3 className="section-title-modal">
              <Clock size={24} /> Informações do Voo
            </h3>
            <div className="info-grid-modal">
              <div className="info-card-modal">
                <div className="info-card-icon-modal">✈️</div>
                <div className="info-card-title-modal">Aeronave</div>
                <div className="info-card-value-modal">Boeing 737-800</div>
              </div>

              <div className="info-card-modal">
                <div className="info-card-icon-modal">💺</div>
                <div className="info-card-title-modal">Capacidade</div>
                <div className="info-card-value-modal">186 assentos</div>
              </div>

              <div className="info-card-modal">
                <div className="info-card-icon-modal">📏</div>
                <div className="info-card-title-modal">Distância</div>
                <div className="info-card-value-modal">
                  {flight.distancia || '1.200 km'}
                </div>
              </div>

              <div className="info-card-modal">
                <div className="info-card-icon-modal">⏱️</div>
                <div className="info-card-title-modal">Tempo de Voo</div>
                <div className="info-card-value-modal">
                  {flight.duracao || '2h 15min'}
                </div>
              </div>
            </div>
          </div>

          {/* Baggage Information */}
          <div className="section-modal">
            <h3 className="section-title-modal">
              <Briefcase size={24} /> Bagagem Incluída
            </h3>
            <div className="baggage-grid-modal">
              <div className="baggage-card-modal">
                <div className="baggage-icon-modal">🎒</div>
                <div className="baggage-title-modal">Bagagem de Mão</div>
                <div className="baggage-value-modal">10 kg</div>
                <div className="baggage-note-modal">Incluído</div>
              </div>

              <div className="baggage-card-modal">
                <div className="baggage-icon-modal">🧳</div>
                <div className="baggage-title-modal">Bagagem Despachada</div>
                <div className="baggage-value-modal">23 kg</div>
                <div className="baggage-note-modal">Incluído</div>
              </div>

              <div className="baggage-card-modal">
                <div className="baggage-icon-modal">➕</div>
                <div className="baggage-title-modal">Bagagem Extra</div>
                <div className="baggage-value-modal">R$ 150</div>
                <div className="baggage-note-modal">Por mala</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="section-modal">
            <h3 className="section-title-modal">
              <Utensils size={24} /> Comodidades
            </h3>
            <div className="amenities-grid-modal">
              <div className="amenity-item-modal">
                <Wifi size={20} className="amenity-icon-modal" />
                <span className="amenity-text-modal">Wi-Fi a bordo</span>
              </div>
              <div className="amenity-item-modal">
                <Utensils size={20} className="amenity-icon-modal" />
                <span className="amenity-text-modal">Refeição incluída</span>
              </div>
              <div className="amenity-item-modal">
                <Tv size={20} className="amenity-icon-modal" />
                <span className="amenity-text-modal">Entretenimento</span>
              </div>
              <div className="amenity-item-modal">
                <User size={20} className="amenity-icon-modal" />
                <span className="amenity-text-modal">Assento reclinável</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="section-modal">
            <h3 className="section-title-modal">
              <Star size={24} /> Avaliação dos Passageiros
            </h3>
            <div className="rating-card-modal">
              <div className="rating-score-modal">
                <div className="rating-number-modal">4.5</div>
                <div className="rating-stars-modal">
                  {renderStars(4.5)}
                </div>
                <div className="rating-text-modal">Excelente</div>
              </div>

              <div className="rating-details-modal">
                <div className="rating-bar-modal">
                  <span className="rating-label-modal">Conforto</span>
                  <div className="rating-progress-modal">
                    <div className="rating-fill-modal" style={{ width: '90%' }}></div>
                  </div>
                  <span className="rating-value-modal">4.5</span>
                </div>

                <div className="rating-bar-modal">
                  <span className="rating-label-modal">Serviço</span>
                  <div className="rating-progress-modal">
                    <div className="rating-fill-modal" style={{ width: '85%' }}></div>
                  </div>
                  <span className="rating-value-modal">4.3</span>
                </div>

                <div className="rating-bar-modal">
                  <span className="rating-label-modal">Pontualidade</span>
                  <div className="rating-progress-modal">
                    <div className="rating-fill-modal" style={{ width: '95%' }}></div>
                  </div>
                  <span className="rating-value-modal">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-flight">
          <button className="btn-modal btn-secondary-modal" onClick={onClose}>
            Voltar
          </button>
          <button className="btn-modal btn-share-modal">
            Compartilhar
          </button>
          <button className="btn-modal btn-primary-modal">
            Selecionar Voo
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
