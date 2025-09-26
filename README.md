# ClickPassagens Frontend

Frontend da plataforma ClickPassagens - Sistema de busca de passagens aéreas com milhas.

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
