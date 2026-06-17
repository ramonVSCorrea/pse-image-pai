"""
Script para criar imagens PGM de teste no formato P5 (binario).
Execucao: python create_test_pgm.py
As imagens sao salvas na pasta samples/ na raiz do projeto.
"""
import os
import random

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), '..', 'samples')


def write_pgm(filename, width, height, pixels):
    """Escreve um arquivo PGM P5 (binario, 8 bits, maxval=255)."""
    path = os.path.join(SAMPLES_DIR, filename)
    header = f"P5\n{width} {height}\n255\n".encode('ascii')
    pixel_bytes = bytearray()
    for p in pixels:
        v = int(p)
        if v < 0:
            v = 0
        if v > 255:
            v = 255
        pixel_bytes.append(v)
    with open(path, 'wb') as f:
        f.write(header + bytes(pixel_bytes))
    print(f"  Criado: {filename} ({width}x{height})")


def gradient_horizontal(width, height):
    """Gradiente horizontal: preto a esquerda, branco a direita."""
    pixels = []
    for y in range(height):
        for x in range(width):
            pixels.append(int((x / (width - 1)) * 255))
    return pixels


def gradient_vertical(width, height):
    """Gradiente vertical: preto em cima, branco embaixo."""
    pixels = []
    for y in range(height):
        val = int((y / (height - 1)) * 255)
        for x in range(width):
            pixels.append(val)
    return pixels


def checkerboard(width, height, square_size):
    """Tabuleiro de xadrez preto e branco."""
    pixels = []
    for y in range(height):
        for x in range(width):
            if ((x // square_size) + (y // square_size)) % 2 == 0:
                pixels.append(255)
            else:
                pixels.append(0)
    return pixels


def circle(width, height):
    """Circulo branco centralizado sobre fundo preto."""
    cx = width // 2
    cy = height // 2
    menor = width if width < height else height
    raio = menor // 3
    pixels = []
    for y in range(height):
        for x in range(width):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if dist <= raio:
                pixels.append(255)
            else:
                pixels.append(0)
    return pixels


def salt_and_pepper(width, height, density=0.05):
    """Imagem cinza medio com ruido sal-e-pimenta."""
    random.seed(42)
    pixels = []
    for _ in range(width * height):
        r = random.random()
        if r < density / 2:
            pixels.append(0)
        elif r < density:
            pixels.append(255)
        else:
            pixels.append(128)
    return pixels


def shapes(width, height):
    """Formas geometricas com diferentes tons de cinza."""
    pixels = [30] * (width * height)

    # Retangulo claro
    for y in range(40, 120):
        for x in range(40, 180):
            pixels[y * width + x] = 200

    # Quadrado escuro
    for y in range(150, 230):
        for x in range(50, 130):
            pixels[y * width + x] = 80

    # Circulo branco
    cx, cy, r = 200, 180, 50
    for y in range(height):
        for x in range(width):
            if ((x - cx) ** 2 + (y - cy) ** 2) <= r * r:
                pixels[y * width + x] = 240

    # Faixa diagonal
    for y in range(height):
        for x in range(width):
            if 0 <= (x - y + 60) <= 20:
                pixels[y * width + x] = 160

    return pixels


if __name__ == '__main__':
    os.makedirs(SAMPLES_DIR, exist_ok=True)

    print("\nCriando imagens PGM de teste...\n")

    write_pgm('gradiente_h_256x256.pgm', 256, 256, gradient_horizontal(256, 256))
    write_pgm('gradiente_v_256x256.pgm', 256, 256, gradient_vertical(256, 256))
    write_pgm('tabuleiro_256x256.pgm', 256, 256, checkerboard(256, 256, 32))
    write_pgm('circulo_256x256.pgm', 256, 256, circle(256, 256))
    write_pgm('ruido_sal_pimenta_256x256.pgm', 256, 256, salt_and_pepper(256, 256))
    write_pgm('formas_256x256.pgm', 256, 256, shapes(256, 256))

    print("\nImagens criadas em: samples/")
    print("Use esses arquivos .pgm no bloco Leitura do PSE-Image.\n")
