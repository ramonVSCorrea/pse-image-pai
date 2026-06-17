import { useState, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Node,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import type { PSEEdge, NodeDataTypes } from '@/types'
import { nodeTypes } from '@/features/nodes'

interface FlowCanvasProps {
  nodes: Node<NodeDataTypes>[]
  edges: PSEEdge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

interface KeyboardHandlerProps {
  onLockChange: (locked: boolean) => void
}

function KeyboardHandler({ onLockChange }: KeyboardHandlerProps) {
  const { zoomIn, zoomOut } = useReactFlow()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Atalho para zoom in: tecla "+" ou "="
      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoomIn()
      }

      // Atalho para zoom out: tecla "-" ou "_"
      if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        zoomOut()
      }

      // Atalho para alternar cadeado: tecla "Alt"
      if (event.key === 'Alt') {
        event.preventDefault()
        onLockChange(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomIn, zoomOut, onLockChange])

  return null
}

function FlowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: FlowCanvasProps) {
  const [isLocked, setIsLocked] = useState(false)

  const handleLockToggle = () => {
    setIsLocked((prev) => !prev)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EEF4FA]">
      <div className="pointer-events-none absolute top-28 z-10 hidden max-w-[390px] rounded-3xl border border-white/80 bg-white/80 px-4 py-3 text-slate-900 shadow-lab lg:left-[372px] lg:block">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-950">
          <span className="h-2 w-5 rounded-full bg-blue-600" />
          Workspace do pipeline
        </div>
        <p className="mt-1 text-xs text-slate-500">Organize as etapas, conecte as imagens e execute a sequência.</p>
      </div>
      <KeyboardHandler onLockChange={handleLockToggle} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2.2, stroke: '#667085' },
        }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={18} size={0.7} color="#9AA6B8" />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dashed border-slate-300 bg-white/90 px-6 py-5 text-center shadow-lab">
          <p className="text-sm font-semibold text-slate-900">Comece adicionando um bloco de Leitura para importar uma imagem PGM.</p>
          <p className="mt-2 text-xs text-slate-500">Conecte os blocos para definir a ordem do processamento.</p>
        </div>
      )}
    </div>
  )
}

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
