import { Handle, Position, type NodeProps } from 'reactflow'
import { SunMoon } from 'lucide-react'
import type { ComplementNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function ComplementNode({ data, selected }: NodeProps<ComplementNodeData>) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-card p-3 shadow-lg min-w-[200px]',
        selected ? 'border-primary' : 'border-indigo-500'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-500 !border-indigo-600"
      />

      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <SunMoon className="w-4 h-4 text-indigo-500" />
        <h3 className="font-bold text-sm text-indigo-500">Complemento</h3>
      </div>

      <div className="space-y-2 text-xs">
        <div className="text-muted-foreground bg-secondary p-2 rounded">
          Inverte a imagem: saída = 255 - pixel
        </div>

        <div className="text-[10px] text-muted-foreground">
          Gera o negativo da imagem de entrada
        </div>

        {data.result && (
          <div className="text-xs text-indigo-500 font-medium pt-2 border-t border-border">
            {data.result.width} x {data.result.height}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-500 !border-indigo-600"
      />
    </div>
  )
}
