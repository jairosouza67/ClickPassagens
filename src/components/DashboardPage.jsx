import React, { useState, useEffect } from 'react';
import { Home, Search, FileText, Settings, DollarSign, LogOut, Calendar, ShoppingBag, TrendingUp, Plane } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getConfirmedSales, calculateTotalCommissions } from '../services/quoteService.js';
import './DashboardPage.css';

const DashboardPage = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [confirmedSales, setConfirmedSales] = useState([]);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  
  // Obter dados do usuário autenticado
  const { currentUser, userData, logout } = useAuth();

  // Carregar vendas confirmadas e contar orçamentos ao montar componente
  useEffect(() => {
    loadSalesData();
    loadQuotesCount();
    
    // Listener para atualizar quando localStorage mudar (novo orçamento ou venda confirmada)
    const handleStorageChange = () => {
      loadSalesData();
      loadQuotesCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listener customizado para mudanças locais (mesma aba)
    const handleLocalUpdate = () => {
      loadSalesData();
      loadQuotesCount();
    };
    
    window.addEventListener('quotesUpdated', handleLocalUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('quotesUpdated', handleLocalUpdate);
    };
  }, []);

  // Recarregar quando userData mudar (quando incrementQuotes é chamado)
  useEffect(() => {
    if (userData) {
      loadQuotesCount();
    }
  }, [userData?.quotes, userData?.searches]);

  const loadSalesData = () => {
    const sales = getConfirmedSales();
    setConfirmedSales(sales);
    const commissions = calculateTotalCommissions();
    setTotalCommissions(commissions);
  };

  const loadQuotesCount = () => {
    try {
      const history = JSON.parse(localStorage.getItem('quotesHistory') || '[]');
      setTotalQuotes(history.length);
    } catch (error) {
      console.error('Erro ao carregar contagem de orçamentos:', error);
      setTotalQuotes(0);
    }
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    if (onNavigate) {
      // Mapear IDs de menu para tabs do App.jsx
      const tabMap = {
        'home': 'busca',
        'vendas': 'historico-orcamentos',
        'orcamentos': 'historico-orcamentos',
        'comissoes': 'comissoes',
        'configuracoes': 'dashboard'
      };
      if (tabMap[menuId]) {
        onNavigate(tabMap[menuId]);
      }
    }
  };
  
  const handleLogout = async () => {
    const result = await logout();
    if (result.success && onNavigate) {
      onNavigate('busca');
    }
  };

  const menuItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Início' },
    { id: 'vendas', icon: <ShoppingBag size={20} />, label: 'Minhas Vendas' },
    { id: 'orcamentos', icon: <FileText size={20} />, label: 'Orçamentos' },
    { id: 'comissoes', icon: <DollarSign size={20} />, label: 'Comissões' },
    { id: 'configuracoes', icon: <Settings size={20} />, label: 'Configurações' }
  ];

  // Estatísticas com dados reais do usuário
  const quickStats = [
    { 
      icon: '�', 
      label: 'Comissões Totais', 
      value: `R$ ${totalCommissions.toFixed(2)}`, 
      color: '#10b981' 
    },
    { 
      icon: '�', 
      label: 'Vendas Confirmadas', 
      value: confirmedSales.length, 
      color: '#3b82f6' 
    },
    { 
      icon: '📋', 
      label: 'Orçamentos Gerados', 
      value: totalQuotes,
      color: '#f59e0b' 
    },
    { 
      icon: '�', 
      label: 'Buscas Realizadas', 
      value: userData?.searches || 0,
      color: '#8b5cf6' 
    }
  ];

  const recentSales = confirmedSales.slice(0, 5).map(sale => ({
    id: sale.quoteNumber,
    origem: sale.flight?.origin?.code || 'N/A',
    destino: sale.flight?.destination?.code || 'N/A',
    passageiro: sale.passenger?.name || 'N/A',
    data: sale.confirmedAt ? new Date(sale.confirmedAt).toLocaleDateString('pt-BR') : 'N/A',
    valor: sale.pricing?.total || sale.pricing?.clientPrice || 0,
    comissao: sale.pricing?.profit?.amount || (sale.pricing?.total ? sale.pricing.total * 0.30 : 0)
  }));

  const upcomingTrips = confirmedSales
    .filter(sale => {
      // Filtra vendas com data de ida futura
      const departureDate = sale.flight?.departure?.date;
      if (!departureDate) return false;
      
      // Tenta parsear a data (formato: DD/MM/YYYY ou YYYY-MM-DD)
      let tripDate;
      if (departureDate.includes('/')) {
        const [day, month, year] = departureDate.split('/');
        tripDate = new Date(year, month - 1, day);
      } else {
        tripDate = new Date(departureDate);
      }
      
      return tripDate > new Date();
    })
    .slice(0, 4)
    .map(sale => ({
      destino: `${sale.flight?.destination?.name || sale.flight?.destination?.code || 'Destino'}`,
      data: sale.flight?.departure?.date || 'A definir',
      voo: sale.flight?.flightNumber || 'N/A',
      passageiro: sale.passenger?.name || 'N/A',
      status: 'Confirmado'
    }));
  
  // Obter nome e iniciais do usuário
  const displayName = userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuário';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  
  // Nome do plano formatado
  const planNames = {
    free: 'Plano Gratuito',
    basic: 'Plano Básico',
    premium: 'Plano Premium',
    enterprise: 'Plano Enterprise'
  };
  const planName = planNames[userData?.plan] || 'Plano Gratuito';

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar-dash">
        <div className="logo-sidebar-dash">✈️ ClickPassagens</div>

        <div className="user-profile-dash">
          <div className="user-avatar-large-dash">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              userInitials
            )}
          </div>
          <div className="user-details-dash">
            <div className="user-name-dash">{displayName}</div>
            <div className="user-plan-dash">{planName}</div>
          </div>
        </div>

        <nav className="nav-menu-dash">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link-dash ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button className="nav-link-dash logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content-dash">
        {/* Top Bar */}
        <div className="top-bar-dash">
          <div className="welcome-message-dash">
            <h1>Bem-vindo de volta, <span className="gradient-text">{displayName.split(' ')[0]}</span>!</h1>
            <p>Aqui está o resumo da sua conta</p>
          </div>
          <div className="top-actions-dash">
            <button className="btn-new-search-dash" onClick={() => onNavigate && onNavigate('busca')}>
              <Search size={20} />
              Nova Busca
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-dash">
          {quickStats.map((stat, index) => (
            <div key={index} className="quick-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon-dash">{stat.icon}</div>
              <div>
                <div className="stat-label-dash">{stat.label}</div>
                <div className="stat-value-dash" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Minhas Vendas */}
          <div className="dashboard-card">
            <h2 className="card-title-dash">
              <ShoppingBag size={20} /> Minhas Vendas
            </h2>
            {recentSales.length === 0 ? (
              <div className="empty-state-dash">
                <ShoppingBag size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <p style={{ color: '#64748b', textAlign: 'center' }}>
                  Ainda não há vendas confirmadas.<br/>
                  Marque orçamentos como vendidos para vê-los aqui!
                </p>
                <button 
                  className="btn-view-all-dash" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => onNavigate && onNavigate('historico-orcamentos')}
                >
                  Ver Orçamentos
                </button>
              </div>
            ) : (
              <>
                <div className="sales-list">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="sale-item-dash">
                      <div className="sale-route-info">
                        <div className="sale-route-dash">
                          <strong>{sale.origem}</strong>
                          <Plane size={14} style={{ color: '#64748b' }} />
                          <strong>{sale.destino}</strong>
                        </div>
                        <div className="sale-passenger-dash">{sale.passageiro}</div>
                        <div className="sale-date-dash">Vendido em: {sale.data}</div>
                      </div>
                      <div className="sale-values-dash">
                        <div className="sale-price">R$ {sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div className="sale-commission">Comissão: R$ {sale.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-view-all-dash" onClick={() => onNavigate && onNavigate('historico-orcamentos')}>
                  Ver Todas as Vendas
                </button>
              </>
            )}
          </div>

          {/* Orçamentos Salvos */}
          <div className="dashboard-card">
            <h2 className="card-title-dash">
              <FileText size={20} /> Orçamentos Pendentes
            </h2>
            <div className="orcamentos-preview">
              <div className="orcamento-stat">
                <span className="stat-number">{totalQuotes - confirmedSales.length}</span>
                <span className="stat-text">Aguardando Confirmação</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '1rem 0' }}>
                Acesse todos os seus orçamentos, confirme vendas e baixe documentos
              </p>
            </div>
            <button className="btn-view-all-dash" onClick={() => onNavigate && onNavigate('historico-orcamentos')}>
              Ver Orçamentos
            </button>
          </div>

          {/* Próximas Viagens */}
          <div className="dashboard-card full-width">
            <h2 className="card-title-dash">
              <Calendar size={20} /> Próximas Viagens
            </h2>
            {upcomingTrips.length === 0 ? (
              <div className="empty-state-dash">
                <Calendar size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <p style={{ color: '#64748b', textAlign: 'center' }}>
                  Nenhuma viagem futura confirmada.<br/>
                  Vendas confirmadas com datas futuras aparecerão aqui!
                </p>
              </div>
            ) : (
              <div className="trips-list">
                {upcomingTrips.map((trip, index) => (
                  <div key={index} className="trip-item-dash">
                    <div className="trip-icon-dash">✈️</div>
                    <div className="trip-details-dash">
                      <div className="trip-destination-dash">{trip.destino}</div>
                      <div className="trip-passenger-dash">{trip.passageiro}</div>
                      <div className="trip-date-dash">Data: {trip.data}</div>
                      <div className="trip-flight-dash">Voo {trip.voo}</div>
                    </div>
                    <span className="trip-status-confirmed">{trip.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
