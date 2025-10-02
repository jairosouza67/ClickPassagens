import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, FileText, Award, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './UserMenu.css';

export default function UserMenu({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);
  const { currentUser, userData, logout } = useAuth();

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Reset error quando usuário muda
  useEffect(() => {
    setImageError(false);
  }, [currentUser?.photoURL]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setIsOpen(false);
      if (onNavigate) {
        onNavigate('busca');
      }
    }
  };

  const handleMenuClick = (tab) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  if (!currentUser) return null;

  const displayName = userData?.displayName || currentUser.displayName || currentUser.email?.split('@')[0];
  const userInitial = displayName?.charAt(0).toUpperCase() || '?';
  const userPlan = userData?.plan || 'free';
  
  const planNames = {
    free: 'Gratuito',
    basic: 'Básico',
    premium: 'Premium',
    enterprise: 'Enterprise'
  };

  const planColors = {
    free: '#6b7280',
    basic: '#3b82f6',
    premium: '#f59e0b',
    enterprise: '#8b5cf6'
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="user-menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className="user-menu" ref={menuRef}>
        <button 
          className="user-menu-trigger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !isOpen;
            console.log('🔘 CLIQUE NO AVATAR! Estado:', isOpen, '→', newState);
            setIsOpen(newState);
          }}
        >
          <div className="user-avatar">
          {currentUser?.photoURL && !imageError ? (
            <img 
              src={currentUser.photoURL} 
              alt={displayName}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span 
            className="user-plan"
            style={{ color: planColors[userPlan] }}
          >
            {planNames[userPlan]}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`user-menu-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown user-menu-mobile">
          {/* Botão fechar mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="mobile-close-btn"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          
          <div className="user-menu-header">
            <div className="user-menu-avatar-large">
              {currentUser?.photoURL && !imageError ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={displayName}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="user-menu-details">
              <h3>{displayName}</h3>
              <p>{currentUser.email}</p>
              <span 
                className="user-menu-badge"
                style={{ background: planColors[userPlan] }}
              >
                {planNames[userPlan]}
              </span>
            </div>
          </div>

          <div className="user-menu-stats">
            <div className="user-stat">
              <FileText size={16} />
              <div>
                <strong>{userData?.quotes || 0}</strong>
                <span>Orçamentos</span>
              </div>
            </div>
            <div className="user-stat">
              <Award size={16} />
              <div>
                <strong>{userData?.searches || 0}</strong>
                <span>Buscas</span>
              </div>
            </div>
          </div>

          <div className="user-menu-divider" />

          <div className="user-menu-actions">
            <button 
              className="user-menu-item"
              onClick={() => handleMenuClick('dashboard')}
            >
              <User size={18} />
              <span>Meu Painel</span>
            </button>

            <button 
              className="user-menu-item"
              onClick={() => handleMenuClick('orcamento')}
            >
              <FileText size={18} />
              <span>Meus Orçamentos</span>
            </button>

            <button 
              className="user-menu-item"
              onClick={() => handleMenuClick('planos')}
            >
              <Award size={18} />
              <span>Planos e Assinatura</span>
            </button>

            <button 
              className="user-menu-item"
              onClick={() => handleMenuClick('dashboard')}
            >
              <Settings size={18} />
              <span>Configurações</span>
            </button>
          </div>

          <div className="user-menu-divider" />

          <button 
            className="user-menu-item user-menu-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sair da Conta</span>
          </button>
        </div>
      )}
      </div>
    </>
  );
}
