# Leitura de Imagem

## Objetivo

Esta funcionalidade representa o bloco inicial do fluxo. Ela recebe do frontend uma imagem PGM ja carregada e transforma esses dados no formato padrao usado pelo backend durante o processamento do grafo.

## Tipo de no

`RAW_READER`

## Entrada

Este bloco nao depende de outro bloco conectado antes dele. Os dados chegam no campo `data` do proprio no enviado pelo frontend.

Campos esperados:

- `width`: largura da imagem em pixels.
- `height`: altura da imagem em pixels.
- `imageData`: lista linear de pixels em escala de cinza.

A lista `imageData` deve estar organizada linha por linha. Para uma imagem de largura `width`, o pixel na posicao `(x, y)` fica no indice `y * width + x`.

## Processamento

O handler `handle_raw_reader` apenas copia os dados recebidos do no:

1. Le a largura no campo `width`.
2. Le a altura no campo `height`.
3. Le a lista de pixels no campo `imageData`.
4. Monta um dicionario de imagem no formato interno do backend.

O parser de arquivo PGM fica em `backend/main.py`, no endpoint `/upload-raw`. Este bloco assume que o frontend ja fez o upload e recebeu os pixels processados pela API.

## Saida

Retorna uma imagem no formato:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [0, 128, 200, 255]
}
```

Essa saida pode ser conectada a qualquer bloco que espere uma imagem, como convolucao, operacao pontual, histograma, complemento, diferenca, exibicao ou salvamento.

## Observacoes

- A validacao completa do arquivo PGM acontece antes, no upload.
- O bloco permite que varias imagens sejam abertas no workspace, pois cada no `RAW_READER` carrega seus proprios dados.
- Valores ausentes sao convertidos para largura/altura `0` ou lista vazia, e erros de fluxo podem aparecer em blocos seguintes que exigem imagem valida.
