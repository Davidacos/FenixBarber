import { cn } from '@/lib/utils'

type Status = 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no-asistio' | 'activo' | 'inactivo'

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  pendiente: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    label: 'Pendiente',
  },
  confirmada: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    label: 'Confirmada',
  },
  completada: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    label: 'Completada',
  },
  cancelada: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    label: 'Cancelada',
  },
  'no-asistio': {
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    text: 'text-gray-700 dark:text-gray-400',
    label: 'No asistió',
  },
  activo: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    label: 'Activo',
  },
  inactivo: {
    bg: 'bg-slate-50 dark:bg-slate-900/30',
    text: 'text-slate-700 dark:text-slate-400',
    label: 'Inactivo',
  },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex px-3 py-1 rounded-full text-sm font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  )
}
