import { Handle, Position, type NodeProps } from 'reactflow'
import { GitCompare } from 'lucide-react'
import type { DifferenceNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function DifferenceNode({ data, selected }: NodeProps<DifferenceNodeData>) {
  return (
    <div
      className={cn(
        'relative min-w-[285px] overflow-visible rounded-[1.7rem] border bg-gradient-to-br from-red-50 via-white to-rose-50 text-slate-900 shadow-node',
        selected ? 'border-red-500 ring-4 ring-red-100' : 'border-red-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.7rem] bg-red-500" />
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        className="!h-4 !w-4 !border-red-500 !bg-white"
        style={{ top: '30%' }}
      />
      <span className="pointer-events-none absolute -left-6 top-[30%] -translate-y-1/2 rounded-full border border-red-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-red-700">A</span>
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        className="!h-4 !w-4 !border-red-500 !bg-white"
        style={{ top: '70%' }}
      />
      <span className="pointer-events-none absolute -left-6 top-[70%] -translate-y-1/2 rounded-full border border-red-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-red-700">B</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-sm">
              <GitCompare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Diferença</h3>
              <p className="text-[11px] font-medium text-slate-500">Diferença pixel a pixel</p>
            </div>
          </div>
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-800">2 entradas</span>
        </div>

        <div className="space-y-3 border-t border-red-100/80 p-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-red-100 bg-white/80 p-3 text-red-800">
              <div className="text-[10px] font-black uppercase tracking-wide">Entrada A</div>
              <div className="mt-1 text-[10px] text-slate-500">porta superior</div>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white/80 p-3 text-red-800">
              <div className="text-[10px] font-black uppercase tracking-wide">Entrada B</div>
              <div className="mt-1 text-[10px] text-slate-500">porta inferior</div>
            </div>
          </div>

          <div className="rounded-2xl bg-red-100/70 p-2 text-[10px] font-medium text-red-900">
            Calcula |A - B| para comparar duas imagens.
          </div>

          {data.result && (
            <div className="rounded-2xl bg-red-500 p-2 text-xs font-bold text-white">
              {data.result.width} × {data.result.height}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-red-500 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>
    </div>
  )
}
