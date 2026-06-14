# Convolucao e Filtros Locais

## Objetivo

Esta funcionalidade aplica processamento local baseado em vizinhanca. Diferente da operacao pontual, o valor de cada pixel de saida pode depender de pixels ao redor da mesma posicao na imagem de entrada.

## Tipo de no

`CONVOLUTION`

## Entrada

O bloco recebe uma imagem conectada em sua entrada.

Formato esperado:

```json
{
  "type": "image",
  "width": 3,
  "height": 3,
  "data": [10, 20, 30, 40, 50, 60, 70, 80, 90]
}
```

## Parametros

Os parametros ficam em `node.data`:

- `kernelSize`: tamanho da mascara. O backend normaliza para um numero impar e no minimo `3`.
- `filterType`: tipo de filtro. Valores aceitos: `convolution`, `median`, `average` ou `laplacian`.
- `kernel`: matriz de pesos usada na convolucao customizada.
- `divisor`: valor usado para dividir o somatorio da convolucao.

## Processamento

O handler `handle_convolution` escolhe a rotina correta com base em `filterType`.

### Convolucao customizada

Para cada pixel `(x, y)`, o backend posiciona a mascara sobre a vizinhanca do pixel e calcula:

```text
somatorio = soma(pixel_vizinho * peso_da_mascara)
saida = somatorio / divisor
```

Depois disso, o valor e limitado ao intervalo `0..255` com `clip`.

Se o divisor for `0`, a saida daquele pixel e tratada como `0` para evitar divisao por zero.

### Filtro de media

O filtro de media coleta os pixels validos da vizinhanca e calcula a media aritmetica inteira:

```text
saida = soma(vizinhanca) // quantidade_de_pixels
```

Esse filtro suaviza a imagem e reduz variacoes bruscas.

### Filtro de mediana

O filtro de mediana coleta os pixels validos da vizinhanca, ordena os valores com insertion sort e escolhe o valor central.

Esse filtro e util para reduzir ruido do tipo sal e pimenta, preservando melhor bordas do que a media.

### Filtro laplaciano

O filtro laplaciano cria uma mascara em formato de cruz. O centro recebe peso positivo e os vizinhos verticais/horizontais recebem peso `-1`.

Para mascara `3x3`, a ideia e equivalente a:

```text
 0 -1  0
-1  4 -1
 0 -1  0
```

Esse filtro destaca mudancas bruscas de intensidade, sendo usado para realce ou deteccao de bordas.

## Tratamento de bordas

Quando a mascara ultrapassa a imagem, os pixels fora dos limites sao ignorados. O backend usa apenas coordenadas validas.

## Saida

Retorna uma nova imagem com a mesma largura e altura da entrada:

```json
{
  "type": "image",
  "width": 3,
  "height": 3,
  "data": [12, 21, 31, 42, 50, 58, 69, 79, 88]
}
```

## Observacoes

- O processamento e implementado manualmente, sem bibliotecas prontas de visao computacional.
- A mediana nao usa pesos do kernel, apenas o tamanho da janela.
- A mascara pode ter tamanho `3x3`, `5x5`, `7x7` ou `9x9` pelo frontend, mas o backend tambem normaliza o valor recebido.
