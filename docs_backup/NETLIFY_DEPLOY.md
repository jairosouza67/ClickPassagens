# 🚀 Deploy no Netlify - Guia Rápido

## ✅ Configuração Automática

O projeto já está configurado para funcionar no Netlify! 

### 📁 Arquivos Criados:
- `netlify.toml` - Configuração do build
- `.env.production` - Variáveis de produção
- Fallback para dados estáticos incorporado

## 🎯 Como Fazer Deploy

### Opção 1: Drag & Drop (Mais Fácil)

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Drag & Drop**:
   - Acesse https://app.netlify.com
   - Arraste a pasta `dist` para a área de deploy

### Opção 2: Git Deploy (Recomendado)

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Deploy configuration for Netlify"
   git push origin main
   ```

2. **Conectar no Netlify**:
   - Acesse https://app.netlify.com
   - "New site from Git"
   - Conecte seu repositório GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🛠️ Configurações Automáticas

### ✅ O que já funciona:
- **Build automático** com `npm run build`
- **SPA routing** com redirects configurados
- **Headers de segurança** aplicados
- **Cache otimizado** para assets
- **Fallback de dados** quando API não disponível
- **Variáveis de ambiente** para produção

### 🔄 Funcionamento Híbrido:
- **Com backend**: Conecta com sua API Flask/Heroku
- **Sem backend**: Usa dados estáticos realistas
- **Erro de rede**: Fallback automático para dados locais

## 🌐 URLs após Deploy

Após o deploy, você terá:
- **Site**: https://seu-site.netlify.app
- **Preview**: Builds de preview para PRs
- **Forms**: Formulários funcionam automaticamente

## 📱 PWA Funcional

O site funcionará como PWA:
- **Instalável** no celular/desktop
- **Offline** com service worker
- **Ícones** configurados
- **Manifest** incluído

## 🎛️ Configurações Opcionais

### Custom Domain:
1. No painel Netlify: Domain settings
2. Add custom domain
3. Configure DNS

### Environment Variables:
```
VITE_API_BASE_URL=https://sua-api.herokuapp.com/api
VITE_APP_MODE=production
```

### Build Hooks:
- Webhook para rebuild automático
- Integração com CMS

## 🚨 Troubleshooting

### Build Error:
```bash
# Testar build local primeiro
npm run build
npm run preview
```

### 404 em rotas:
- ✅ Já configurado no `netlify.toml`

### Variáveis não carregam:
- Prefixo `VITE_` é obrigatório
- Configurar no painel Netlify

## 🎉 Resultado Final

Seu site estará:
- ⚡ **Rápido** - CDN global
- 🔒 **Seguro** - HTTPS automático  
- 📱 **Responsivo** - Funciona em todos dispositivos
- 🛠️ **Robusto** - Funciona com/sem backend
- 🔄 **Atualizado** - Deploy automático via Git

### Demo funcionando:
✅ Busca de voos com dados realistas
✅ Interface responsiva
✅ PWA instalável  
✅ Funcionamento offline