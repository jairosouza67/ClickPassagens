# 🔐 Sistema de Autenticação Firebase - ClickPassagens

## 📦 Arquivos Criados

### 1. Configuração
- **src/config/firebase.js** - Configuração e funções do Firebase

### 2. Context
- **src/contexts/AuthContext.jsx** - Provider de autenticação global

### 3. Componentes
- **src/components/AuthModal.jsx** - Modal de Login/Cadastro
- **src/components/AuthModal.css** - Estilos do modal
- **src/components/UserMenu.jsx** - Menu do usuário logado
- **src/components/UserMenu.css** - Estilos do menu

### 4. Documentação
- **FIREBASE_SETUP.md** - Guia completo de configuração

---

## 🎨 Funcionalidades Visuais

### Modal de Autenticação
- Design moderno com gradiente azul royal e dourado
- 3 modos: Login, Cadastro, Recuperar Senha
- Transições suaves e animações
- Validação em tempo real
- Mensagens de erro traduzidas em português
- Login com Google (popup)
- Ícones lucide-react

### Menu do Usuário
- Avatar circular (foto ou inicial)
- Nome, email e plano do usuário
- Badge colorido do plano (Free, Basic, Premium, Enterprise)
- Estatísticas de uso (buscas e orçamentos)
- Links de navegação rápida
- Botão de logout destacado
- Dropdown animado

---

## 🔧 Integração com o Sistema

### App.jsx
```jsx
// Importações
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import AuthModal from './components/AuthModal.jsx'
import UserMenu from './components/UserMenu.jsx'

// No componente App
const { isAuthenticated, incrementSearches } = useAuth()
const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

// No header
{isAuthenticated ? (
  <UserMenu onNavigate={navegarPara} />
) : (
  <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>
)}

// Antes do export
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
```

### QuotePage.jsx
```jsx
// Auto-preenche dados do usuário
const { currentUser, userData, incrementQuotes } = useAuth()

useEffect(() => {
  if (currentUser && userData) {
    setFormData(prev => ({
      ...prev,
      nome: userData.displayName || currentUser.displayName,
      email: currentUser.email
    }))
  }
}, [currentUser, userData])

// Incrementa contador ao gerar orçamento
if (currentUser) {
  incrementQuotes()
}
```

---

## 📊 Estrutura de Dados do Usuário

### Firebase Auth
```javascript
currentUser {
  uid: "abc123...",
  email: "usuario@email.com",
  displayName: "João Silva",
  photoURL: "https://lh3.googleusercontent.com/...",
  emailVerified: false
}
```

### Firestore Database
```javascript
users/{uid} {
  uid: "abc123...",
  email: "usuario@email.com",
  displayName: "João Silva",
  photoURL: "https://...",
  plan: "free", // free | basic | premium | enterprise
  searches: 42,
  quotes: 15,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T12:45:00Z"
}
```

---

## 🔐 Funções Disponíveis (AuthContext)

### Para Autenticação
```javascript
const {
  // Estados
  currentUser,        // Dados do Firebase Auth
  userData,           // Dados do Firestore
  loading,            // Carregando autenticação
  authError,          // Erros de autenticação
  isAuthenticated,    // Boolean: usuário logado?
  isPremium,          // Boolean: tem plano premium/enterprise?
  
  // Funções
  signup(email, password, displayName),
  login(email, password),
  googleLogin(),
  logout(),
  resetPassword(email),
  updateUser(data),
  incrementSearches(),
  incrementQuotes()
} = useAuth()
```

### Exemplos de Uso

#### Cadastro
```javascript
const result = await signup(
  'joao@email.com',
  'senha123',
  'João Silva'
)

if (result.success) {
  // Usuário criado!
  console.log(result.user)
} else {
  // Erro
  console.error(result.error)
}
```

#### Login com Email
```javascript
const result = await login('joao@email.com', 'senha123')

if (result.success) {
  // Login bem-sucedido
} else {
  alert(result.error) // Mensagem em português
}
```

#### Login com Google
```javascript
const result = await googleLogin()
// Abre popup do Google
// Retorna automaticamente
```

#### Atualizar Dados
```javascript
await updateUser({
  plan: 'premium',
  telefone: '11 98765-4321'
})
```

#### Incrementar Contadores
```javascript
// Ao fazer uma busca
await incrementSearches()

// Ao gerar orçamento
await incrementQuotes()
```

---

## 🎨 Customização de Cores dos Planos

```javascript
const planColors = {
  free: '#6b7280',      // Cinza
  basic: '#3b82f6',     // Azul
  premium: '#f59e0b',   // Dourado
  enterprise: '#8b5cf6' // Roxo
}
```

---

## 🔒 Segurança Implementada

### 1. Validação de Formulários
- Email válido (regex)
- Senha mínima de 6 caracteres
- Confirmação de senha
- Campos obrigatórios

### 2. Mensagens de Erro Traduzidas
```javascript
{
  'auth/email-already-in-use': 'Este email já está em uso.',
  'auth/invalid-email': 'Email inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  // ... mais erros
}
```

### 3. Regras do Firestore
```javascript
// Usuários só podem acessar seus próprios dados
match /users/{userId} {
  allow read, write: if request.auth != null 
                     && request.auth.uid == userId;
}
```

### 4. Estados de Carregamento
- Botões desabilitados durante requisições
- Spinners de loading
- Prevenção de múltiplos cliques

---

## 📱 Responsividade

### Desktop (> 768px)
- UserMenu completo com nome, avatar e plano
- Modal centralizado

### Mobile (< 768px)
- UserMenu apenas com avatar
- Dropdown se ajusta à tela
- Modal ocupa 100% da largura (com padding)

---

## 🚀 Próximas Melhorias Possíveis

### Verificação de Email
```javascript
import { sendEmailVerification } from 'firebase/auth';

await sendEmailVerification(currentUser);
```

### Upload de Avatar Personalizado
```javascript
import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Fazer upload da foto
const storage = getStorage();
const storageRef = ref(storage, `avatars/${currentUser.uid}`);
await uploadBytes(storageRef, file);
```

### Edição de Perfil
- Modal separado para editar dados
- Alterar nome, telefone, etc.
- Trocar foto de perfil

### Planos Premium
- Checkout com Stripe/Mercado Pago
- Upgrade/downgrade de planos
- Limites por plano

### Histórico Completo
- Todas as buscas do usuário
- Todos os orçamentos gerados
- Exportar relatórios

---

## 🐛 Troubleshooting

### Erro: "Firebase app not initialized"
**Solução:** Verifique se as credenciais estão corretas em `src/config/firebase.js`

### Erro: "User is null"
**Solução:** Use `isAuthenticated` antes de acessar `currentUser`

### Modal não abre
**Solução:** Verifique se `isAuthModalOpen` está sendo setado corretamente

### UserMenu não aparece
**Solução:** Certifique-se de que `isAuthenticated` está true

---

## ✅ Checklist de Configuração

- [ ] Firebase SDK instalado (`npm install firebase`)
- [ ] Projeto criado no Firebase Console
- [ ] App Web registrado no projeto
- [ ] Credenciais copiadas para `src/config/firebase.js`
- [ ] Authentication ativado no console
- [ ] Provedor Email/Password ativado
- [ ] Provedor Google ativado
- [ ] Firestore Database criado
- [ ] Regras de segurança do Firestore configuradas
- [ ] Domínios autorizados configurados (localhost + produção)
- [ ] Testado cadastro de usuário
- [ ] Testado login com email
- [ ] Testado login com Google
- [ ] Testado recuperação de senha
- [ ] Testado logout
- [ ] Verificado dados no Firestore

---

## 📖 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Documentação Firebase Auth](https://firebase.google.com/docs/auth)
- [Documentação Firestore](https://firebase.google.com/docs/firestore)
- [Guia Completo de Setup](./FIREBASE_SETUP.md)

---

**Sistema de autenticação completo e pronto para uso! 🎉**
