import { Handle, Position, type NodeProps } from 'reactflow'
import { useEffect, useRef, useState } from 'react'
import { ImageIcon, Monitor } from 'lucide-react'
import type { DisplayNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function DisplayNode({ data, selected }: NodeProps<DisplayNodeData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })

  // Debug: verificar os dados que chegam
  console.log('DisplayNode data:', data)

  useEffect(() => {
    console.log('DisplayNode useEffect triggered. imageData:', data.imageData)

    if (!data.imageData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, data: pixels } = data.imageData

    console.log('Rendering image:', { width, height, pixelsLength: pixels.length })

    canvas.width = width
    canvas.height = height

    // Calcular dimensões de exibição mantendo aspect ratio
    const maxSize = 200
    const aspectRatio = width / height

    let displayWidth: number
    let displayHeight: number

    if (width > height) {
      // Imagem mais larga que alta
      displayWidth = maxSize
      displayHeight = maxSize / aspectRatio
    } else {
      // Imagem mais alta que larga (ou quadrada)
      displayHeight = maxSize
      displayWidth = maxSize * aspectRatio
    }

    setDisplaySize({ width: displayWidth, height: displayHeight })

    const imageData = ctx.createImageData(width, height)

    for (let i = 0; i < pixels.length; i++) {
      const pixelValue = pixels[i]
      imageData.data[i * 4] = pixelValue     // R
      imageData.data[i * 4 + 1] = pixelValue // G
      imageData.data[i * 4 + 2] = pixelValue // B
      imageData.data[i * 4 + 3] = 255        // A
    }

    ctx.putImageData(imageData, 0, 0)
    console.log('Image rendered successfully with display size:', { displayWidth, displayHeight })
  }, [data.imageData])

  return (
    <div
      className={cn(
        'relative min-w-[300px] overflow-visible rounded-[1.75rem] border bg-gradient-to-br from-violet-50 via-white to-purple-50 text-slate-900 shadow-node',
        selected ? 'border-violet-600 ring-4 ring-violet-100' : 'border-violet-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.75rem] bg-violet-600" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-violet-600 !bg-white"
      />
      <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-violet-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-violet-700">img</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Visualizar resultado</h3>
              <p className="text-[11px] font-medium text-slate-500">Preview da etapa conectada</p>
            </div>
          </div>
          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800">Visualização</span>
        </div>

      <div className="space-y-3 border-t border-violet-100/80 p-4">
        {data.imageData ? (
          <>
            <div className="flex min-h-[170px] items-center justify-center rounded-3xl border border-violet-100 bg-white/85 p-3 shadow-inner">
            <canvas
              ref={canvasRef}
              className="rounded-2xl border border-slate-200 bg-slate-50"
              style={{
                width: `${displaySize.width}px`,
                height: `${displaySize.height}px`,
                imageRendering: 'pixelated',
              }}
            />
            </div>
            <div className="rounded-2xl bg-violet-100/70 p-2 text-center text-xs font-bold text-violet-900">
              {data.imageData.width} × {data.imageData.height}
            </div>
          </>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-white/70 text-slate-500">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Visualizar resultado</p>
          </div>
        )}
      </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-violet-600 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>
    </div>
  )
}
