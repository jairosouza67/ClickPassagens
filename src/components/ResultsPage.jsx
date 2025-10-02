import { useState } from 'react'
import { Filter, TrendingDown, Clock, Plane, Check, X } from 'lucide-react'
import FlightCard from './FlightCard.jsx'
import FlightDetailsModal from './FlightDetailsModal.jsx'
import './ResultsPage.css'

export default function ResultsPage({ results, onNewSearch, onCompare, onCheckout }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filters, setFilters] = useState({
    companhias: [],
    paradas: [],
    horarios: [],
    precoMax: 10000
  })
  
  const [sortBy, setSortBy] = useState('economia') // economia, preco, duracao

  // Companhias disponíveis
  const companhias = ['GOL', 'AZUL', 'LATAM', 'AVIANCA', 'TAP']
  
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

  // Filtrar resultados
  const filteredResults = results.filter(result => {
    if (filters.companhias.length > 0 && !filters.companhias.includes(result.companhia?.nome)) {
      return false
    }
    if (filters.paradas.length > 0 && !filters.paradas.includes(result.paradas)) {
      return false
    }
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
    <div className="results-page">
      {/* Search Bar Compacta */}
      <div className="search-bar-compact">
        <div className="search-summary">
          <div className="search-summary-info">
            <span className="search-route">
              {results[0]?.origem} → {results[0]?.destino}
            </span>
            <span className="search-date">
              {results[0]?.data} • {results.length} voos encontrados
            </span>
          </div>
          <button onClick={onNewSearch} className="btn-modify-search">
            Modificar Busca
          </button>
        </div>
      </div>

      <div className="results-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-card">
            <div className="filter-title">
              <Filter size={20} />
              <span>Filtros</span>
            </div>

            {/* Companhias */}
            <div className="filter-group">
              <h4>Companhias Aéreas</h4>
              {companhias.map(comp => (
                <label key={comp} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.companhias.includes(comp)}
                    onChange={() => handleFilterChange('companhias', comp)}
                  />
                  <span>{comp}</span>
                  <span className="filter-count">
                    ({results.filter(r => r.companhia?.nome === comp).length})
                  </span>
                </label>
              ))}
            </div>

            {/* Paradas */}
            <div className="filter-group">
              <h4>Paradas</h4>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.paradas.includes('Direto')}
                  onChange={() => handleFilterChange('paradas', 'Direto')}
                />
                <span>Voos Diretos</span>
                <span className="filter-count">
                  ({results.filter(r => r.paradas === 'Direto').length})
                </span>
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.paradas.includes('1 parada')}
                  onChange={() => handleFilterChange('paradas', '1 parada')}
                />
                <span>1 Parada</span>
                <span className="filter-count">
                  ({results.filter(r => r.paradas === '1 parada').length})
                </span>
              </label>
            </div>

            {/* Preço Máximo */}
            <div className="filter-group">
              <h4>Preço Máximo</h4>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.precoMax}
                onChange={(e) => setFilters(prev => ({ ...prev, precoMax: parseInt(e.target.value) }))}
                className="price-range"
              />
              <div className="price-range-label">
                Até R$ {filters.precoMax.toLocaleString('pt-BR')}
              </div>
            </div>

            <button onClick={resetFilters} className="btn-reset-filters">
              Limpar Filtros
            </button>
          </div>

          {/* Dica de Economia */}
          <div className="filter-card economy-tip">
            <div className="economy-icon">💡</div>
            <h4>Dica de Economia</h4>
            <p>Voos diretos geralmente oferecem melhor custo-benefício em milhas!</p>
          </div>
        </aside>

        {/* Results List */}
        <main className="results-list">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-count">
              Mostrando <strong>{sortedResults.length}</strong> de {results.length} voos
            </div>
            
            <div className="sort-options">
              <span className="sort-label">Ordenar por:</span>
              <button
                className={`sort-btn ${sortBy === 'economia' ? 'active' : ''}`}
                onClick={() => setSortBy('economia')}
              >
                <TrendingDown size={16} />
                Economia
              </button>
              <button
                className={`sort-btn ${sortBy === 'preco' ? 'active' : ''}`}
                onClick={() => setSortBy('preco')}
              >
                Menor Preço
              </button>
              <button
                className={`sort-btn ${sortBy === 'duracao' ? 'active' : ''}`}
                onClick={() => setSortBy('duracao')}
              >
                <Clock size={16} />
                Duração
              </button>
            </div>
          </div>

          {/* Comparison Button */}
          {onCompare && (
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={onCompare}
                className="btn-compare-miles"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <TrendingDown size={20} />
                Comparar Milhas vs Dinheiro
              </button>
            </div>
          )}

          {/* Flight Cards */}
          {sortedResults.length > 0 ? (
            sortedResults.map((result, index) => (
              <div
                key={result.id || index}
                className={`flight-card-results ${index === 0 ? 'best-offer' : ''}`}
              >
                {index === 0 && (
                  <div className="best-offer-badge">
                    ⭐ MELHOR OFERTA
                  </div>
                )}

                <div className="flight-header">
                  <div className="airline-info">
                    <div className={`airline-logo-box airline-${result.companhia?.nome?.toLowerCase()}`}>
                      {result.companhia?.codigo}
                    </div>
                    <div className="airline-details">
                      <h3>{result.companhia?.nome}</h3>
                      <p>Voo {result.voo_numero}</p>
                    </div>
                  </div>

                  <div className="flight-price">
                    <div className="price-miles">
                      {result.milhas_necessarias?.toLocaleString('pt-BR')} milhas
                    </div>
                    <div className="price-money">
                      ou R$ {result.preco_dinheiro?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="price-economy">
                      Economia de {result.economia_calculada}%
                    </div>
                  </div>
                </div>

                <div className="flight-route">
                  <div className="route-point">
                    <div className="route-time">{result.horario_saida}</div>
                    <div className="route-airport">{result.origem}</div>
                  </div>

                  <div className="route-middle">
                    <div className="route-duration">{result.duracao || '2h 30min'}</div>
                    <div className="route-line-container">
                      <Plane size={20} className="route-plane-icon" />
                    </div>
                    <div className="route-stops">{result.paradas}</div>
                  </div>

                  <div className="route-point">
                    <div className="route-time">{result.horario_chegada}</div>
                    <div className="route-airport">{result.destino}</div>
                  </div>
                </div>

                <div className="flight-features">
                  <div className="feature-item">
                    <Check size={16} className="feature-icon" />
                    <span>Bagagem de mão incluída</span>
                  </div>
                  <div className="feature-item">
                    <Check size={16} className="feature-icon" />
                    <span>Escolha de assento</span>
                  </div>
                  <div className="feature-item">
                    <Check size={16} className="feature-icon" />
                    <span>Remarcação flexível</span>
                  </div>
                </div>

                <div className="flight-actions">
                  <button 
                    className="btn-details"
                    onClick={() => setSelectedFlight(result)}
                  >
                    Ver Detalhes
                  </button>
                  <button 
                    className="btn-select"
                    onClick={() => onCheckout && onCheckout(result)}
                  >
                    Selecionar Voo
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <X size={48} />
              <h3>Nenhum voo encontrado</h3>
              <p>Tente ajustar os filtros ou fazer uma nova busca</p>
              <button onClick={resetFilters} className="btn-reset-filters">
                Limpar Filtros
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Flight Details Modal */}
      {selectedFlight && (
        <FlightDetailsModal 
          flight={selectedFlight} 
          onClose={() => setSelectedFlight(null)} 
        />
      )}
    </div>
  )
}
