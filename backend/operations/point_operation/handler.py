"""Operacoes ponto a ponto."""

from typing import Any

from operations.common import clip, image, require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_point_operation(node: Node, inputs: list[Result]) -> Result:
    """Aplica brilho ou limiarizacao pixel a pixel."""

    input_image = require_image(inputs, "operacao pontual")
    width = int(input_image["width"])
    height = int(input_image["height"])
    pixels = list(input_image["data"])
    params = node.get("data", {})
    operation = params.get("operation", "brightness")
    value = float(params.get("value", 0))

    output: list[int] = []

    for pixel in pixels:
        if operation == "threshold":
            output.append(255 if pixel >= value else 0)
        else:
            output.append(clip(pixel + value))

    return image(width, height, output)
