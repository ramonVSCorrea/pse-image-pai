"""Modelos de dados usados pela API do PSE-Image.

Este arquivo concentra apenas os contratos de entrada e saida do backend.
O frontend envia uma lista de nos e arestas do React Flow; o backend valida a
estrutura basica com Pydantic e depois repassa os dados ao processador.
"""

from typing import Any

from pydantic import BaseModel, Field


class ImagePayload(BaseModel):
    """Representa uma imagem em escala de cinza dentro da API.

    A imagem e armazenada como uma lista simples, linha por linha, com valores
    inteiros entre 0 e 255. Esse modelo fica disponivel para documentacao e
    futuras validacoes, mesmo que o grafo use dados mais flexiveis nos nos.
    """

    width: int
    height: int
    data: list[int]


class FlowNode(BaseModel):
    """No recebido do frontend.

    O campo `type` indica qual bloco deve ser executado, por exemplo
    `RAW_READER`, `CONVOLUTION`, `POINT_OP`, `DISPLAY`, `SAVE`, `HISTOGRAM` ou
    `DIFFERENCE`. O campo `data` carrega parametros especificos de cada bloco.
    """

    id: str
    type: str
    data: dict[str, Any] = Field(default_factory=dict)
    position: dict[str, float] | None = None


class FlowEdge(BaseModel):
    """Aresta que conecta dois blocos do fluxo.

    `source` e o no que produz a imagem ou resultado. `target` e o no que vai
    consumir esse resultado. Os handles sao opcionais porque alguns blocos tem
    apenas uma entrada, mas blocos como diferenca podem usar mais de uma porta.
    """

    id: str | None = None
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None


class ProcessRequest(BaseModel):
    """Corpo da requisicao enviada para `/process`."""

    nodes: list[FlowNode]
    edges: list[FlowEdge]


class ProcessResponse(BaseModel):
    """Resposta padronizada do endpoint `/process`."""

    results: dict[str, Any]
    error: str | None = None
