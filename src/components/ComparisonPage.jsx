import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, Check, X, Calculator } from 'lucide-react';
import './ComparisonPage.css';

const ComparisonPage = ({ onSelect }) => {
  const [viewMode, setViewMode] = useState('comparison'); // 'comparison' ou 'calculator'
  const [calculatorInputs, setCalculatorInputs] = useState({
    milhas: 50000,
    precoPorMilha: 0.015,
    taxas: 150,
    precoPassagem: 1500
  });

  const milesOption = {
    icon: '✈️',
    title: 'Pagar com Milhas',
    subtitle: 'Economize usando seus pontos',
    price: '50.000',
    priceLabel: 'milhas + R$ 150',
    subPrice: 'Taxas e emissão',
    savings: 'Economia de 65%',
    recommended: true,
    features: [
      { text: 'Sem pagar passagem', available: true },
      { text: 'Use seus pontos acumulados', available: true },
      { text: 'Upgrade de classe', available: true },
      { text: 'Pagamento flexível', available: true },
      { text: 'Sem tarifas ocultas', available: true }
    ]
  };

  const cashOption = {
    icon: '💵',
    title: 'Pagar em Dinheiro',
    subtitle: 'Pagamento tradicional à vista',
    price: 'R$ 1.500',
    priceLabel: 'valor total',
    subPrice: 'Sem taxas adicionais',
    savings: null,
    recommended: false,
    features: [
      { text: 'Pagamento à vista ou parcelado', available: true },
      { text: 'Acumula milhas', available: true },
      { text: 'Cashback no cartão', available: true },
      { text: 'Upgrade de classe', available: false },
      { text: 'Reembolso total', available: true }
    ]
  };

  const comparisonData = [
    { feature: 'Custo Total', miles: 'R$ 900 (50k milhas + taxas)', cash: 'R$ 1.500' },
    { feature: 'Economia', miles: 'R$ 600 (40%)', cash: '-' },
    { feature: 'Formas de Pagamento', miles: 'Milhas + Dinheiro', cash: 'Dinheiro/Cartão' },
    { feature: 'Upgrade de Classe', miles: 'Disponível', cash: 'Não disponível' },
    { feature: 'Flexibilidade', miles: 'Alta', cash: 'Média' },
    { feature: 'Acúmulo de Pontos', miles: 'Não', cash: 'Sim (até 3%)' }
  ];

  const calculateComparison = () => {
    const { milhas, precoPorMilha, taxas, precoPassagem } = calculatorInputs;
    const custoMilhas = (milhas * precoPorMilha) + taxas;
    const economia = precoPassagem - custoMilhas;
    const percentualEconomia = ((economia / precoPassagem) * 100).toFixed(1);

    return {
      custoMilhas,
      economia,
      percentualEconomia,
      valeAPena: economia > 0
    };
  };

  const result = calculateComparison();

  return (
    <div className="comparison-page">
      <div className="comparison-container">
        {/* Header */}
        <div className="comparison-header">
          <div className="comparison-logo">✈️ ClickPassagens</div>
          <h1 className="comparison-title">
            <span className="gradient-text">Milhas</span> ou <span className="gradient-text-green">Dinheiro</span>?
          </h1>
          <p className="comparison-subtitle">
            Compare e descubra a melhor forma de pagar sua passagem
          </p>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => setViewMode('comparison')}
          >
            📊 Comparação
          </button>
          <button
            className={`toggle-btn ${viewMode === 'calculator' ? 'active' : ''}`}
            onClick={() => setViewMode('calculator')}
          >
            🧮 Calculadora
          </button>
        </div>

        {viewMode === 'comparison' ? (
          <>
            {/* Comparison Grid */}
            <div className="comparison-grid-comp">
              {/* Miles Option */}
              <div className={`option-card ${milesOption.recommended ? 'recommended' : ''}`}>
                {milesOption.recommended && (
                  <div className="recommended-badge">⭐ RECOMENDADO</div>
                )}
                <div className="option-type">{milesOption.icon}</div>
                <h2 className="option-title option-miles">{milesOption.title}</h2>
                <p className="option-subtitle">{milesOption.subtitle}</p>

                <div className="price-display">
                  <div className="price-main miles-color">{milesOption.price}</div>
                  <div className="price-sub">{milesOption.priceLabel}</div>
                  {milesOption.savings && (
                    <div className="savings-badge">{milesOption.savings}</div>
                  )}
                </div>

                <ul className="features-list">
                  {milesOption.features.map((feature, index) => (
                    <li key={index}>
                      {feature.available ? (
                        <Check size={20} className="check-yes" />
                      ) : (
                        <X size={20} className="check-no" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <button 
                  className="btn-select-option btn-miles"
                  onClick={() => onSelect && onSelect('miles')}
                >
                  <Zap size={20} />
                  Escolher Milhas
                </button>
              </div>

              {/* Cash Option */}
              <div className="option-card">
                <div className="option-type">{cashOption.icon}</div>
                <h2 className="option-title option-cash">{cashOption.title}</h2>
                <p className="option-subtitle">{cashOption.subtitle}</p>

                <div className="price-display">
                  <div className="price-main cash-color">{cashOption.price}</div>
                  <div className="price-sub">{cashOption.priceLabel}</div>
                </div>

                <ul className="features-list">
                  {cashOption.features.map((feature, index) => (
                    <li key={index}>
                      {feature.available ? (
                        <Check size={20} className="check-yes" />
                      ) : (
                        <X size={20} className="check-no" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <button 
                  className="btn-select-option btn-cash"
                  onClick={() => onSelect && onSelect('cash')}
                >
                  <DollarSign size={20} />
                  Escolher Dinheiro
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="comparison-table-section">
              <h2 className="table-title">📊 Comparação Detalhada</h2>
              <div className="table-wrapper-comp">
                <table className="comparison-table-comp">
                  <thead>
                    <tr>
                      <th>Característica</th>
                      <th>✈️ Milhas</th>
                      <th>💵 Dinheiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.feature}</td>
                        <td className="value-miles">{row.miles}</td>
                        <td className="value-cash">{row.cash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Calculator Section */
          <div className="calculator-section">
            <h2 className="calculator-title">🧮 Calculadora de Milhas</h2>
            <p className="calculator-subtitle">
              Calcule se vale a pena usar suas milhas nesta passagem
            </p>

            <div className="calculator-form">
              <div className="form-group">
                <label>Quantidade de Milhas</label>
                <input
                  type="number"
                  value={calculatorInputs.milhas}
                  onChange={(e) => setCalculatorInputs(prev => ({ ...prev, milhas: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 50000"
                />
              </div>

              <div className="form-group">
                <label>Preço por Milha (R$)</label>
                <input
                  type="number"
                  step="0.001"
                  value={calculatorInputs.precoPorMilha}
                  onChange={(e) => setCalculatorInputs(prev => ({ ...prev, precoPorMilha: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 0.015"
                />
              </div>

              <div className="form-group">
                <label>Taxas e Emissão (R$)</label>
                <input
                  type="number"
                  value={calculatorInputs.taxas}
                  onChange={(e) => setCalculatorInputs(prev => ({ ...prev, taxas: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 150"
                />
              </div>

              <div className="form-group">
                <label>Preço da Passagem (R$)</label>
                <input
                  type="number"
                  value={calculatorInputs.precoPassagem}
                  onChange={(e) => setCalculatorInputs(prev => ({ ...prev, precoPassagem: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 1500"
                />
              </div>
            </div>

            <div className={`calculator-result ${result.valeAPena ? 'vale-pena' : 'nao-vale'}`}>
              <h3>
                {result.valeAPena ? '✅ Vale a pena usar milhas!' : '❌ Melhor pagar em dinheiro'}
              </h3>
              <div className="result-details">
                <div className="result-item">
                  <span className="result-label">Custo com Milhas:</span>
                  <span className="result-value">R$ {result.custoMilhas.toFixed(2)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Economia:</span>
                  <span className="result-value saving">
                    R$ {Math.abs(result.economia).toFixed(2)} ({result.percentualEconomia}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
