import React, { useState } from 'react';
import { FileText, Upload, Check, ArrowRight, Calendar, MapPin, Users, Plane } from 'lucide-react';
import './QuotePage.css';

const QuotePage = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
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
    if (onSubmit) onSubmit(formData);
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

          {/* Step 4: Confirmação */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="confirmation-success">
                <div className="success-icon">✅</div>
                <h2>Orçamento Solicitado com Sucesso!</h2>
                <p>Recebemos sua solicitação e em breve entraremos em contato.</p>
                
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
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
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
                type="button"
                onClick={handleNext}
                className="btn-nav btn-submit"
              >
                <Check size={20} /> Enviar Solicitação
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
