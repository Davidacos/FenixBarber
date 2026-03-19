type Status =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada"
  | "no-asistio"
  | "activo"
  | "inactivo";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

const statusMap: Record<
  Status,
  { wrapper: string; dot: string; label: string }
> = {
  pendiente: {
    wrapper: "bg-amber-50 border border-amber-200 text-amber-800",
    dot: "bg-amber-400",
    label: "Pendiente",
  },
  confirmada: {
    wrapper: "bg-blue-50 border border-blue-200 text-blue-800",
    dot: "bg-blue-500",
    label: "Confirmada",
  },
  completada: {
    wrapper: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    dot: "bg-emerald-500",
    label: "Completada",
  },
  cancelada: {
    wrapper: "bg-red-50 border border-red-200 text-red-800",
    dot: "bg-red-500",
    label: "Cancelada",
  },
  "no-asistio": {
    wrapper: "bg-slate-50 border border-slate-200 text-slate-600",
    dot: "bg-slate-400",
    label: "No asistió",
  },
  activo: {
    wrapper: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    dot: "bg-emerald-500",
    label: "Activo",
  },
  inactivo: {
    wrapper: "bg-slate-50 border border-slate-200 text-slate-500",
    dot: "bg-slate-400",
    label: "Inactivo",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { wrapper, dot, label } = statusMap[status];
  const sizeClass =
    size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${wrapper} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}
