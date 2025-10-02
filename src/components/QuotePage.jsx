import React, { useState, useEffect } from 'react';
import { FileText, Upload, Check, ArrowRight, Calendar, MapPin, Users, Plane, Download, Printer, ArrowLeft } from 'lucide-react';
import { generateInternalQuote, generateClientQuote, saveQuoteToHistory } from '../services/quoteService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import './QuotePage.css';

const QuotePage = ({ selectedFlight, onSubmit, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [internalQuote, setInternalQuote] = useState(null);
  const [clientQuote, setClientQuote] = useState(null);
  const [activeQuoteView, setActiveQuoteView] = useState('client'); // 'client' or 'internal'
  
  // Hook de autenticação para auto-preencher dados do usuário
  const { currentUser, userData, incrementQuotes } = useAuth();
  
  const [formData, setFormData] = useState({
    // Step 1 - Auto-preenchido se houver selectedFlight
    tipo: 'ida-volta',
    origem: '',
    destino: '',
    dataIda: '',
    dataVolta: '',
    passageiros: 1,
    classe: 'economica',
    // Step 2
    nome: '',
    email: '',
    telefone: '',
    // Step 3
    observacoes: '',
    arquivo: null
  });

  const steps = [
    { id: 1, label: 'Viagem', icon: '✈️' },
    { id: 2, label: 'Dados', icon: '👤' },
    { id: 3, label: 'Detalhes', icon: '📋' },
    { id: 4, label: 'Confirmação', icon: '✅' }
  ];

  // Auto-preencher dados do usuário logado
  useEffect(() => {
    if (currentUser && userData) {
      setFormData(prev => ({
        ...prev,
        nome: userData.displayName || currentUser.displayName || prev.nome,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser, userData]);

  // Auto-preencher dados se houver voo selecionado
  useEffect(() => {
    if (selectedFlight) {
      setFormData(prev => ({
        ...prev,
        origem: selectedFlight.origem || '',
        destino: selectedFlight.destino || '',
        dataIda: selectedFlight.data || selectedFlight.dataIda || '',
        dataVolta: selectedFlight.dataVolta || selectedFlight.data_volta || '',
        passageiros: selectedFlight.passageiros || 1,
        classe: selectedFlight.classe || 'economica',
        tipo: selectedFlight.dataVolta || selectedFlight.data_volta ? 'ida-volta' : 'so-ida'
      }));
      
      // Se voo já está selecionado, pode pular direto para step 2
      setCurrentStep(2);
    }
  }, [selectedFlight]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gerar orçamentos
    if (selectedFlight) {
      const passengersData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        passageiros: formData.passageiros
      };
      
      const internal = generateInternalQuote(selectedFlight, passengersData);
      const client = generateClientQuote(selectedFlight, passengersData);
      
      setInternalQuote(internal);
      setClientQuote(client);
      
      // Salvar no histórico
      saveQuoteToHistory(client);
      
      // Incrementar contador de orçamentos do usuário
      if (currentUser) {
        incrementQuotes();
      }
    }
    
    setCurrentStep(4);
    
    if (onSubmit) onSubmit(formData);
  };

  const downloadQuote = (quoteType) => {
    const quote = quoteType === 'internal' ? internalQuote : clientQuote;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quote, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `orcamento-${quoteType}-${quote.quoteNumber}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const printQuote = () => {
    window.print();
  };

  return (
    <div className="quote-page">
      <div className="quote-container">
        {/* Header */}
        <div className="quote-header">
          <h1 className="quote-title">
            Solicite um <span className="gradient-text">Orçamento Personalizado</span>
          </h1>
          <p className="quote-subtitle">
            Preencha os dados e receba as melhores ofertas em até 24 horas
          </p>
        </div>

        {/* Steps Progress */}
        <div className="steps-container">
          <div className="steps-progress">
            <div 
              className="steps-fill" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`step ${currentStep === step.id ? 'active' : ''} ${
                  currentStep > step.id ? 'completed' : ''
                }`}
              >
                <div className="step-number">{step.icon}</div>
                <div className="step-label">{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="quote-form">
          {/* Step 1: Viagem */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2 className="step-title">
                <Plane size={24} /> Informações da Viagem
              </h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Viagem</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                  >
                    <option value="ida-volta">Ida e Volta</option>
                    <option value="somente-ida">Somente Ida</option>
                    <option value="multiplos-destinos">Múltiplos Destinos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Classe</label>
                  <select
                    value={formData.classe}
                    onChange={(e) => handleChange('classe', e.target.value)}
                  >
                    <option value="economica">Econômica</option>
                    <option value="executiva">Executiva</option>
                    <option value="primeira">Primeira Classe</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <MapPin size={16} /> Origem
                  </label>
                  <input
                    type="text"
                    value={formData.origem}
                    onChange={(e) => handleChange('origem', e.target.value)}
                    placeholder="Ex: São Paulo (GRU)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={16} /> Destino
                  </label>
                  <input
                    type="text"
                    value={formData.destino}
                    onChange={(e) => handleChange('destino', e.target.value)}
                    placeholder="Ex: Rio de Janeiro (GIG)"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Calendar size={16} /> Data de Ida
                  </label>
                  <input
                    type="date"
                    value={formData.dataIda}
                    onChange={(e) => handleChange('dataIda', e.target.value)}
                    required
                  />
                </div>

                {formData.tipo === 'ida-volta' && (
                  <div className="form-group">
                    <label>
                      <Calendar size={16} /> Data de Volta
                    </label>
                    <input
                      type="date"
                      value={formData.dataVolta}
                      onChange={(e) => handleChange('dataVolta', e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>
                    <Users size={16} /> Passageiros
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={formData.passageiros}
                    onChange={(e) => handleChange('passageiros', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2 className="step-title">
                👤 Seus Dados de Contato
              </h2>

              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telefone/WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Detalhes */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2 className="step-title">
                <FileText size={24} /> Informações Adicionais
              </h2>

              <div className="form-group">
                <label>Observações (opcional)</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  placeholder="Preferências de horário, bagagem extra, necessidades especiais..."
                  rows={5}
                ></textarea>
              </div>

              <div className="form-group">
                <label>
                  <Upload size={16} /> Anexar Arquivo (opcional)
                </label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={(e) => handleChange('arquivo', e.target.files[0])}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <Upload size={24} />
                    <span>Clique para anexar ou arraste aqui</span>
                    <span className="file-hint">PDF, DOC, JPG até 5MB</span>
                  </label>
                  {formData.arquivo && (
                    <div className="file-selected">
                      ✓ {formData.arquivo.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmação e Orçamentos */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="confirmation-success">
                <div className="success-icon">✅</div>
                <h2>Orçamentos Gerados com Sucesso!</h2>
                <p>Confira abaixo os orçamentos detalhados para sua viagem.</p>
                
                {/* Toggle entre Orçamentos */}
                {internalQuote && clientQuote && (
                  <div className="quote-toggle" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <button
                      className={`quote-toggle-btn ${activeQuoteView === 'client' ? 'active' : ''}`}
                      onClick={() => setActiveQuoteView('client')}
                      style={{
                        padding: '12px 32px',
                        background: activeQuoteView === 'client' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent',
                        border: '2px solid #fbbf24',
                        borderRadius: '8px 0 0 8px',
                        color: activeQuoteView === 'client' ? '#1e293b' : '#fbbf24',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      📄 Orçamento Cliente
                    </button>
                    <button
                      className={`quote-toggle-btn ${activeQuoteView === 'internal' ? 'active' : ''}`}
                      onClick={() => setActiveQuoteView('internal')}
                      style={{
                        padding: '12px 32px',
                        background: activeQuoteView === 'internal' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'transparent',
                        border: '2px solid #10b981',
                        borderRadius: '0 8px 8px 0',
                        color: activeQuoteView === 'internal' ? 'white' : '#10b981',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      💼 Orçamento Interno
                    </button>
                  </div>
                )}

                {/* Orçamento do Cliente */}
                {activeQuoteView === 'client' && clientQuote && (
                  <div className="quote-details" style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ borderBottom: '2px solid #fbbf24', paddingBottom: '1rem', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                        📄 ORÇAMENTO PARA CLIENTE
                      </h3>
                      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                        Número: <strong>{clientQuote.quoteNumber}</strong> | 
                        Válido até: <strong>{new Date(clientQuote.validUntil).toLocaleDateString('pt-BR')}</strong>
                      </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#1e3a8a', marginBottom: '1rem', fontSize: '1.2rem' }}>✈️ Dados da Viagem</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                          <strong>Companhia:</strong> {clientQuote.flight.airline}
                        </div>
                        <div>
                          <strong>Voo:</strong> {clientQuote.flight.flightNumber}
                        </div>
                        <div>
                          <strong>Origem:</strong> {clientQuote.flight.origin.name} ({clientQuote.flight.origin.code})
                        </div>
                        <div>
                          <strong>Destino:</strong> {clientQuote.flight.destination.name} ({clientQuote.flight.destination.code})
                        </div>
                        <div>
                          <strong>Data Ida:</strong> {clientQuote.flight.departure.date}
                        </div>
                        {clientQuote.flight.return && (
                          <div>
                            <strong>Data Volta:</strong> {clientQuote.flight.return.date}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#1e3a8a', marginBottom: '1rem', fontSize: '1.2rem' }}>💰 Valores</h4>
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span>Passagem:</span>
                          <strong style={{ color: '#1e3a8a' }}>
                            R$ {clientQuote.pricing.flightPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span>Taxas de Embarque:</span>
                          <strong>
                            R$ {clientQuote.pricing.taxes.airportTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div style={{ 
                          borderTop: '2px solid #fbbf24', 
                          marginTop: '1rem', 
                          paddingTop: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <strong style={{ fontSize: '1.3rem' }}>TOTAL:</strong>
                          <strong style={{ fontSize: '1.3rem', color: '#fbbf24' }}>
                            R$ {clientQuote.pricing.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>

                      {clientQuote.pricing.milesOption && (
                        <div style={{ marginTop: '1.5rem', background: '#eff6ff', padding: '1.5rem', borderRadius: '12px', border: '2px solid #3b82f6' }}>
                          <h5 style={{ color: '#1e3a8a', marginBottom: '0.75rem' }}>⭐ Opção em Milhas</h5>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Milhas Necessárias:</span>
                            <strong>{clientQuote.pricing.milesOption.totalMiles.toLocaleString('pt-BR')}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Economia:</span>
                            <strong style={{ color: '#10b981' }}>
                              {clientQuote.pricing.milesOption.savings?.percentage}%
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#1e3a8a', marginBottom: '1rem', fontSize: '1.2rem' }}>💳 Formas de Pagamento</h4>
                      {clientQuote.pricing.paymentMethods.map((method, index) => (
                        <div key={index} style={{ 
                          background: '#f8fafc', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          marginBottom: '0.75rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          <strong>{method.method}</strong>
                          {method.finalPrice && (
                            <div style={{ color: '#10b981', marginTop: '0.25rem' }}>
                              R$ {method.finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                              <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>({method.discount})</span>
                            </div>
                          )}
                          {method.installments && (
                            <div style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                              {method.installments} de R$ {method.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          {method.miles && (
                            <div style={{ color: '#3b82f6', marginTop: '0.25rem' }}>
                              {method.miles.toLocaleString('pt-BR')} milhas + R$ {method.taxesCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (taxas)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                      <strong style={{ color: '#92400e' }}>📞 Contato:</strong>
                      <div style={{ color: '#78350f', marginTop: '0.5rem' }}>
                        {clientQuote.agency.name} | {clientQuote.agency.phone} | {clientQuote.agency.email}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => downloadQuote('client')}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Download size={20} /> Baixar Orçamento
                      </button>
                      <button
                        onClick={printQuote}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Printer size={20} /> Imprimir
                      </button>
                    </div>
                  </div>
                )}

                {/* Orçamento Interno */}
                {activeQuoteView === 'internal' && internalQuote && (
                  <div className="quote-details" style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    marginBottom: '2rem',
                    border: '3px solid #10b981'
                  }}>
                    <div style={{ borderBottom: '2px solid #10b981', paddingBottom: '1rem', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                        💼 ORÇAMENTO INTERNO (CONFIDENCIAL)
                      </h3>
                      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                        Número: <strong>{internalQuote.quoteNumber}</strong>
                      </p>
                    </div>

                    <div style={{ marginBottom: '2rem', background: '#dcfce7', padding: '1.5rem', borderRadius: '12px', border: '2px solid #10b981' }}>
                      <h4 style={{ color: '#065f46', marginBottom: '1rem', fontSize: '1.3rem' }}>💰 Análise Financeira</h4>
                      
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
                          <span>Custo Base da Passagem:</span>
                          <strong style={{ color: '#1e3a8a' }}>
                            R$ {internalQuote.pricing.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
                          <span>Taxas de Embarque:</span>
                          <strong>
                            R$ {internalQuote.pricing.airportTaxes.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'white', borderRadius: '8px', border: '2px solid #3b82f6' }}>
                          <span><strong>SUBTOTAL (Custo Real):</strong></span>
                          <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>
                            R$ {internalQuote.pricing.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', border: '2px solid #fbbf24' }}>
                          <span><strong>LUCRO ({internalQuote.pricing.profit.percentage}%):</strong></span>
                          <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>
                            + R$ {internalQuote.pricing.profit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#10b981', borderRadius: '8px', color: 'white' }}>
                          <span><strong style={{ fontSize: '1.2rem' }}>PREÇO AO CLIENTE:</strong></span>
                          <strong style={{ fontSize: '1.4rem' }}>
                            R$ {internalQuote.pricing.clientPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>📋 Detalhamento de Taxas</h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <strong>Origem:</strong> {internalQuote.pricing.airportTaxes.origin.airport} ({internalQuote.pricing.airportTaxes.origin.code})
                          <div style={{ color: '#64748b', marginTop: '0.25rem' }}>
                            Taxa: R$ {internalQuote.pricing.airportTaxes.origin.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        {internalQuote.pricing.airportTaxes.destination && (
                          <div>
                            <strong>Destino:</strong> {internalQuote.pricing.airportTaxes.destination.airport} ({internalQuote.pricing.airportTaxes.destination.code})
                            <div style={{ color: '#64748b', marginTop: '0.25rem' }}>
                              Taxa: R$ {internalQuote.pricing.airportTaxes.destination.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {internalQuote.pricing.miles && (
                      <div style={{ marginBottom: '2rem', background: '#eff6ff', padding: '1.5rem', borderRadius: '12px' }}>
                        <h4 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>⭐ Análise em Milhas</h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Milhas Base (Custo):</span>
                            <strong>{internalQuote.pricing.miles.baseNeeded.toLocaleString('pt-BR')}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Lucro em Milhas ({internalQuote.pricing.miles.profitPercentage}%):</span>
                            <strong style={{ color: '#f59e0b' }}>
                              + {Math.ceil(internalQuote.pricing.miles.profit).toLocaleString('pt-BR')}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid #3b82f6' }}>
                            <strong>Total ao Cliente:</strong>
                            <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>
                              {Math.ceil(internalQuote.pricing.miles.clientTotal).toLocaleString('pt-BR')} milhas
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                      <strong style={{ color: '#92400e' }}>💡 Observações Internas:</strong>
                      <div style={{ color: '#78350f', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        {internalQuote.internalNotes.recommendation}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => downloadQuote('internal')}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Download size={20} /> Baixar Orçamento Interno
                      </button>
                    </div>
                  </div>
                )}
                
                {!internalQuote && !clientQuote && (
                  <div className="summary-card">
                    <h3>Resumo da Solicitação</h3>
                    <div className="summary-item">
                      <span>Rota:</span>
                      <strong>{formData.origem} → {formData.destino}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Data:</span>
                      <strong>{formData.dataIda} {formData.dataVolta && `- ${formData.dataVolta}`}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Passageiros:</span>
                      <strong>{formData.passageiros}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Contato:</span>
                      <strong>{formData.email}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {onBack && currentStep === 1 && (
              <button
                type="button"
                onClick={onBack}
                className="btn-nav btn-previous"
                style={{
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft size={20} /> Voltar aos Resultados
              </button>
            )}
            
            {currentStep > 1 && currentStep < 4 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-nav btn-previous"
              >
                Voltar
              </button>
            )}

            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="btn-nav btn-next"
              >
                Próximo <ArrowRight size={20} />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="submit"
                className="btn-nav btn-submit"
              >
                <Check size={20} /> Gerar Orçamento
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-nav btn-new"
              >
                Nova Solicitação
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotePage;
