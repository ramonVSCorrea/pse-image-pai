"""Operacao de exibicao."""

from typing import Any

from operations.common import image, require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_display(node: Node, inputs: list[Result]) -> Result:
    """Repassa a imagem para que o frontend possa desenha-la no canvas."""

    input_image = require_image(inputs, "exibicao")
    return image(int(input_image["width"]), int(input_image["height"]), list(input_image["data"]))
