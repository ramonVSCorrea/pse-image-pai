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
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(6,182,212,0.24),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(139,92,246,0.16),transparent_28%),linear-gradient(135deg,rgba(238,247,255,0.98),rgba(226,232,240,0.94))] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(0,229,255,0.22),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(139,92,246,0.24),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(15,23,42,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.55)_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.08] dark:[background-image:linear-gradient(rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.9)_1px,transparent_1px)]" />

      <Toolbar
        onAddNode={addNode}
        onProcess={handleProcess}
        onClear={clearWorkspace}
        isProcessing={isProcessing}
      />

      <main className="relative z-10 flex flex-1 flex-col gap-4 p-4 pl-0 md:p-6 md:pl-0">
        <section className="flex items-center justify-between rounded-[2rem] border border-slate-900/10 bg-white/70 px-5 py-4 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:shadow-cyan-950/30">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700/80 dark:text-cyan-300/80">PSE-Image Lab</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Workspace de Processamento Visual</h1>
          </div>
          <div className="hidden rounded-full border border-cyan-700/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-900 md:block dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            {nodes.length} blocos ativos
          </div>
        </section>

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
