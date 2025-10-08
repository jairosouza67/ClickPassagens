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
const isFirebaseConfigured = firebaseConfig.apiKey && 
                              firebaseConfig.projectId && 
                              !firebaseConfig.apiKey.includes('DEMO') &&
                              !firebaseConfig.apiKey.includes('REPLACE');

if (!isFirebaseConfigured) {
  console.warn('⚠️ AVISO: Firebase não está configurado corretamente!');
  console.warn('A aplicação funcionará em modo de demonstração.');
  console.warn('Para habilitar autenticação, configure o arquivo .env');
}

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

// Initialize Firebase apenas se configurado
if (isFirebaseConfigured) {
  console.log('✅ Firebase configurado com sucesso!', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.log('🔧 Modo de desenvolvimento - Firebase desabilitado');
}

// Configurar persistência LOCAL (crucial para mobile)
// Isso garante que a sessão persista mesmo após fechar o navegador
if (auth) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Persistência LOCAL configurada (sessão mantida)');
    })
    .catch((error) => {
      console.error('⚠️ Erro ao configurar persistência:', error);
    });
}

// Configure Google Provider
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

/**
 * Registra um novo usuário com email e senha
 */
export async function registerWithEmail(email, password, displayName) {
  if (!auth) {
    return { success: false, error: 'Firebase não configurado. Configure o arquivo .env' };
  }
  
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
  if (!auth) {
    return { success: false, error: 'Firebase não configurado. Configure o arquivo .env' };
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Detecta se é dispositivo mobile
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
}

/**
 * Login com Google - VERSÃO OTIMIZADA (popup para desktop, redirect para mobile)
 */
export async function loginWithGoogle() {
  if (!auth || !googleProvider) {
    return { success: false, error: 'Firebase não configurado. Configure o arquivo .env para usar login com Google.' };
  }
  
  const isMobile = isMobileDevice();
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔵 [GOOGLE LOGIN] INICIANDO');
  console.log('📱 [GOOGLE LOGIN] Dispositivo:', isMobile ? 'MOBILE' : 'DESKTOP');
  console.log('� [GOOGLE LOGIN] User Agent:', navigator.userAgent);
  console.log('🔵 [GOOGLE LOGIN] Auth:', auth ? 'OK' : 'NULL');
  console.log('🔵 [GOOGLE LOGIN] Provider:', googleProvider ? 'OK' : 'NULL');
  console.log('═══════════════════════════════════════════════════════');
  
  try {
    // Em mobile, usar redirect (melhor experiência)
    // Em desktop, usar popup (mais rápido)
    if (isMobile) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('📱 [MOBILE LOGIN] USANDO REDIRECT');
      console.log('📱 [MOBILE LOGIN] Salvando flag googleLoginInProgress no localStorage (mais seguro que sessionStorage)');
      console.log('═══════════════════════════════════════════════════════');
      
      // Salvar flag para identificar que estamos fazendo login
      // IMPORTANTE: Usar localStorage ao invés de sessionStorage
      // porque sessionStorage pode ser limpo durante redirects
      localStorage.setItem('googleLoginInProgress', 'true');
      sessionStorage.setItem('googleLoginInProgress', 'true');
      console.log('✅ [MOBILE LOGIN] Flag salva em localStorage:', localStorage.getItem('googleLoginInProgress'));
      console.log('✅ [MOBILE LOGIN] Flag salva em sessionStorage:', sessionStorage.getItem('googleLoginInProgress'));
      
      // Salvar timestamp para debug
      localStorage.setItem('googleLoginTimestamp', new Date().toISOString());
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('📱 [MOBILE LOGIN] INFORMAÇÕES DE DEBUG:');
      console.log('📱 [MOBILE LOGIN] Auth Domain:', auth.config.authDomain);
      console.log('📱 [MOBILE LOGIN] API Key:', auth.config.apiKey?.substring(0, 10) + '...');
      console.log('📱 [MOBILE LOGIN] Redirect URI esperada:', `https://${window.location.hostname}/__/auth/handler`);
      console.log('═══════════════════════════════════════════════════════');
      
      // Redirecionar para login do Google
      console.log('🚀 [MOBILE LOGIN] Chamando signInWithRedirect...');
      await signInWithRedirect(auth, googleProvider);
      console.log('✅ [MOBILE LOGIN] signInWithRedirect executado (redirect em andamento...)');
      
      // A função retorna aqui, mas o redirect vai acontecer
      // O resultado será capturado em handleRedirectResult()
      return { success: true, redirect: true };
      
    } else {
      // Desktop: usar popup
      console.log('🖥️ [Firebase] Desktop - usando POPUP...');
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
    }
    
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
        errorMessage = 'Domínio não autorizado no Firebase Console. Adicione seu domínio em: Authentication > Settings > Authorized domains';
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
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 [REDIRECT] handleRedirectResult INICIADO');
    console.log('🔄 [REDIRECT] URL atual:', window.location.href);
    console.log('🔄 [REDIRECT] Hostname:', window.location.hostname);
    console.log('🔄 [REDIRECT] Usuário atual ANTES:', auth.currentUser ? auth.currentUser.email : 'null');
    console.log('🔄 [REDIRECT] sessionStorage googleLoginInProgress:', sessionStorage.getItem('googleLoginInProgress'));
    console.log('🔄 [REDIRECT] localStorage googleLoginInProgress:', localStorage.getItem('googleLoginInProgress'));
    
    const loginTimestamp = localStorage.getItem('googleLoginTimestamp');
    if (loginTimestamp) {
      const elapsed = (Date.now() - new Date(loginTimestamp).getTime()) / 1000;
      console.log('🔄 [REDIRECT] Tempo desde início do login:', elapsed.toFixed(2), 'segundos');
    }
    
    console.log('🔄 [REDIRECT] Auth Domain configurado:', auth.config.authDomain);
    console.log('🔄 [REDIRECT] Redirect URI esperada:', `https://${window.location.hostname}/__/auth/handler`);
    console.log('═══════════════════════════════════════════════════════');
    
    const result = await getRedirectResult(auth);
    console.log('🔄 [REDIRECT] getRedirectResult retornou:', result);
    console.log('🔄 [REDIRECT] Usuário atual DEPOIS:', auth.currentUser ? auth.currentUser.email : 'null');
    
    // Se getRedirectResult retornar algo, processar normalmente
    if (result && result.user) {
      const user = result.user;
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ [REDIRECT] SUCESSO! getRedirectResult retornou usuário');
      console.log('✅ [REDIRECT] Email:', user.email);
      console.log('✅ [REDIRECT] UID:', user.uid);
      console.log('═══════════════════════════════════════════════════════');
      
      // Verificar se é novo usuário
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('📄 [REDIRECT] Documento do usuário existe?', userDoc.exists());
      
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
    
    // NOVA ESTRATÉGIA: Como não há parâmetros na URL (Firebase pode tê-los removido),
    // vamos aguardar o Firebase processar internamente e verificar auth.currentUser
    console.log('📱 firebase.js: getRedirectResult retornou null - usando estratégia alternativa');
    console.log('⏳ firebase.js: Aguardando Firebase processar autenticação...');
    
    // NOVA ABORDAGEM: Usar um listener onAuthStateChanged com timeout
    // Isso é mais confiável que verificar auth.currentUser diretamente
    return new Promise((resolve) => {
      let resolved = false;
      
      // Timeout de segurança de 8 segundos
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('⏰ firebase.js: TIMEOUT - Firebase não processou em 8 segundos');
          console.log('⚠️ firebase.js: Nenhum resultado de redirect e nenhum usuário autenticado');
          console.log('═══════════════════════════════════════════════════════');
          console.log('⚠️ POSSÍVEIS CAUSAS:');
          console.log('⚠️ 1. URI de Redirect não autorizada no Google Cloud Console');
          console.log('⚠️ 2. Verificar em: https://console.cloud.google.com/');
          console.log('⚠️ 3. APIs & Services > Credentials > OAuth 2.0 Client IDs');
          console.log('⚠️ 4. Adicionar esta URI EXATA nas "Authorized redirect URIs":');
          console.log(`⚠️    https://${window.location.hostname}/__/auth/handler`);
          console.log('⚠️ 5. Também verificar "Authorized JavaScript origins":');
          console.log(`⚠️    https://${window.location.hostname}`);
          console.log('═══════════════════════════════════════════════════════');
          resolve({ success: false, noResult: true });
        }
      }, 8000);
      
      // Listener para mudanças de autenticação
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!resolved && user) {
          resolved = true;
          clearTimeout(timeout);
          unsubscribe();
          
          console.log('═══════════════════════════════════════════════════════');
          console.log('✅ firebase.js: USUÁRIO ENCONTRADO via onAuthStateChanged!');
          console.log('✅ firebase.js: Email:', user.email);
          console.log('✅ firebase.js: Este é o método correto para mobile!');
          console.log('═══════════════════════════════════════════════════════');
          
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          const result = await processUserAfterRedirect(user);
          resolve(result);
        }
      });
      
      // Fallback: após 1 segundo, verificar se já tem usuário
      setTimeout(() => {
        if (!resolved && auth.currentUser) {
          resolved = true;
          clearTimeout(timeout);
          unsubscribe();
          
          console.log('✅ firebase.js: USUÁRIO ENCONTRADO no fallback!');
          
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          processUserAfterRedirect(auth.currentUser).then(resolve);
        }
      }, 1000);
    });
    
    console.log('⚠️ firebase.js: Nenhum resultado de redirect e nenhum usuário autenticado');
    console.log('⚠️ firebase.js: POSSÍVEIS CAUSAS:');
    console.log('⚠️ firebase.js: 1. Domínio não autorizado no Firebase Console');
    console.log('⚠️ firebase.js: 2. Verificar em: https://console.firebase.google.com/');
    console.log('⚠️ firebase.js: 3. Authentication > Settings > Authorized domains');
    console.log('⚠️ firebase.js: 4. Adicionar:', window.location.hostname);
    return { success: false, noResult: true };
  } catch (error) {
    console.error('❌ firebase.js: Erro ao processar redirect:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    // Verificar se é erro de domínio não autorizado
    if (error.code === 'auth/unauthorized-domain' || 
        error.message?.includes('domain') || 
        error.message?.includes('authorized')) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('🚨 ERRO: DOMÍNIO NÃO AUTORIZADO!');
      console.error('🚨 Domínio atual:', window.location.hostname);
      console.error('🚨 SOLUÇÃO:');
      console.error('🚨 1. Acesse: https://console.firebase.google.com/');
      console.error('🚨 2. Vá em: Authentication > Settings > Authorized domains');
      console.error('🚨 3. Adicione:', window.location.hostname);
      console.error('═══════════════════════════════════════════════════════');
    }
    
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
  if (!auth) {
    return { success: true }; // Em modo demo, sempre permite "logout"
  }
  
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
  if (!auth) {
    // Em modo demo, chama callback com null imediatamente
    setTimeout(() => callback(null), 0);
    return () => {}; // Retorna função vazia para unsubscribe
  }
  
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
