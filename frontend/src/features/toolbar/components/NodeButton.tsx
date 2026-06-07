import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import type { NodeType } from '@/types'
import { NODE_COLORS } from '@/types'

interface NodeButtonProps {
  type: NodeType
  icon: LucideIcon
  label: string
  onClick: (type: NodeType) => void
}

export function NodeButton({ type, icon: Icon, label, onClick }: NodeButtonProps) {
  return (
    <Button
      onClick={() => onClick(type)}
      variant="ghost"
      className="group h-14 w-full justify-center gap-3 rounded-2xl border border-slate-900/10 bg-white/70 px-3 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-700/30 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-200/30 dark:hover:bg-white/[0.08] dark:hover:text-white md:justify-start"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 shadow-inner ring-1 ring-slate-900/10 transition-transform group-hover:scale-105 dark:bg-slate-900 dark:ring-white/10"
        style={{ color: NODE_COLORS[type] }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="hidden text-sm font-bold md:inline">{label}</span>
    </Button>
  )
}
