"""API HTTP do backend do PSE-Image.

O backend tem duas responsabilidades principais:

1. Ler arquivos PGM enviados pelo frontend e transformar a imagem em uma lista
   de pixels em escala de cinza.
2. Receber o grafo de blocos montado pelo usuario e executar cada etapa na
   ordem correta.
"""

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from models import ProcessRequest, ProcessResponse
from processor import ImageFlowEngine


# Instancia principal da aplicacao FastAPI.
app = FastAPI(title="PSE-Image Backend", version="2.0.0")


# Lista de origens autorizadas a chamar a API pelo navegador.
# Mantem localhost para desenvolvimento e o dominio publicado do projeto.
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "null"
]


# Middleware necessario para o frontend React conseguir acessar a API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# O motor de processamento fica separado da camada HTTP.
engine = ImageFlowEngine()


class PgmTokenReader:
    """Leitor pequeno para tokens do cabecalho PGM.

    PGM possui cabecalho textual mesmo no formato binario P5. Este leitor anda
    pelo arquivo byte a byte, ignorando espacos e comentarios iniciados por `#`.
    """

    def __init__(self, content: bytes):
        # Guarda todos os bytes do arquivo enviado.
        self.content = content
        # Guarda a posicao atual de leitura.
        self.index = 0

    def _skip_spaces_and_comments(self) -> None:
        """Avanca enquanto encontra espacos em branco ou comentarios."""

        while self.index < len(self.content):
            current = self.content[self.index]

            # Espacos, tabs e quebras de linha nao fazem parte dos tokens.
            if current in b" \t\r\n":
                self.index += 1
                continue

            # Comentarios em PGM comecam com # e vao ate o fim da linha.
            if current == ord("#"):
                while self.index < len(self.content) and self.content[self.index] not in b"\r\n":
                    self.index += 1
                continue

            # Qualquer outro byte marca o inicio de um token real.
            break

    def read_token(self) -> str:
        """Retorna o proximo token textual do arquivo."""

        self._skip_spaces_and_comments()

        start = self.index

        # O token termina em espaco, quebra de linha ou inicio de comentario.
        while self.index < len(self.content) and self.content[self.index] not in b" \t\r\n#":
            self.index += 1

        if start == self.index:
            raise ValueError("Cabecalho PGM incompleto")

        try:
            return self.content[start:self.index].decode("ascii")
        except UnicodeDecodeError as exc:
            raise ValueError("Cabecalho PGM deve usar texto ASCII") from exc

    def move_to_binary_pixels(self) -> None:
        """Posiciona o cursor no primeiro byte de pixels de um PGM P5."""

        # Depois do valor maximo, a especificacao exige um separador antes dos
        # bytes crus da imagem. Apenas esse separador deve ser consumido.
        if self.index < len(self.content) and self.content[self.index] in b" \t\r\n":
            if self.content[self.index] == ord("\r") and self.index + 1 < len(self.content):
                if self.content[self.index + 1] == ord("\n"):
                    self.index += 2
                    return
            self.index += 1


def parse_pgm(content: bytes) -> dict[str, object]:
    """Converte um arquivo PGM P2 ou P5 em dados de imagem.

    O TP pede imagens acromaticas de 8 bits por pixel. Por isso, a funcao aceita
    apenas PGM com valor maximo 255 e retorna pixels no intervalo 0..255.
    """

    reader = PgmTokenReader(content)

    # Os quatro primeiros tokens formam o cabecalho minimo do PGM.
    magic = reader.read_token()
    width = int(reader.read_token())
    height = int(reader.read_token())
    max_value = int(reader.read_token())

    # `P2` e ASCII; `P5` e binario. Outros formatos Netpbm nao sao aceitos.
    if magic not in {"P2", "P5"}:
        raise ValueError("Formato PGM invalido. Use P2 ou P5")

    # Dimensoes precisam ser positivas para formar uma imagem valida.
    if width <= 0 or height <= 0:
        raise ValueError("Dimensoes PGM invalidas")

    # O trabalho limita o projeto a imagens de 8 bits/pixel.
    if max_value != 255:
        raise ValueError("Apenas PGM 8 bits com valor maximo 255 e suportado")

    total_pixels = width * height

    # P2 guarda cada pixel como numero textual separado por espaco.
    if magic == "P2":
        pixels: list[int] = []
        for _ in range(total_pixels):
            value = int(reader.read_token())
            if value < 0 or value > 255:
                raise ValueError("PGM contem pixel fora do intervalo 0-255")
            pixels.append(value)

        return {"width": width, "height": height, "data": pixels}

    # P5 guarda os pixels como bytes crus logo apos o cabecalho.
    reader.move_to_binary_pixels()
    raw_pixels = content[reader.index:reader.index + total_pixels]

    # Se faltarem bytes, o arquivo esta truncado ou possui cabecalho incorreto.
    if len(raw_pixels) != total_pixels:
        raise ValueError(
            f"PGM P5 invalido: esperado {total_pixels} bytes de pixels, recebido {len(raw_pixels)}"
        )

    return {"width": width, "height": height, "data": list(raw_pixels)}


@app.get("/")
def read_root() -> dict[str, object]:
    """Retorna informacoes simples sobre a API."""

    return {
        "message": "PSE-Image Backend API",
        "version": "2.0.0",
        "endpoints": ["/health", "/upload-raw", "/process"],
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    """Endpoint usado para verificar se o backend esta ativo."""

    return {"status": "ok"}


@app.post("/upload-raw")
async def upload_raw_file(file: UploadFile = File(...)) -> dict[str, object]:
    """Recebe um `.pgm` e devolve largura, altura e pixels.

    O nome da rota foi mantido como `/upload-raw` para nao quebrar o frontend
    existente, apesar de o formato aceito atualmente ser PGM.
    """

    filename = file.filename or ""

    # A validacao por extensao evita que o usuario envie JPG, PNG ou RAW.
    if not filename.lower().endswith(".pgm"):
        raise HTTPException(status_code=400, detail="Formato nao suportado. Carregue um arquivo PGM (.pgm).")

    try:
        content = await file.read()
        return parse_pgm(content)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Erro ao processar arquivo PGM: {exc}") from exc


@app.post("/process", response_model=ProcessResponse)
async def process_graph(request: ProcessRequest) -> ProcessResponse:
    """Executa o grafo de blocos montado na interface."""

    try:
        # `model_dump` transforma os modelos Pydantic em dicionarios comuns,
        # formato esperado pelo motor de processamento.
        nodes = [node.model_dump() for node in request.nodes]
        edges = [edge.model_dump() for edge in request.edges]
        results = engine.run(nodes, edges)
        return ProcessResponse(results=results)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    # Permite iniciar o backend com `python main.py` durante o desenvolvimento.
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
