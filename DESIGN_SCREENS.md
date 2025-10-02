# 🎨 ClickPassagens - Design de Telas Completo
## Documento de Especificação Visual e Funcional

**Versão:** 2.0  
**Data:** 2024  
**Projeto:** ClickPassagens - Plataforma de Busca de Passagens Aéreas com Milhas

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral)
2. [Paleta de Cores e Identidade Visual](#paleta-de-cores)
3. [Telas do Sistema](#telas-do-sistema)
   - [Tela 1: Home/Landing Page](#tela-1-home)
   - [Tela 2: Busca de Passagens](#tela-2-busca)
   - [Tela 3: Resultados da Busca](#tela-3-resultados)
   - [Tela 4: Planos e Preços](#tela-4-planos)
   - [Tela 5: Contato e Suporte](#tela-5-contato)
   - [Tela 6: Login e Cadastro](#tela-6-login)
   - [Tela 7: Dashboard do Usuário](#tela-7-dashboard-usuario)
   - [Tela 8: Painel do Agente](#tela-8-painel-agente)
   - [Tela 9: Painel Administrativo](#tela-9-admin)
   - [Tela 10: Orçamento Personalizado](#tela-10-orcamento)
   - [Tela 11: Programa de Indicações](#tela-11-indicacoes)
   - [Tela 12: Histórico e Cashback](#tela-12-historico)
4. [Componentes Globais](#componentes-globais)
5. [Responsividade](#responsividade)

---

## �� Visão Geral do Projeto {#visão-geral}

O ClickPassagens é uma plataforma inovadora que permite aos usuários comparar preços de passagens aéreas em **dinheiro** e **milhas**, facilitando a tomada de decisão e promovendo economia de até 70% nas viagens.

### Objetivos do Design

- ✅ **Modernidade**: Interface clean, com gradientes suaves e animações elegantes
- ✅ **Sofisticação**: Visual premium que transmite confiança e profissionalismo
- ✅ **Usabilidade**: Navegação intuitiva e fluxos otimizados
- ✅ **Responsividade**: Adaptação perfeita para desktop, tablet e mobile
- ✅ **Performance**: Carregamento rápido e transições suaves

---

## 🎨 Paleta de Cores e Identidade Visual {#paleta-de-cores}

### Cores Primárias

```css
--aviation-blue: #0066CC        /* Azul aviação principal */
--aviation-light-blue: #4A90E2  /* Azul claro para gradientes */
--aviation-gold: #FFC107        /* Dourado para destaques premium */
```

### Cores Secundárias

```css
--success-green: #10B981        /* Verde para economia */
--error-red: #EF4444           /* Vermelho para alertas */
--warning-orange: #F59E0B      /* Laranja para avisos */
--neutral-gray: #6B7280        /* Cinza para textos secundários */
```

### Gradientes

```css
/* Gradiente Principal */
background: linear-gradient(135deg, #0066CC 0%, #4A90E2 100%);

/* Gradiente de Fundo */
background: linear-gradient(to-br, from-blue-50, via-indigo-50, to-purple-50);
```

### Tipografia

- **Fonte Principal**: Inter, sans-serif
- **Títulos**: 600-700 (Semi-bold a Bold)
- **Corpo**: 400-500 (Regular a Medium)
- **Tamanhos**:
  - H1: 3.75rem (60px)
  - H2: 3rem (48px)
  - H3: 2.25rem (36px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

---

## 📱 Telas do Sistema {#telas-do-sistema}

---

### TELA 1: Home/Landing Page {#tela-1-home}

**Objetivo**: Criar primeira impressão impactante e direcionar usuários para busca de passagens

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ [HEADER]                                                  │
│ Logo ClickPassagens    [Buscar][Planos][Contato] [Login] │
├──────────────────────────────────────────────────────────┤
│                      HERO SECTION                         │
│                                                           │
│          ⭐ #1 Plataforma de Milhas do Brasil            │
│                                                           │
│              Voe mais, gaste menos                        │
│                                                           │
│    A plataforma mais inteligente para encontrar          │
│    passagens aéreas com milhas. Compare preços           │
│    em tempo real e economize até 70%                     │
│                                                           │
│    [🛫 Buscar Passagens Agora] [Ver Como Funciona]      │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  50K+   │ │   70%   │ │  24/7   │ │  100%   │      │
│  │Passag.  │ │Economia │ │ Suporte │ │Segurança│      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                           │
│         Parceiros de confiança                            │
│    [Gol] [Azul] [LATAM] [Avianca] [Ibéria]             │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Background**: Gradiente suave de azul claro a roxo claro com elementos flutuantes animados
2. **Badge de Destaque**: Badge branco com borda azul "#1 Plataforma"
3. **Título Principal**: Fonte grande e bold com "gaste menos" em gradiente azul
4. **Estatísticas**: 4 cards com ícones, números grandes e labels
   - Animação: Destaque rotativo a cada 3 segundos com scale e sombra
5. **Companhias**: Pills coloridas com cores das companhias (laranja, azul, vermelho, etc.)
6. **CTAs**: 
   - Primário: Botão com gradiente azul + ícone de avião
   - Secundário: Botão outline azul

#### Animações

- Fade-in sequencial dos elementos (0.2s de delay entre cada)
- Floating animation nos elementos de background
- Hover: Scale 1.05 nos botões
- Estatísticas: Highlight rotativo

---

### TELA 2: Busca de Passagens {#tela-2-busca}

**Objetivo**: Permitir busca rápida e intuitiva de passagens aéreas

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│             FORMULÁRIO DE BUSCA                           │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │ Voe Mais, Gaste Menos                          │     │
│  │ Compare preços em milhas e dinheiro            │     │
│  │ ✓ Mais de 50 companhias                       │     │
│  │ ✓ Economia garantida                          │     │
│  │ ✓ Busca em tempo real                         │     │
│  └────────────────────────────────────────────────┘     │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ CARD DE BUSCA (fundo branco, sombra elegante)   │   │
│  │                                                   │   │
│  │ 📍 Origem          📍 Destino                    │   │
│  │ [São Paulo (GRU)] [Rio de Janeiro (GIG)]        │   │
│  │                                                   │   │
│  │ 📅 Data de Ida    📅 Data de Volta (opcional)   │   │
│  │ [DD/MM/AAAA]      [DD/MM/AAAA]                  │   │
│  │                                                   │   │
│  │ 👥 Passageiros    💺 Classe                      │   │
│  │ [1 Adulto ▼]      [Econômica ▼]                │   │
│  │                                                   │   │
│  │ ✈️ Companhias Aéreas (opcional)                 │   │
│  │ [Todas as companhias ▼]                         │   │
│  │                                                   │   │
│  │      [🔍 Buscar Melhores Preços]                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│           FILTROS AVANÇADOS (expansível)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ⚙️ Filtros Avançados [▼]                         │   │
│  │ • Número de paradas                              │   │
│  │ • Horário de saída/chegada                       │   │
│  │ • Bagagem incluída                               │   │
│  │ • Preço máximo                                   │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Header**: Gradiente azul com título branco e badges informativos
2. **Card Principal**: 
   - Fundo branco com backdrop-blur
   - Border radius 16px
   - Sombra suave (shadow-lg)
   - Padding generoso
3. **Campos de Formulário**:
   - Labels com ícones coloridos
   - Inputs com border 2px
   - Focus: borda azul animada
   - Placeholder em cinza claro
4. **Botão de Busca**:
   - Gradiente azul completo
   - Largura total
   - Ícone de lupa
   - Hover: ligeira opacidade
5. **Estados de Loading**:
   - Spinner animado com mensagem
   - Desabilita formulário durante busca

#### Funcionalidades

- Autocomplete para aeroportos
- Validação em tempo real
- Busca flexível de datas (+/- 3 dias)
- Seleção múltipla de companhias
- Salvamento de buscas recentes

---

### TELA 3: Resultados da Busca {#tela-3-resultados}

**Objetivo**: Exibir resultados comparativos de forma clara e atrativa

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Resultados da Busca                    [Nova Busca]     │
│  Encontramos 12 opções para você                         │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ FLIGHT CARD 1                                       │ │
│  │ ┌──────────────────────────────────────┐           │ │
│  │ │ 🔴 GOL                       📉 -45%  │           │ │
│  │ │ Direto                                │           │ │
│  │ └──────────────────────────────────────┘           │ │
│  │                                                     │ │
│  │  GRU        ✈️ ─────────────►        GIG          │ │
│  │  08:30                                 09:45        │ │
│  │           ⏱️ Duração: 1h 15min                     │ │
│  │                                                     │ │
│  │  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ 💰 Milhas   │  │ 💳 Dinheiro  │               │ │
│  │  │ 15.000      │  │ R$ 450,00    │               │ │
│  │  │ + taxas     │  │ Economia:    │               │ │
│  │  │             │  │ R$ 120,00    │               │ │
│  │  └──────────────┘  └──────────────┘               │ │
│  │                                                     │ │
│  │        [Selecionar Voo →]                          │ │
│  │                                                     │ │
│  │  ⭐ Melhor Oferta (badge no canto)                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ FLIGHT CARD 2                                       │ │
│  │ [Similar ao Card 1]                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  [Carregar mais resultados]                              │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Header de Resultados**:
   - Título bold com contador
   - Botão "Nova Busca" alinhado à direita
2. **Flight Card**:
   - Card com hover effect (elevação de sombra)
   - Header com logo da companhia (colorido)
   - Badge de economia em verde (-X%)
   - Linha do tempo visual da rota com ícone de avião
   - Dois painéis lado a lado: Milhas vs Dinheiro
   - Diferenciação visual (milhas com ícone dourado)
   - Botão CTA com gradiente e ícone de seta
   - Badge "Melhor Oferta" para economias > 30%
3. **Cores das Companhias**:
   - GOL: Laranja (#FF6B00)
   - Azul: Azul (#0066CC)
   - LATAM: Vermelho (#DC0032)
   - Avianca: Vermelho (#DC143C)
4. **Animações**:
   - Fade-in ao carregar
   - Hover: scale 1.02 + sombra aumentada
   - Botão: translate da seta no hover

#### Estado Vazio

```
┌──────────────────────────────────────────┐
│                                          │
│            ✈️ (ícone grande)            │
│                                          │
│      Nenhuma busca realizada             │
│                                          │
│  Faça uma busca para ver os resultados   │
│                                          │
│         [🔍 Fazer Busca]                 │
│                                          │
└──────────────────────────────────────────┘
```

---

### TELA 4: Planos e Preços {#tela-4-planos}

**Objetivo**: Apresentar opções de planos de forma atrativa e clara

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│            Escolha o Plano Ideal                          │
│   Encontre a opção que melhor se adapta às suas          │
│              necessidades de viagem                       │
│                                                           │
│ ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────┐             │
│ │FREE  │  │BÁSICO│  │ PREMIUM  │  │AGENTE│             │
│ │      │  │      │  │⭐Popular │  │      │             │
│ │R$ 0  │  │R$ 99 │  │ R$ 299   │  │R$ 499│             │
│ │/mês  │  │/mês  │  │  /mês    │  │/mês  │             │
│ │      │  │      │  │          │  │      │             │
│ │5     │  │100   │  │ 500      │  │1000  │             │
│ │consul│  │consul│  │consultas │  │consul│             │
│ │tas   │  │tas   │  │          │  │tas   │             │
│ │      │  │      │  │          │  │      │             │
│ │✓Basic│  │✓Avanç│  │✓Todas as │  │✓Painel│             │
│ │✓Comp │  │✓Filtr│  │ features │  │✓Comiss│             │
│ │✓Email│  │✓Histó│  │✓Orçament │  │✓Marca │             │
│ │      │  │✓Prior│  │✓Cashback │  │✓Relat │             │
│ │      │  │      │  │✓24/7     │  │      │             │
│ │      │  │      │  │          │  │      │             │
│ │[Esco │  │[Esco │  │[Escolher]│  │[Esco │             │
│ │lher] │  │lher] │  │          │  │lher] │             │
│ └──────┘  └──────┘  └──────────┘  └──────┘             │
│                                                           │
│          BENEFÍCIOS ADICIONAIS                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │ 🛡️        │  │ 📈        │  │ ⚡        │           │
│  │ Segurança │  │ Economia  │  │ Busca     │           │
│  │ Total     │  │ Garantida │  │ Rápida    │           │
│  └───────────┘  └───────────┘  └───────────┘           │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Cards de Plano**:
   - Todos com mesma altura e largura
   - Bordas coloridas conforme o plano
   - Plano Premium: 
     - Scale 1.05 (maior)
     - Ring dourado (2px)
     - Sombra mais intensa
     - Badge "Mais Popular" no topo
2. **Estrutura do Card**:
   - Header: Nome do plano
   - Preço: Fonte grande (48px) + período
   - Consultas: Subtítulo em cinza
   - Lista de recursos com checkmarks verdes
   - Botão CTA na parte inferior
3. **Cores dos Planos**:
   - Free: Border cinza
   - Básico: Border azul
   - Premium: Border dourado + ring
   - Agente: Border roxo
4. **Botões**:
   - Premium: Gradiente azul (destaque)
   - Outros: Outline azul
5. **Seção de Benefícios**:
   - 3 cards com ícones grandes
   - Background com gradiente azul
   - Texto branco
   - Hover: elevação de sombra

---

### TELA 5: Contato e Suporte {#tela-5-contato}

**Objetivo**: Facilitar comunicação e resolver dúvidas dos usuários

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│              Entre em Contato                             │
│   Nossa equipe está pronta para ajudar você a             │
│         encontrar as melhores ofertas                     │
│                                                           │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│ │ 📞       │  │ ✉️       │  │ 💬       │               │
│ │ Telefone │  │ E-mail   │  │ Chat     │               │
│ │          │  │          │  │ Online   │               │
│ │Seg-Sex   │  │Resposta  │  │Suporte   │               │
│ │8h-18h    │  │em 24h    │  │instantân│               │
│ │          │  │          │  │eo        │               │
│ │(11)      │  │contato@  │  │          │               │
│ │99999-9999│  │click.com │  │[Iniciar] │               │
│ └──────────┘  └──────────┘  └──────────┘               │
│                                                           │
│         PERGUNTAS FREQUENTES                              │
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ❓ Como funciona a busca por passagens com milhas? │  │
│ │ Nossa plataforma compara preços em dinheiro e      │  │
│ │ milhas de múltiplas companhias aéreas...           │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ❓ As milhas são transferidas automaticamente?     │  │
│ │ Não, você precisa ter as milhas em sua conta...    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ [+ mais perguntas...]                                     │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Cards de Contato**:
   - 3 cards em grid
   - Ícone grande no topo com fundo gradiente azul
   - Título em bold
   - Descrição em cinza
   - Informação de contato em azul
   - Hover: elevação de sombra
2. **FAQ**:
   - Cards com pergunta em negrito
   - Resposta em texto cinza
   - Hover: sombra mais intensa
   - Opcional: Accordion para expandir/colapsar

---

### TELA 6: Login e Cadastro {#tela-6-login}

**Objetivo**: Autenticação segura e rápida

#### Layout Login

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│          ┌────────────────────────────┐                  │
│          │                            │                  │
│          │  ✈️ ClickPassagens         │                  │
│          │                            │                  │
│          │  Bem-vindo de volta!       │                  │
│          │                            │                  │
│          │  ┌──────────────────────┐ │                  │
│          │  │ 📧 E-mail            │ │                  │
│          │  │ [Digite seu e-mail]  │ │                  │
│          │  └──────────────────────┘ │                  │
│          │                            │                  │
│          │  ┌──────────────────────┐ │                  │
│          │  │ 🔒 Senha             │ │                  │
│          │  │ [Digite sua senha]   │ │                  │
│          │  └──────────────────────┘ │                  │
│          │                            │                  │
│          │  [Esqueci minha senha]     │                  │
│          │                            │                  │
│          │  [Entrar →]                │                  │
│          │                            │                  │
│          │  ────────── ou ──────────  │                  │
│          │                            │                  │
│          │  [🔵 Entrar com Google]   │                  │
│          │  [📘 Entrar com Facebook] │                  │
│          │                            │                  │
│          │  Não tem conta?            │                  │
│          │  [Cadastre-se]             │                  │
│          │                            │                  │
│          └────────────────────────────┘                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

#### Layout Cadastro

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│          ┌────────────────────────────┐                  │
│          │  Criar sua conta           │                  │
│          │                            │                  │
│          │  [Nome completo]           │                  │
│          │  [E-mail]                  │                  │
│          │  [Telefone]                │                  │
│          │  [Senha]                   │                  │
│          │  [Confirmar senha]         │                  │
│          │                            │                  │
│          │  ☐ Aceito os termos de uso │                  │
│          │                            │                  │
│          │  [Criar Conta →]           │                  │
│          │                            │                  │
│          │  ────────── ou ──────────  │                  │
│          │                            │                  │
│          │  [Cadastro com Google]     │                  │
│          │  [Cadastro com Facebook]   │                  │
│          │                            │                  │
│          │  Já tem conta? [Entrar]    │                  │
│          └────────────────────────────┘                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Card Central**:
   - Centralizado verticalmente e horizontalmente
   - Background branco com sombra forte
   - Border radius 24px
   - Max-width: 400px
   - Padding generoso
2. **Logo**: Ícone de avião + nome em gradiente
3. **Campos**:
   - Ícones à esquerda
   - Border 2px cinza
   - Focus: borda azul com transição
4. **Botões Social**:
   - Cores das redes sociais
   - Ícones à esquerda
   - Texto branco
5. **Links**: Azul com hover sublinhado
6. **Validação**:
   - Mensagens de erro em vermelho abaixo dos campos
   - Checkmarks verdes para campos válidos

---

### TELA 7: Dashboard do Usuário {#tela-7-dashboard-usuario}

**Objetivo**: Central do usuário para gerenciar suas atividades

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ [HEADER]                                                  │
│ Logo           [Dashboard][Histórico][Perfil]    [👤User]│
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Bem-vindo, João! 👋                                     │
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Consultas   │ │ Economia    │ │ Cashback    │       │
│  │ 45/100      │ │ R$ 2.340    │ │ R$ 120,50   │       │
│  │ este mês    │ │ total       │ │ disponível  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                           │
│  ÚLTIMAS BUSCAS                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ GRU → GIG | 15/03/2024 | R$ 450 | 15.000 milhas  │ │
│  │ [Ver detalhes] [Buscar novamente]                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  PRÓXIMAS VIAGENS                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🗓️ 20/03/2024 - Rio de Janeiro                    │ │
│  │ GOL - Voo 1234 - 08:30                            │ │
│  │ [Baixar voucher] [Adicionar ao calendário]        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ALERTAS DE PREÇO                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🔔 GRU → MIA | Preço caiu R$ 500 → R$ 380       │ │
│  │ [Ver oferta]                                       │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Cabeçalho com Saudação**:
   - Título com nome do usuário
   - Emoji de mão acenando
2. **Cards de Estatísticas**:
   - 3 cards em linha
   - Número grande em destaque
   - Label em cinza
   - Barra de progresso para consultas
3. **Seções**:
   - Últimas Buscas: Lista de cards clicáveis
   - Próximas Viagens: Cards com informações de voo
   - Alertas: Notificações com badge
4. **Ações Rápidas**:
   - Botões de ação em cada card
   - Links destacados em azul

---

### TELA 8: Painel do Agente {#tela-8-painel-agente}

**Objetivo**: Ferramenta profissional para agentes de viagem

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ [HEADER AGENTE]                                           │
│ Logo      [Dashboard][Clientes][Orçamentos][Comissões]   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Painel do Agente 💼                                     │
│                                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Clientes  │ │Orçamentos│ │Comissões │ │Conversão │  │
│  │  124     │ │    45    │ │ R$ 8.450 │ │   32%    │  │
│  │ativos    │ │pendentes │ │este mês  │ │taxa      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                           │
│  AÇÕES RÁPIDAS                                            │
│  [+ Novo Orçamento] [+ Novo Cliente] [Buscar Passagem]   │
│                                                           │
│  ORÇAMENTOS RECENTES                                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Cliente: Maria Silva                               │ │
│  │ Destino: GRU → MIA                                │ │
│  │ Valor: R$ 3.450 | Status: 🟡 Pendente            │ │
│  │ [Editar] [Enviar] [Duplicar]                      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  CONFIGURAÇÕES DA AGÊNCIA                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Logo da Agência: [Upload]                         │ │
│  │ Cores da Marca: [#0066CC] [#4A90E2]              │ │
│  │ Comissões: [Configurar por companhia]             │ │
│  │ Termos Personalizados: [Editar]                   │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Header Diferenciado**: 
   - Badge "Agente" em roxo
   - Menu com opções específicas
2. **Estatísticas de Negócio**:
   - 4 cards com métricas de performance
   - Ícones de negócio
3. **Tabela de Orçamentos**:
   - Status coloridos (verde=aprovado, amarelo=pendente, vermelho=recusado)
   - Ações inline
4. **Editor de Marca**:
   - Upload de logo
   - Color pickers
   - Preview em tempo real

---

### TELA 9: Painel Administrativo {#tela-9-admin}

**Objetivo**: Controle total do sistema para administradores

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ [HEADER ADMIN]                                            │
│ Logo  [Dashboard][Usuários][Planos][Relatórios][Config]  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Dashboard Administrativo ⚙️                              │
│                                                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Users │ │Buscas│ │Renda │ │APIs  │ │Erros │          │
│  │1.245 │ │8.942 │ │R$45K │ │ 99%  │ │  2   │          │
│  │total │ │hoje  │ │mês   │ │uptime│ │hoje  │          │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                           │
│  GRÁFICOS E MÉTRICAS                                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📊 Buscas por Dia (última semana)                 │ │
│  │ [Gráfico de linha]                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 💰 Receita por Plano                              │ │
│  │ [Gráfico de pizza]                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  GESTÃO DE USUÁRIOS                                       │
│  [Filtros] [Buscar] [+ Novo Usuário]                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Nome        │ Email         │ Plano   │ Status    │ │
│  │ João Silva  │ joao@...      │ Premium │ ✅ Ativo  │ │
│  │ [Editar] [Suspender] [Deletar]                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  CONFIGURAÇÕES DO SISTEMA                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ APIs Ativas: [GOL][Azul][LATAM][Avianca]         │ │
│  │ Valor do Milheiro: [Configurar por companhia]     │ │
│  │ Manutenção: [Agendar downtime]                    │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Métricas de Sistema**:
   - 5 cards com números grandes
   - Cores: verde (sucesso), vermelho (erro), azul (neutro)
2. **Gráficos**:
   - Biblioteca de charts (Chart.js ou Recharts)
   - Interativos com tooltips
3. **Tabelas**:
   - Paginação
   - Ordenação por coluna
   - Ações inline
   - Badges de status

---

### TELA 10: Orçamento Personalizado {#tela-10-orcamento}

**Objetivo**: Criar orçamentos profissionais com marca própria

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Editor de Orçamento                                      │
│                                                           │
│  ┌──────────────────┐  ┌────────────────────────────┐   │
│  │ EDITOR           │  │ PREVIEW                     │   │
│  │                  │  │ ┌────────────────────────┐ │   │
│  │ Logo da Agência  │  │ │ [LOGO]                 │ │   │
│  │ [Upload/URL]     │  │ │                        │ │   │
│  │                  │  │ │ Orçamento de Viagem    │ │   │
│  │ Título           │  │ │                        │ │   │
│  │ [Orçamento...]   │  │ │ Cliente: Maria Silva   │ │   │
│  │                  │  │ │                        │ │   │
│  │ Subtítulo        │  │ │ GRU ──✈️──► MIA       │ │   │
│  │ [Viagem para...] │  │ │ 20/03/2024             │ │   │
│  │                  │  │ │                        │ │   │
│  │ Cliente          │  │ │ 💰 R$ 3.450,00        │ │   │
│  │ [Nome]           │  │ │ 💎 45.000 milhas      │ │   │
│  │                  │  │ │                        │ │   │
│  │ Cores da Marca   │  │ │ Detalhes do voo:      │ │   │
│  │ Primária [🎨]    │  │ │ • GOL - Voo 1234      │ │   │
│  │ Secundária [🎨]  │  │ │ • Saída: 08:30        │ │   │
│  │                  │  │ │ • Bagagem inclusa     │ │   │
│  │ Observações      │  │ │                        │ │   │
│  │ [Textarea]       │  │ │ Observações:          │ │   │
│  │                  │  │ │ [Texto personalizado] │ │   │
│  │                  │  │ │                        │ │   │
│  │ [Gerar PDF]      │  │ │ [Logo da agência]     │ │   │
│  │ [Enviar Email]   │  │ │ contato@agencia.com   │ │   │
│  └──────────────────┘  │ └────────────────────────┘ │   │
│                        └────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Layout Split**:
   - Editor à esquerda (40%)
   - Preview à direita (60%)
2. **Editor**:
   - Campos de formulário
   - Upload de imagem
   - Color pickers
   - Textarea para observações
3. **Preview**:
   - Simulação em tempo real
   - Estilo de documento profissional
   - Cores personalizadas aplicadas
4. **Ações**:
   - Gerar PDF (download)
   - Enviar por email
   - Salvar template

---

### TELA 11: Programa de Indicações {#tela-11-indicacoes}

**Objetivo**: Incentivar e gerenciar programa de afiliados

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Programa de Indicações 🎁                                │
│                                                           │
│  Ganhe R$ 50 por cada amigo que se cadastrar!            │
│                                                           │
│  SEU LINK DE INDICAÇÃO                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │ https://clickpassagens.me/ref/JOAO123             │ │
│  │                              [📋 Copiar] [🔗Comp] │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  SUAS ESTATÍSTICAS                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Indicações│ │Cadastros │ │Comissão  │ │Saldo     │  │
│  │    45    │ │    12    │ │ R$ 600   │ │ R$ 450   │  │
│  │enviadas  │ │completos │ │total     │ │disponível│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                           │
│  INDICAÇÕES RECENTES                                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📧 maria@email.com                                 │ │
│  │ Status: ✅ Cadastro completo                       │ │
│  │ Comissão: R$ 50,00 (pago)                         │ │
│  │ Data: 10/03/2024                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📧 joao@email.com                                  │ │
│  │ Status: 🟡 Pendente confirmação                   │ │
│  │ Comissão: R$ 0,00                                  │ │
│  │ Data: 12/03/2024                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  [Solicitar Resgate]                                      │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Link de Indicação**:
   - Box com fundo cinza claro
   - Botões de copiar e compartilhar
   - Tooltip "Link copiado!" ao clicar
2. **Estatísticas**:
   - 4 cards coloridos
   - Ícones relevantes
   - Números em destaque
3. **Lista de Indicações**:
   - Cards com informações completas
   - Status coloridos (verde, amarelo, cinza)
   - Histórico de comissões
4. **Botão de Resgate**:
   - Destaque quando saldo disponível
   - Desabilitado quando saldo insuficiente

---

### TELA 12: Histórico e Cashback {#tela-12-historico}

**Objetivo**: Transparência total nas transações e benefícios

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Histórico e Cashback 💰                                  │
│                                                           │
│  SALDO DE CASHBACK                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                     │ │
│  │      💎 R$ 245,80                                  │ │
│  │      Saldo disponível                               │ │
│  │                                                     │ │
│  │      [Resgatar Cashback]                           │ │
│  │      Mínimo: R$ 100,00                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  HISTÓRICO DE BUSCAS                                      │
│  [Filtrar por data] [Filtrar por companhia] [Exportar]   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📅 15/03/2024                                      │ │
│  │ GRU → GIG | GOL | R$ 450,00                       │ │
│  │ Cashback: R$ 9,00 (2%)                            │ │
│  │ [Ver detalhes] [Buscar novamente]                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📅 10/03/2024                                      │ │
│  │ GRU → MIA | LATAM | R$ 2.340,00                   │ │
│  │ Cashback: R$ 46,80 (2%)                           │ │
│  │ [Ver detalhes]                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  HISTÓRICO DE RESGATES                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📅 01/03/2024                                      │ │
│  │ Resgate via PIX: R$ 190,00                        │ │
│  │ Status: ✅ Processado                              │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

#### Elementos Visuais

1. **Card de Saldo**:
   - Destaque visual com gradiente
   - Número grande
   - Botão de resgate prominent
   - Informação de valor mínimo
2. **Filtros**:
   - Dropdowns e date pickers
   - Botão de exportar para CSV/PDF
3. **Cards de Histórico**:
   - Timeline visual
   - Informações resumidas
   - Badges de status
   - Ações secundárias

---

## 🧩 Componentes Globais {#componentes-globais}

### Header (Cabeçalho)

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO ClickPassagens]    [Nav Links]      [User Actions] │
│                                                           │
│ • Background: Branco com blur e transparência            │
│ • Sticky: Fixo no topo ao rolar                          │
│ • Shadow: Sombra suave                                   │
│ • Logo: Clicável, volta à home                           │
│ • Nav: Hover com background azul claro                   │
│ • User: Avatar + dropdown menu                           │
└──────────────────────────────────────────────────────────┘
```

### Footer (Rodapé)

```
┌──────────────────────────────────────────────────────────┐
│                     FOOTER                                │
│ Background: Cinza escuro (#1F2937)                       │
│                                                           │
│ [LOGO]          [Produtos]    [Empresa]    [Suporte]     │
│ ClickPass.      • Busca       • Sobre      • Central     │
│                 • Comparador  • Termos     • Contato     │
│ Descrição       • Alertas     • Privac.    • Status      │
│ da empresa      • Fidelidade                • Reportar   │
│                                                           │
│ ─────────────────────────────────────────────────────────│
│ © 2024 ClickPassagens. Todos os direitos reservados.    │
└──────────────────────────────────────────────────────────┘
```

### Navegação Mobile

```
┌──────────────────────────────────────────────────────────┐
│                  [NAVEGAÇÃO INFERIOR]                     │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                │
│ │ 🔍    │ │ 📍    │ │ 💳    │ │ 💬    │                │
│ │Buscar │ │Result │ │Planos │ │Contato│                │
│ └───────┘ └───────┘ └───────┘ └───────┘                │
│                                                           │
│ • Fixed: Fixo na parte inferior                          │
│ • Apenas mobile (oculto em desktop)                      │
│ • Active: Ícone e texto em azul + fundo azul claro      │
│ • Grid: 4 colunas iguais                                 │
└──────────────────────────────────────────────────────────┘
```

### Botões

**Botão Primário (CTA)**
```css
background: linear-gradient(135deg, #0066CC, #4A90E2);
color: white;
padding: 12px 32px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 14px rgba(0, 102, 204, 0.3);
transition: all 0.3s;

hover:
  opacity: 0.9;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
```

**Botão Secundário (Outline)**
```css
background: transparent;
border: 2px solid #0066CC;
color: #0066CC;
padding: 12px 32px;
border-radius: 12px;
font-weight: 600;
transition: all 0.3s;

hover:
  background: #0066CC;
  color: white;
```

### Cards

```css
background: white;
border-radius: 16px;
padding: 24px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
transition: all 0.3s;

hover:
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
```

### Inputs

```css
border: 2px solid #E5E7EB;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.3s;

focus:
  border-color: #0066CC;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
```

---

## 📱 Responsividade {#responsividade}

### Breakpoints

```css
/* Mobile First */
mobile: default         /* 0-639px */
tablet: 640px          /* 640px-1023px */
desktop: 1024px        /* 1024px+ */
wide: 1280px           /* 1280px+ */
```

### Adaptações por Dispositivo

#### Mobile (< 640px)
- **Header**: Logo menor, menu hambúrguer
- **Hero**: Título 2.5rem, stack vertical dos botões
- **Cards**: 1 coluna, padding reduzido
- **Flight Cards**: Layout vertical, informações simplificadas
- **Planos**: 1 coluna com scroll
- **Footer**: Links em accordion
- **Navegação**: Bottom navigation bar

#### Tablet (640px - 1023px)
- **Header**: Logo médio, menu visível
- **Hero**: Título 3.5rem, botões lado a lado
- **Cards**: 2 colunas
- **Flight Cards**: Layout horizontal compacto
- **Planos**: 2 colunas
- **Footer**: 2 colunas

#### Desktop (1024px+)
- **Header**: Full menu, logo grande
- **Hero**: Título 4rem, layout completo
- **Cards**: 3-4 colunas
- **Flight Cards**: Layout completo com todos os detalhes
- **Planos**: 4 colunas
- **Footer**: 4 colunas completas

---

## 🎬 Animações e Transições

### Animações Globais

```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Micro-interações

- **Hover em botões**: Scale 1.05 + sombra aumentada
- **Hover em cards**: translateY(-4px) + sombra
- **Click em inputs**: Animação de foco com border
- **Loading**: Spinner com rotação suave
- **Sucesso**: Checkmark com animação de scale
- **Erro**: Shake animation

---

## 🎨 Estados e Feedback

### Loading States

```
┌──────────────────────────────┐
│                              │
│     ⚪ ⚪ ⚪                  │
│                              │
│   Buscando passagens...      │
│                              │
└──────────────────────────────┘
```

### Success States

```
┌──────────────────────────────┐
│       ✅                     │
│   Operação realizada          │
│   com sucesso!               │
└──────────────────────────────┘
```

### Error States

```
┌──────────────────────────────┐
│       ❌                     │
│   Algo deu errado            │
│   Tente novamente            │
│   [Tentar novamente]         │
└──────────────────────────────┘
```

### Empty States

```
┌──────────────────────────────┐
│       📭                     │
│   Nenhum resultado           │
│   encontrado                 │
│   [Fazer nova busca]         │
└──────────────────────────────┘
```

---

## 🔄 Fluxos de Usuário

### Fluxo Principal: Busca de Passagens

1. **Home** → Usuário clica em "Buscar Passagens"
2. **Busca** → Preenche formulário e clica em "Buscar"
3. **Loading** → Mostra spinner durante 2-5 segundos
4. **Resultados** → Exibe cards de voos ordenados por melhor economia
5. **Seleção** → Usuário clica em "Selecionar Voo"
6. **Login** (se não autenticado) → Modal de login/cadastro
7. **Confirmação** → Modal com detalhes e opção de gerar orçamento
8. **Redirecionamento** → Link para site da companhia aérea

### Fluxo Secundário: Cadastro Premium

1. **Home/Planos** → Usuário visualiza planos
2. **Seleção** → Clica em "Escolher Premium"
3. **Cadastro** → Formulário de cadastro completo
4. **Pagamento** → Gateway de pagamento seguro
5. **Confirmação** → Email de boas-vindas + acesso ao dashboard
6. **Dashboard** → Primeiro acesso com tutorial

---

## 💡 Considerações Finais

### Princípios de Design

1. **Clareza**: Informação hierarquizada e fácil de entender
2. **Consistência**: Padrões visuais mantidos em todo o sistema
3. **Feedback**: Resposta visual para toda ação do usuário
4. **Acessibilidade**: Contraste adequado, textos legíveis, navegação por teclado
5. **Performance**: Carregamento rápido, animações suaves

### Melhorias Futuras

- [ ] Dark mode
- [ ] Personalização de tema
- [ ] Mais opções de idioma (EN, ES)
- [ ] Integração com assistente virtual
- [ ] Realidade aumentada para visualizar destinos
- [ ] Gamificação (badges, níveis)
- [ ] Social features (compartilhar viagens)

---

## 📄 Exportação para PowerPoint/PDF

Este documento pode ser convertido para PowerPoint ou PDF usando ferramentas como:

1. **Pandoc**: `pandoc DESIGN_SCREENS.md -o design_screens.pptx`
2. **Marp**: Para apresentações com markdown
3. **Markdown to PDF**: Várias ferramentas online
4. **Notion**: Import e export como PDF
5. **VS Code + Extension**: Markdown PDF

### Estrutura Sugerida para Apresentação

**Slide 1**: Capa com logo e título
**Slides 2-3**: Visão geral e objetivos
**Slide 4**: Paleta de cores
**Slides 5-16**: Uma tela por slide com screenshots/mockups
**Slide 17**: Componentes globais
**Slide 18**: Responsividade
**Slide 19**: Próximos passos

---

**Documento criado por**: ClickPassagens Team  
**Última atualização**: 2024  
**Versão**: 2.0 - Design Sofisticado e Moderno

🚀 **ClickPassagens - Voe mais, gaste menos!** ✈️
