import { Handle, Position, type NodeProps } from 'reactflow'
import { Contrast } from 'lucide-react'
import type { ComplementNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function ComplementNode({ data, selected }: NodeProps<ComplementNodeData>) {
  return (
    <div
      className={cn(
        'relative min-w-[295px] overflow-visible rounded-[1.7rem] border bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-slate-900 shadow-node',
        selected ? 'border-indigo-600 ring-4 ring-indigo-100' : 'border-indigo-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.7rem] bg-indigo-600" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-indigo-600 !bg-white"
      />
      <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-indigo-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">img</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Contrast className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Complemento</h3>
              <p className="text-[11px] font-medium text-slate-500">Negativo da imagem em escala de cinza</p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-800">Pixel</span>
        </div>

        <div className="space-y-3 border-t border-indigo-100/80 p-4 text-xs">
          <div className="rounded-2xl border border-indigo-100 bg-white/85 p-3 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wide text-indigo-800">Transformação</div>
            <div className="mt-2 rounded-xl bg-indigo-50 px-3 py-2 text-center font-mono text-xs font-bold text-indigo-900">
              saída = 255 - pixel
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-100/70 p-2 text-[10px] font-medium text-indigo-950">
            Inverte tons claros e escuros sem alterar as dimensões da imagem.
          </div>

          {data.result && (
            <div className="rounded-2xl bg-indigo-600 p-2 text-xs font-bold text-white">
              {data.result.width} × {data.result.height}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-indigo-600 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>
    </div>
  )
}
