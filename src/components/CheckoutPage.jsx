import React, { useState } from 'react';
import { CreditCard, Shield, Check, User, MapPin, Phone, Mail } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = ({ flightData, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(2); // 1: Dados, 2: Pagamento, 3: Confirmação
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const flight = flightData || {
    origem: 'GRU',
    destino: 'MIA',
    companhia: 'GOL',
    data: '15/12/2024',
    horario: '08:00',
    preco: 2450.00
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    if (onComplete) {
      setTimeout(() => onComplete(formData), 2000);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-logo">✈️ ClickPassagens</div>
          
          {/* Progress Steps */}
          <div className="checkout-progress">
            <div className="progress-fill-checkout" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
            <div className="checkout-steps">
              <div className={`checkout-step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                <div className="checkout-step-circle">1</div>
                <div className="checkout-step-label">Dados</div>
              </div>
              <div className={`checkout-step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                <div className="checkout-step-circle">2</div>
                <div className="checkout-step-label">Pagamento</div>
              </div>
              <div className={`checkout-step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                <div className="checkout-step-circle">3</div>
                <div className="checkout-step-label">Confirmação</div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Main Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="checkout-step-content">
                  <h2 className="checkout-section-title">
                    <User size={24} /> Dados do Passageiro
                  </h2>

                  <div className="form-row-checkout">
                    <div className="form-group-checkout">
                      <label>Nome Completo *</label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Nome como no documento"
                        required
                      />
                    </div>
                    <div className="form-group-checkout">
                      <label>CPF *</label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-checkout">
                    <div className="form-group-checkout">
                      <label>
                        <Mail size={16} /> E-mail *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="form-group-checkout">
                      <label>
                        <Phone size={16} /> Telefone *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>

                  <h3 className="subsection-title">
                    <MapPin size={20} /> Endereço
                  </h3>

                  <div className="form-group-checkout">
                    <label>Endereço Completo *</label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, número, complemento"
                      required
                    />
                  </div>

                  <div className="form-row-checkout">
                    <div className="form-group-checkout">
                      <label>Cidade *</label>
                      <input
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-checkout">
                      <label>Estado *</label>
                      <select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        {/* Adicionar outros estados */}
                      </select>
                    </div>
                    <div className="form-group-checkout">
                      <label>CEP *</label>
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="checkout-step-content">
                  <h2 className="checkout-section-title">
                    <CreditCard size={24} /> Forma de Pagamento
                  </h2>

                  {/* Payment Methods */}
                  <div className="payment-methods">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'credit-card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('credit-card')}
                    >
                      💳 Cartão de Crédito
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'pix' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      📱 PIX
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'boleto' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      🏦 Boleto
                    </button>
                  </div>

                  {paymentMethod === 'credit-card' && (
                    <>
                      <div className="form-group-checkout">
                        <label>Número do Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          required
                        />
                      </div>

                      <div className="form-group-checkout">
                        <label>Nome no Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          placeholder="Nome como no cartão"
                          required
                        />
                      </div>

                      <div className="form-row-checkout">
                        <div className="form-group-checkout">
                          <label>Validade *</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            placeholder="MM/AA"
                            maxLength="5"
                            required
                          />
                        </div>
                        <div className="form-group-checkout">
                          <label>CVV *</label>
                          <input
                            type="text"
                            value={formData.cardCVV}
                            onChange={(e) => handleInputChange('cardCVV', e.target.value)}
                            placeholder="123"
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>

                      <div className="installments-section">
                        <label>Parcelas</label>
                        <select className="installments-select">
                          <option>1x de R$ {flight.preco.toFixed(2)} sem juros</option>
                          <option>2x de R$ {(flight.preco / 2).toFixed(2)} sem juros</option>
                          <option>3x de R$ {(flight.preco / 3).toFixed(2)} sem juros</option>
                          <option>6x de R$ {(flight.preco / 6).toFixed(2)} sem juros</option>
                        </select>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="pix-info">
                      <div className="pix-icon">📱</div>
                      <h3>Pagamento via PIX</h3>
                      <p>Após confirmar, você receberá um QR Code para realizar o pagamento.</p>
                      <div className="pix-benefit">✓ Aprovação instantânea</div>
                      <div className="pix-benefit">✓ Desconto de 5%</div>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className="boleto-info">
                      <div className="boleto-icon">🏦</div>
                      <h3>Pagamento via Boleto</h3>
                      <p>O boleto será enviado para seu e-mail após a confirmação.</p>
                      <div className="boleto-warning">⚠️ Vencimento em 3 dias úteis</div>
                    </div>
                  )}

                  <div className="security-badge-checkout">
                    <Shield size={24} />
                    <div>
                      <strong>Pagamento 100% Seguro</strong>
                      <p>Seus dados estão protegidos com criptografia SSL</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="checkout-step-content">
                  <div className="confirmation-checkout">
                    <div className="success-icon-checkout">✅</div>
                    <h2>Pagamento Confirmado!</h2>
                    <p>Sua passagem foi reservada com sucesso</p>

                    <div className="booking-code">
                      <strong>Código de Reserva:</strong>
                      <div className="code">ABC123XYZ</div>
                    </div>

                    <div className="confirmation-message">
                      <Check size={20} />
                      <span>E-mail de confirmação enviado para {formData.email}</span>
                    </div>

                    <div className="next-steps">
                      <h3>Próximos Passos:</h3>
                      <ul>
                        <li>✓ Verifique seu e-mail</li>
                        <li>✓ Faça check-in online 24h antes do voo</li>
                        <li>✓ Chegue com 2h de antecedência</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="checkout-navigation">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="btn-checkout-nav btn-back"
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    type={currentStep === 2 ? 'submit' : 'button'}
                    onClick={() => currentStep === 1 && setCurrentStep(2)}
                    className="btn-checkout-nav btn-continue"
                  >
                    {currentStep === 2 ? 'Finalizar Compra' : 'Continuar'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="checkout-summary">
            <h3 className="summary-title">Resumo da Compra</h3>

            <div className="flight-summary">
              <div className="flight-route-summary">
                <strong>{flight.origem}</strong> → <strong>{flight.destino}</strong>
              </div>
              <div className="flight-airline">{flight.companhia} Airlines</div>
              <div className="flight-datetime">
                {flight.data} às {flight.horario}
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-item">
                <span>Passagem</span>
                <span>R$ {flight.preco.toFixed(2)}</span>
              </div>
              <div className="price-item">
                <span>Taxas</span>
                <span>R$ 150.00</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="price-item discount">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {(flight.preco * 0.05).toFixed(2)}</span>
                </div>
              )}
              <div className="price-total">
                <strong>Total</strong>
                <strong>
                  R$ {paymentMethod === 'pix' 
                    ? (flight.preco * 0.95 + 150).toFixed(2)
                    : (flight.preco + 150).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <Shield size={20} />
                <span>Compra Segura</span>
              </div>
              <div className="trust-badge">
                <Check size={20} />
                <span>Garantia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
