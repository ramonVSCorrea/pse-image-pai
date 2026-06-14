"""Operacoes de convolucao e filtros por vizinhanca."""

from typing import Any

from operations.common import clip, image, insertion_sort, neighborhood, normalize_mask_size, pixel_at, require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_convolution(node: Node, inputs: list[Result]) -> Result:
    """Executa filtros locais: media, mediana, laplaciano ou kernel manual."""

    input_image = require_image(inputs, "convolucao")
    width = int(input_image["width"])
    height = int(input_image["height"])
    pixels = list(input_image["data"])
    params = node.get("data", {})
    size = normalize_mask_size(params.get("kernelSize", 3))
    filter_type = str(params.get("filterType", "convolution")).lower()

    if filter_type in {"median", "mediana"}:
        return _median_filter(pixels, width, height, size)

    if filter_type in {"average", "mean", "media"}:
        return _mean_filter(pixels, width, height, size)

    if filter_type in {"laplacian", "laplaciano"}:
        return _laplacian_filter(pixels, width, height, size)

    kernel = params.get("kernel") or _ones_kernel(size)
    divisor = float(params.get("divisor") or 1)
    return _custom_convolution(pixels, width, height, kernel, divisor)


def _custom_convolution(
    pixels: list[int],
    width: int,
    height: int,
    kernel: list[list[float]],
    divisor: float,
) -> Result:
    """Aplica uma mascara de convolucao informada pelo usuario."""

    size = len(kernel)
    radius = size // 2
    output = [0] * (width * height)

    for y in range(height):
        for x in range(width):
            total = 0.0

            for ky in range(size):
                yy = y + ky - radius
                if yy < 0 or yy >= height:
                    continue

                for kx in range(size):
                    xx = x + kx - radius
                    if xx < 0 or xx >= width:
                        continue
                    total += float(kernel[ky][kx]) * pixel_at(pixels, width, xx, yy)

            output[y * width + x] = clip(total / divisor if divisor != 0 else 0)

    return image(width, height, output)


def _median_filter(pixels: list[int], width: int, height: int, size: int) -> Result:
    """Substitui cada pixel pela mediana de sua vizinhanca."""

    radius = size // 2
    output = [0] * (width * height)

    for y in range(height):
        for x in range(width):
            values = neighborhood(pixels, width, height, x, y, radius)
            ordered = insertion_sort(values)
            output[y * width + x] = ordered[len(ordered) // 2]

    return image(width, height, output)


def _mean_filter(pixels: list[int], width: int, height: int, size: int) -> Result:
    """Substitui cada pixel pela media aritmetica de sua vizinhanca."""

    radius = size // 2
    output = [0] * (width * height)

    for y in range(height):
        for x in range(width):
            values = neighborhood(pixels, width, height, x, y, radius)
            output[y * width + x] = sum(values) // len(values) if values else 0

    return image(width, height, output)


def _laplacian_filter(pixels: list[int], width: int, height: int, size: int) -> Result:
    """Detecta bordas usando uma mascara laplaciana em formato de cruz."""

    kernel = _laplacian_kernel(size)
    return _custom_convolution(pixels, width, height, kernel, 1)


def _ones_kernel(size: int) -> list[list[int]]:
    """Cria uma mascara quadrada preenchida com 1."""

    return [[1 for _ in range(size)] for _ in range(size)]


def _laplacian_kernel(size: int) -> list[list[int]]:
    """Cria uma mascara laplaciana com vizinhanca em cruz."""

    center = size // 2
    kernel = [[0 for _ in range(size)] for _ in range(size)]

    for index in range(size):
        if index == center:
            continue
        kernel[center][index] = -1
        kernel[index][center] = -1

    kernel[center][center] = (size - 1) * 2
    return kernel
