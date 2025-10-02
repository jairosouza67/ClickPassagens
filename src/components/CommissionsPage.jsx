import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, FileText, Calendar, Download } from 'lucide-react';
import './CommissionsPage.css';

const CommissionsPage = () => {
  const [period, setPeriod] = useState('mes'); // 'mes', 'trimestre', 'ano'

  const stats = [
    {
      icon: '💰',
      label: 'Comissões Totais',
      value: 'R$ 12.450,00',
      change: '+15.3%',
      positive: true
    },
    {
      icon: '✈️',
      label: 'Vendas Realizadas',
      value: '48',
      change: '+8',
      positive: true
    },
    {
      icon: '👥',
      label: 'Clientes Ativos',
      value: '127',
      change: '+12',
      positive: true
    },
    {
      icon: '📈',
      label: 'Taxa Média',
      value: '8.5%',
      change: '+0.5%',
      positive: true
    }
  ];

  const recentSales = [
    {
      id: 1,
      cliente: 'João Silva',
      rota: 'GRU → MIA',
      data: '2024-10-01',
      valor: 'R$ 4.200,00',
      comissao: 'R$ 357,00',
      status: 'pago'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      rota: 'GIG → LIS',
      data: '2024-09-28',
      valor: 'R$ 3.800,00',
      comissao: 'R$ 323,00',
      status: 'pago'
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      rota: 'BSB → NYC',
      data: '2024-09-25',
      valor: 'R$ 5.500,00',
      comissao: 'R$ 467,50',
      status: 'pendente'
    },
    {
      id: 4,
      cliente: 'Ana Oliveira',
      rota: 'GRU → LON',
      data: '2024-09-22',
      valor: 'R$ 4.900,00',
      comissao: 'R$ 416,50',
      status: 'pago'
    }
  ];

  return (
    <div className="commissions-page">
      <div className="commissions-container">
        {/* Header */}
        <div className="commissions-header">
          <div>
            <h1 className="commissions-title">
              Sistema de <span className="gradient-text">Comissões</span>
            </h1>
            <p className="commissions-subtitle">
              Acompanhe seus ganhos e vendas em tempo real
            </p>
          </div>
          <button className="btn-download">
            <Download size={20} />
            Exportar Relatório
          </button>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <button
            className={`period-btn ${period === 'mes' ? 'active' : ''}`}
            onClick={() => setPeriod('mes')}
          >
            Este Mês
          </button>
          <button
            className={`period-btn ${period === 'trimestre' ? 'active' : ''}`}
            onClick={() => setPeriod('trimestre')}
          >
            Trimestre
          </button>
          <button
            className={`period-btn ${period === 'ano' ? 'active' : ''}`}
            onClick={() => setPeriod('ano')}
          >
            Ano
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-comm">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-comm">
              <div className="stat-icon-comm">{stat.icon}</div>
              <div className="stat-label-comm">{stat.label}</div>
              <div className="stat-value-comm">{stat.value}</div>
              <div className={`stat-change-comm ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? '↗' : '↘'} {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Sales Table */}
        <div className="sales-section">
          <h2 className="section-title-comm">
            <FileText size={24} /> Vendas Recentes
          </h2>
          <div className="table-wrapper-comm">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Rota</th>
                  <th>Data</th>
                  <th>Valor Venda</th>
                  <th>Comissão</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="client-name">{sale.cliente}</td>
                    <td className="route">{sale.rota}</td>
                    <td>{new Date(sale.data).toLocaleDateString('pt-BR')}</td>
                    <td className="value">{sale.valor}</td>
                    <td className="commission">{sale.comissao}</td>
                    <td>
                      <span className={`status-badge ${sale.status}`}>
                        {sale.status === 'pago' ? '✓ Pago' : '⏱ Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="settings-section">
          <h2 className="section-title-comm">
            ⚙️ Configurações de Comissão
          </h2>
          <div className="settings-grid">
            <div className="setting-card">
              <h3>Taxa Padrão</h3>
              <div className="setting-value">8.5%</div>
              <button className="btn-edit">Editar</button>
            </div>
            <div className="setting-card">
              <h3>Pagamento</h3>
              <div className="setting-value">Semanal</div>
              <button className="btn-edit">Editar</button>
            </div>
            <div className="setting-card">
              <h3>Método</h3>
              <div className="setting-value">PIX</div>
              <button className="btn-edit">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionsPage;
