"""Operacao de entrada RAW/PGM ja carregada pelo frontend."""

from typing import Any

from operations.common import image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_raw_reader(node: Node, inputs: list[Result]) -> Result:
    """Entrega ao grafo a imagem ja carregada no bloco de leitura."""

    data = node.get("data", {})
    width = int(data.get("width") or 0)
    height = int(data.get("height") or 0)
    pixels = list(data.get("imageData") or [])

    return image(width, height, pixels)
