import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/features/theme'
import {
  Upload,
  Grid3x3,
  Sparkles,
  Eye,
  BarChart3,
  Minus,
  Save,
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
}

export function Toolbar({ onAddNode, onProcess, onClear, isProcessing }: ToolbarProps) {
  return (
    <aside className="relative z-20 flex h-full w-[108px] shrink-0 flex-col border-r border-slate-900/10 bg-white/75 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/40 md:w-[286px]">
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-[1.75rem] border border-cyan-700/20 bg-gradient-to-br from-cyan-400/20 to-violet-400/10 p-4 shadow-lg shadow-cyan-900/10 dark:border-cyan-300/20 dark:from-cyan-300/15 dark:shadow-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/30">
              <Network className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black leading-none tracking-tight text-slate-950 dark:text-white">PSE-Image</h1>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-800/80 dark:text-cyan-200/80">
                Image pipeline
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <div className="hidden px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500 md:block">
            Blocos
          </div>

          <NodeButton
            type="RAW_READER"
            icon={Upload}
            label="Leitura"
            onClick={onAddNode}
          />

          <NodeButton
            type="CONVOLUTION"
            icon={Grid3x3}
            label="Convolução"
            onClick={onAddNode}
          />

          <NodeButton
            type="POINT_OP"
            icon={Sparkles}
            label="Pontual"
            onClick={onAddNode}
          />

          <NodeButton
            type="DISPLAY"
            icon={Eye}
            label="Exibir"
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
            icon={Minus}
            label="Diferença"
            onClick={onAddNode}
          />

          <NodeButton
            type="SAVE"
            icon={Save}
            label="Salvar"
            onClick={onAddNode}
          />
        </div>

        <Button
          onClick={onProcess}
          disabled={isProcessing}
          className="h-12 w-full rounded-2xl bg-cyan-300 text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-200"
        >
          <Play className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">{isProcessing ? 'Processando...' : 'Processar'}</span>
        </Button>

        <Button onClick={onClear} variant="ghost" className="h-11 w-full rounded-2xl border border-red-500/20 bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100 dark:hover:bg-red-400/20 dark:hover:text-white">
          <Trash2 className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Limpar tudo</span>
        </Button>

        <div className="flex justify-center rounded-2xl border border-slate-900/10 bg-slate-900/5 p-2 dark:border-white/10 dark:bg-white/5">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
