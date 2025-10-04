import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  handleRedirectResult,
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
  getUserData,
  updateUserData,
  onAuthChange
} from '../config/firebase';

const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verificação básica de redirect - apenas para limpeza de URL
  useEffect(() => {
    const checkForRedirect = () => {
      try {
        // Verificar se há parâmetros de autenticação na URL
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthParams = urlParams.toString().includes('auth') || 
                             urlParams.toString().includes('code') ||
                             urlParams.toString().includes('state');
        
        if (hasAuthParams) {
          console.log('🔍 AuthContext: Parâmetros auth detectados na URL');
          
          // Limpar URL após um tempo (o firebase.js vai processar)
          setTimeout(() => {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            console.log('✅ AuthContext: URL limpa');
          }, 3000);
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro ao verificar URL:', error);
      }
    };
    
    checkForRedirect();
  }, []);

  // Listener para mudanças na autenticação
  useEffect(() => {
    console.log('🎧 AuthContext: Registrando listener onAuthChange...');
    const unsubscribe = onAuthChange(async (user) => {
      console.log('🔔 AuthContext: onAuthChange disparado! Usuário:', user ? user.email : 'null');
      setCurrentUser(user);
      
      if (user) {
        console.log('📥 AuthContext: Carregando dados do Firestore para:', user.uid);
        // Carregar dados do Firestore
        const result = await getUserData(user.uid);
        if (result.success) {
          console.log('✅ AuthContext: Dados carregados:', result.data);
          setUserData(result.data);
        } else {
          console.log('⚠️ AuthContext: Erro ao carregar dados:', result.error);
        }
      } else {
        console.log('🚪 AuthContext: Usuário deslogado, limpando dados');
        setUserData(null);
      }
      
      setLoading(false);
      console.log('✅ AuthContext: Loading = false');
    });

    return unsubscribe;
  }, []);

  // Registrar novo usuário
  async function signup(email, password, displayName) {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await registerWithEmail(email, password, displayName);
      
      if (!result.success) {
        setAuthError(result.error);
        return result;
      }
      
      return result;
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // Login com email e senha
  async function login(email, password) {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await loginWithEmail(email, password);
      
      if (!result.success) {
        setAuthError(result.error);
        return result;
      }
      
      return result;
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // Login com Google
  async function googleLogin() {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await loginWithGoogle();
      
      if (!result.success) {
        setAuthError(result.error);
        setLoading(false);
        return result;
      }
      
      // Se for redirect, não desabilitar loading - a página vai recarregar
      if (!result.redirect) {
        setLoading(false);
      }
      
      return result;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  }

  // Logout
  async function logout() {
    try {
      setAuthError(null);
      const result = await firebaseLogout();
      return result;
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  }

  // Resetar senha
  async function resetPassword(email) {
    try {
      setAuthError(null);
      const result = await firebaseResetPassword(email);
      
      if (!result.success) {
        setAuthError(result.error);
        return result;
      }
      
      return result;
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  }

  // Atualizar dados do usuário
  async function updateUser(data) {
    if (!currentUser) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await updateUserData(currentUser.uid, data);
      
      if (result.success) {
        // Atualizar dados locais
        setUserData(prev => ({ ...prev, ...data }));
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Incrementar contador de buscas
  async function incrementSearches() {
    if (!currentUser || !userData) return;
    
    const newCount = (userData.searches || 0) + 1;
    await updateUser({ searches: newCount });
  }

  // Incrementar contador de orçamentos
  async function incrementQuotes() {
    if (!currentUser || !userData) return;
    
    const newCount = (userData.quotes || 0) + 1;
    await updateUser({ quotes: newCount });
  }

  const value = {
    currentUser,
    userData,
    loading,
    authError,
    signup,
    login,
    googleLogin,
    logout,
    resetPassword,
    updateUser,
    incrementSearches,
    incrementQuotes,
    isAuthenticated: !!currentUser,
    isPremium: userData?.plan === 'premium' || userData?.plan === 'enterprise'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
