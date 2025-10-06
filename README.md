# 🛫 ClickPassagens - Encontre as Melhores Passagens com Milhas# ClickPassagens Frontend



**Bem-vindo ao ClickPassagens!** 🎉Frontend da plataforma ClickPassagens - # ClickPassagens - Sistema de Busca de Passagens com Milhas



Este é um sistema completo que ajuda você a encontrar passagens aéreas e calcular quantas milhas você precisa para viajar. É como ter um assistente pessoal que procura os melhores voos para você!Sistema completo para busca e comparação de passagens aéreas usando milhas, com dados reais de voos.



---## 🚀 Como Executar (Modo Fácil)



## 🤔 O que este site faz?### Opção 1: Script Automático

```bash

Imagine que você quer viajar para o Rio de Janeiro. Em vez de procurar em vários sites, você:# Clique duplo no arquivo ou execute:

start_clickpassagens.bat

1. **Entra no ClickPassagens**```

2. **Escolhe de onde sai e para onde vai** (exemplo: São Paulo → Rio de Janeiro)Este script irá:

3. **Seleciona a data** que quer viajar- Iniciar o backend Flask (porta 5001)

4. **Clica em "Buscar"**- Iniciar o frontend React (porta 5173)  

5. **PRONTO!** O sistema mostra todos os voos disponíveis com:- Abrir automaticamente o navegador

   - 💵 Preço em dinheiro

   - ✈️ Quantidade de milhas necessárias### Opção 2: Manual

   - ⏰ Horários de saída e chegada```bash

   - 🏢 Companhia aérea# Terminal 1 - Backend (mantenha aberto)

.venv\Scripts\activate

Depois você pode:py main.py

- 📄 **Gerar um orçamento em PDF** para guardar ou enviar para alguém

- 📝 **Baixar em Word** para editar# Terminal 2 - Frontend (mantenha aberto)  

- 📊 **Ver seu histórico** de buscas e orçamentosnpm run dev

```

---

## 🌐 URLs de Acesso

## 🚀 Como fazer o site funcionar?

- **Frontend**: http://localhost:5173

### Você vai precisar:- **Backend API**: http://127.0.0.1:5001

- **Documentação da API**: http://127.0.0.1:5001/api

1. **Python** (versão 3.12 ou mais nova) - É o "cérebro" do site

2. **Node.js** (versão 18 ou mais nova) - Ajuda a criar a parte visual## ⚡ Configuração Inicial

3. **Uma conta no Amadeus** - Dá acesso aos dados de voos reais

4. **Uma conta no Firebase** - Cuida do login dos usuários### 1. Instalar Dependências Python

```bash

---.venv\Scripts\activate

pip install -r requirements.txt

## 📖 Guia Passo a Passo (Primeira Vez)```



### PASSO 1: Baixar o Código### 2. Instalar Dependências Node.js

```bash

Se você ainda não tem o código no seu computador:npm install

```bash```

git clone https://github.com/jairosouza67/ClickPassagens.git

cd ClickPassagens### 3. Inicializar Banco de Dados

``````bash

.venv\Scripts\activate

### PASSO 2: Configurar o "Cérebro" (Backend)python init_db.py

```

O backend é a parte que busca os voos e faz os cálculos.

## 🛫 APIs de Voos Reais

**No terminal, digite:**

### Modo Development (Padrão)

```bash- Usa dados realistas de fallback

# 1. Criar um "ambiente virtual" (como uma pasta especial para o Python)- Preços baseados em rotas reais

python -m venv .venv- Companhias aéreas reais (Gol, Azul, LATAM, etc.)

- Não requer credenciais de API

# 2. Ativar o ambiente virtual

# Se você usa Windows:### Modo Production (APIs Reais)

.venv\Scripts\Activate.ps1Para usar dados 100% reais:



# 3. Instalar as ferramentas que o sistema precisa1. **Cadastre-se na Amadeus**: https://developers.amadeus.com/

pip install -r requirements.txt2. **Configure no `.env`**:

```   ```env

   AMADEUS_API_KEY=sua_chave_aqui

### PASSO 3: Configurar a Parte Visual (Frontend)   AMADEUS_API_SECRET=seu_secret_aqui

   FLIGHT_API_MODE=production

A parte visual é o que você vê no navegador.   ```

3. **Reinicie o servidor**

**No terminal, digite:**

```bash## 📱 Funcionalidades

npm install

```- ✅ Busca de voos com dados reais

- ✅ Comparação de preços (dinheiro vs milhas)

Isso vai instalar todas as ferramentas necessárias para criar a interface bonita que você vê.- ✅ Cálculo de economia automático

- ✅ Interface responsiva

### PASSO 4: Configurar as "Chaves Secretas"- ✅ PWA (Progressive Web App)

- ✅ Múltiplas companhias aéreas

O site precisa de algumas "chaves" para funcionar. É como ter as chaves da sua casa - sem elas, você não consegue entrar!- ✅ Filtros avançados



**Você vai configurar um arquivo chamado `.env`**## 🏗️ Arquitetura



1. Abra o arquivo `.env` (está na pasta principal)```

2. Preencha assim:Frontend (React + Vite)

│

```env├── src/

# ===== AMADEUS - Para buscar voos =====│   ├── components/

# Pegue estas chaves em: https://developers.amadeus.com/│   │   ├── BuscaIntegrada.jsx

AMADEUS_API_KEY=sua_chave_aqui│   │   ├── FlightCard.jsx

AMADEUS_API_SECRET=seu_secret_aqui│   │   └── ui/

│   └── App.jsx

# ===== FIREBASE - Para login de usuários =====│

# Pegue estas em: https://console.firebase.google.com/Backend (Flask + Python)

VITE_FIREBASE_API_KEY=sua_firebase_key│

VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com├── src/

VITE_FIREBASE_PROJECT_ID=seu-projeto-id│   ├── routes/

VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app│   │   └── busca.py

VITE_FIREBASE_MESSAGING_SENDER_ID=123456789│   ├── models/

VITE_FIREBASE_APP_ID=seu_app_id│   │   └── milhas.py

│   └── services/

# ===== Conexão entre Frontend e Backend =====│       └── flight_api.py

VITE_API_BASE_URL=http://localhost:5001└── main.py

``````



#### Como conseguir a chave do Amadeus:## 🛠️ Tecnologias

1. Vá em https://developers.amadeus.com/

2. Crie uma conta (é grátis!)### Frontend

3. Crie um novo "app" (aplicativo)- React 18

4. Copie a **API Key** e o **API Secret**- Vite

5. Cole no arquivo `.env`- TailwindCSS

- Radix UI

#### Como conseguir as chaves do Firebase:- Lucide Icons

1. Vá em https://console.firebase.google.com/

2. Crie um novo projeto (dê um nome, ex: "ClickPassagens")### Backend  

3. Adicione um app **Web** (ícone `</>`)- Flask

4. Copie todas as 6 informações que aparecem- SQLAlchemy

5. Cole no arquivo `.env`- SQLite

6. Ative **Authentication** → **Email/Password** e **Google**- Amadeus API

7. Crie um **Firestore Database** (modo teste)- SkyScanner API



---## 📋 Scripts Disponíveis



## ▶️ Como Iniciar o Site (Dia a Dia)- `start_clickpassagens.bat` - Inicia tudo automaticamente

- `start_backend.bat` - Apenas backend Flask

Criamos scripts especiais para facilitar sua vida! 🎁- `start_frontend.bat` - Apenas frontend React

- `start_production.bat` - Modo produção com Gunicorn

### Opção 1: Iniciar TUDO de uma vez (RECOMENDADO)

## 🐛 Troubleshooting

```bash

.\start_sistema.ps1### "Failed to fetch"

```- Certifique-se que o backend está rodando na porta 5001

- Use os scripts `.bat` para manter os servidores ativos

Este comando vai:- Verifique se não há firewall bloqueando as portas

- ✅ Abrir o backend em uma janela

- ✅ Abrir o frontend em outra janela### Dados não aparecem

- ✅ Deixar tudo funcionando- Verifique o console do navegador (F12)

- Confirme que a busca tem origem, destino e data válidos

### Opção 2: Iniciar manualmente (se preferir)- Veja os logs do servidor Flask



**Abra 2 terminais diferentes:**### Performance lenta

- Use `FLIGHT_API_MODE=development` para dados de fallback

**Terminal 1 - Backend:**- Credenciais de API podem ter rate limiting

```bash

.\start_backend_window.ps1## 🚀 Deploy

```

Ver `README_DEPLOY.md` para instruções de deploy em produção.

**Terminal 2 - Frontend:**

```bash## 🚀 Tecnologias

.\start_frontend_window.ps1

```- **React 18** - Framework principal

- **Vite** - Build tool moderna

### Pronto! 🎉- **Tailwind CSS** - Framework CSS utilitário

- **shadcn/ui** - Componentes UI profissionais

Agora abra seu navegador em: **http://localhost:5173**- **Lucide React** - Ícones modernos

- **PWA** - Progressive Web App com suporte offline

---

## 📱 Funcionalidades PWA

## 🔧 Como Manter e Cuidar do Site

- ✅ Instalação como app nativo no celular

### Atualizando o Código- ✅ Funcionamento offline

- ✅ Notificações push

Se você fez mudanças e quer salvar no GitHub:- ✅ Compartilhamento nativo

- ✅ Ícones personalizados

```bash

git add .## 🛠️ Instalação

git commit -m "Descreva o que você mudou"

git push```bash

```# Instalar dependências

pnpm install

### Se Algo Parar de Funcionar

# Executar em desenvolvimento

#### Problema: "Não encontra voos"pnpm run dev

**Solução:** Verifique se o backend está rodando

```bash# Build para produção

# Veja se a porta 5001 está ativapnpm run build

netstat -ano | findstr ":5001"```

```

## 📦 Scripts Disponíveis

#### Problema: "Não consigo fazer login"

**Solução:** Verifique se o Firebase está configurado- `pnpm run dev` - Inicia servidor de desenvolvimento

```bash- `pnpm run build` - Gera build de produção

# Execute o verificador- `pnpm run preview` - Visualiza build de produção

.\verificar_configuracao.ps1- `pnpm run lint` - Executa linting do código

```

## 🏗️ Estrutura do Projeto

#### Problema: "Erro de credenciais Amadeus"

**Solução:** Sua chave pode ter expirado. Gere uma nova em https://developers.amadeus.com/```

src/

### Verificar se Está Tudo OK├── components/

│   ├── BuscaIntegrada.jsx     # Busca integrada com API

Criamos um script que verifica tudo para você:│   └── PWAInstallButton.jsx   # Botão de instalação PWA

├── hooks/

```bash│   └── usePWA.js              # Hook para funcionalidades PWA

.\verificar_configuracao.ps1├── App.jsx                    # Componente principal

```└── main.jsx                   # Ponto de entrada



Ele vai te dizer se:public/

- ✅ As chaves estão configuradas├── manifest.json              # Manifest PWA

- ✅ O Firebase está OK├── sw.js                      # Service Worker

- ✅ Tudo está funcionando├── icon-192x192.png          # Ícone PWA 192x192

└── icon-512x512.png          # Ícone PWA 512x512

---```



## 📚 Entendendo a Estrutura## 🔗 Integração com Backend



```O frontend se comunica com o backend através das seguintes APIs:

ClickPassagens/

│- `GET /api/busca/companhias` - Lista companhias aéreas

├── src/                      # Código principal- `POST /api/busca/buscar` - Busca passagens

│   ├── components/           # Pedaços da interface (botões, cards, etc)- `POST /api/usuarios/cadastrar` - Cadastro de usuários

│   ├── config/              # Configurações (Firebase, etc)- `POST /api/usuarios/login` - Login de usuários

│   ├── routes/              # Rotas do backend (buscar voos, login, etc)

│   └── services/            # Serviços (conecta com Amadeus)## 🎨 Design System

│

├── main.py                   # Inicia o backendO projeto utiliza uma paleta de cores focada em azul (#3B82F6) para transmitir confiança e profissionalismo. Os componentes seguem as diretrizes do shadcn/ui para consistência visual.

├── package.json             # Lista de ferramentas do frontend

├── .env                     # Suas chaves secretas (NUNCA compartilhe!)## 📱 Responsividade

│

├── start_sistema.ps1        # Inicia tudo de uma vezO layout é totalmente responsivo, funcionando perfeitamente em:

├── start_backend_window.ps1 # Inicia só o backend- 📱 Mobile (320px+)

└── start_frontend_window.ps1 # Inicia só o frontend- 📱 Tablet (768px+)

```- 💻 Desktop (1024px+)



---## 🔧 Configuração PWA



## 🎨 O que Você Pode PersonalizarO aplicativo está configurado como PWA com:

- Service Worker para cache offline

### Mudar Cores- Manifest para instalação

Edite: `tailwind.config.js`- Ícones em múltiplas resoluções

```javascript- Suporte a notificações push

colors: {

  'aviation-blue': '#3B82F6',  // Mude para a cor que quiser!## 🚀 Deploy

}

```Para fazer deploy:



### Mudar Textos1. Execute `pnpm run build`

Edite os arquivos em: `src/components/`2. Copie os arquivos da pasta `dist/` para seu servidor

3. Configure seu servidor para servir o `index.html` para todas as rotas

### Adicionar Novas Funcionalidades

- **Backend:** Adicione em `src/routes/`## 📄 Licença

- **Frontend:** Adicione em `src/components/`

Este projeto é propriedade da ClickPassagens.

---

## 🐛 Resolvendo Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Python não encontrado" | Instale Python 3.12+ |
| "npm não encontrado" | Instale Node.js 18+ |
| "Porta 5001 em uso" | Feche outros programas ou mude a porta em `main.py` |
| "Erro de CORS" | Verifique CORS no `main.py` |
| "Firebase error" | Verifique se configurou as 6 variáveis |
| "Amadeus error" | Gere nova chave no site da Amadeus |

---

## 🚀 Colocando na Internet (Deploy)

### Backend → Render.com
1. Crie conta no Render.com
2. Conecte seu GitHub
3. Adicione as variáveis de ambiente (copie do .env)
4. Deploy automático! ✨

### Frontend → Netlify
1. Crie conta no Netlify
2. Conecte seu GitHub
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Adicione variáveis de ambiente
5. Deploy automático! ✨

---

## 💡 Dicas Importantes

### ✅ FAÇA:
- ✅ Mantenha o arquivo `.env` sempre atualizado
- ✅ Faça backup das suas chaves em local seguro
- ✅ Teste tudo localmente antes de fazer deploy
- ✅ Use o script `verificar_configuracao.ps1` regularmente

### ❌ NÃO FAÇA:
- ❌ NUNCA compartilhe o arquivo `.env`
- ❌ NUNCA coloque chaves direto no código
- ❌ NUNCA commit o `.env` no Git
- ❌ NUNCA use a mesma senha em todos os lugares

---

## 📞 Precisa de Ajuda?

1. **Execute o verificador:**
   ```bash
   .\verificar_configuracao.ps1
   ```

2. **Veja os logs:**
   - Backend: Olhe a janela onde está rodando o Python
   - Frontend: Abra F12 no navegador → Console

3. **Teste a API:**
   ```bash
   .venv\Scripts\python.exe test_amadeus_real.py
   ```

---

## 🎉 Pronto!

Agora você sabe:
- ✅ O que o site faz
- ✅ Como configurar tudo
- ✅ Como iniciar o sistema
- ✅ Como manter funcionando
- ✅ Como resolver problemas

**Divirta-se buscando as melhores passagens! ✈️🌍**

---

*Desenvolvido com ❤️ por Jairo Souza*
