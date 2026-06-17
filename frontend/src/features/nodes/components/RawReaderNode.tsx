import { Handle, Position, type NodeProps } from 'reactflow'
import { useEffect, useRef, useState } from 'react'
import { FileText, UploadCloud } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useDialog } from '@/hooks/useDialog'
import type { RawReaderNodeData } from '@/types'
import { cn } from '@/lib/utils'
import { uploadRawFile } from '@/lib/api'

export default function RawReaderNode({ data, id, selected }: NodeProps<RawReaderNodeData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(false)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const { dialog, showDialog, closeDialog } = useDialog()

  useEffect(() => {
    if (!data.imageData || !data.width || !data.height || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = data.width
    canvas.height = data.height

    const maxSize = 180
    const aspectRatio = data.width / data.height
    const displayWidth = data.width > data.height ? maxSize : maxSize * aspectRatio
    const displayHeight = data.width > data.height ? maxSize / aspectRatio : maxSize

    setDisplaySize({ width: displayWidth, height: displayHeight })

    const previewImage = ctx.createImageData(data.width, data.height)

    for (let i = 0; i < data.imageData.length; i++) {
      const pixelValue = data.imageData[i]
      previewImage.data[i * 4] = pixelValue
      previewImage.data[i * 4 + 1] = pixelValue
      previewImage.data[i * 4 + 2] = pixelValue
      previewImage.data[i * 4 + 3] = 255
    }

    ctx.putImageData(previewImage, 0, 0)
  }, [data.height, data.imageData, data.width])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const result = await uploadRawFile(file)

      data.onChange?.(id, {
        imageData: result.data,
        width: result.width,
        height: result.height,
        filename: file.name,
      } as Partial<RawReaderNodeData>)
    } catch (error) {
      console.error('Erro ao ler arquivo:', error)
      showDialog(
        'Erro ao processar arquivo',
        error instanceof Error ? error.message : 'Ocorreu um erro ao processar o arquivo selecionado.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'relative min-w-[310px] overflow-visible rounded-[1.75rem] border bg-gradient-to-br from-teal-50 via-white to-teal-50/70 text-slate-900 shadow-node',
        selected ? 'border-teal-600 ring-4 ring-teal-100' : 'border-teal-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.75rem] bg-teal-700" />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 !bg-teal-700 !border-white"
      />
      <span className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-teal-700 px-1.5 py-0.5 text-[9px] font-bold text-white">out</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Importar imagem</h3>
              <p className="text-[11px] font-medium text-slate-500">Leitura de arquivo em escala de cinza</p>
            </div>
          </div>
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-800">Entrada PGM</span>
        </div>

        <div className="space-y-3 border-t border-teal-100/80 p-4 text-xs">
          <div className="rounded-2xl border border-teal-100 bg-white/80 p-3 shadow-sm">
            <Label htmlFor={`file-${id}`} className="text-xs font-bold text-slate-700">
              Arquivo PGM
            </Label>
            <Input
              id={`file-${id}`}
              type="file"
              accept=".pgm"
              onChange={handleFileChange}
              className="mt-2 h-10 cursor-pointer rounded-2xl bg-white text-xs file:mr-3 file:rounded-xl file:bg-teal-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-teal-700"
              disabled={loading}
              aria-label="Selecionar arquivo PGM"
            />
            <p className="mt-2 text-[10px] text-slate-500">
              Formatos aceitos: PGM P2 ou P5, 8 bits.
            </p>
          </div>

          {data.filename && (
              <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50/80 p-2.5 text-xs text-teal-800">
              <FileText className="w-3 h-3" />
              <span className="truncate font-semibold">{data.filename}</span>
            </div>
          )}

          {data.imageData && (
            <div className="space-y-2 rounded-2xl border border-teal-100 bg-white/85 p-3 shadow-inner">
              <div className="flex min-h-[150px] items-center justify-center rounded-2xl bg-slate-50 p-2">
                <canvas
                  ref={canvasRef}
                  className="rounded-xl border border-slate-200 bg-white"
                  style={{
                    width: `${displaySize.width}px`,
                    height: `${displaySize.height}px`,
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
              <div className="rounded-xl bg-teal-700 p-2 text-center text-xs font-bold text-white">
                {data.width}×{data.height} ({data.imageData.length} pixels)
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogDescription>{dialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeDialog}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
