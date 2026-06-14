# Complemento de Imagem

## Objetivo

Esta funcionalidade calcula o complemento, ou negativo, de uma imagem em escala de cinza. Pixels escuros se tornam claros e pixels claros se tornam escuros.

## Tipo de no

`COMPLEMENT`

## Entrada

O bloco recebe uma imagem conectada em sua entrada.

Formato esperado:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [0, 10, 128, 255]
}
```

## Processamento

O handler `handle_complement` percorre todos os pixels e aplica a regra:

```text
saida = 255 - pixel
```

Exemplo:

```text
entrada = [0, 10, 128, 255]
saida   = [255, 245, 127, 0]
```

Como a imagem trabalha com 8 bits por pixel, o maior valor possivel e `255`. Por isso, subtrair o pixel de `255` inverte a intensidade.

## Saida

Retorna uma nova imagem com a mesma largura e altura da entrada:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [255, 245, 127, 0]
}
```

## Observacoes

- O bloco nao altera as dimensoes da imagem.
- A operacao e pontual, pois cada pixel depende apenas dele mesmo.
- O resultado pode ser conectado a exibicao, salvamento, histograma, diferenca ou outros blocos de processamento.
