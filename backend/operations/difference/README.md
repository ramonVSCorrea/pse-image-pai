# Diferenca entre Imagens

## Objetivo

Esta funcionalidade calcula a diferenca absoluta entre duas imagens. Ela e usada para comparar uma imagem original com uma imagem processada, ou para comparar duas imagens quaisquer de mesmas dimensoes.

## Tipo de no

`DIFFERENCE`

## Entrada

O bloco exige duas imagens conectadas em suas entradas.

Formato esperado de cada imagem:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [10, 80, 150, 250]
}
```

As duas imagens devem ter a mesma largura e a mesma altura.

## Processamento

O handler `handle_difference` valida se existem pelo menos duas entradas e se as dimensoes sao iguais.

Depois percorre os pixels em pares:

```text
saida = abs(pixel_imagem_1 - pixel_imagem_2)
```

Exemplo:

```text
imagem 1 = [10, 80, 150, 250]
imagem 2 = [0, 100, 120, 255]
saida   = [10, 20, 30, 5]
```

## Saida

Retorna uma imagem com a mesma largura e altura das entradas:

```json
{
  "type": "image",
  "width": 2,
  "height": 2,
  "data": [10, 20, 30, 5]
}
```

## Erros tratados

Se houver menos de duas imagens:

```json
{"error": "Diferenca requer duas imagens de entrada"}
```

Se as dimensoes forem diferentes:

```json
{"error": "As imagens devem ter as mesmas dimensoes"}
```

## Observacoes

- Como a diferenca usa valor absoluto, a ordem das duas imagens nao altera o resultado.
- A saida destaca regioes onde houve maior alteracao entre as imagens.
