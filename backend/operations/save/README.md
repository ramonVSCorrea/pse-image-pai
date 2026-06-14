# Salvamento em PGM

## Objetivo

Esta funcionalidade grava uma imagem processada em arquivo PGM binario (`P5`) dentro da pasta `backend/output`.

## Tipo de no

`SAVE`

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

## Parametros

Os parametros ficam em `node.data`:

- `filename`: nome do arquivo de saida.

Se o nome nao terminar com `.pgm`, o backend ajusta automaticamente para gerar um arquivo PGM.

Exemplos:

- `resultado` vira `resultado.pgm`.
- `imagem.txt` vira `imagem.pgm`.
- `saida.pgm` permanece `saida.pgm`.

## Processamento

O handler `handle_save` executa os seguintes passos:

1. Valida se existe uma imagem de entrada.
2. Le largura, altura e pixels.
3. Confere se largura e altura sao positivas.
4. Confere se a quantidade de pixels e igual a `width * height`.
5. Cria a pasta `backend/output`, se ela ainda nao existir.
6. Monta o cabecalho PGM `P5`.
7. Converte os pixels para bytes, limitando cada valor ao intervalo `0..255`.
8. Escreve cabecalho e pixels no arquivo final.

Cabecalho gerado:

```text
P5
largura altura
255
```

Depois do cabecalho, o arquivo recebe os bytes da imagem.

## Saida

Retorna metadados do salvamento:

```json
{
  "type": "save",
  "filename": "output.pgm",
  "path": "backend/output/output.pgm",
  "width": 2,
  "height": 2,
  "image": {
    "width": 2,
    "height": 2,
    "data": [0, 80, 160, 255]
  },
  "saved": true
}
```

## Erros tratados

Se os dados da imagem forem invalidos, retorna:

```json
{"error": "Imagem invalida para salvar em PGM"}
```

## Observacoes

- O backend salva sempre em PGM `P5`, que e o formato binario.
- O frontend tambem pode permitir download do arquivo, mas o salvamento oficial do backend fica em `backend/output`.
- O bloco normalmente fica no fim do fluxo, mas pode receber qualquer imagem intermediaria conectada a ele.
