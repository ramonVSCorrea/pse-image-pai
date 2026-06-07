import { useGraphState, useGraphProcessor } from '@/features/graph'
import { Toolbar } from '@/features/toolbar'
import { FlowCanvas } from '@/features/canvas'

function App() {
  const {
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearWorkspace,
  } = useGraphState()

  const { isProcessing, handleProcess } = useGraphProcessor(nodes, edges, setNodes)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <Toolbar
        onAddNode={addNode}
        onProcess={handleProcess}
        onClear={clearWorkspace}
        isProcessing={isProcessing}
        nodeCount={nodes.length}
      />

      <main className="h-full w-full p-0">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </main>
    </div>
  )
}

export default App
