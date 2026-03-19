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
    <div className="flex flex-col gap-4 mb-7 pb-6 border-b border-slate-200">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Inicio</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-600 font-semibold">{breadcrumb}</span>
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-400 mt-1 font-normal">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
