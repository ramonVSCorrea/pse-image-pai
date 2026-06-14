"""Registro central das operacoes executaveis pelo backend."""

from typing import Any, Callable

from .complement.handler import handle_complement
from .convolution.handler import handle_convolution
from .difference.handler import handle_difference
from .display.handler import handle_display
from .histogram.handler import handle_histogram
from .point_operation.handler import handle_point_operation
from .raw_reader.handler import handle_raw_reader
from .save.handler import handle_save


Node = dict[str, Any]
Result = dict[str, Any]
Handler = Callable[[Node, list[Result]], Result]


HANDLERS: dict[str, Handler] = {
    "RAW_READER": handle_raw_reader,
    "CONVOLUTION": handle_convolution,
    "POINT_OP": handle_point_operation,
    "DISPLAY": handle_display,
    "SAVE": handle_save,
    "HISTOGRAM": handle_histogram,
    "DIFFERENCE": handle_difference,
    "COMPLEMENT": handle_complement,
}
