"""Operacao de salvamento em PGM."""

from pathlib import Path
from typing import Any

from operations.common import clip, require_image


Node = dict[str, Any]
Result = dict[str, Any]


def handle_save(node: Node, inputs: list[Result]) -> Result:
    """Grava uma imagem PGM P5 dentro da pasta `backend/output`."""

    input_image = require_image(inputs, "salvamento")
    filename = str(node.get("data", {}).get("filename") or "output.pgm")

    if not filename.lower().endswith(".pgm"):
        filename = f"{filename.rsplit('.', 1)[0]}.pgm" if "." in filename else f"{filename}.pgm"

    width = int(input_image.get("width") or 0)
    height = int(input_image.get("height") or 0)
    pixels = list(input_image.get("data") or [])

    if width <= 0 or height <= 0 or len(pixels) != width * height:
        return {"error": "Imagem invalida para salvar em PGM"}

    output_dir = Path(__file__).resolve().parents[2] / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    header = f"P5\n{width} {height}\n255\n".encode("ascii")
    body = bytes(clip(pixel) for pixel in pixels)
    output_path.write_bytes(header + body)

    return {
        "type": "save",
        "filename": filename,
        "path": str(output_path),
        "width": width,
        "height": height,
        "image": {"width": width, "height": height, "data": pixels},
        "saved": True,
        "message": f"Arquivo PGM salvo em {output_path}",
    }
