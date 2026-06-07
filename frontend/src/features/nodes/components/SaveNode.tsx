import { Handle, Position, type NodeProps } from 'reactflow'
import { useState } from 'react'
import { Save, Download } from 'lucide-react'
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
        'rounded-lg border-2 bg-card p-3 shadow-lg min-w-[220px]',
        selected ? 'border-primary' : 'border-green-600'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-600 !border-green-700"
      />

      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Save className="w-4 h-4 text-green-600" />
        <h3 className="font-bold text-sm text-green-600">Salvar PGM</h3>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <Label htmlFor={`filename-${id}`} className="text-xs text-muted-foreground">
            Nome do arquivo
          </Label>
          <Input
            id={`filename-${id}`}
            type="text"
            value={filename}
            onChange={(e) => handleFilenameChange(e.target.value)}
            className="h-8 text-xs"
            placeholder="output.pgm"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!data.imageData}
          className="w-full h-8 text-xs"
          variant={data.imageData ? 'default' : 'secondary'}
        >
          <Download className="w-3 h-3 mr-1" />
          Baixar Arquivo
        </Button>

        {data.imageData && (
          <div className="text-xs text-green-600 font-medium bg-secondary p-2 rounded">
            ✓ Pronto para salvar ({data.imageData.width} × {data.imageData.height})
          </div>
        )}

        {!data.imageData && (
          <div className="text-xs text-muted-foreground text-center">
            Execute o processamento primeiro
          </div>
        )}
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
