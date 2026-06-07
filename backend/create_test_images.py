"""
Script para criar imagens RAW de teste
Execução: python create_test_images.py
"""
import os

def create_gradient_image(width, height, filename):
    """Cria uma imagem com gradiente horizontal"""
    image = []
    for y in range(height):
        for x in range(width):
            value = int((x / width) * 255)
            image.append(value)

    with open(filename, 'wb') as f:
        f.write(bytes(image))
    print(f"✓ Criado: {filename} ({width}x{height})")

def create_checkerboard_image(width, height, square_size, filename):
    """Cria uma imagem com padrão de tabuleiro de xadrez"""
    image = []
    for y in range(height):
        for x in range(width):
            if ((x // square_size) + (y // square_size)) % 2 == 0:
                image.append(255)
            else:
                image.append(0)

    with open(filename, 'wb') as f:
        f.write(bytes(image))
    print(f"✓ Criado: {filename} ({width}x{height})")

def create_circle_image(width, height, filename):
    """Cria uma imagem com um círculo branco no centro"""
    image = []
    center_x = width // 2
    center_y = height // 2
    smaller_dimension = width
    if height < smaller_dimension:
        smaller_dimension = height
    radius = smaller_dimension // 3

    for y in range(height):
        for x in range(width):
            distance = ((x - center_x)**2 + (y - center_y)**2) ** 0.5
            if distance <= radius:
                image.append(255)
            else:
                image.append(0)

    with open(filename, 'wb') as f:
        f.write(bytes(image))
    print(f"✓ Criado: {filename} ({width}x{height})")

def create_noise_image(width, height, filename):
    """Cria uma imagem com ruído aleatório"""
    import random
    image = [random.randint(0, 255) for _ in range(width * height)]

    with open(filename, 'wb') as f:
        f.write(bytes(image))
    print(f"✓ Criado: {filename} ({width}x{height})")

def create_vertical_gradient(width, height, filename):
    """Cria uma imagem com gradiente vertical"""
    image = []
    for y in range(height):
        for x in range(width):
            value = int((y / height) * 255)
            image.append(value)

    with open(filename, 'wb') as f:
        f.write(bytes(image))
    print(f"✓ Criado: {filename} ({width}x{height})")

if __name__ == '__main__':
    # Criar diretório de exemplos
    os.makedirs('test_images', exist_ok=True)

    print("\n🎨 Criando imagens RAW de teste...\n")

    # Criar imagens de teste (512x512)
    create_gradient_image(512, 512, 'test_images/gradient_512x512.raw')
    create_checkerboard_image(512, 512, 32, 'test_images/checkerboard_512x512.raw')
    create_circle_image(512, 512, 'test_images/circle_512x512.raw')
    create_noise_image(512, 512, 'test_images/noise_512x512.raw')
    create_vertical_gradient(512, 512, 'test_images/gradient_v_512x512.raw')

    # Imagens menores para testes rápidos (256x256)
    create_gradient_image(256, 256, 'test_images/gradient_256x256.raw')
    create_circle_image(256, 256, 'test_images/circle_256x256.raw')
    create_checkerboard_image(256, 256, 16, 'test_images/checkerboard_256x256.raw')

    print("\n✅ Imagens de teste criadas com sucesso!")
    print("📁 Localização: backend/test_images/")
    print("\n📖 Instruções de uso:")
    print("1. Abra o PSE-Image (http://localhost:5173)")
    print("2. Adicione um bloco 'Leitura RAW'")
    print("3. Configure: Largura = 512, Altura = 512")
    print("4. Carregue um dos arquivos .raw criados")
    print("5. Adicione blocos de processamento e exibição")
    print("6. Clique em 'Processar'")
    print("\n🎯 Exemplos de teste:")
    print("  • gradient_512x512.raw - Testar filtros (Gaussiano, Sobel)")
    print("  • circle_512x512.raw - Testar detecção de bordas (Laplaciano)")
    print("  • checkerboard_512x512.raw - Testar operações pontuais")
    print("  • noise_512x512.raw - Testar filtros de suavização")
