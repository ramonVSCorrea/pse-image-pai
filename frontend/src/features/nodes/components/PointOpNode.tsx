import { Handle, Position, type NodeProps } from 'reactflow'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PointOpNodeData, PointOperation } from '@/types'
import { cn } from '@/lib/utils'

const OPERATION_CONFIG: Record<PointOperation, {
  label: string
  min: number
  max: number
  step: string
  default: number
  description: string
}> = {
  brightness: {
    label: 'Ajuste',
    min: -255,
    max: 255,
    step: '1',
    default: 0,
    description: 'Adiciona valor a cada pixel'
  },
  threshold: {
    label: 'Limiar',
    min: 0,
    max: 255,
    step: '1',
    default: 128,
    description: 'Binariza: >= limiar → 255, < limiar → 0'
  },
}

export default function PointOpNode({ data, id, selected }: NodeProps<PointOpNodeData>) {
  const [operation, setOperation] = useState<PointOperation>(data.operation || 'brightness')
  const [value, setValue] = useState(data.value || 0)

  const config = OPERATION_CONFIG[operation]

  const handleOperationChange = (newOp: PointOperation) => {
    setOperation(newOp)
    const newValue = OPERATION_CONFIG[newOp].default
    setValue(newValue)
    data.onChange?.(id, { operation: newOp, value: newValue } as Partial<PointOpNodeData>)
  }

  const handleValueChange = (newValue: string) => {
    const parsed = parseFloat(newValue)
    setValue(parsed)
    data.onChange?.(id, { value: parsed } as Partial<PointOpNodeData>)
  }

  return (
    <div
      className={cn(
        'relative min-w-[285px] overflow-visible rounded-[1.6rem] border bg-gradient-to-br from-orange-50 via-white to-amber-50 text-slate-900 shadow-node',
        selected ? 'border-orange-500 ring-4 ring-orange-100' : 'border-orange-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.6rem] bg-orange-500" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-orange-500 !bg-white"
      />
      <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-orange-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-orange-700">img</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Ajuste ponto a ponto</h3>
              <p className="text-[11px] font-medium text-slate-500">Operação direta por pixel</p>
            </div>
          </div>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-800">Pixel</span>
        </div>

        <div className="grid grid-cols-[1fr_88px] gap-3 border-t border-orange-100/80 p-4 text-xs">
          <div>
            <Label htmlFor={`op-${id}`} className="text-xs font-bold text-slate-700">
              Operação
            </Label>
            <Select value={operation} onValueChange={handleOperationChange}>
              <SelectTrigger id={`op-${id}`} className="mt-1 h-10 rounded-2xl bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brightness" className="text-xs">Brilho</SelectItem>
                <SelectItem value="threshold" className="text-xs">Limiarização</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`value-${id}`} className="text-xs font-bold text-slate-700">
              {config.label}
            </Label>
            <Input
              id={`value-${id}`}
              type="number"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="mt-1 h-10 rounded-2xl bg-orange-50/80 text-center text-xs font-bold"
              min={config.min}
              max={config.max}
              step={config.step}
            />
          </div>

          <div className="col-span-2 rounded-2xl bg-orange-100/70 px-3 py-2 text-[10px] font-medium text-orange-900">
            {config.description}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-orange-500 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>
    </div>
  )
}
