import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Chrome, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, googleLogin, resetPassword, currentUser } = useAuth();

  // Fechar modal automaticamente se o usuário estiver logado
  useEffect(() => {
    if (isOpen && currentUser) {
      console.log('✅ AuthModal: Usuário logado, fechando modal');
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [isOpen, currentUser, onClose]);

  // Prevenir scroll do body quando modal estiver aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setLocalError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (mode === 'reset') {
      if (!formData.email) {
        setLocalError('Digite seu email');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setLocalError('Email inválido');
        return false;
      }
      return true;
    }

    if (!formData.email || !formData.password) {
      setLocalError('Preencha todos os campos');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Email inválido');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (mode === 'signup') {
      if (!formData.displayName) {
        setLocalError('Digite seu nome');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('As senhas não coincidem');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLocalError('');
    setSuccess('');

    try {
      let result;

      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else if (mode === 'signup') {
        result = await signup(formData.email, formData.password, formData.displayName);
      } else if (mode === 'reset') {
        result = await resetPassword(formData.email);
      }

      if (result.success) {
        if (mode === 'reset') {
          setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setTimeout(() => {
            setMode('login');
            setSuccess('');
          }, 3000);
        } else {
          setSuccess(mode === 'login' ? 'Login realizado!' : 'Conta criada com sucesso!');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1000);
        }
      } else {
        setLocalError(result.error);
      }
    } catch (error) {
      setLocalError('Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔵 [AuthModal.handleGoogleLogin] Iniciando...');
    setIsLoading(true);
    setLocalError('');
    
    try {
      console.log('🔵 [AuthModal.handleGoogleLogin] Chamando googleLogin()...');
      const result = await googleLogin();
      console.log('🔵 [AuthModal.handleGoogleLogin] Resultado:', result);
      
      if (result.success) {
        console.log('✅ [AuthModal.handleGoogleLogin] Sucesso!');
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        console.log('❌ [AuthModal.handleGoogleLogin] Falhou:', result.error);
        setLocalError(result.error || 'Erro ao fazer login com Google');
      }
    } catch (error) {
      console.error('❌ [AuthModal.handleGoogleLogin] Exceção:', error);
      setLocalError('Erro ao fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
    setLocalError('');
    setSuccess('');
    setMode('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="auth-modal-header">
          <h2>
            {mode === 'login' && '🔐 Entrar na Conta'}
            {mode === 'signup' && '✨ Criar Conta'}
            {mode === 'reset' && '🔑 Recuperar Senha'}
          </h2>
          <p>
            {mode === 'login' && 'Acesse sua conta ClickPassagens'}
            {mode === 'signup' && 'Crie sua conta e aproveite todas as funcionalidades'}
            {mode === 'reset' && 'Enviaremos um link de recuperação para seu email'}
          </p>
        </div>

        {/* Mensagens de erro e sucesso */}
        {localError && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={20} />
            <span>{localError}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>
                <User size={18} />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                name="displayName"
                placeholder="Digite seu nome"
                value={formData.displayName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {mode !== 'reset' && (
            <div className="auth-input-group">
              <label>
                <Lock size={18} />
                <span>Senha</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>
                <Lock size={18} />
                <span>Confirmar Senha</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>🔄 Processando...</>
            ) : (
              <>
                {mode === 'login' && '🔓 Entrar'}
                {mode === 'signup' && '✨ Criar Conta'}
                {mode === 'reset' && '📧 Enviar Link'}
              </>
            )}
          </button>
        </form>

        {/* Login com Google */}
        {mode !== 'reset' && (
          <>
            <div className="auth-divider">
              <span>ou</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="auth-google-btn"
              disabled={isLoading}
            >
              <Chrome size={20} />
              Continuar com Google
            </button>
          </>
        )}

        {/* Links de navegação */}
        <div className="auth-footer">
          {mode === 'login' && (
            <>
              <button 
                type="button"
                onClick={() => setMode('reset')}
                className="auth-link"
              >
                Esqueci minha senha
              </button>
              <p>
                Não tem uma conta?{' '}
                <button 
                  type="button"
                  onClick={() => setMode('signup')}
                  className="auth-link-primary"
                >
                  Criar conta
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p>
              Já tem uma conta?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="auth-link-primary"
              >
                Fazer login
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p>
              Lembrou sua senha?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="auth-link-primary"
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
