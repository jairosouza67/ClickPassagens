import { useState, useEffect, useMemo } from 'react'
import { Filter, TrendingDown, Clock, Plane, Check, X, Edit2, Calendar, Users, MapPin, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import FlightCard from './FlightCard.jsx'
import FlightDetailsModal from './FlightDetailsModal.jsx'
import './ResultsPageModern.css'

export default function ResultsPage({ results, onNewSearch, onCompare, onCheckout, onGenerateQuote, searchParams }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [filters, setFilters] = useState({
    companhias: [],
    paradas: [],
    horarios: [],
    precoMax: 10000
  })
  
  const [sortBy, setSortBy] = useState('economia') // economia, preco, duracao

  // Extrair companhias únicas dos resultados
  const companhias = useMemo(() => {
    const uniqueCompanies = new Set();
    results.forEach(result => {
      if (result.companhia?.nome) {
        uniqueCompanies.add(result.companhia.nome);
      }
    });
    return Array.from(uniqueCompanies).sort();
  }, [results])
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }))
  }

  const resetFilters = () => {
    setFilters({
      companhias: [],
      paradas: [],
      horarios: [],
      precoMax: 10000
    })
  }

  // Filtrar resultados com verificação mais robusta
  const filteredResults = results.filter(result => {
    // Filtro de companhias
    if (filters.companhias.length > 0) {
      const companhiaNome = result.companhia?.nome || result.airline || '';
      if (!filters.companhias.includes(companhiaNome)) {
        return false;
      }
    }
    
    // Filtro de paradas
    if (filters.paradas.length > 0 && !filters.paradas.includes(result.paradas)) {
      return false
    }
    
    // Filtro de horário
    if (filters.horarios.length > 0) {
      const hora = parseInt(result.horario_saida?.split(':')[0] || 0);
      let horarioMatch = false;
      
      filters.horarios.forEach(periodo => {
        if (periodo === 'manha' && hora >= 6 && hora < 12) horarioMatch = true;
        if (periodo === 'tarde' && hora >= 12 && hora < 18) horarioMatch = true;
        if (periodo === 'noite' && hora >= 18 && hora < 24) horarioMatch = true;
        if (periodo === 'madrugada' && hora >= 0 && hora < 6) horarioMatch = true;
      });
      
      if (!horarioMatch) return false;
    }
    
    // Filtro de preço
    if (result.preco_dinheiro > filters.precoMax) {
      return false
    }
    
    return true
  })

  // Ordenar resultados
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'economia':
        return b.economia_calculada - a.economia_calculada
      case 'preco':
        return a.milhas_necessarias - b.milhas_necessarias
      case 'duracao':
        return parseInt(a.duracao) - parseInt(b.duracao)
      default:
        return 0
    }
  })

  return (
    <div className="results-page-modern">
      {/* Header com Resumo da Busca */}
      <div className="search-summary-header">
        <div className="container-summary">
          <div className="summary-content">
            <div className="route-summary">
              <div className="route-cities">
                <MapPin size={18} />
                <span className="city-from">{searchParams?.origem || results[0]?.origem}</span>
                <ArrowRight size={20} className="arrow-icon" />
                <span className="city-to">{searchParams?.destino || results[0]?.destino}</span>
              </div>
              <div className="route-details">
                <span className="detail-item">
                  <Calendar size={14} />
                  {searchParams?.data_ida || results[0]?.data || 'Data'}
                </span>
                {searchParams?.data_volta && (
                  <>
                    <span className="separator">•</span>
                    <span className="detail-item">
                      <Calendar size={14} />
                      {searchParams.data_volta}
                    </span>
                  </>
                )}
                <span className="separator">•</span>
                <span className="detail-item">
                  <Users size={14} />
                  {searchParams?.passageiros || 1} {searchParams?.passageiros > 1 ? 'passageiros' : 'passageiro'}
                </span>
                <span className="separator">•</span>
                <span className="flights-count">{results.length} voos disponíveis</span>
              </div>
            </div>
            <button onClick={() => setShowEditPanel(!showEditPanel)} className="btn-edit-search">
              <Edit2 size={18} />
              Editar busca
            </button>
          </div>
        </div>
      </div>

      {/* Painel Lateral de Edição */}
      {showEditPanel && (
        <div className="edit-panel-overlay" onClick={() => setShowEditPanel(false)}>
          <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
            <div className="edit-panel-header">
              <h3>Editar sua busca</h3>
              <button className="btn-close-panel" onClick={() => setShowEditPanel(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="edit-panel-content">
              <div className="edit-field">
                <label>
                  <MapPin size={16} />
                  Origem
                </label>
                <input 
                  type="text" 
                  defaultValue={searchParams?.origem || results[0]?.origem}
                  placeholder="De onde você sai?"
                />
              </div>

              <div className="edit-field">
                <label>
                  <MapPin size={16} />
                  Destino
                </label>
                <input 
                  type="text" 
                  defaultValue={searchParams?.destino || results[0]?.destino}
                  placeholder="Para onde você vai?"
                />
              </div>

              <div className="edit-field-row">
                <div className="edit-field">
                  <label>
                    <Calendar size={16} />
                    Data de ida
                  </label>
                  <input 
                    type="date" 
                    defaultValue={searchParams?.data_ida}
                  />
                </div>

                <div className="edit-field">
                  <label>
                    <Calendar size={16} />
                    Data de volta
                  </label>
                  <input 
                    type="date" 
                    defaultValue={searchParams?.data_volta}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  <Users size={16} />
                  Passageiros
                </label>
                <select defaultValue={searchParams?.passageiros || 1}>
                  <option value="1">1 passageiro</option>
                  <option value="2">2 passageiros</option>
                  <option value="3">3 passageiros</option>
                  <option value="4">4 passageiros</option>
                  <option value="5">5+ passageiros</option>
                </select>
              </div>

              <div className="edit-field">
                <label>Classe</label>
                <select defaultValue={searchParams?.classe || 'economica'}>
                  <option value="economica">Econômica</option>
                  <option value="executiva">Executiva</option>
                  <option value="primeira">Primeira Classe</option>
                </select>
              </div>
            </div>

            <div className="edit-panel-footer">
              <button className="btn-cancel" onClick={() => setShowEditPanel(false)}>
                Cancelar
              </button>
              <button className="btn-search-new" onClick={onNewSearch}>
                Buscar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="results-container-modern">
        {/* Filtros Sidebar */}
        <aside className="filters-sidebar-modern">
          <div className="filters-header">
            <div className="filters-title">
              <Filter size={20} />
              <span>Filtrar resultados</span>
            </div>
            {(filters.companhias.length > 0 || filters.paradas.length > 0 || filters.horarios.length > 0) && (
              <button onClick={resetFilters} className="btn-clear-all">
                Limpar tudo
              </button>
            )}
          </div>

          {/* Filtro de Paradas */}
          <div className="filter-section">
            <h4 className="filter-section-title">Paradas</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paradas.includes('Direto')}
                  onChange={() => handleFilterChange('paradas', 'Direto')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">Voo direto</span>
                <span className="filter-count">
                  ({results.filter(r => r.paradas === 'Direto').length})
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paradas.includes('1 parada')}
                  onChange={() => handleFilterChange('paradas', '1 parada')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">1 parada</span>
                <span className="filter-count">
                  ({results.filter(r => r.paradas === '1 parada').length})
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paradas.includes('2+ paradas')}
                  onChange={() => handleFilterChange('paradas', '2+ paradas')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">2 ou mais paradas</span>
                <span className="filter-count">
                  ({results.filter(r => r.paradas === '2+ paradas').length})
                </span>
              </label>
            </div>
          </div>

          {/* Filtro de Horário */}
          <div className="filter-section">
            <h4 className="filter-section-title">Horário de saída</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.horarios.includes('madrugada')}
                  onChange={() => handleFilterChange('horarios', 'madrugada')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">Madrugada (00h - 06h)</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.horarios.includes('manha')}
                  onChange={() => handleFilterChange('horarios', 'manha')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">Manhã (06h - 12h)</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.horarios.includes('tarde')}
                  onChange={() => handleFilterChange('horarios', 'tarde')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">Tarde (12h - 18h)</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.horarios.includes('noite')}
                  onChange={() => handleFilterChange('horarios', 'noite')}
                />
                <span className="checkbox-custom"></span>
                <span className="filter-label">Noite (18h - 00h)</span>
              </label>
            </div>
          </div>

          {/* Filtro de Companhias */}
          <div className="filter-section">
            <h4 className="filter-section-title">Companhias aéreas</h4>
            <div className="filter-options">
              {companhias.map(comp => {
                const count = results.filter(r => {
                  const compNome = r.companhia?.nome || r.airline || '';
                  return compNome === comp;
                }).length;
                
                return (
                  <label key={comp} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.companhias.includes(comp)}
                      onChange={() => handleFilterChange('companhias', comp)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{comp}</span>
                    <span className="filter-count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Filtro de Preço */}
          <div className="filter-section">
            <h4 className="filter-section-title">Preço máximo</h4>
            <div className="price-filter">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.precoMax}
                onChange={(e) => setFilters(prev => ({ ...prev, precoMax: parseInt(e.target.value) }))}
                className="price-slider"
              />
              <div className="price-value">
                Até <strong>R$ {filters.precoMax.toLocaleString('pt-BR')}</strong>
              </div>
            </div>
          </div>

          {/* Dica */}
          <div className="filter-tip">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h5>Dica</h5>
              <p>Voos diretos costumam ter melhor custo-benefício em milhas!</p>
            </div>
          </div>
        </aside>

        {/* Lista de Resultados */}
        <main className="results-main">
          {/* Ordenação */}
          <div className="results-toolbar">
            <div className="results-info">
              <strong>{sortedResults.length}</strong> {sortedResults.length === 1 ? 'voo encontrado' : 'voos encontrados'}
            </div>
            
            <div className="sort-buttons">
              <button
                className={`sort-btn ${sortBy === 'economia' ? 'active' : ''}`}
                onClick={() => setSortBy('economia')}
              >
                <TrendingDown size={16} />
                Melhor economia
              </button>
              <button
                className={`sort-btn ${sortBy === 'preco' ? 'active' : ''}`}
                onClick={() => setSortBy('preco')}
              >
                Menor preço
              </button>
              <button
                className={`sort-btn ${sortBy === 'duracao' ? 'active' : ''}`}
                onClick={() => setSortBy('duracao')}
              >
                <Clock size={16} />
                Menor duração
              </button>
            </div>
          </div>

          {/* Flight Cards */}
          <div className="flights-list">
            {sortedResults.length > 0 ? (
              sortedResults.map((result, index) => (
                <div key={result.id || index} className="flight-card-modern">
                  {/* Badge de melhor oferta */}
                  {index === 0 && (
                    <div className="best-deal-badge">
                      ⭐ Melhor opção
                    </div>
                  )}

                  <div className="flight-card-content">
                    {/* Cabeçalho com Companhia */}
                    <div className="flight-airline">
                      <div className={`airline-logo airline-${(result.companhia?.nome || result.airline || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {(result.companhia?.codigo || result.companhia?.nome?.substring(0, 2) || 'XX').toUpperCase()}
                      </div>
                      <div className="airline-name">
                        <h4>{result.companhia?.nome || result.airline || 'Companhia Aérea'}</h4>
                        <p className="flight-number">Voo {result.voo_numero}</p>
                      </div>
                    </div>

                    {/* Rota e Horários */}
                    <div className="flight-route-modern">
                      <div className="route-time-block">
                        <div className="time-large">{result.horario_saida}</div>
                        <div className="airport-code">{result.origem}</div>
                      </div>

                      <div className="route-info-center">
                        <div className="flight-duration">{result.duracao || '2h 30min'}</div>
                        <div className="route-visual">
                          <div className="route-line"></div>
                          <Plane size={18} className="plane-icon" />
                        </div>
                        <div className="flight-stops">
                          {result.paradas === 'Direto' ? (
                            <span className="direct-badge">Direto</span>
                          ) : (
                            <span className="stops-badge">{result.paradas}</span>
                          )}
                        </div>
                      </div>

                      <div className="route-time-block">
                        <div className="time-large">{result.horario_chegada}</div>
                        <div className="airport-code">{result.destino}</div>
                      </div>
                    </div>

                    {/* Preços e Ações */}
                    <div className="flight-pricing">
                      <div className="pricing-info">
                        <div className="price-miles">
                          <div className="price-label">Milhas</div>
                          <div className="price-value-miles">
                            {result.milhas_necessarias?.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div className="price-divider">ou</div>
                        <div className="price-money">
                          <div className="price-label">Dinheiro</div>
                          <div className="price-value-money">
                            R$ {result.preco_dinheiro?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      {result.economia_calculada > 0 && (
                        <div className="economy-badge-modern">
                          <TrendingDown size={14} />
                          Economize {result.economia_calculada}%
                        </div>
                      )}

                      <div className="action-buttons">
                        <button 
                          className="btn-details-modern"
                          onClick={() => setSelectedFlight(result)}
                        >
                          Ver detalhes
                        </button>
                        <button 
                          className="btn-select-modern"
                          onClick={() => onCheckout && onCheckout(result)}
                        >
                          Solicitar orçamento
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="flight-amenities">
                    <div className="amenity-item">
                      <Check size={14} />
                      <span>Bagagem de mão</span>
                    </div>
                    <div className="amenity-item">
                      <Check size={14} />
                      <span>Escolha de assento</span>
                    </div>
                    <div className="amenity-item">
                      <Check size={14} />
                      <span>Remarcação flexível</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-modern">
                <div className="no-results-icon">
                  <Plane size={64} />
                </div>
                <h3>Nenhum voo encontrado</h3>
                <p>Tente ajustar os filtros ou modificar sua busca</p>
                <div className="no-results-actions">
                  <button onClick={resetFilters} className="btn-reset">
                    Limpar filtros
                  </button>
                  <button onClick={() => setShowEditPanel(true)} className="btn-modify">
                    Modificar busca
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Detalhes */}
      {selectedFlight && (
        <FlightDetailsModal 
          flight={selectedFlight} 
          onClose={() => setSelectedFlight(null)} 
        />
      )}
    </div>
  )
}
