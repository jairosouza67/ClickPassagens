# 🎨 Como Adicionar o Ícone do Avião ao Site

## 📋 Passo a Passo:

### 1. Salvar a Imagem

1. **Salve a imagem do avião** que você enviou
2. Renomeie para: `airplane-icon.png`
3. Coloque na **raiz do projeto** (mesmo lugar onde está o `README.md`)

### 2. Instalar Pillow (se ainda não tiver)

Execute no terminal:

```powershell
pip install Pillow
```

### 3. Gerar os Ícones

Execute o script que criei:

```powershell
python generate_icons.py
```

Isso vai criar automaticamente:
- ✅ `favicon.ico` (16x16, 32x32, 48x48)
- ✅ `favicon-16x16.png`
- ✅ `favicon-32x32.png`
- ✅ `icon-192x192.png` (para PWA Android)
- ✅ `icon-512x512.png` (para PWA Android)
- ✅ `apple-touch-icon.png` (180x180 para iOS)

Todos os arquivos serão salvos na pasta `static/`

### 4. Fazer Deploy

Depois de gerar os ícones:

```powershell
git add .
git commit -m "Add airplane icon for favicon and PWA"
git push origin master
```

O Netlify vai fazer deploy automaticamente e o ícone aparecerá:
- ✅ Na aba do navegador (favicon)
- ✅ No app instalado no celular (PWA)
- ✅ No iOS quando adicionar à tela inicial

---

## 🎯 Resultado:

### Desktop (Navegador):
- Ícone do avião na aba do navegador

### Mobile (PWA):
- Ícone do avião na tela inicial do celular
- Ícone do avião na splash screen ao abrir o app

---

## ❓ Dúvidas?

Se aparecer erro "Pillow not found":
```powershell
pip install Pillow
```

Se a imagem não for encontrada, verifique:
- Nome do arquivo: `airplane-icon.png`
- Local: Raiz do projeto (não dentro de pasta)

---

**Depois de fazer isso, me avise que eu atualizo o manifest.json e o index.html!**
