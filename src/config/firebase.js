// Firebase Configuration
// Para configurar o Firebase:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto ou use um existente
// 3. Vá em "Configurações do Projeto" > "Seus aplicativos" > "Adicionar app" > "Web"
// 4. Copie as credenciais e substitua abaixo
// 5. Ative "Authentication" no console Firebase
// 6. Ative os provedores: Email/Password, Google, etc.

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase Configuration
// ⚠️ IMPORTANTE: As credenciais agora vêm do arquivo .env
// Nunca exponha suas credenciais diretamente no código!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar configuração
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ ERRO: Variáveis do Firebase não configuradas!');
  console.error('Verifique se o arquivo .env possui as variáveis VITE_FIREBASE_*');
  throw new Error('Firebase configuration is missing. Check your .env file.');
}

console.log('✅ Firebase configurado com sucesso!', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configurar persistência LOCAL (crucial para mobile)
// Isso garante que a sessão persista mesmo após fechar o navegador
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Persistência LOCAL configurada (sessão mantida)');
  })
  .catch((error) => {
    console.error('⚠️ Erro ao configurar persistência:', error);
  });

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Registra um novo usuário com email e senha
 */
export async function registerWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar perfil com nome
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || '',
      plan: 'free', // Plano inicial
      searches: 0,
      quotes: 0
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Erro no registro:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Login com email e senha
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Login com Google - VERSÃO SIMPLIFICADA (apenas popup)
 */
export async function loginWithGoogle() {
  try {
    console.log('🔵 [Firebase] Iniciando login com Google...');
    console.log('🔵 [Firebase] Auth:', auth);
    console.log('🔵 [Firebase] Provider:', googleProvider);
    
    // SEMPRE usar popup (simplificado)
    console.log('🪟 [Firebase] Chamando signInWithPopup...');
    const result = await signInWithPopup(auth, googleProvider);
    
    console.log('✅ [Firebase] Popup retornou resultado:', result);
    const user = result.user;
    console.log('✅ [Firebase] User email:', user.email);
    console.log('✅ [Firebase] User displayName:', user.displayName);
    
    // Verificar/criar documento do usuário
    console.log('📄 [Firebase] Verificando documento no Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.log('📝 [Firebase] Documento não existe, criando...');
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || '',
        plan: 'free',
        searches: 0,
        quotes: 0
      });
      console.log('✅ [Firebase] Documento criado com sucesso!');
    } else {
      console.log('✅ [Firebase] Documento já existe');
    }
    
    console.log('🎉 [Firebase] Login Google concluído com sucesso!');
    return { success: true, user };
    
  } catch (error) {
    console.error('❌ [Firebase] ERRO no login Google:');
    console.error('❌ [Firebase] Nome:', error.name);
    console.error('❌ [Firebase] Código:', error.code);
    console.error('❌ [Firebase] Mensagem:', error.message);
    console.error('❌ [Firebase] Objeto completo:', error);
    
    // Tratamento de erros
    let errorMessage = 'Erro ao fazer login com Google';
    
    switch(error.code) {
      case 'auth/popup-blocked':
        errorMessage = 'Popup bloqueado! Permita popups no navegador.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Você fechou a janela de login.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Aguarde e tente novamente.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'Domínio não autorizado. Configure no Firebase.';
        break;
      default:
        errorMessage = getErrorMessage(error.code) || error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Capturar resultado do redirect (para login Google em mobile)
 */
export async function handleRedirectResult() {
  try {
    console.log('🔄 firebase.js: Chamando getRedirectResult...');
    console.log('🔄 firebase.js: Usuário atual antes:', auth.currentUser ? auth.currentUser.email : 'null');
    
    const result = await getRedirectResult(auth);
    console.log('🔄 firebase.js: getRedirectResult retornou:', result);
    console.log('🔄 firebase.js: Usuário atual depois:', auth.currentUser ? auth.currentUser.email : 'null');
    
    // Se getRedirectResult retornar algo, processar normalmente
    if (result && result.user) {
      const user = result.user;
      console.log('✅ firebase.js: Usuário do redirect:', user.email);
      
      // Verificar se é novo usuário
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('📄 firebase.js: Documento do usuário existe?', userDoc.exists());
      
      if (!userDoc.exists()) {
        console.log('📝 firebase.js: Criando novo documento de usuário...');
        // Criar documento para novo usuário
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || '',
          plan: 'free',
          searches: 0,
          quotes: 0
        });
        console.log('✅ firebase.js: Documento criado com sucesso!');
      }
      
      // Marcar que o redirect foi processado com sucesso
      sessionStorage.setItem('googleLoginSuccess', 'true');
      console.log('✅ firebase.js: handleRedirectResult - Login bem-sucedido!');
      return { success: true, user };
    }
    
    // FALLBACK: Se getRedirectResult retornou null mas há usuário autenticado
    // (isso pode acontecer se a página recarregou após o redirect)
    if (!result && auth.currentUser) {
      console.log('⚡ firebase.js: getRedirectResult null, mas há usuário autenticado!');
      const user = auth.currentUser;
      
      // Verificar/criar documento
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log('📝 firebase.js: Criando documento do usuário logado...');
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || '',
          plan: 'free',
          searches: 0,
          quotes: 0
        });
      }
      
      return { success: true, user };
    }
    
    // ABORDAGEM ALTERNATIVA: Verificação direta do usuário atual
    // Para mobile, às vezes o Firebase autentica mas não retorna pelo getRedirectResult
    
    console.log('📱 firebase.js: Verificando autenticação mobile alternativa');
    
    // Verificar se há parâmetros de auth na URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.toString().includes('auth') || 
                         urlParams.toString().includes('code') ||
                         urlParams.toString().includes('state');
    
    console.log('📱 firebase.js: URL:', window.location.href);
    console.log('📱 firebase.js: Tem parâmetros auth?', hasAuthParams);
    
    if (hasAuthParams) {
      console.log('🚨 firebase.js: PARÂMETROS AUTH DETECTADOS - TENTANDO ABORDAGEM ALTERNATIVA');
      
      // ESTRATÉGIA: Aguardar e verificar se o usuário foi autenticado automaticamente
      console.log('⏳ firebase.js: Aguardando processamento do Firebase...');
      
      // Aguardar 1 segundo para o Firebase processar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar diretamente se há um usuário autenticado
      if (auth.currentUser) {
        console.log('✅ firebase.js: USUÁRIO ENCONTRADO DIRETAMENTE!');
        console.log('✅ firebase.js: Email:', auth.currentUser.email);
        
        // Limpar URL imediatamente
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 firebase.js: URL limpa');
        
        return await processUserAfterRedirect(auth.currentUser);
      }
      
      // Se não encontrou, tentar o método tradicional
      console.log('🔄 firebase.js: Tentando getRedirectResult tradicional...');
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log('✅ firebase.js: getRedirectResult funcionou!');
          
          // Limpar URL
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          return await processUserAfterRedirect(result.user);
        }
      } catch (error) {
        console.error('❌ firebase.js: Erro no getRedirectResult:', error);
      }
      
      // Último recurso: verificar novamente após mais delay
      console.log('🔄 firebase.js: Tentando verificação final...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (auth.currentUser) {
        console.log('✅ firebase.js: USUÁRIO ENCONTRADO NA VERIFICAÇÃO FINAL!');
        
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        return await processUserAfterRedirect(auth.currentUser);
      }
      
      console.log('⚠️ firebase.js: Nenhuma abordagem funcionou');
      return { success: false, error: 'Nenhuma abordagem de autenticação funcionou' };
    }
    
    console.log('⚠️ firebase.js: Nenhum resultado de redirect e nenhum usuário autenticado');
    return { success: false, noResult: true };
  } catch (error) {
    console.error('❌ firebase.js: Erro ao processar redirect:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Processa usuário após redirect bem-sucedido
 */
async function processUserAfterRedirect(user) {
  console.log('🎯 firebase.js: PROCESSANDO USUÁRIO APÓS REDIRECT - EMAIL:', user.email);
  console.log('🎯 firebase.js: UID:', user.uid);
  
  try {
    // Verificar se usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.log('📝 firebase.js: CRIANDO NOVO USUÁRIO NO FIRESTORE');
      // Criar novo documento de usuário
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        plan: 'free',
        searches: 0,
        quotes: 0,
        lastLogin: new Date().toISOString(),
        provider: user.providerData[0]?.providerId || 'google.com'
      });
      console.log('✅ firebase.js: USUÁRIO CRIADO COM SUCESSO!');
    } else {
      console.log('✅ firebase.js: Usuário já existe - atualizando último login');
      // Atualizar último login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });
    }
    
    // Limpar parâmetros da URL para evitar loops
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    console.log('🧹 firebase.js: URL limpa com sucesso');
    
    // Limpar flag de recarregamento
    sessionStorage.removeItem('mobileAuthReloaded');
    
    console.log('🎉 firebase.js: PROCESSAMENTO CONCLUÍDO COM SUCESSO!');
    
    return { success: true, user };
    
  } catch (error) {
    console.error('❌ firebase.js: ERRO AO PROCESSAR USUÁRIO:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout
 */
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Resetar senha
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Email de recuperação enviado!' };
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Obter dados do usuário do Firestore
 */
export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'Usuário não encontrado' };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualizar dados do usuário
 */
export async function updateUserData(uid, data) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listener para mudanças no estado de autenticação
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Traduzir mensagens de erro do Firebase
 */
function getErrorMessage(errorCode) {
  const errors = {
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/invalid-email': 'Email inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/cancelled-popup-request': 'Popup cancelado.'
  };
  
  return errors[errorCode] || 'Erro ao processar solicitação.';
}

export { auth, db };
export default app;
