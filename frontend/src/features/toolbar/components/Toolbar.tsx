import { Button } from '@/components/ui/button'
import {
  UploadCloud,
  Grid3x3,
  SlidersHorizontal,
  Monitor,
  BarChart3,
  GitCompare,
  Contrast,
  FileDown,
  Play,
  Trash2,
  Network,
} from 'lucide-react'
import { NodeButton } from './NodeButton'
import type { NodeType } from '@/types'

interface ToolbarProps {
  onAddNode: (type: NodeType) => void
  onProcess: () => void
  onClear: () => void
  isProcessing: boolean
  nodeCount?: number
}

export function Toolbar({ onAddNode, onProcess, onClear, isProcessing, nodeCount = 0 }: ToolbarProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="pointer-events-auto absolute left-4 right-4 top-4 flex flex-col gap-3 lg:left-6 lg:right-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/95 px-4 py-3 text-slate-900 shadow-lab">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <Network className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-950">PSE-Image</h1>
                <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 sm:inline-flex">
                  Light Lab
                </span>
              </div>
              <p className="truncate text-xs text-slate-500">Ambiente gráfico para montar pipelines de imagem</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:flex">
              {nodeCount} etapas configuradas
            </div>
            <Button
              onClick={onClear}
              variant="outline"
              className="h-10 rounded-2xl border-red-200 bg-white px-3 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Reiniciar montagem</span>
            </Button>
            <Button
              onClick={onProcess}
              disabled={isProcessing}
              className="h-10 rounded-2xl bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Play className="mr-1 h-4 w-4" />
              {isProcessing ? 'Processando fluxo de imagem...' : 'Executar pipeline'}
            </Button>
          </div>
        </div>
      </div>

      <aside className="pointer-events-auto absolute bottom-4 left-4 right-4 rounded-3xl border border-slate-200 bg-[#EAF2F8]/95 p-3 text-slate-900 shadow-lab lg:bottom-auto lg:left-6 lg:right-auto lg:top-28 lg:w-[330px]">
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Biblioteca de operações</h2>
            <p className="mt-0.5 text-xs text-slate-500">Escolha uma operação e conecte ao pipeline</p>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">8 módulos</span>
        </div>

        <div className="grid max-h-[31vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:max-h-[calc(100vh-220px)] lg:grid-cols-1">

          <NodeButton
            type="RAW_READER"
            icon={UploadCloud}
            label="Entrada PGM"
            onClick={onAddNode}
          />

          <NodeButton
            type="CONVOLUTION"
            icon={Grid3x3}
            label="Filtro por máscara"
            onClick={onAddNode}
          />

          <NodeButton
            type="POINT_OP"
            icon={SlidersHorizontal}
            label="Ajuste ponto a ponto"
            onClick={onAddNode}
          />

          <NodeButton
            type="DISPLAY"
            icon={Monitor}
            label="Visualização"
            onClick={onAddNode}
          />

          <NodeButton
            type="HISTOGRAM"
            icon={BarChart3}
            label="Histograma"
            onClick={onAddNode}
          />

          <NodeButton
            type="DIFFERENCE"
            icon={GitCompare}
            label="Diferença"
            onClick={onAddNode}
          />

          <NodeButton
            type="COMPLEMENT"
            icon={Contrast}
            label="Complemento"
            onClick={onAddNode}
          />

          <NodeButton
            type="SAVE"
            icon={FileDown}
            label="Exportar PGM"
            onClick={onAddNode}
          />
        </div>
      </aside>
    </div>
  )
}
