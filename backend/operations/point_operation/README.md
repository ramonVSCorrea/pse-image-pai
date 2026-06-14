# Operacao Pontual

## Objetivo

Esta funcionalidade aplica uma transformacao independente em cada pixel da imagem. Cada pixel de entrada gera exatamente um pixel de saida, sem consultar pixels vizinhos.

## Tipo de no

`POINT_OP`

## Entrada

O bloco recebe uma imagem conectada em sua entrada.

Formato esperado:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [10, 50, 120, 240]
}
```

## Parametros

Os parametros ficam em `node.data`:

- `operation`: define a operacao aplicada. Valores usados atualmente: `brightness` ou `threshold`.
- `value`: valor numerico usado pela operacao.

## Processamento

O handler `handle_point_operation` valida a imagem de entrada com `require_image` e percorre todos os pixels.

Para brilho (`brightness`):

```text
saida = pixel + value
```

Depois da soma, o valor e limitado para o intervalo `0..255` pela funcao `clip`.

Para limiarizacao (`threshold`):

```text
se pixel >= value, saida = 255
caso contrario, saida = 0
```

A limiarizacao transforma a imagem em uma imagem binaria, usando apenas os valores `0` e `255`.

## Saida

Retorna uma nova imagem com a mesma largura e altura da entrada:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [20, 60, 130, 250]
}
```

## Observacoes

- A operacao nao altera as dimensoes da imagem.
- O processamento e manual, pixel a pixel.
- Se `operation` nao for `threshold`, o backend trata como brilho.
