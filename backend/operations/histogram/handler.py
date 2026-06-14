"""Operacao de histograma."""

from typing import Any

from operations.common import require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_histogram(node: Node, inputs: list[Result]) -> Result:
    """Conta quantos pixels existem em cada intensidade de 0 a 255."""

    input_image = require_image(inputs, "histograma")
    histogram = [0] * 256

    for pixel in input_image["data"]:
        histogram[int(pixel)] += 1

    return {"type": "histogram", "data": histogram}
