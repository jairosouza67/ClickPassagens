# ClickPassagens Frontend

Frontend da plataforma ClickPassagens - # ClickPassagens - Sistema de Busca de Passagens com Milhas

Sistema completo para busca e comparação de passagens aéreas usando milhas, com dados reais de voos.

## 🚀 Como Executar (Modo Fácil)

### Opção 1: Script Automático
```bash
# Clique duplo no arquivo ou execute:
start_clickpassagens.bat
```
Este script irá:
- Iniciar o backend Flask (porta 5001)
- Iniciar o frontend React (porta 5173)  
- Abrir automaticamente o navegador

### Opção 2: Manual
```bash
# Terminal 1 - Backend (mantenha aberto)
.venv\Scripts\activate
py main.py

# Terminal 2 - Frontend (mantenha aberto)  
npm run dev
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:5001
- **Documentação da API**: http://127.0.0.1:5001/api

## ⚡ Configuração Inicial

### 1. Instalar Dependências Python
```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Instalar Dependências Node.js
```bash
npm install
```

### 3. Inicializar Banco de Dados
```bash
.venv\Scripts\activate
python init_db.py
```

## 🛫 APIs de Voos Reais

### Modo Development (Padrão)
- Usa dados realistas de fallback
- Preços baseados em rotas reais
- Companhias aéreas reais (Gol, Azul, LATAM, etc.)
- Não requer credenciais de API

### Modo Production (APIs Reais)
Para usar dados 100% reais:

1. **Cadastre-se na Amadeus**: https://developers.amadeus.com/
2. **Configure no `.env`**:
   ```env
   AMADEUS_API_KEY=sua_chave_aqui
   AMADEUS_API_SECRET=seu_secret_aqui
   FLIGHT_API_MODE=production
   ```
3. **Reinicie o servidor**

## 📱 Funcionalidades

- ✅ Busca de voos com dados reais
- ✅ Comparação de preços (dinheiro vs milhas)
- ✅ Cálculo de economia automático
- ✅ Interface responsiva
- ✅ PWA (Progressive Web App)
- ✅ Múltiplas companhias aéreas
- ✅ Filtros avançados

## 🏗️ Arquitetura

```
Frontend (React + Vite)
│
├── src/
│   ├── components/
│   │   ├── BuscaIntegrada.jsx
│   │   ├── FlightCard.jsx
│   │   └── ui/
│   └── App.jsx
│
Backend (Flask + Python)
│
├── src/
│   ├── routes/
│   │   └── busca.py
│   ├── models/
│   │   └── milhas.py
│   └── services/
│       └── flight_api.py
└── main.py
```

## 🛠️ Tecnologias

### Frontend
- React 18
- Vite
- TailwindCSS
- Radix UI
- Lucide Icons

### Backend  
- Flask
- SQLAlchemy
- SQLite
- Amadeus API
- SkyScanner API

## 📋 Scripts Disponíveis

- `start_clickpassagens.bat` - Inicia tudo automaticamente
- `start_backend.bat` - Apenas backend Flask
- `start_frontend.bat` - Apenas frontend React
- `start_production.bat` - Modo produção com Gunicorn

## 🐛 Troubleshooting

### "Failed to fetch"
- Certifique-se que o backend está rodando na porta 5001
- Use os scripts `.bat` para manter os servidores ativos
- Verifique se não há firewall bloqueando as portas

### Dados não aparecem
- Verifique o console do navegador (F12)
- Confirme que a busca tem origem, destino e data válidos
- Veja os logs do servidor Flask

### Performance lenta
- Use `FLIGHT_API_MODE=development` para dados de fallback
- Credenciais de API podem ter rate limiting

## 🚀 Deploy

Ver `README_DEPLOY.md` para instruções de deploy em produção.

## 🚀 Tecnologias

- **React 18** - Framework principal
- **Vite** - Build tool moderna
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI profissionais
- **Lucide React** - Ícones modernos
- **PWA** - Progressive Web App com suporte offline

## 📱 Funcionalidades PWA

- ✅ Instalação como app nativo no celular
- ✅ Funcionamento offline
- ✅ Notificações push
- ✅ Compartilhamento nativo
- ✅ Ícones personalizados

## 🛠️ Instalação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## 📦 Scripts Disponíveis

- `pnpm run dev` - Inicia servidor de desenvolvimento
- `pnpm run build` - Gera build de produção
- `pnpm run preview` - Visualiza build de produção
- `pnpm run lint` - Executa linting do código

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── BuscaIntegrada.jsx     # Busca integrada com API
│   └── PWAInstallButton.jsx   # Botão de instalação PWA
├── hooks/
│   └── usePWA.js              # Hook para funcionalidades PWA
├── App.jsx                    # Componente principal
└── main.jsx                   # Ponto de entrada

public/
├── manifest.json              # Manifest PWA
├── sw.js                      # Service Worker
├── icon-192x192.png          # Ícone PWA 192x192
└── icon-512x512.png          # Ícone PWA 512x512
```

## 🔗 Integração com Backend

O frontend se comunica com o backend através das seguintes APIs:

- `GET /api/busca/companhias` - Lista companhias aéreas
- `POST /api/busca/buscar` - Busca passagens
- `POST /api/usuarios/cadastrar` - Cadastro de usuários
- `POST /api/usuarios/login` - Login de usuários

## 🎨 Design System

O projeto utiliza uma paleta de cores focada em azul (#3B82F6) para transmitir confiança e profissionalismo. Os componentes seguem as diretrizes do shadcn/ui para consistência visual.

## 📱 Responsividade

O layout é totalmente responsivo, funcionando perfeitamente em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔧 Configuração PWA

O aplicativo está configurado como PWA com:
- Service Worker para cache offline
- Manifest para instalação
- Ícones em múltiplas resoluções
- Suporte a notificações push

## 🚀 Deploy

Para fazer deploy:

1. Execute `pnpm run build`
2. Copie os arquivos da pasta `dist/` para seu servidor
3. Configure seu servidor para servir o `index.html` para todas as rotas

## 📄 Licença

Este projeto é propriedade da ClickPassagens.
