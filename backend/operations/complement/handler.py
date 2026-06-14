"""Operacao de complemento de imagem."""

from typing import Any

from operations.common import image, require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_complement(node: Node, inputs: list[Result]) -> Result:
    """Inverte cada pixel usando a regra 255 - pixel."""

    input_image = require_image(inputs, "complemento")
    width = int(input_image["width"])
    height = int(input_image["height"])
    pixels = list(input_image["data"])

    output = [255 - int(pixel) for pixel in pixels]

    return image(width, height, output)
