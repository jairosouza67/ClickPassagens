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

  // Capturar resultado do redirect (para login Google em mobile/desktop)
  useEffect(() => {
    console.log('🔄 AuthContext: Verificando redirect result...');
    handleRedirectResult().then(result => {
      console.log('🔄 AuthContext: Redirect result:', result);
      if (result.success && result.user) {
        console.log('✅ Login com Google via redirect concluído!', result.user);
        // O onAuthStateChanged já vai pegar o usuário automaticamente
      } else if (result.error) {
        console.error('❌ Erro no redirect:', result.error);
        setAuthError(result.error);
      }
    }).catch(error => {
      console.error('❌ Exceção ao processar redirect:', error);
    });
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
