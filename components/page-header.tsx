import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-7 pb-6 border-b border-slate-200 dark:border-slate-800">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <span>Inicio</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-600 dark:text-blue-500 font-semibold">{breadcrumb}</span>
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-400 mt-1 font-normal">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
