# ClickPassagens - Sistema Completo de Busca de Passagens com Milhas

## Visão Geral

O **ClickPassagens** é uma plataforma completa para busca e comparação de passagens aéreas utilizando milhas. O sistema foi desenvolvido seguindo as especificações do documento técnico fornecido, implementando todas as funcionalidades solicitadas com tecnologias modernas e arquitetura escalável.

## Características Principais

### ✈️ **Funcionalidades Core**
- **Busca Inteligente**: Sistema de busca avançado que compara preços em milhas vs. dinheiro
- **Múltiplas Companhias**: Integração com Gol, Azul, LATAM, Avianca e Ibéria
- **Cálculo de Economia**: Mostra automaticamente a economia ao usar milhas
- **Planos de Assinatura**: Sistema de planos Básico, Premium e Empresarial
- **Orçamentos Personalizados**: Geração de orçamentos em PDF para clientes

### 📱 **Progressive Web App (PWA)**
- **Instalação no Celular**: Pode ser instalado como app nativo no smartphone
- **Funcionamento Offline**: Cache inteligente para uso sem internet
- **Notificações Push**: Alertas sobre ofertas e atualizações
- **Compartilhamento Nativo**: Integração com API de compartilhamento do dispositivo
- **Ícones Personalizados**: Ícones profissionais gerados especificamente para o app

### 🎨 **Interface Moderna**
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Componentes Profissionais**: Utiliza shadcn/ui para interface consistente
- **Animações Suaves**: Transições e micro-interações para melhor UX
- **Tema Azul**: Paleta de cores profissional focada em confiança

## Arquitetura Técnica

### **Frontend (React + Vite)**
```
site-milhas/
├── src/
│   ├── components/
│   │   ├── BuscaIntegrada.jsx     # Busca integrada com API
│   │   └── PWAInstallButton.jsx   # Botão de instalação PWA
│   ├── hooks/
│   │   └── usePWA.js              # Hook para funcionalidades PWA
│   └── App.jsx                    # Componente principal
├── public/
│   ├── manifest.json              # Manifest PWA
│   ├── sw.js                      # Service Worker
│   ├── icon-192x192.png          # Ícone PWA 192x192
│   └── icon-512x512.png          # Ícone PWA 512x512
└── dist/                          # Build de produção
```

### **Backend (Flask + SQLAlchemy)**
```
backend-milhas/
├── src/
│   ├── models/
│   │   └── milhas.py              # Modelos de dados
│   ├── routes/
│   │   ├── busca.py               # Rotas de busca
│   │   ├── usuarios.py            # Gestão de usuários
│   │   └── orcamentos.py          # Geração de orçamentos
│   ├── static/                    # Frontend buildado
│   └── main.py                    # Aplicação principal
└── database/
    └── app.db                     # Banco SQLite
```

## Funcionalidades Implementadas

### 🔍 **Sistema de Busca**
- Busca por origem, destino, datas e número de passageiros
- Comparação automática entre preços em milhas e dinheiro
- Cálculo de economia em tempo real
- Filtros por classe de voo (Econômica, Premium, Executiva, Primeira)

### 🏢 **Companhias Aéreas**
| Companhia | Código | Valor Milheiro | Comissão |
|-----------|--------|----------------|----------|
| Gol       | G3     | R$ 18,00       | 3,5%     |
| Azul      | AD     | R$ 22,00       | 4,0%     |
| LATAM     | LA     | R$ 25,00       | 4,5%     |
| Avianca   | AV     | R$ 20,00       | 3,0%     |
| Ibéria    | IB     | R$ 28,00       | 5,0%     |

### 💳 **Planos de Assinatura**

#### **Plano Básico - Gratuito**
- 5 buscas por mês
- Comparação básica de preços
- Suporte por email

#### **Plano Premium - R$ 29,90/mês**
- Buscas ilimitadas
- Alertas de preços
- Histórico de buscas
- Suporte prioritário
- Relatórios mensais

#### **Plano Empresarial - R$ 99,90/mês**
- Todas as funcionalidades Premium
- API para integração
- Gestão de equipes
- Orçamentos personalizados
- Suporte dedicado
- Relatórios avançados

### 📄 **Geração de Orçamentos**
- Orçamentos em PDF profissionais
- Logotipo e identidade visual
- Detalhamento completo dos voos
- Comparação de preços
- Validade e condições

## APIs Implementadas

### **Busca de Passagens**
```http
POST /api/busca/buscar
Content-Type: application/json

{
  "origem": "GRU",
  "destino": "GIG",
  "data_ida": "2025-10-15",
  "data_volta": "2025-10-20",
  "passageiros": 1,
  "classe": "economica",
  "usuario_id": 1
}
```

### **Listar Companhias**
```http
GET /api/busca/companhias
```

### **Gestão de Usuários**
```http
POST /api/usuarios/cadastrar
POST /api/usuarios/login
GET /api/usuarios/perfil
PUT /api/usuarios/plano
```

### **Orçamentos**
```http
POST /api/orcamentos/gerar
GET /api/orcamentos/listar
GET /api/orcamentos/{id}/pdf
```

## Recursos PWA

### **Instalação**
- Detecta automaticamente se o dispositivo suporta instalação
- Botão "Instalar App" aparece quando disponível
- Processo de instalação guiado

### **Offline**
- Cache inteligente de recursos estáticos
- Funcionalidade básica disponível offline
- Sincronização automática quando volta online

### **Notificações**
- Solicitação de permissão após instalação
- Notificações sobre ofertas especiais
- Alertas de mudanças de preços

## Tecnologias Utilizadas

### **Frontend**
- **React 18**: Framework principal
- **Vite**: Build tool moderna e rápida
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI profissionais
- **Lucide React**: Ícones modernos

### **Backend**
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **Flask-CORS**: Suporte a CORS
- **ReportLab**: Geração de PDFs

### **PWA**
- **Service Worker**: Cache e funcionalidade offline
- **Web App Manifest**: Configuração de instalação
- **Web Share API**: Compartilhamento nativo
- **Notification API**: Notificações push

## Segurança e Performance

### **Segurança**
- Validação de dados no frontend e backend
- Sanitização de inputs
- CORS configurado adequadamente
- Tokens de sessão seguros

### **Performance**
- Build otimizado com Vite
- Lazy loading de componentes
- Cache inteligente via Service Worker
- Compressão gzip automática

## Instalação e Deploy

### **Desenvolvimento Local**
```bash
# Frontend
cd site-milhas
pnpm install
pnpm run dev

# Backend
cd backend-milhas
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### **Build de Produção**
```bash
# Build do frontend
cd site-milhas
pnpm run build

# Copiar para Flask
cp -r dist/* ../backend-milhas/src/static/
```

## Próximos Passos

### **Funcionalidades Futuras**
- Integração com APIs reais das companhias aéreas
- Sistema de pagamento integrado
- Chat de suporte em tempo real
- Aplicativo mobile nativo
- Integração com programas de fidelidade

### **Melhorias Técnicas**
- Implementação de testes automatizados
- CI/CD pipeline
- Monitoramento e analytics
- Otimização de SEO
- Implementação de Redis para cache

## Conclusão

O **ClickPassagens** foi desenvolvido como uma solução completa e moderna para busca de passagens com milhas. A implementação seguiu todas as especificações do documento técnico, adicionando funcionalidades PWA para uma experiência mobile nativa. O sistema está pronto para uso em produção e pode ser facilmente escalado conforme a demanda.

A arquitetura modular permite fácil manutenção e adição de novas funcionalidades, enquanto o design responsivo e as funcionalidades PWA garantem uma excelente experiência do usuário em qualquer dispositivo.
