import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import type { NodeType } from '@/types'
import { NODE_COLORS } from '@/types'

const NODE_DETAILS: Record<NodeType, { description: string; category: string; tint: string }> = {
  RAW_READER: { description: 'Carregar imagem em escala de cinza', category: 'Entrada PGM', tint: 'bg-teal-50' },
  CONVOLUTION: { description: 'Aplicar kernel configurável ou filtro conhecido', category: 'Convolução', tint: 'bg-blue-50' },
  POINT_OP: { description: 'Modificar pixels por brilho, limiar ou regra direta', category: 'Pixel', tint: 'bg-orange-50' },
  DISPLAY: { description: 'Mostrar a imagem gerada por uma etapa', category: 'Visualização', tint: 'bg-violet-50' },
  HISTOGRAM: { description: 'Analisar frequências dos níveis de cinza', category: 'Análise', tint: 'bg-pink-50' },
  DIFFERENCE: { description: 'Calcular diferença entre duas imagens', category: '2 entradas', tint: 'bg-red-50' },
  SAVE: { description: 'Gravar a imagem final em arquivo', category: 'Saída PGM', tint: 'bg-emerald-50' },
}

interface NodeButtonProps {
  type: NodeType
  icon: LucideIcon
  label: string
  onClick: (type: NodeType) => void
}

export function NodeButton({ type, icon: Icon, label, onClick }: NodeButtonProps) {
  const details = NODE_DETAILS[type]

  return (
    <Button
      onClick={() => onClick(type)}
      variant="ghost"
      className="group h-auto min-h-[74px] flex-row items-center justify-start gap-3 rounded-2xl border border-transparent bg-white/72 p-2.5 text-left text-slate-700 shadow-sm hover:border-white hover:bg-white hover:text-slate-950 hover:shadow-md lg:w-full"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${details.tint} ring-1 ring-white transition-transform group-hover:scale-105`}
        style={{ color: NODE_COLORS[type] }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-bold text-slate-950">{label}</span>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-500">
            {details.category}
          </span>
        </span>
        <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-500">{details.description}</span>
      </span>
    </Button>
  )
}
