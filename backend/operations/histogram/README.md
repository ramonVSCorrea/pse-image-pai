# Histograma

## Objetivo

Esta funcionalidade calcula a distribuicao de intensidades da imagem. Ela conta quantos pixels existem em cada nivel de cinza de `0` a `255`.

## Tipo de no

`HISTOGRAM`

## Entrada

O bloco recebe uma imagem conectada em sua entrada.

Formato esperado:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [0, 0, 128, 255]
}
```

## Processamento

O handler `handle_histogram` cria uma lista com 256 posicoes, todas iniciadas com `0`.

Depois percorre cada pixel da imagem:

```text
histograma[pixel] = histograma[pixel] + 1
```

Exemplo com pixels `[0, 0, 128, 255]`:

- Posicao `0` recebe valor `2`.
- Posicao `128` recebe valor `1`.
- Posicao `255` recebe valor `1`.
- Todas as outras posicoes permanecem `0`.

## Saida

Retorna um resultado do tipo `histogram`:

```json
{
  "type": "histogram",
  "data": [2, 0, 0, "...", 1]
}
```

O campo `data` sempre possui 256 valores.

## Observacoes

- Este bloco nao gera uma imagem, ele gera dados de analise.
- A plotagem visual do histograma acontece no frontend.
- O histograma ajuda a avaliar contraste, brilho e distribuicao tonal da imagem.
