import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  iconClassName?: string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  trendLabel?: string;
  subtext?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  iconClassName = "bg-blue-50",
  trend = "neutral",
  trendPercent = 0,
  trendLabel = "vs mes anterior",
  subtext,
}: StatCardProps) {
  const showTrend = trend !== "neutral" && trendPercent !== 0;
  const isUp = trend === "up";

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-blue-900/10 hover:border-blue-200 dark:hover:border-blue-900 overflow-hidden">
      {/* Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-3">
            {value}
          </p>

          {subtext && (
            <p className="text-xs text-slate-400 font-medium">{subtext}</p>
          )}

          {showTrend && (
            <div
              className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full border text-xs font-bold ${
                isUp
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isUp ? "+" : "-"}
              {trendPercent}% {trendLabel}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30 ${iconClassName} dark:bg-blue-950/20`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
