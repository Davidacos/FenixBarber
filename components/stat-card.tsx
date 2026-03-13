import { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendPercent?: number
  subtext?: string
}

export default function StatCard({
  label,
  value,
  icon,
  trend = 'neutral',
  trendPercent = 0,
  subtext,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{value}</p>

          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-500">{subtext}</p>
          )}

          {trend !== 'neutral' && trendPercent !== 0 && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{trendPercent}% vs mes anterior</span>
            </div>
          )}
        </div>

        {icon && (
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
