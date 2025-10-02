import React, { useState } from 'react';
import { Home, Search, FileText, Settings, DollarSign, LogOut, Bell, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './DashboardPage.css';

const DashboardPage = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('home');
  
  // Obter dados do usuário autenticado
  const { currentUser, userData, logout } = useAuth();

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    if (onNavigate) {
      // Mapear IDs de menu para tabs do App.jsx
      const tabMap = {
        'home': 'busca',
        'buscas': 'resultados',
        'orcamentos': 'orcamento',
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
    { id: 'buscas', icon: <Search size={20} />, label: 'Minhas Buscas' },
    { id: 'orcamentos', icon: <FileText size={20} />, label: 'Orçamentos' },
    { id: 'comissoes', icon: <DollarSign size={20} />, label: 'Comissões' },
    { id: 'configuracoes', icon: <Settings size={20} />, label: 'Configurações' }
  ];

  // Estatísticas com dados reais do usuário
  const quickStats = [
    { 
      icon: '🔍', 
      label: 'Buscas Realizadas', 
      value: userData?.searches || 0, 
      color: '#3b82f6' 
    },
    { 
      icon: '�', 
      label: 'Orçamentos Gerados', 
      value: userData?.quotes || 0, 
      color: '#10b981' 
    },
    { 
      icon: '⭐', 
      label: 'Plano Atual', 
      value: userData?.plan === 'free' ? 'Gratuito' : 
             userData?.plan === 'basic' ? 'Básico' :
             userData?.plan === 'premium' ? 'Premium' : 'Enterprise',
      color: '#f59e0b' 
    },
    { 
      icon: '📅', 
      label: 'Membro Desde', 
      value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Recente',
      color: '#8b5cf6' 
    }
  ];

  const recentSearches = [
    { id: 1, origem: 'GRU', destino: 'MIA', data: '15/12/2024', status: 'Finalizada' },
    { id: 2, origem: 'GIG', destino: 'LIS', data: '20/11/2024', status: 'Pendente' },
    { id: 3, origem: 'BSB', destino: 'NYC', data: '10/01/2025', status: 'Aguardando' }
  ];

  const upcomingTrips = [
    { destino: 'Miami', data: '15/12/2024', voo: 'G3 1234', status: 'Confirmado' },
    { destino: 'Lisboa', data: '20/01/2025', voo: 'TP 8091', status: 'Confirmado' }
  ];
  
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
            <button className="btn-notification-dash">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
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
          {/* Recent Searches */}
          <div className="dashboard-card">
            <h2 className="card-title-dash">
              <Search size={20} /> Buscas Recentes
            </h2>
            <div className="searches-list">
              {recentSearches.map((search) => (
                <div key={search.id} className="search-item-dash">
                  <div className="search-route-dash">
                    <strong>{search.origem}</strong> → <strong>{search.destino}</strong>
                  </div>
                  <div className="search-date-dash">{search.data}</div>
                  <span className={`search-status-dash ${search.status.toLowerCase()}`}>
                    {search.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-view-all-dash" onClick={() => onNavigate && onNavigate('resultados')}>
              Ver Todas
            </button>
          </div>

          {/* Upcoming Trips */}
          <div className="dashboard-card">
            <h2 className="card-title-dash">
              <Calendar size={20} /> Próximas Viagens
            </h2>
            <div className="trips-list">
              {upcomingTrips.map((trip, index) => (
                <div key={index} className="trip-item-dash">
                  <div className="trip-icon-dash">✈️</div>
                  <div className="trip-details-dash">
                    <div className="trip-destination-dash">{trip.destino}</div>
                    <div className="trip-date-dash">{trip.data}</div>
                    <div className="trip-flight-dash">Voo {trip.voo}</div>
                  </div>
                  <span className="trip-status-confirmed">{trip.status}</span>
                </div>
              ))}
            </div>
            <button className="btn-view-all-dash">Ver Todas</button>
          </div>

          {/* Activity Chart */}
          <div className="dashboard-card full-width">
            <h2 className="card-title-dash">
              <TrendingUp size={20} /> Atividade dos Últimos Meses
            </h2>
            <div className="activity-chart">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, index) => (
                <div key={index} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{ height: `${Math.random() * 100 + 50}px` }}
                  ></div>
                  <div className="chart-label">{month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
