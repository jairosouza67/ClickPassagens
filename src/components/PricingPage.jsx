import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import './PricingPage.css';

const PricingPage = ({ onSelectPlan }) => {
  const [billingPeriod, setBillingPeriod] = useState('anual'); // 'mensal' ou 'anual'

  const plans = [
    {
      id: 'gratuito',
      icon: '🆓',
      name: 'Gratuito',
      description: 'Para quem quer testar a plataforma',
      priceMonthly: 0,
      priceYearly: 0,
      consultations: '5 consultas por mês',
      features: [
        'Busca básica de passagens',
        'Comparação simples',
        'Suporte por email',
        'Resultados limitados'
      ],
      buttonText: 'Começar Grátis',
      buttonClass: 'secondary',
      popular: false
    },
    {
      id: 'basico',
      icon: '⭐',
      name: 'Básico',
      description: 'Ideal para viajantes frequentes',
      priceMonthly: 99,
      priceYearly: 79, // 20% de desconto anual
      consultations: '100 consultas por mês',
      features: [
        'Busca avançada de passagens',
        'Filtros completos',
        'Histórico de buscas',
        'Suporte prioritário',
        'Alertas de preços'
      ],
      buttonText: 'Assinar Plano Básico',
      buttonClass: 'secondary',
      popular: false
    },
    {
      id: 'premium',
      icon: '💎',
      name: 'Premium',
      description: 'O favorito dos nossos clientes',
      priceMonthly: 299,
      priceYearly: 239, // 20% de desconto anual
      consultations: '500 consultas por mês',
      features: [
        'Todas as funcionalidades',
        'Orçamentos personalizados',
        'Cashback de 2%',
        'Suporte 24/7',
        'Relatórios avançados',
        'API de integração'
      ],
      buttonText: 'Assinar Plano Premium',
      buttonClass: 'primary',
      popular: true
    },
    {
      id: 'agente',
      icon: '👨‍💼',
      name: 'Agente',
      description: 'Para agentes de viagem profissionais',
      priceMonthly: 499,
      priceYearly: 399, // 20% de desconto anual
      consultations: '1000 consultas por mês',
      features: [
        'Painel do agente completo',
        'Comissões configuráveis',
        'Marca própria (White Label)',
        'Relatórios personalizados',
        'Multi-usuários',
        'Gerente de conta dedicado'
      ],
      buttonText: 'Assinar Plano Agente',
      buttonClass: 'primary',
      popular: false
    }
  ];

  const comparisonFeatures = [
    { name: 'Consultas por mês', values: ['5', '100', '500', '1000'] },
    { name: 'Busca básica', values: [true, true, true, true] },
    { name: 'Filtros avançados', values: [false, true, true, true] },
    { name: 'Histórico de buscas', values: [false, true, true, true] },
    { name: 'Alertas de preços', values: [false, true, true, true] },
    { name: 'Orçamentos personalizados', values: [false, false, true, true] },
    { name: 'Cashback', values: [false, false, '2%', '3%'] },
    { name: 'Suporte', values: ['Email', 'Prioritário', '24/7', 'Dedicado'] },
    { name: 'Marca própria (White Label)', values: [false, false, false, true] },
    { name: 'API de integração', values: [false, false, true, true] }
  ];

  const faqs = [
    {
      icon: '💳',
      question: 'Como funciona o pagamento?',
      answer: 'Aceitamos cartão de crédito, débito e PIX. O pagamento é recorrente mensal ou anual, conforme sua escolha. Você pode cancelar a qualquer momento.'
    },
    {
      icon: '🔄',
      question: 'Posso trocar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O ajuste de valores será feito proporcionalmente.'
    },
    {
      icon: '✈️',
      question: 'O que conta como uma consulta?',
      answer: 'Uma consulta é contada quando você busca passagens em uma companhia aérea específica. Exemplo: Se você busca em 3 companhias, são 3 consultas.'
    },
    {
      icon: '💰',
      question: 'Como funciona o cashback?',
      answer: 'O cashback é calculado sobre cada emissão de passagem. O valor fica disponível na sua conta e pode ser usado para pagar futuras consultas ou resgatado.'
    }
  ];

  const getPrice = (plan) => {
    return billingPeriod === 'anual' ? plan.priceYearly : plan.priceMonthly;
  };

  const handleSelectPlan = (planId) => {
    if (onSelectPlan) {
      onSelectPlan(planId, billingPeriod);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header">
          <div className="pricing-logo">✈️ ClickPassagens</div>
          <h1 className="pricing-title">
            Escolha o <span className="gradient-text">plano perfeito</span> para você
          </h1>
          <p className="pricing-subtitle">
            Todos os planos incluem busca ilimitada nas principais companhias aéreas
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <button
            className={`billing-option ${billingPeriod === 'mensal' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('mensal')}
          >
            💳 Mensal
          </button>
          <button
            className={`billing-option ${billingPeriod === 'anual' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('anual')}
          >
            💰 Anual <span className="discount-badge">-20% OFF</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">⭐ MAIS POPULAR</div>
              )}
              <div className="plan-icon">{plan.icon}</div>
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price">
                <span className="plan-price-value">R$ {getPrice(plan)}</span>
                <span className="plan-price-period">/mês</span>
              </div>
              <p className="plan-consultations">{plan.consultations}</p>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-btn plan-btn-${plan.buttonClass}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="comparison-section">
          <h2 className="comparison-title">📊 Compare todos os recursos</h2>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Funcionalidade</th>
                  <th style={{ textAlign: 'center' }}>Gratuito</th>
                  <th style={{ textAlign: 'center' }}>Básico</th>
                  <th style={{ textAlign: 'center' }}>Premium</th>
                  <th style={{ textAlign: 'center' }}>Agente</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index}>
                    <td className="feature-name">{feature.name}</td>
                    {feature.values.map((value, idx) => (
                      <td key={idx} className="feature-value">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <span className="check-yes">
                              <Check size={20} />
                            </span>
                          ) : (
                            <span className="check-no">
                              <X size={20} />
                            </span>
                          )
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">❓ Perguntas Frequentes</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">
                {faq.icon} {faq.question}
              </div>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}

          {/* Guarantee Badge */}
          <div className="guarantee-badge">
            <h3>🛡️ Garantia de 30 Dias</h3>
            <p>Não ficou satisfeito? Devolvemos seu dinheiro, sem perguntas!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
