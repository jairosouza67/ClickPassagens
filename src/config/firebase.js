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
  sendPasswordResetEmail
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
 * Login com Google
 */
export async function loginWithGoogle() {
  try {
    console.log('🔵 Iniciando login com Google...');
    
    // Detectar se é mobile para usar redirect ao invés de popup
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log('📱 Dispositivo mobile?', isMobile);
    
    let result;
    
    if (isMobile) {
      console.log('🔄 Usando signInWithRedirect para mobile...');
      // Em mobile, usar signInWithRedirect (mais confiável)
      await signInWithRedirect(auth, googleProvider);
      // O resultado será capturado após o redirect
      return { success: true, redirect: true };
    } else {
      console.log('🪟 Usando signInWithPopup para desktop...');
      // Em desktop, usar popup
      result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Popup concluído, resultado:', result);
    }
    
    const user = result.user;
    
    // Verificar se é novo usuário
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
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
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('❌ Erro no login com Google:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    
    // Erros específicos
    if (error.code === 'auth/popup-blocked') {
      return { 
        success: false, 
        error: 'Popup bloqueado! Permita popups para este site e tente novamente.' 
      };
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      return { 
        success: false, 
        error: 'Login cancelado. Você fechou a janela de login.' 
      };
    }
    
    if (error.code === 'auth/cancelled-popup-request') {
      return { 
        success: false, 
        error: 'Solicitação cancelada. Aguarde e tente novamente.' 
      };
    }
    
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Capturar resultado do redirect (para login Google em mobile)
 */
export async function handleRedirectResult() {
  try {
    console.log('🔄 firebase.js: Chamando getRedirectResult...');
    const result = await getRedirectResult(auth);
    console.log('🔄 firebase.js: getRedirectResult retornou:', result);
    
    if (result) {
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
      
      console.log('✅ firebase.js: handleRedirectResult - Login bem-sucedido!');
      return { success: true, user };
    }
    
    console.log('⚠️ firebase.js: Nenhum resultado de redirect (normal se não houve redirect)');
    return { success: false, noResult: true };
  } catch (error) {
    console.error('❌ firebase.js: Erro ao processar redirect:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    return { success: false, error: getErrorMessage(error.code) };
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
