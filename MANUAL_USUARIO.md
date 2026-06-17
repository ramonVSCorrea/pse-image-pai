# PSE-Image — Manual de Utilização

## 1. O que é o PSE-Image

O PSE-Image é um ambiente visual para processamento de imagens em escala de cinza. O usuário monta fluxos de processamento arrastando blocos e conectando-os, sem precisar escrever código. Cada bloco representa uma operação (leitura, filtro, exibição, etc.) e o sistema executa todas as operações na ordem correta.

## 2. Como iniciar o sistema

O PSE-Image possui duas partes: o backend (servidor que processa as imagens) e o frontend (interface no navegador).

### 2.1 Iniciar o backend

Abra um terminal na pasta `backend/` e execute:

```
python -m venv venv
venv\Scripts\activate        (Windows)
source venv/bin/activate     (Linux/macOS)
pip install -r requirements.txt
python main.py
```

O servidor estará disponível em `http://localhost:8000`.

### 2.2 Iniciar o frontend

Abra outro terminal na pasta `frontend/` e execute:

```
npm install
npm run dev
```

A interface estará disponível em `http://localhost:5173`. Abra esse endereço no navegador.

## 3. Visão geral da interface

A tela é dividida em duas áreas:

- **Barra lateral esquerda**: contém os blocos disponíveis, o botão Processar e o botão Limpar.
- **Canvas central**: área onde os blocos são posicionados e conectados.

## 4. Blocos disponíveis

### 4.1 Leitura de Imagem (verde)
- **Função**: carrega uma imagem PGM do computador.
- **Como usar**: clique no campo de arquivo e selecione um arquivo `.pgm` (formatos P2 ou P5, 8 bits). As dimensões são detectadas automaticamente.
- **Saída**: envia os pixels da imagem para o próximo bloco conectado.

### 4.2 Convolução (azul)
- **Função**: aplica um filtro sobre a imagem usando uma máscara/kernel.
- **Parâmetros**:
  - **Tipo de filtro**: Média, Mediana ou Laplaciano (pré-definidos) ou kernel customizado.
  - **Tamanho da máscara**: 3x3, 5x5, 7x7 ou 9x9.
  - **Kernel**: os pesos da máscara (editáveis quando não é mediana).
  - **Divisor**: valor pelo qual o resultado da convolução é dividido.
- **Entrada**: uma imagem.
- **Saída**: imagem filtrada.

### 4.3 Operação Pontual (laranja)
- **Função**: aplica uma transformação em cada pixel individualmente.
- **Operações disponíveis**:
  - **Brilho**: adiciona um valor a cada pixel (positivo = mais claro, negativo = mais escuro).
  - **Limiarização**: converte a imagem em preto e branco. Pixels acima do limiar ficam brancos (255), abaixo ficam pretos (0).
- **Entrada**: uma imagem.
- **Saída**: imagem transformada.

### 4.4 Exibir Imagem (roxo)
- **Função**: mostra a imagem resultante dentro do bloco.
- **Como usar**: conecte a saída de qualquer bloco que produza imagem à entrada deste bloco. Após processar, a imagem aparece no bloco.
- **Observação**: pode ser inserido em qualquer ponto do fluxo. Também propaga a imagem para blocos seguintes.

### 4.5 Histograma (rosa)
- **Função**: mostra o gráfico de distribuição de intensidades da imagem (0 a 255).
- **Como usar**: conecte uma imagem e processe. O gráfico mostra quantos pixels existem para cada nível de cinza.
- **Interação**: passe o mouse sobre o gráfico para ver o valor exato de cada intensidade.

### 4.6 Diferença (vermelho)
- **Função**: calcula a diferença absoluta entre duas imagens pixel a pixel.
- **Como usar**: conecte duas imagens às portas de entrada (superior e inferior). As imagens devem ter as mesmas dimensões.
- **Saída**: imagem onde pixels iguais ficam pretos e diferenças ficam claras.

### 4.7 Complemento (índigo)
- **Função**: gera o negativo da imagem, invertendo cada pixel (saída = 255 - pixel).
- **Como usar**: conecte uma imagem à entrada. Após processar, pixels claros ficam escuros e vice-versa.
- **Saída**: imagem invertida.

### 4.8 Salvar PGM (verde-escuro)
- **Função**: salva a imagem resultante como arquivo PGM no computador.
- **Como usar**: defina o nome do arquivo, conecte uma imagem e clique em "Baixar Arquivo" após processar.
- **Formato**: PGM P5 (binário), 8 bits por pixel.

## 5. Como montar um fluxo

1. **Adicionar blocos**: clique nos botões da barra lateral para adicionar blocos ao canvas.
2. **Mover blocos**: arraste os blocos para posicioná-los no canvas.
3. **Conectar blocos**: clique na porta de saída (bolinha à direita) de um bloco e arraste até a porta de entrada (bolinha à esquerda) de outro bloco.
4. **Configurar parâmetros**: ajuste os valores de cada bloco (tipo de filtro, tamanho do kernel, valor de brilho, etc.).
5. **Processar**: clique no botão "Processar" na barra lateral.
6. **Ver resultados**: os blocos de Exibir, Histograma e Salvar mostram os resultados após o processamento.

## 6. Exemplos de fluxos

### Suavizar uma imagem
```
[Leitura] → [Convolução: Média 3x3] → [Exibir]
```

### Remover ruído sal-e-pimenta
```
[Leitura] → [Convolução: Mediana 3x3] → [Exibir]
```

### Detectar bordas
```
[Leitura] → [Convolução: Laplaciano] → [Exibir]
```

### Binarizar uma imagem
```
[Leitura] → [Pontual: Limiarização, limiar=128] → [Exibir]
```

### Gerar negativo
```
[Leitura] → [Complemento] → [Exibir]
```

### Comparar original com filtrada
```
[Leitura] ──────────────────────→ [Diferença] → [Exibir]
     └→ [Convolução: Média 5x5] ──→┘
```

### Fluxo completo com análise e salvamento
```
[Leitura] → [Pontual: Brilho +30] → [Convolução: Média 3x3] → [Exibir]
                                                                    ├→ [Histograma]
                                                                    └→ [Salvar]
```

## 7. Atalhos de teclado

| Tecla | Ação |
|---|---|
| `+` ou `=` | Aumentar zoom |
| `-` ou `_` | Diminuir zoom |
| `Alt` | Alternar bloqueio (impede mover/conectar nós) |
| `Delete` ou `Backspace` | Remover bloco ou conexão selecionada |

## 8. Formato de imagem aceito

O PSE-Image trabalha exclusivamente com imagens PGM (Portable Gray Map):

- **P2**: formato ASCII (valores dos pixels escritos como texto).
- **P5**: formato binário (valores dos pixels como bytes).
- **Profundidade**: 8 bits por pixel (valores de 0 a 255).
- **Tipo**: escala de cinza (acromática).

Imagens de exemplo estão disponíveis na pasta `samples/` do projeto.

## 9. Observações

- O grafo não pode conter ciclos (bloco A → B → A).
- O bloco Diferença exige duas imagens com as mesmas dimensões.
- Múltiplos blocos de Leitura podem ser usados no mesmo workspace para trabalhar com imagens diferentes.
- Blocos de Exibir e Salvar podem ser inseridos em qualquer ponto do fluxo para ver resultados intermediários.
- Todos os valores de pixel são mantidos no intervalo de 0 a 255.
