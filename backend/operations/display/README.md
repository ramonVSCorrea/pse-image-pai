# Exibicao de Imagem

## Objetivo

Esta funcionalidade representa o bloco de exibicao no fluxo. No backend, ela repassa a imagem recebida para que o frontend consiga desenhar o resultado em um canvas.

## Tipo de no

`DISPLAY`

## Entrada

O bloco recebe uma imagem conectada em sua entrada.

Formato esperado:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [0, 80, 160, 255]
}
```

## Processamento

O handler `handle_display` nao altera os pixels. Ele apenas:

1. Valida se existe uma imagem de entrada.
2. Copia largura, altura e dados de pixel.
3. Retorna uma nova imagem no formato padrao.

No frontend, o componente de exibicao converte cada pixel em escala de cinza para RGBA no canvas:

```text
R = pixel
G = pixel
B = pixel
A = 255
```

## Saida

Retorna a mesma imagem recebida, preservando dimensoes e pixels:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [0, 80, 160, 255]
}
```

## Observacoes

- O bloco pode ser inserido em pontos intermediarios do fluxo para visualizar resultados parciais.
- Como a imagem e repassada, ela tambem pode continuar conectada a outros blocos depois da exibicao.
- A exibicao nao salva arquivo; ela apenas disponibiliza os dados para visualizacao.
