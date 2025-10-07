import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, DollarSign, Plane, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import { getQuotesHistory, confirmQuoteSale, unconfirmQuoteSale } from '../services/quoteService.js';
import { generatePDF, generateWord } from '../services/documentGenerator.js';
import './QuotesHistoryPage.css';

const QuotesHistoryPage = ({ onNavigate }) => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'client', 'internal'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest', 'price'
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [viewMode, setViewMode] = useState('client'); // 'client' ou 'internal' - para alternar visualização

  // Carregar orçamentos ao montar o componente
  useEffect(() => {
    loadQuotes();
  }, []);

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...quotes];

    // Filtrar por tipo
    if (filterType !== 'all') {
      result = result.filter(q => q.quoteType?.toLowerCase() === filterType);
    }

    // Filtrar por busca
    if (searchTerm) {
      result = result.filter(q => 
        q.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.flight?.origin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.flight?.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.passenger?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.savedAt || b.generatedAt) - new Date(a.savedAt || a.generatedAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.savedAt || a.generatedAt) - new Date(b.savedAt || b.generatedAt));
        break;
      case 'price':
        result.sort((a, b) => (b.pricing?.total || b.pricing?.clientPrice || 0) - (a.pricing?.total || a.pricing?.clientPrice || 0));
        break;
      default:
        break;
    }

    setFilteredQuotes(result);
  }, [quotes, searchTerm, filterType, sortBy]);

  const loadQuotes = () => {
    const history = getQuotesHistory();
    setQuotes(history);
    setFilteredQuotes(history);
  };

  const handleDownload = (quote, type = 'client') => {
    try {
      if (downloadFormat === 'pdf') {
        generatePDF(quote, type);
      } else {
        generateWord(quote, type);
      }
    } catch (error) {
      console.error('Erro ao baixar orçamento:', error);
      alert('Erro ao gerar documento. Tente novamente.');
    }
  };

  const handleDelete = (quoteNumber) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        const history = getQuotesHistory();
        const updated = history.filter(q => q.quoteNumber !== quoteNumber);
        localStorage.setItem('quotesHistory', JSON.stringify(updated));
        loadQuotes();
        setSelectedQuote(null);
        alert('Orçamento excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
        alert('Erro ao excluir orçamento.');
      }
    }
  };

  const handleToggleSale = (quoteNumber, currentStatus) => {
    try {
      if (currentStatus) {
        unconfirmQuoteSale(quoteNumber);
      } else {
        confirmQuoteSale(quoteNumber);
      }
      loadQuotes();
      // Atualizar quote selecionado se for o mesmo
      if (selectedQuote?.quoteNumber === quoteNumber) {
        const updated = getQuotesHistory().find(q => q.quoteNumber === quoteNumber);
        setSelectedQuote(updated);
      }
    } catch (error) {
      console.error('Erro ao alterar status de venda:', error);
      alert('Erro ao alterar status da venda.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <div className="quotes-history-page">
      <div className="quotes-history-container">
        {/* Header */}
        <div className="quotes-history-header">
          <div>
            <h1 className="quotes-history-title">
              <FileText size={32} /> Meus Orçamentos
            </h1>
            <p className="quotes-history-subtitle">
              Visualize e gerencie todos os orçamentos gerados
            </p>
          </div>
          {onNavigate && (
            <button 
              className="btn-back-dashboard"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft size={20} /> Voltar ao Dashboard
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="quotes-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por número, destino, passageiro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">📋 Todos</option>
              <option value="client">📄 Cliente</option>
              <option value="internal">💼 Interno</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recent">🕐 Mais Recentes</option>
              <option value="oldest">📅 Mais Antigos</option>
              <option value="price">💰 Maior Valor</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="quotes-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>📊</div>
            <div>
              <div className="stat-value">{quotes.length}</div>
              <div className="stat-label">Total de Orçamentos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>💰</div>
            <div>
              <div className="stat-value">
                {formatPrice(
                  quotes.reduce((sum, q) => sum + (q.pricing?.total || q.pricing?.clientPrice || 0), 0)
                )}
              </div>
              <div className="stat-label">Valor Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}>📅</div>
            <div>
              <div className="stat-value">
                {quotes.filter(q => {
                  const quoteDate = new Date(q.validUntil);
                  return quoteDate > new Date();
                }).length}
              </div>
              <div className="stat-label">Orçamentos Válidos</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="quotes-content">
          {/* List */}
          <div className="quotes-list">
            {filteredQuotes.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} style={{ color: '#cbd5e1' }} />
                <h3>Nenhum orçamento encontrado</h3>
                <p>
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Você ainda não gerou nenhum orçamento'}
                </p>
                {!searchTerm && filterType === 'all' && (
                  <button 
                    className="btn-new-search"
                    onClick={() => onNavigate && onNavigate('busca')}
                  >
                    <Plane size={20} /> Nova Busca
                  </button>
                )}
              </div>
            ) : (
              filteredQuotes.map((quote) => (
                <div 
                  key={quote.quoteNumber}
                  className={`quote-card ${selectedQuote?.quoteNumber === quote.quoteNumber ? 'active' : ''}`}
                  onClick={() => setSelectedQuote(quote)}
                >
                  <div className="quote-card-header">
                    <div className="quote-type-badge" style={{
                      background: quote.quoteType === 'INTERNAL' 
                        ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    }}>
                      {quote.quoteType === 'INTERNAL' ? '💼 Interno' : '📄 Cliente'}
                    </div>
                    <div className="quote-sale-toggle">
                      <label className="sale-checkbox-label" title={quote.saleConfirmed ? 'Venda confirmada - Clique para desmarcar' : 'Marcar como venda confirmada'}>
                        <input
                          type="checkbox"
                          checked={quote.saleConfirmed || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleSale(quote.quoteNumber, quote.saleConfirmed);
                          }}
                          className="sale-checkbox"
                        />
                        <CheckCircle 
                          size={20} 
                          className={quote.saleConfirmed ? 'sale-icon-checked' : 'sale-icon-unchecked'}
                        />
                        <span className="sale-label">Venda</span>
                      </label>
                    </div>
                  </div>

                  <div className="quote-card-body">
                    <div className="quote-route">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <strong>{quote.flight?.origin?.code || 'N/A'}</strong>
                        <small style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {quote.flight?.origin?.name || quote.flight?.origin?.city || ''}
                        </small>
                      </div>
                      <Plane size={16} style={{ color: '#64748b', margin: '0 10px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <strong>{quote.flight?.destination?.code || 'N/A'}</strong>
                        <small style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {quote.flight?.destination?.name || quote.flight?.destination?.city || ''}
                        </small>
                      </div>
                    </div>
                    <div className="quote-details-mini">
                      <span>{quote.flight?.airline || 'N/A'}</span>
                      <span>•</span>
                      <span>{quote.passenger?.name || 'N/A'}</span>
                    </div>
                    <div className="quote-date">
                      <Calendar size={14} />
                      {formatDate(quote.savedAt || quote.generatedAt)}
                    </div>
                  </div>

                  <div className="quote-card-footer">
                    <div className="quote-price">
                      {formatPrice(quote.pricing?.total || quote.pricing?.clientPrice || 0)}
                    </div>
                    <div className="quote-status-group">
                      {quote.saleConfirmed && (
                        <span className="quote-sold">✅ Vendido</span>
                      )}
                      {!quote.saleConfirmed && quote.validUntil && new Date(quote.validUntil) > new Date() && (
                        <span className="quote-valid">⏳ Válido</span>
                      )}
                      {!quote.saleConfirmed && quote.validUntil && new Date(quote.validUntil) <= new Date() && (
                        <span className="quote-expired">⚠️ Expirado</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details Panel */}
          {selectedQuote && (
            <div className="quote-details-panel">
              <div className="quote-details-header">
                <h2>Detalhes do Orçamento</h2>
                <button 
                  className="btn-close-details"
                  onClick={() => setSelectedQuote(null)}
                >
                  ✕
                </button>
              </div>

              {/* Toggle entre Orçamento Cliente e Interno */}
              <div className="quote-view-toggle" style={{
                display: 'flex',
                gap: '10px',
                padding: '20px',
                background: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setViewMode('client')}
                  style={{
                    padding: '12px 32px',
                    background: viewMode === 'client' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent',
                    color: viewMode === 'client' ? 'white' : '#64748b',
                    border: viewMode === 'client' ? 'none' : '2px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  📄 Orçamento Cliente
                </button>
                <button
                  onClick={() => setViewMode('internal')}
                  style={{
                    padding: '12px 32px',
                    background: viewMode === 'internal' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'transparent',
                    color: viewMode === 'internal' ? 'white' : '#64748b',
                    border: viewMode === 'internal' ? 'none' : '2px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  💼 Orçamento Interno
                </button>
              </div>

              <div className="quote-details-content">
                {/* Informações Básicas */}
                <div className="details-section">
                  <h3>📋 Informações Gerais</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Número:</span>
                      <span className="detail-value">{selectedQuote.quoteNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tipo:</span>
                      <span className="detail-value">
                        {selectedQuote.quoteType === 'INTERNAL' ? 'Interno' : 'Cliente'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gerado em:</span>
                      <span className="detail-value">{formatDate(selectedQuote.generatedAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Válido até:</span>
                      <span className="detail-value">{formatDate(selectedQuote.validUntil)}</span>
                    </div>
                  </div>
                </div>

                {/* Dados do Voo */}
                {selectedQuote.flight && (
                  <div className="details-section">
                    <h3>✈️ Dados do Voo</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Companhia:</span>
                        <span className="detail-value">{selectedQuote.flight.airline}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Voo:</span>
                        <span className="detail-value">{selectedQuote.flight.flightNumber}</span>
                      </div>
                      <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                        <span className="detail-label">Origem:</span>
                        <span className="detail-value">
                          <strong>{selectedQuote.flight.origin?.name || selectedQuote.flight.origin?.city}</strong>
                          {selectedQuote.flight.origin?.code && (
                            <span style={{ color: '#64748b', fontSize: '0.9em', marginLeft: '8px' }}>
                              ({selectedQuote.flight.origin.code})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                        <span className="detail-label">Destino:</span>
                        <span className="detail-value">
                          <strong>{selectedQuote.flight.destination?.name || selectedQuote.flight.destination?.city}</strong>
                          {selectedQuote.flight.destination?.code && (
                            <span style={{ color: '#64748b', fontSize: '0.9em', marginLeft: '8px' }}>
                              ({selectedQuote.flight.destination.code})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Data Ida:</span>
                        <span className="detail-value">
                          {selectedQuote.flight.departure?.date} - {selectedQuote.flight.departure?.time}
                        </span>
                      </div>
                      {selectedQuote.flight.return && (
                        <div className="detail-item">
                          <span className="detail-label">Data Volta:</span>
                          <span className="detail-value">
                            {selectedQuote.flight.return.date} - {selectedQuote.flight.return.time}
                          </span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Classe:</span>
                        <span className="detail-value">{selectedQuote.flight.class}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duração:</span>
                        <span className="detail-value">{selectedQuote.flight.duration}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dados do Passageiro */}
                {selectedQuote.passenger && (
                  <div className="details-section">
                    <h3>👤 Dados do Passageiro</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Nome:</span>
                        <span className="detail-value">{selectedQuote.passenger.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">E-mail:</span>
                        <span className="detail-value">{selectedQuote.passenger.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Telefone:</span>
                        <span className="detail-value">{selectedQuote.passenger.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Passageiros:</span>
                        <span className="detail-value">{selectedQuote.passenger.quantity}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Precificação */}
                {selectedQuote.pricing && (
                  <div className="details-section">
                    <h3>💰 Valores</h3>
                    <div className="pricing-details">
                      {viewMode === 'internal' ? (
                        <>
                          <div className="pricing-row">
                            <span>Custo Base:</span>
                            <span>{formatPrice(selectedQuote.pricing.basePrice)}</span>
                          </div>
                          <div className="pricing-row">
                            <span>Taxas:</span>
                            <span>{formatPrice(selectedQuote.pricing.airportTaxes?.total || 0)}</span>
                          </div>
                          <div className="pricing-row subtotal">
                            <span>Subtotal (Custo):</span>
                            <span>{formatPrice(selectedQuote.pricing.subtotal)}</span>
                          </div>
                          <div className="pricing-row profit">
                            <span>Lucro ({selectedQuote.pricing.profit?.percentage}%):</span>
                            <span>+ {formatPrice(selectedQuote.pricing.profit?.amount || 0)}</span>
                          </div>
                          <div className="pricing-row total">
                            <strong>Preço ao Cliente:</strong>
                            <strong>{formatPrice(selectedQuote.pricing.clientPrice)}</strong>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="pricing-row">
                            <span>Passagem:</span>
                            <span>{formatPrice(selectedQuote.pricing.flightPrice)}</span>
                          </div>
                          <div className="pricing-row">
                            <span>Taxas:</span>
                            <span>{formatPrice(selectedQuote.pricing.taxes?.airportTaxes || 0)}</span>
                          </div>
                          <div className="pricing-row total">
                            <strong>Total:</strong>
                            <strong>{formatPrice(selectedQuote.pricing.total)}</strong>
                          </div>
                        </>
                      )}

                      {selectedQuote.pricing.milesOption && (
                        <div className="miles-option">
                          <h4>⭐ Opção em Milhas</h4>
                          <div className="pricing-row">
                            <span>Milhas Necessárias:</span>
                            <span>{selectedQuote.pricing.milesOption.totalMiles?.toLocaleString('pt-BR')}</span>
                          </div>
                          {selectedQuote.pricing.milesOption.savings && (
                            <div className="pricing-row savings">
                              <span>Economia:</span>
                              <span>{selectedQuote.pricing.milesOption.savings.percentage}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="details-actions">
                  <div className="format-selector">
                    <button
                      className={`format-btn ${downloadFormat === 'pdf' ? 'active' : ''}`}
                      onClick={() => setDownloadFormat('pdf')}
                    >
                      📄 PDF
                    </button>
                    <button
                      className={`format-btn ${downloadFormat === 'word' ? 'active' : ''}`}
                      onClick={() => setDownloadFormat('word')}
                    >
                      📝 Word
                    </button>
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn-download"
                      onClick={() => handleDownload(selectedQuote, viewMode)}
                    >
                      <Download size={20} /> Baixar {downloadFormat === 'pdf' ? 'PDF' : 'Word'} ({viewMode === 'internal' ? 'Interno' : 'Cliente'})
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(selectedQuote.quoteNumber)}
                    >
                      <Trash2 size={20} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesHistoryPage;
