"""
Script para gerar todos os ícones necessários para PWA
a partir da imagem do avião
"""
from PIL import Image
import os

def generate_icons():
    # Caminho da imagem original (você precisa salvar a imagem como airplane-icon.png na raiz)
    input_image = "airplane-icon.png"
    
    if not os.path.exists(input_image):
        print(f"❌ Erro: {input_image} não encontrado!")
        print("Por favor, salve a imagem do avião como 'airplane-icon.png' na raiz do projeto")
        return
    
    # Abrir imagem original
    img = Image.open(input_image)
    
    # Converter para RGBA se necessário
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Tamanhos necessários
    sizes = [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (192, "icon-192x192.png"),
        (512, "icon-512x512.png"),
        (180, "apple-touch-icon.png"),
    ]
    
    print("🎨 Gerando ícones...")
    
    for size, filename in sizes:
        # Redimensionar mantendo proporção
        icon = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Salvar na pasta static
        output_path = os.path.join("static", filename)
        icon.save(output_path, "PNG")
        print(f"✅ Criado: {output_path} ({size}x{size})")
    
    # Gerar favicon.ico (multi-size)
    icon_sizes = [(16, 16), (32, 32), (48, 48)]
    icons = []
    for size in icon_sizes:
        icon = img.resize(size, Image.Resampling.LANCZOS)
        icons.append(icon)
    
    favicon_path = os.path.join("static", "favicon.ico")
    icons[0].save(
        favicon_path,
        format='ICO',
        sizes=icon_sizes,
        append_images=icons[1:]
    )
    print(f"✅ Criado: {favicon_path} (multi-size)")
    
    print("\n🎉 Todos os ícones foram gerados com sucesso!")
    print("\n📝 Próximo passo: Fazer deploy para atualizar o site")

if __name__ == "__main__":
    generate_icons()
