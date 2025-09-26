# 🚀 Guia de Setup dos Repositórios GitHub - ClickPassagens

## 📁 Repositórios Preparados

Foram criados **2 repositórios Git** prontos para conectar ao seu GitHub:

### 1. **Frontend** (`site-milhas/`)
- **Tecnologia**: React 18 + Vite + PWA
- **Localização**: `/home/ubuntu/site-milhas/`
- **Branch**: `master`

### 2. **Backend** (`backend-milhas/`)
- **Tecnologia**: Flask + SQLAlchemy + API REST
- **Localização**: `/home/ubuntu/backend-milhas/`
- **Branch**: `branch-1`

## 🔗 Como Conectar ao GitHub

### Passo 1: Criar Repositórios no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Crie dois repositórios:
   - `clickpassagens-frontend`
   - `clickpassagens-backend`
4. **NÃO** inicialize com README, .gitignore ou licença (já estão configurados)

### Passo 2: Conectar o Frontend

```bash
cd /home/ubuntu/site-milhas/
git remote add origin https://github.com/SEU_USUARIO/clickpassagens-frontend.git
git branch -M main
git push -u origin main
```

### Passo 3: Conectar o Backend

```bash
cd /home/ubuntu/backend-milhas/
git remote add origin https://github.com/SEU_USUARIO/clickpassagens-backend.git
git branch -M main
git push -u origin main
```

## 📦 Estrutura dos Repositórios

### Frontend Repository
```
clickpassagens-frontend/
├── src/
│   ├── components/
│   │   ├── BuscaIntegrada.jsx     # Busca com API
│   │   └── PWAInstallButton.jsx   # Instalação PWA
│   ├── hooks/
│   │   └── usePWA.js              # Hook PWA
│   └── App.jsx                    # App principal
├── public/
│   ├── manifest.json              # PWA Manifest
│   ├── sw.js                      # Service Worker
│   └── icon-*.png                 # Ícones PWA
├── package.json
├── vite.config.js
└── README.md
```

### Backend Repository
```
clickpassagens-backend/
├── src/
│   ├── models/
│   │   └── milhas.py              # Modelos de dados
│   ├── routes/
│   │   ├── busca.py               # API de busca
│   │   ├── usuarios.py            # API usuários
│   │   └── orcamentos.py          # API orçamentos
│   ├── static/                    # Frontend build
│   └── main.py                    # App Flask
├── requirements.txt
├── .gitignore
└── README.md
```

## 🛠️ Comandos de Desenvolvimento

### Frontend
```bash
cd clickpassagens-frontend/
pnpm install
pnpm run dev        # Desenvolvimento
pnpm run build      # Build produção
```

### Backend
```bash
cd clickpassagens-backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py  # Executar API
```

## 🔄 Workflow de Deploy

1. **Desenvolver** no frontend
2. **Build** com `pnpm run build`
3. **Copiar** build para backend: `cp -r dist/* ../backend/src/static/`
4. **Deploy** do backend com frontend integrado

## 📱 Funcionalidades PWA

- ✅ **Instalação** como app nativo
- ✅ **Offline** com Service Worker
- ✅ **Notificações** push
- ✅ **Ícones** personalizados
- ✅ **Compartilhamento** nativo

## 🔐 Configurações de Segurança

### Frontend
- CORS configurado para desenvolvimento
- Service Worker com cache seguro
- Validação de dados no cliente

### Backend
- Flask-CORS habilitado
- Validação de dados no servidor
- Senhas com hash seguro
- SQLAlchemy com proteção SQL injection

## 📊 APIs Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/busca/companhias` | GET | Lista companhias |
| `/api/busca/buscar` | POST | Busca passagens |
| `/api/usuarios/cadastrar` | POST | Cadastro |
| `/api/usuarios/login` | POST | Login |
| `/api/orcamentos/gerar` | POST | Gerar PDF |

## 🎯 Próximos Passos

1. **Conectar** repositórios ao GitHub
2. **Configurar** CI/CD (GitHub Actions)
3. **Deploy** em produção
4. **Integrar** APIs reais das companhias
5. **Implementar** sistema de pagamento

## 📞 Suporte

Os repositórios estão **100% funcionais** e prontos para desenvolvimento. Cada um possui:

- ✅ README detalhado
- ✅ .gitignore configurado
- ✅ Dependências listadas
- ✅ Estrutura organizada
- ✅ Commits iniciais feitos

**Basta conectar ao GitHub e começar a desenvolver!** 🚀
