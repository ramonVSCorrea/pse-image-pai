from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from models import ProcessRequest, ProcessResponse
from processor import ImageProcessor

app = FastAPI(title="PSE-Image Backend", version="1.0.0")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://pseimage.yrttech.com", "https://pseimage.yrttech.com"],  # Vite e CRA
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = ImageProcessor()

def _read_pgm_token(contents: bytes, index: int):
    """
    Le um token do cabecalho PGM ignorando espacos e comentarios.
    Retorna (token, proximo_indice).
    """
    length = len(contents)

    while index < length:
        byte = contents[index]
        if byte in b" \t\r\n":
            index += 1
            continue
        if byte == ord('#'):
            while index < length and contents[index] not in b"\r\n":
                index += 1
            continue
        break

    start = index
    while index < length and contents[index] not in b" \t\r\n#":
        index += 1

    if start == index:
        raise ValueError("Cabecalho PGM incompleto")

    return contents[start:index].decode("ascii"), index

def parse_pgm(contents: bytes):
    """
    Faz parser de arquivos PGM P2 (ASCII) e P5 (binario), 8 bits/pixel.
    """
    try:
        magic, index = _read_pgm_token(contents, 0)
        width_token, index = _read_pgm_token(contents, index)
        height_token, index = _read_pgm_token(contents, index)
        max_value_token, index = _read_pgm_token(contents, index)
    except UnicodeDecodeError:
        raise ValueError("Cabecalho PGM deve estar em ASCII")

    if magic not in {"P2", "P5"}:
        raise ValueError("Formato PGM invalido. Use P2 ou P5")

    width = int(width_token)
    height = int(height_token)
    max_value = int(max_value_token)

    if width <= 0 or height <= 0:
        raise ValueError("Dimensoes PGM invalidas")

    if max_value != 255:
        raise ValueError("Apenas PGM 8 bits com valor maximo 255 e suportado")

    expected_pixels = width * height

    if magic == "P2":
        pixel_data = []
        while len(pixel_data) < expected_pixels:
            token, index = _read_pgm_token(contents, index)
            value = int(token)
            if value < 0 or value > 255:
                raise ValueError("PGM contem pixel fora do intervalo 0-255")
            pixel_data.append(value)

        return {
            "width": width,
            "height": height,
            "data": pixel_data
        }

    if index < len(contents) and contents[index] in b" \t\r\n":
        if contents[index] == ord('\r') and index + 1 < len(contents) and contents[index + 1] == ord('\n'):
            index += 2
        else:
            index += 1

    while index < len(contents) and contents[index] == ord('#'):
        while index < len(contents) and contents[index] not in b"\r\n":
            index += 1
        if index < len(contents) and contents[index] == ord('\r') and index + 1 < len(contents) and contents[index + 1] == ord('\n'):
            index += 2
        elif index < len(contents) and contents[index] in b"\r\n":
            index += 1

    pixel_bytes = contents[index:index + expected_pixels]
    if len(pixel_bytes) != expected_pixels:
        raise ValueError(
            f"PGM P5 invalido: esperado {expected_pixels} bytes de pixels, recebido {len(pixel_bytes)}"
        )

    pixel_data = []
    for pixel in pixel_bytes:
        pixel_data.append(pixel)

    return {
        "width": width,
        "height": height,
        "data": pixel_data
    }

@app.get("/")
def read_root():
    return {
        "message": "PSE-Image Backend API",
        "version": "1.0.0",
        "endpoints": ["/process", "/health"]
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/process", response_model=ProcessResponse)
async def process_graph(request: ProcessRequest):
    """
    Processa o grafo de nós e retorna os resultados
    """
    try:
        # Converter para dicts
        nodes = [node.model_dump() for node in request.nodes]
        edges = [edge.model_dump() for edge in request.edges]

        # Processar
        results = processor.process_graph(nodes, edges)

        return ProcessResponse(results=results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-raw")
async def upload_raw_file(file: UploadFile = File(...)):
    """
    Faz upload de um arquivo PGM e retorna os pixels em escala de cinza.
    O parser e manual e aceita P2 (ASCII) e P5 (binario), 8 bits/pixel.
    """
    try:
        contents = await file.read()
        filename = file.filename or ""
        file_ext = filename.lower().split('.')[-1] if '.' in filename else ""

        if file_ext != 'pgm':
            raise HTTPException(
                status_code=400,
                detail="Formato não suportado. Carregue um arquivo PGM (.pgm)."
            )

        try:
            return parse_pgm(contents)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erro ao processar arquivo PGM: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
