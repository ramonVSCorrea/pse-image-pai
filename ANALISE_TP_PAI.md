# Analise de conformidade com TP_PAI.pdf

Data da analise: 09/06/2026

Projeto analisado: `pse-image-pai`

Enunciado analisado: `TP_PAI.pdf`

## Resumo executivo

O projeto esta parcialmente condizente com o solicitado no `TP_PAI.pdf`. A base principal do PSE-Image existe: ha uma aplicacao web com interface grafica em blocos, conexoes via React Flow, backend FastAPI, leitura de PGM, exibicao, gravacao, operacoes pontuais, convolucao parametrizavel e mascaras conhecidas.

O principal ponto de nao conformidade funcional e o requisito de implementar tres blocos extras entre histograma, diferenca, morfologia e complemento. O projeto implementa apenas dois desses blocos extras: histograma e diferenca. Nao foram encontradas implementacoes de operacao morfologica nem de complemento de imagem.

Tambem nao foram encontrados no repositorio os produtos finais de entrega alem do codigo-fonte, como video demonstrativo, manual sucinto separado, executavel/artefato final e bases de dados organizadas em formato PGM.

## Verificacoes executadas

| Verificacao | Resultado |
| --- | --- |
| Leitura do `TP_PAI.pdf` | Concluida |
| Analise do backend | Concluida |
| Analise do frontend | Concluida |
| Busca por morfologia/complemento | Nada encontrado |
| Busca por manual/video/executavel | Nada encontrado |
| `npm run build` em `frontend/` | Sucesso, com aviso de chunk JS acima de 500 kB |
| `python -m compileall backend` | Sucesso, mas varreu tambem `backend/venv/` |

## Requisitos do enunciado

O `TP_PAI.pdf` pede um Problem-Solving Environment para processamento de imagens com construcao grafica de fluxos por blocos interconectados, sem programacao textual pelo usuario. O usuario deve parametrizar blocos, processar imagens e avaliar os resultados.

Requisitos funcionais principais:

| Requisito | Status | Evidencias |
| --- | --- | --- |
| Interface grafica com blocos interconectados | Implementado | `frontend/src/features/canvas/components/FlowCanvas.tsx`, `frontend/src/features/toolbar/components/Toolbar.tsx` |
| Usuario monta fluxo sem programacao textual | Implementado | Blocos adicionados pela toolbar e conectados no React Flow |
| Parametrizacao dos blocos | Implementado parcialmente | Parametros em `ConvolutionNode.tsx`, `PointOpNode.tsx`, `SaveNode.tsx` |
| Processamento do grafo em ordem de dependencias | Implementado | `backend/processor.py`, metodo `topological_sort` |
| Avaliacao visual dos resultados | Implementado parcialmente | Blocos `DISPLAY` e `HISTOGRAM`; nao ha metricas de qualidade alem de visualizacao/histograma |

## Blocos de interface

| Requisito | Status | Evidencias | Observacoes |
| --- | --- | --- | --- |
| Leitura de arquivo PGM acromatico, escala de cinza, 8 bits/pixel | Implementado | `backend/main.py`, `parse_pgm`; `RawReaderNode.tsx` | Aceita PGM `P2` e `P5`, exige valor maximo `255` |
| Exibicao de imagem acromatica | Implementado | `DisplayNode.tsx`, `processor.py` metodo `process_display` | Renderiza em canvas convertendo cada pixel para RGB igual |
| Gravacao de arquivo PGM | Implementado | `processor.py` metodo `process_save`; `SaveNode.tsx` | Backend salva em `backend/output/`; frontend tambem permite baixar PGM P5 pelo navegador |
| Duas ou mais imagens no workspace | Implementado | `useGraphState.ts`, `addNode` permite adicionar multiplos `RAW_READER` | Nao ha restricao de quantidade de blocos de leitura |
| Exibicao e gravacao em qualquer ponto do fluxo | Implementado parcialmente | `DISPLAY` tem entrada e saida; `SAVE` pode receber qualquer imagem conectada | `SAVE` e terminal na interface, o que e aceitavel para gravacao; `DISPLAY` propaga a imagem |

## Blocos de processamento de imagem

| Requisito | Status | Evidencias | Observacoes |
| --- | --- | --- | --- |
| Bloco de processamento pontual | Implementado | `PointOpNode.tsx`, `processor.py` metodo `process_point_operation` | Suporta brilho e limiarizacao |
| Bloco local baseado em convolucao parametrizavel | Implementado | `ConvolutionNode.tsx`, `processor.py` metodo `process_convolution` | Permite tamanho 3x3, 5x5, 7x7 e 9x9, pesos editaveis e divisor |
| Tamanho da mascara definido pelo usuario | Implementado | `KERNEL_SIZES` em `ConvolutionNode.tsx` | Tamanhos sao predefinidos, mas selecionaveis pelo usuario |
| Pesos definidos pelo usuario | Implementado | Inputs numericos do kernel em `ConvolutionNode.tsx` | Desabilitado apenas para mediana, o que faz sentido por nao ser convolucao linear |
| Mascaras conhecidas para selecao | Implementado | `PRESET_KERNELS` em `types/index.ts` | Media, mediana e laplaciano |
| Cada bloco recebe imagem e gera imagem | Implementado para blocos de imagem | `processor.py` | Histograma gera histograma, e salvar gera metadados de salvamento, como esperado para blocos nao transformadores |

## Outros blocos exigidos

O enunciado pede escolher tres entre: histograma, diferenca entre duas imagens, operacao morfologica e complemento.

| Bloco opcional | Status | Evidencias |
| --- | --- | --- |
| Plotagem de histograma | Implementado | `HistogramNode.tsx`, `processor.py` metodo `process_histogram` |
| Calculo da diferenca entre duas imagens | Implementado | `DifferenceNode.tsx`, `processor.py` metodo `process_difference` |
| Operacao morfologica | Nao implementado | Busca por `morph`, `morf`, `erod`, `dilat` nao encontrou codigo |
| Complemento de uma imagem | Nao implementado | Busca por `complement`, `COMPLEMENT`, `Complemento` nao encontrou codigo |

Status deste grupo: nao conforme. O projeto implementa 2 de 3 blocos extras obrigatorios.

## Produtos de entrega

| Produto pedido | Status no repositorio | Observacoes |
| --- | --- | --- |
| Codigo-fonte | Implementado | Backend, frontend e README estao presentes |
| Arquivo executavel | Nao encontrado | Ha build web possivel com `npm run build`, mas nenhum executavel/artefato final foi encontrado |
| Bases de dados utilizadas | Parcial | Existe `backend/images/elephant-8994442_1280 (1).jpg`, mas o sistema exige PGM; existe `backend/output/output.pgm` como saida gerada |
| Video de 4 a 5 minutos | Nao encontrado | Nenhum arquivo `.mp4`, `.avi`, `.mov`, `.mkv` ou `.webm` encontrado |
| Manual sucinto de utilizacao | Parcial | O `README.md` contem instrucoes de uso, mas nao ha manual separado |

## O que esta implementado

- Aplicacao web com frontend React, TypeScript, Vite, Tailwind e React Flow.
- Backend FastAPI com endpoints `/`, `/health`, `/upload-raw` e `/process`.
- Upload manual de PGM `P2` e `P5`, com validacao de extensao, dimensoes e valor maximo `255`.
- Workspace grafico para adicionar blocos e conectar etapas.
- Processamento de grafo em ordem topologica e deteccao de ciclos no backend.
- Bloco de leitura PGM (`RAW_READER`).
- Bloco de visualizacao (`DISPLAY`) com canvas em escala de cinza.
- Bloco de salvamento/exportacao PGM (`SAVE`).
- Bloco pontual (`POINT_OP`) com brilho e limiarizacao.
- Bloco de convolucao (`CONVOLUTION`) com kernel editavel, divisor e tamanhos 3x3, 5x5, 7x7 e 9x9.
- Presets de media, mediana e laplaciano.
- Histograma de intensidades 0 a 255.
- Diferenca absoluta entre duas imagens de mesmas dimensoes.
- README com visao geral, execucao, endpoints, exemplos de fluxo e observacoes.
- Build de frontend funcionando.

## O que esta faltando para atender melhor ao TP

- Implementar pelo menos mais um bloco entre `Operacao Morfologica` ou `Complemento de uma imagem`.
- Expor esse novo bloco na toolbar, nos tipos, no mapeamento de componentes e no backend.
- Criar ou anexar um manual sucinto de utilizacao, preferencialmente `MANUAL.md` ou PDF curto.
- Criar o video demonstrativo de 4 a 5 minutos solicitado.
- Definir o artefato executavel/entregavel final da aplicacao web, por exemplo build empacotado, instrucoes de execucao offline ou container.
- Organizar bases de dados utilizadas em PGM, ja que o arquivo encontrado em `backend/images/` e JPG e nao e aceito pelo leitor atual.
- Remover ou atualizar `backend/create_test_images.py`, pois ele ainda menciona imagens RAW e instrui uso de bloco RAW, enquanto o projeto atual usa PGM.

## Melhorias recomendadas

| Prioridade | Melhoria | Justificativa |
| --- | --- | --- |
| Alta | Adicionar bloco de complemento `255 - pixel` | E o caminho mais simples para cumprir o terceiro bloco opcional exigido |
| Alta | Propagar erros de resultado por no para a interface | Atualmente alguns erros retornam dentro de `results` e podem nao aparecer claramente ao usuario |
| Alta | Atualizar README/manual removendo referencias a RAW | Evita divergencia entre documentacao antiga e requisito PGM |
| Media | Adicionar testes unitarios para `parse_pgm` e `ImageProcessor` | Reduz risco em parser PGM, convolucao, diferenca e salvamento |
| Media | Validar tamanho real do kernel no backend | Evita erro se o frontend enviar `kernelSize` diferente da matriz `kernel` |
| Media | Melhorar tratamento de bordas da convolucao | Hoje pixels fora da imagem sao ignorados; documentar ou parametrizar esse comportamento |
| Media | Usar `targetHandle` para entradas da diferenca | Facilita rastrear explicitamente entrada A e B, mesmo que `|A - B|` seja simetrico |
| Baixa | Remover `console.log` e `print` de debug | Limpa a apresentacao final em laboratorio |
| Baixa | Configurar code splitting do frontend | O build funciona, mas emite aviso de chunk acima de 500 kB |

## Conclusao

O projeto demonstra uma implementacao funcional e coerente da arquitetura principal do PSE-Image. A parte central do trabalho esta bem encaminhada: ha ambiente grafico, blocos conectaveis, processamento manual no backend e suporte a PGM em escala de cinza.

Para ficar condizente com todos os requisitos do `TP_PAI.pdf`, o ponto mais urgente e implementar o terceiro bloco opcional. A opcao mais rapida e segura e o bloco de complemento de imagem, pois exige apenas a operacao `255 - pixel`, uma entrada e uma saida de imagem. Depois disso, devem ser preparados os artefatos de entrega: manual, video, bases PGM e definicao do executavel/artefato final.
