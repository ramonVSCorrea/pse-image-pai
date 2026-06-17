"""Motor de execucao dos fluxos de processamento de imagem.

O frontend monta um grafo visual. Este arquivo interpreta esse grafo, ordena os
blocos de acordo com as conexoes e delega cada operacao ao seu modulo proprio.
"""

from collections import defaultdict, deque
from typing import Any, Callable

from operations import HANDLERS


# Tipo auxiliar para deixar as assinaturas dos handlers mais legiveis.
Node = dict[str, Any]
Edge = dict[str, Any]
Result = dict[str, Any]


class ImageFlowEngine:
    """Executa os blocos do PSE-Image na ordem correta."""

    def __init__(self) -> None:
        # Mapa entre o tipo do no recebido do frontend e a funcao que o executa.
        self.handlers: dict[str, Callable[[Node, list[Result]], Result]] = HANDLERS

    def run(self, nodes: list[Node], edges: list[Edge]) -> dict[str, Result]:
        """Processa todos os nos do grafo.

        Cada resultado fica salvo em `results` usando o id do no como chave.
        Assim, quando um bloco depende de outro, a saida anterior pode ser usada
        como entrada do bloco atual.
        """

        nodes_by_id = {node["id"]: node for node in nodes}
        execution_order = self._topological_order(nodes_by_id, edges)
        results: dict[str, Result] = {}

        for node_id in execution_order:
            node = nodes_by_id[node_id]
            node_type = node.get("type", "")
            handler = self.handlers.get(node_type)
            inputs = self._collect_inputs(node_id, edges, results)

            # Tipos desconhecidos nao derrubam o fluxo inteiro; o erro fica no no.
            if handler is None:
                results[node_id] = {"error": f"Tipo de no desconhecido: {node_type}"}
                continue

            try:
                results[node_id] = handler(node, inputs)
            except Exception as exc:
                results[node_id] = {"error": f"Erro ao processar no {node_id}: {exc}"}

        return results

    def _topological_order(self, nodes_by_id: dict[str, Node], edges: list[Edge]) -> list[str]:
        """Ordena os nos garantindo que produtores venham antes dos consumidores."""

        incoming_count = {node_id: 0 for node_id in nodes_by_id}
        outgoing: dict[str, list[str]] = defaultdict(list)

        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")

            # Arestas incompletas ou apontando para nos inexistentes sao ignoradas.
            if source not in nodes_by_id or target not in nodes_by_id:
                continue

            outgoing[source].append(target)
            incoming_count[target] += 1

        # A fila inicia com blocos sem dependencias, normalmente leitores PGM.
        queue = deque(node_id for node_id, count in incoming_count.items() if count == 0)
        ordered: list[str] = []

        while queue:
            current = queue.popleft()
            ordered.append(current)

            for target in outgoing[current]:
                incoming_count[target] -= 1
                if incoming_count[target] == 0:
                    queue.append(target)

        # Se algum no ficou de fora, existe ciclo no fluxo visual.
        if len(ordered) != len(nodes_by_id):
            raise ValueError("Grafo contem ciclos")

        return ordered

    def _collect_inputs(self, node_id: str, edges: list[Edge], results: dict[str, Result]) -> list[Result]:
        """Busca as saidas dos blocos conectados na entrada de um no."""

        connected_inputs: list[tuple[str | None, Result]] = []

        for edge in edges:
            if edge.get("target") != node_id:
                continue

            source_id = edge.get("source")
            if source_id not in results:
                continue

            # Guarda o handle para manter uma ordem estavel em nos com 2 entradas.
            connected_inputs.append((edge.get("targetHandle"), results[source_id]))

        # Ordena por nome do handle quando existir; isso ajuda o bloco diferenca.
        connected_inputs.sort(key=lambda item: item[0] or "")
        return [result for _, result in connected_inputs]


# Alias para preservar compatibilidade com qualquer importacao antiga.
ImageProcessor = ImageFlowEngine
