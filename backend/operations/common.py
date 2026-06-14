"""Funcoes compartilhadas pelas operacoes de imagem."""

from typing import Any


Image = dict[str, Any]
Result = dict[str, Any]


def clip(value: float | int) -> int:
    """Limita qualquer valor numerico ao intervalo valido de pixel."""

    if value < 0:
        return 0
    if value > 255:
        return 255
    return int(value)


def image(width: int, height: int, pixels: list[int]) -> Image:
    """Monta o dicionario padrao de imagem devolvido ao frontend."""

    return {"type": "image", "width": width, "height": height, "data": pixels}


def require_image(inputs: list[Result], label: str) -> Image:
    """Valida se a primeira entrada de um bloco e uma imagem."""

    if not inputs or "data" not in inputs[0]:
        raise ValueError(f"Entrada invalida para {label}")
    return inputs[0]


def pixel_at(pixels: list[int], width: int, x: int, y: int) -> int:
    """Retorna um pixel usando coordenadas x/y."""

    return pixels[y * width + x]


def neighborhood(pixels: list[int], width: int, height: int, x: int, y: int, radius: int) -> list[int]:
    """Coleta os pixels validos ao redor de uma coordenada."""

    values: list[int] = []

    for yy in range(y - radius, y + radius + 1):
        if yy < 0 or yy >= height:
            continue
        for xx in range(x - radius, x + radius + 1):
            if xx < 0 or xx >= width:
                continue
            values.append(pixels[yy * width + xx])

    return values


def insertion_sort(values: list[int]) -> list[int]:
    """Ordena uma lista pequena sem usar funcoes prontas de ordenacao."""

    ordered = values[:]

    for i in range(1, len(ordered)):
        current = ordered[i]
        j = i - 1
        while j >= 0 and ordered[j] > current:
            ordered[j + 1] = ordered[j]
            j -= 1
        ordered[j + 1] = current

    return ordered


def normalize_mask_size(value: Any) -> int:
    """Garante que o tamanho da mascara seja impar e pelo menos 3."""

    try:
        size = int(value)
    except (TypeError, ValueError):
        size = 3

    if size < 3:
        size = 3
    if size % 2 == 0:
        size += 1

    return size
