import { Handle, Position, type NodeProps } from 'reactflow'
import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ConvolutionNodeData } from '@/types'
import { PRESET_KERNELS, generateAverageKernel, generateLaplacianKernel } from '@/types'
import { cn } from '@/lib/utils'

const KERNEL_SIZES = [3, 5, 7, 9]

export default function ConvolutionNode({ data, id, selected }: NodeProps<ConvolutionNodeData>) {
  const initialPreset = data.preset || 'average'
  const [preset, setPreset] = useState(initialPreset)
  const [kernelSize, setKernelSize] = useState(data.kernelSize || 3)
  const [kernel, setKernel] = useState(data.kernel || PRESET_KERNELS.average.kernel)
  const [divisor, setDivisor] = useState<number | string>(data.divisor || 9)
  const [filterType, setFilterType] = useState<'convolution' | 'median' | 'average' | 'laplacian'>(
    data.filterType || (initialPreset === 'median' ? 'median' : 'convolution')
  )

  const handlePresetChange = (presetKey: string) => {
    setPreset(presetKey)
    const isMedian = presetKey === 'median'
    const newFilterType = isMedian ? 'median' : 'convolution'
    setFilterType(newFilterType)

    let kernelData
    if (presetKey === 'average') {
      kernelData = generateAverageKernel(kernelSize)
    } else if (presetKey === 'laplacian') {
      kernelData = generateLaplacianKernel(kernelSize)
    } else {
      // median - gera máscara de 1's para visualização
      const medianMask = Array(kernelSize).fill(0).map(() => Array(kernelSize).fill(1))
      kernelData = { kernel: medianMask, divisor: 1 }
    }

    setKernel(kernelData.kernel)
    setDivisor(kernelData.divisor)

    data.onChange?.(id, {
      preset: presetKey,
      kernelSize: kernelSize,
      kernel: kernelData.kernel,
      divisor: kernelData.divisor,
      filterType: newFilterType,
    } as Partial<ConvolutionNodeData>)
  }

  const handleKernelSizeChange = (size: string) => {
    const newSize = parseInt(size)
    setKernelSize(newSize)

    let kernelData
    if (preset === 'average') {
      kernelData = generateAverageKernel(newSize)
    } else if (preset === 'laplacian') {
      kernelData = generateLaplacianKernel(newSize)
    } else {
      // median - gera máscara de 1's para visualização
      const medianMask = Array(newSize).fill(0).map(() => Array(newSize).fill(1))
      kernelData = { kernel: medianMask, divisor: 1 }
    }

    setKernel(kernelData.kernel)
    setDivisor(kernelData.divisor)

    data.onChange?.(id, {
      kernelSize: newSize,
      kernel: kernelData.kernel,
      divisor: kernelData.divisor,
      filterType,
    } as Partial<ConvolutionNodeData>)
  }

  const handleKernelChange = (row: number, col: number, value: string) => {
    // Permitir campo vazio - converter para 0 apenas se não for vazio
    const numValue = value === '' ? 0 : (isNaN(parseFloat(value)) ? 0 : parseFloat(value))
    const newKernel = kernel.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? numValue : c))
    )
    setKernel(newKernel)
    data.onChange?.(id, { kernel: newKernel } as Partial<ConvolutionNodeData>)
  }

  const handleDivisorChange = (value: string) => {
    // Permitir campo vazio para que o usuário possa apagar e digitar novo valor
    // Se vazio, usar 1 como padrão apenas no processamento
    if (value === '') {
      setDivisor('')
      data.onChange?.(id, { divisor: 1 } as Partial<ConvolutionNodeData>)
      return
    }

    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setDivisor(numValue)
      data.onChange?.(id, { divisor: numValue } as Partial<ConvolutionNodeData>)
    }
  }

  const isMedianFilter = filterType === 'median'

  return (
    <div
      className={cn(
        'relative min-w-[380px] overflow-visible rounded-[1.8rem] border bg-gradient-to-br from-blue-50 via-white to-sky-50 text-slate-900 shadow-node',
        selected ? 'border-blue-600 ring-4 ring-blue-100' : 'border-blue-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.8rem] bg-blue-600" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-blue-600 !bg-white"
      />
      <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-blue-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-blue-700">img</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Filter className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Filtro por máscara</h3>
              <p className="text-[11px] font-medium text-slate-500">Kernel configurável ou filtro conhecido</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-800">Convolução</span>
        </div>

        <div className="grid gap-3 border-t border-blue-100/80 p-4 text-xs md:grid-cols-[145px_1fr]">
          <div className="space-y-3">
            <div>
              <Label htmlFor={`preset-${id}`} className="text-xs font-bold text-slate-700">
                Filtro
              </Label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger id={`preset-${id}`} className="mt-1 h-9 rounded-2xl bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRESET_KERNELS).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`size-${id}`} className="text-xs font-bold text-slate-700">
                Máscara
              </Label>
              <Select value={kernelSize.toString()} onValueChange={handleKernelSizeChange}>
                <SelectTrigger id={`size-${id}`} className="mt-1 h-9 rounded-2xl bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KERNEL_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}×{size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isMedianFilter && (
              <div>
                <Label htmlFor={`divisor-${id}`} className="text-xs font-bold text-slate-700">
                  Divisor
                </Label>
                <Input
                  id={`divisor-${id}`}
                  type="number"
                  value={divisor || ''}
                  onChange={(e) => handleDivisorChange(e.target.value)}
                  className="mt-1 h-9 rounded-2xl bg-white text-xs"
                  placeholder="1"
                  step="0.1"
                />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white/82 p-3 shadow-sm">
            <Label className="mb-2 block text-xs font-bold text-slate-700">
              {isMedianFilter ? `Janela ${kernelSize}×${kernelSize}` : `Kernel ${kernelSize}×${kernelSize}`}
            </Label>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${kernelSize}, 1fr)`,
              }}
            >
              {kernel.map((row, i) =>
                row.map((val, j) => (
                  <Input
                    key={`${i}-${j}`}
                    type="number"
                    value={val}
                    onChange={(e) => handleKernelChange(i, j, e.target.value)}
                    className="h-8 rounded-xl bg-blue-50/70 p-0 text-center text-xs font-semibold"
                    step="0.1"
                    placeholder="0"
                    disabled={isMedianFilter}
                  />
                ))
              )}
            </div>
            <div className="mt-2 rounded-2xl bg-blue-50 px-2 py-1.5 text-[10px] text-blue-800">
              {isMedianFilter ? `Mediana ${kernelSize}×${kernelSize}` : `${PRESET_KERNELS[preset]?.name} - Kernel editável`}
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-blue-600 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>
    </div>
  )
}
