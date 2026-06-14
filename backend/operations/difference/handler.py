"""Operacao de diferenca entre duas imagens."""

from typing import Any

from operations.common import image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_difference(node: Node, inputs: list[Result]) -> Result:
    """Calcula a diferenca absoluta entre duas imagens de mesmo tamanho."""

    if len(inputs) < 2:
        return {"error": "Diferenca requer duas imagens de entrada"}

    first = inputs[0]
    second = inputs[1]

    if first.get("width") != second.get("width") or first.get("height") != second.get("height"):
        return {"error": "As imagens devem ter as mesmas dimensoes"}

    width = int(first["width"])
    height = int(first["height"])
    output: list[int] = []

    for left, right in zip(first["data"], second["data"]):
        output.append(abs(int(left) - int(right)))

    return image(width, height, output)
