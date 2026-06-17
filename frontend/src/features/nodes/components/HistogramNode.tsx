import { Handle, Position, type NodeProps } from 'reactflow'
import { useEffect, useRef, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import type { HistogramNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function HistogramNode({ data, selected }: NodeProps<HistogramNodeData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; index: number } | null>(null)

  useEffect(() => {
    if (!data.histogram || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 256
    const height = 180
    const graphHeight = 140 // Altura para o gráfico, deixando espaço para labels

    canvas.width = width
    canvas.height = height

    // Detectar tema (dark ou light)
    const isDark = document.documentElement.classList.contains('dark')

    // Limpar com cor de fundo apropriada
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff'  // slate-900 / white
    ctx.fillRect(0, 0, width, height)

    // Grid horizontal ANTES das barras
    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0'  // slate-700 / slate-200
    ctx.lineWidth = 1
    for (let i = 25; i < graphHeight; i += 25) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Encontrar máximo para normalização sem depender de helper pronto.
    let maxCount = 1
    for (let i = 0; i < data.histogram.length; i++) {
      if (data.histogram[i] > maxCount) {
        maxCount = data.histogram[i]
      }
    }
    let nonZeroCount = 0
    for (let i = 0; i < data.histogram.length; i++) {
      if (data.histogram[i] > 0) {
        nonZeroCount += 1
      }
    }

    // Se houver poucos valores únicos, desenhar como barras grossas
    const useBars = nonZeroCount <= 20
    let barWidth = 1
    if (useBars) {
      barWidth = Math.floor(width / 100)
      if (barWidth < 3) {
        barWidth = 3
      }
    }

    if (useBars) {
      // Desenhar como barras verticais grossas
      for (let i = 0; i < 256; i++) {
        if (data.histogram[i] > 0) {
          const barHeight = (data.histogram[i] / maxCount) * (graphHeight - 10)
          const x = i
          const y = graphHeight - barHeight

          // Desenhar barra
          ctx.fillStyle = isDark ? '#64748b' : '#f9a8d4'
          ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)

          // Contorno da barra
          ctx.strokeStyle = isDark ? '#475569' : '#db2777'
          ctx.lineWidth = 1
          ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight)
        }
      }
    } else {
      // Desenhar como área preenchida (código original)
      // Desenhar como área preenchida (código original)
      ctx.beginPath()
      ctx.moveTo(0, graphHeight)

      for (let i = 0; i < 256; i++) {
        const barHeight = (data.histogram[i] / maxCount) * (graphHeight - 10)
        ctx.lineTo(i, graphHeight - barHeight)
      }

      ctx.lineTo(255, graphHeight)
      ctx.closePath()

      // Preencher área com cor cinza
      ctx.fillStyle = isDark ? '#64748b' : '#f9a8d4'
      ctx.fill()

      // Adicionar contorno na parte superior
      ctx.strokeStyle = isDark ? '#475569' : '#db2777'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, graphHeight)
      for (let i = 0; i < 256; i++) {
        const barHeight = (data.histogram[i] / maxCount) * (graphHeight - 10)
        ctx.lineTo(i, graphHeight - barHeight)
      }
      ctx.stroke()
    }

    // Adicionar labels no eixo X
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b'  // slate-400 / slate-500
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'

    const labels = [
      { text: 'muito\nescuro', x: 25 },
      { text: 'escuro', x: 75 },
      { text: 'médio', x: 130 },
      { text: 'claro', x: 185 },
      { text: 'muito\nclaro', x: 235 }
    ]

    labels.forEach(label => {
      const lines = label.text.split('\n')
      lines.forEach((line, i) => {
        ctx.fillText(line, label.x, graphHeight + 15 + (i * 10))
      })
    })

    // Adicionar linhas divisórias no eixo X
    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0'
    ctx.lineWidth = 1
    const divisions = [0, 51, 102, 153, 204, 255]
    divisions.forEach(x => {
      ctx.beginPath()
      ctx.moveTo(x, graphHeight)
      ctx.lineTo(x, graphHeight + 5)
      ctx.stroke()
    })
  }, [data.histogram])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !data.histogram) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Converter posição do mouse para índice do histograma
    const index = Math.floor(x)

    if (index >= 0 && index < 256) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        value: data.histogram[index],
        index
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <>
      <div
        className={cn(
          'relative min-w-[330px] overflow-visible rounded-[1.75rem] border bg-gradient-to-br from-pink-50 via-white to-rose-50 text-slate-900 shadow-node',
          selected ? 'border-pink-600 ring-4 ring-pink-100' : 'border-pink-100'
        )}
      >
        <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.75rem] bg-pink-600" />
        <Handle
          type="target"
          position={Position.Left}
          className="!h-4 !w-4 !border-pink-600 !bg-white"
        />
        <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-pink-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-pink-700">img</span>

        <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Histograma</h3>
              <p className="text-[11px] font-medium text-slate-500">Frequência dos níveis de cinza</p>
            </div>
          </div>
          <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-pink-800">Análise</span>
        </div>

        <div className="space-y-3 border-t border-pink-100/80 p-4">
          <div className="rounded-3xl border border-pink-100 bg-white/85 p-3 shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair rounded-2xl bg-white"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          </div>
          <div className="rounded-2xl bg-pink-100/70 p-2 text-center text-xs font-bold text-pink-900">
            Distribuição de intensidades (0-255)
          </div>
        </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 shadow-xl"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 30}px`,
          }}
        >
          <div className="font-semibold">{tooltip.value.toLocaleString('pt-BR')} pixels</div>
          <div className="text-[10px] opacity-80">intensidade: {tooltip.index}</div>
        </div>
      )}
    </>
  )
}
