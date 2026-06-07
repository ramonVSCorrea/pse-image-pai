import { Handle, Position, type NodeProps } from 'reactflow'
import { useState } from 'react'
import { FileDown } from 'lucide-react'
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
import type { SaveNodeData } from '@/types'
import { cn } from '@/lib/utils'

export default function SaveNode({ data, id, selected }: NodeProps<SaveNodeData>) {
  const [filename, setFilename] = useState(data.filename || 'output.pgm')
  const { dialog, showDialog, closeDialog } = useDialog()

  const handleFilenameChange = (newFilename: string) => {
    setFilename(newFilename)
    data.onChange?.(id, { filename: newFilename } as Partial<SaveNodeData>)
  }

  const handleSave = () => {
    if (!data.imageData) {
      showDialog(
        'Nenhuma imagem para salvar',
        'Execute o processamento primeiro para gerar uma imagem.'
      )
      return
    }

    const { width, height, data: pixels } = data.imageData
    const pgmFilename = filename.toLowerCase().endsWith('.pgm') ? filename : `${filename}.pgm`

    const header = `P5\n${width} ${height}\n255\n`
    const headerBytes = new TextEncoder().encode(header)
    const pixelBytes = new Uint8Array(pixels.length)
    for (let i = 0; i < pixels.length; i++) {
      let pixel = Math.round(pixels[i])
      if (pixel < 0) {
        pixel = 0
      } else if (pixel > 255) {
        pixel = 255
      }
      pixelBytes[i] = pixel
    }
    const pgmBytes = new Uint8Array(headerBytes.length + pixelBytes.length)
    pgmBytes.set(headerBytes, 0)
    pgmBytes.set(pixelBytes, headerBytes.length)
    const blob = new Blob([pgmBytes], { type: 'image/x-portable-graymap' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = pgmFilename
    a.click()
    URL.revokeObjectURL(url)

    showDialog(
      'Arquivo salvo!',
      `Arquivo ${pgmFilename} salvo em formato PGM P5 (${width}×${height} pixels).`
    )
  }

  return (
    <div
      className={cn(
        'relative min-w-[295px] overflow-visible rounded-[1.75rem] border bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 shadow-node',
        selected ? 'border-emerald-600 ring-4 ring-emerald-100' : 'border-emerald-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-[1.75rem] bg-emerald-600" />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-emerald-600 !bg-white"
      />
      <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 rounded-full border border-emerald-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">img</span>

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <FileDown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-950">Exportar imagem</h3>
              <p className="text-[11px] font-medium text-slate-500">Salvar resultado em arquivo</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">Saída PGM</span>
        </div>

        <div className="space-y-3 border-t border-emerald-100/80 p-4 text-xs">
          <div className="rounded-3xl border border-emerald-100 bg-white/82 p-3 shadow-sm">
            <Label htmlFor={`filename-${id}`} className="text-xs font-bold text-slate-700">
              Nome do arquivo
            </Label>
            <Input
              id={`filename-${id}`}
              type="text"
              value={filename}
              onChange={(e) => handleFilenameChange(e.target.value)}
              className="mt-1 h-10 rounded-2xl bg-white text-xs"
              placeholder="output.pgm"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!data.imageData}
            className="h-10 w-full rounded-2xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
            variant={data.imageData ? 'default' : 'secondary'}
          >
            <FileDown className="w-3 h-3 mr-1" />
            Exportar PGM
          </Button>

          {data.imageData && (
              <div className="rounded-2xl bg-emerald-100 p-2 text-xs font-bold text-emerald-800">
              Pronto para salvar ({data.imageData.width} × {data.imageData.height})
            </div>
          )}

          {!data.imageData && (
            <div className="text-center text-xs text-slate-500">
              Execute o processamento primeiro
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
