# PSE-Image

Ambiente visual para montar e executar pipelines de processamento de imagens em escala de cinza. O projeto combina uma interface em React Flow com uma API em FastAPI que processa o grafo de blocos e aplica operações pixel a pixel.

## Visão Geral

O PSE-Image permite construir fluxos conectando blocos de leitura, processamento, análise, visualização e gravação. Cada bloco representa uma etapa do pipeline, e o backend executa as operações em ordem topológica, respeitando as dependências entre os nós.

O foco do projeto é deixar o processamento explícito e didático, com algoritmos implementados manualmente em Python, sem depender de bibliotecas prontas de visão computacional.

## Recursos

- Interface visual com blocos conectáveis usando React Flow.
- Backend FastAPI para processamento do grafo.
- Upload de imagens PGM em escala de cinza, nos formatos `P2` e `P5`, com 8 bits por pixel.
- Operações de convolução com kernel customizável.
- Filtros de média, mediana e laplaciano.
- Operações pontuais de brilho e limiarização.
- Cálculo de histograma de intensidades.
- Diferença absoluta entre duas imagens de mesmas dimensões.
- Complemento (negativo) de uma imagem.
- Visualização de resultados intermediários no fluxo.
- Exportação de resultado em arquivo `.pgm`.
- Tema claro/escuro.

## Blocos Disponíveis

| Bloco | Função |
| --- | --- |
| Leitura | Carrega uma imagem PGM e fornece os pixels ao grafo. |
| Convolução | Aplica kernel customizado ou filtros de média, mediana e laplaciano. |
| Pontual | Aplica brilho ou limiarização em cada pixel. |
| Exibir | Mostra a imagem resultante e propaga os dados para outros blocos. |
| Histograma | Calcula a frequência de intensidades de 0 a 255. |
| Diferença | Calcula a diferença absoluta entre duas imagens. |
| Complemento | Gera o negativo da imagem (255 - pixel). |
| Salvar | Grava o resultado no formato PGM P5. |

## Tecnologias

### Frontend

- React 18
- TypeScript
- Vite
- React Flow
- Tailwind CSS
- Radix UI
- Axios

### Backend

- Python 3
- FastAPI
- Pydantic
- Uvicorn
- python-multipart

## Estrutura

```text
pse-image-pai/
├── backend/
│   ├── main.py                 # API FastAPI e upload de PGM
│   ├── models.py               # Modelos Pydantic das requisições
│   ├── processor.py            # Processamento do grafo e das imagens
│   ├── requirements.txt        # Dependências Python
│   ├── images/                 # Imagens de apoio/teste
│   └── output/                 # Arquivos gerados pelo bloco Salvar
├── frontend/
│   ├── src/
│   │   ├── components/ui/      # Componentes base de UI
│   │   ├── contexts/           # Contextos globais
│   │   ├── features/           # Módulos da aplicação
│   │   │   ├── canvas/         # Canvas do React Flow
│   │   │   ├── graph/          # Estado e processamento do grafo
│   │   │   ├── nodes/          # Componentes dos blocos
│   │   │   ├── theme/          # Tema claro/escuro
│   │   │   └── toolbar/        # Barra lateral de blocos e ações
│   │   ├── lib/                # Cliente HTTP e utilitários
│   │   ├── types/              # Tipos e presets de kernels
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Entrada da aplicação
│   ├── package.json
│   └── vite.config.ts
├── vercel.json
└── README.md
```

## Pré-requisitos

- Node.js 18 ou superior.
- npm.
- Python 3.10 ou superior recomendado.

## Como Executar

Execute o backend e o frontend em terminais separados.

### 1. Backend

```bash
cd backend
python -m venv venv
```

No Windows:

```bash
venv\Scripts\activate
```

No Linux/macOS:

```bash
source venv/bin/activate
```

Instale as dependências e suba a API:

```bash
pip install -r requirements.txt
python main.py
```

A API ficará disponível em:

```text
http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

## Configuração de Ambiente

Por padrão, o frontend usa a API em `http://localhost:8000`.

Para apontar para outra URL, crie um arquivo `.env.local` dentro de `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

## Scripts do Frontend

Execute dentro da pasta `frontend/`.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor Vite em modo desenvolvimento. |
| `npm run build` | Compila TypeScript e gera a versão de produção. |
| `npm run preview` | Serve localmente a build de produção. |
| `npm run vercel-build` | Comando de build usado pela Vercel. |

## Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Retorna informações básicas da API. |
| `GET` | `/health` | Verifica se o backend está respondendo. |
| `POST` | `/upload-raw` | Recebe um arquivo `.pgm` e retorna `width`, `height` e pixels. |
| `POST` | `/process` | Recebe nós e arestas do grafo e retorna os resultados processados. |

## Formato de Imagem Suportado

O upload aceita apenas arquivos `.pgm` em escala de cinza:

- `P2`: PGM ASCII.
- `P5`: PGM binário.
- Valor máximo obrigatório: `255`.
- Um byte por pixel no caso de `P5`.

Arquivos salvos pelo bloco Salvar são gravados em `backend/output/` como PGM `P5`.

## Como Usar

1. Inicie o backend e o frontend.
2. Abra `http://localhost:5173` no navegador.
3. Adicione um bloco Leitura.
4. Selecione uma imagem `.pgm`.
5. Adicione blocos de processamento, análise ou visualização.
6. Conecte a saída de um bloco à entrada do próximo.
7. Clique em Processar.
8. Veja os resultados nos blocos Exibir, Histograma ou Salvar.

## Exemplos de Fluxo

Remover ruído com mediana:

```text
[Leitura] -> [Convolução: Mediana 3x3] -> [Exibir]
```

Suavizar imagem e visualizar histograma:

```text
[Leitura] -> [Convolução: Média 5x5] -> [Histograma]
```

Detectar bordas com laplaciano:

```text
[Leitura] -> [Convolução: Laplaciano] -> [Exibir]
```

Comparar imagem original com imagem processada:

```text
[Leitura] -------------------------------> [Diferença] -> [Exibir]
     \                                      /
      -> [Convolução: Média 5x5] ----------
```

Salvar resultado final:

```text
[Leitura] -> [Pontual: Brilho] -> [Convolução] -> [Salvar]
```

## Observações

- O grafo não pode conter ciclos.
- O bloco Diferença exige duas imagens com as mesmas dimensões.
- O bloco Leitura valida se há imagem e dimensões antes do processamento.
- O backend usa listas de pixels no intervalo de `0` a `255`.
- Valores resultantes das operações são limitados ao intervalo `0..255`.

## Build de Produção

Para gerar a build do frontend:

```bash
cd frontend
npm run build
```

Os arquivos finais serão gerados em `frontend/dist/`.
