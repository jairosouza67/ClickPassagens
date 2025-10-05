import React from 'react';
import { Plane, Target, Zap, Shield, Users, TrendingUp, Award, Heart, ArrowRight } from 'lucide-react';
import './AboutPage.css';

const AboutPage = ({ onNavigate }) => {
  const values = [
    {
      icon: <Zap size={32} />,
      title: 'Agilidade',
      description: 'Respostas rápidas para decisões urgentes de viagem'
    },
    {
      icon: <Shield size={32} />,
      title: 'Transparência',
      description: 'Clareza em cada orçamento e recomendação'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Economia',
      description: 'Aproveitamento inteligente de milhas e melhores preços'
    },
    {
      icon: <Award size={32} />,
      title: 'Qualidade',
      description: 'Serviço profissional sem comprometer a excelência'
    }
  ];

  const features = [
    'Busca simultânea em múltiplas companhias aéreas',
    'Análise automática de economia com milhas',
    'Comparação inteligente de rotas e conexões',
    'Orçamentos profissionais prontos para o cliente',
    'Histórico completo de buscas e vendas',
    'Cálculo automático de comissões'
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="hero-badge">
            <Plane size={20} />
            <span>Sobre Nós</span>
          </div>
          <h1 className="about-title">
            Facilitando viagens para
            <span className="gradient-text"> empresas inteligentes</span>
          </h1>
          <p className="about-subtitle">
            Rapidez, economia e transparência para quem trabalha com viagens todos os dias
          </p>
        </div>
        <div className="hero-decoration">
          <div className="floating-plane">✈️</div>
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="about-story">
        <div className="container-about">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">
                <Target size={28} />
                Nossa História
              </h2>
              <div className="story-paragraphs">
                <p>
                  A <strong>ClickPassagens</strong> nasceu para facilitar a rotina de empresas que lidam 
                  diariamente com viagens. Entendemos que, ao atender o público, rapidez e custo-benefício 
                  fazem toda a diferença — por isso nos especializamos em buscar as melhores opções de 
                  passagens e em aproveitar milhas sempre que for vantajoso.
                </p>
                <p>
                  Nossa missão é permitir que agências, operadoras e times de atendimento economizem tempo 
                  e dinheiro, sem abrir mão da qualidade do serviço prestado ao cliente. Trabalhamos com 
                  transparência, agilidade e foco em resultados: analisamos alternativas, apresentamos as 
                  melhores rotas e destacamos oportunidades reais de economia usando milhas.
                </p>
                <p>
                  Seja para viagens emergenciais ou planejamento, a ClickPassagens é parceira das empresas 
                  que querem otimizar cada deslocamento com segurança e eficiência.
                </p>
              </div>
              <button className="btn-cta-about" onClick={() => onNavigate && onNavigate('busca')}>
                Começar agora
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="story-visual">
              <div className="visual-card card-primary">
                <Users size={48} />
                <h3>Para Empresas</h3>
                <p>Agências, operadoras e times de atendimento</p>
              </div>
              <div className="visual-card card-secondary">
                <Heart size={48} />
                <h3>Foco no Cliente</h3>
                <p>Qualidade e eficiência em cada viagem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="about-values">
        <div className="container-about">
          <h2 className="section-title-center">
            O que nos move
          </h2>
          <p className="section-subtitle-center">
            Valores que guiam cada decisão e cada orçamento
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que oferecemos */}
      <section className="about-features">
        <div className="container-about">
          <div className="features-content">
            <div className="features-header">
              <h2 className="section-title">
                O que oferecemos
              </h2>
              <p className="features-intro">
                Ferramentas profissionais para otimizar seu trabalho com viagens
              </p>
            </div>
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-check">✓</div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="about-cta">
        <div className="container-about">
          <div className="cta-content">
            <h2>Pronto para economizar tempo e dinheiro?</h2>
            <p>Junte-se às empresas que já otimizam suas viagens com a ClickPassagens</p>
            <div className="cta-buttons">
              <button className="btn-primary-cta" onClick={() => onNavigate && onNavigate('busca')}>
                <Plane size={20} />
                Fazer uma busca
              </button>
              <button className="btn-secondary-cta" onClick={() => onNavigate && onNavigate('dashboard')}>
                Ver Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
