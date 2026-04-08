"use client";

import { useEffect, useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getDashboardStats } from "@/lib/api";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  Scissors,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import StatCard from "@/components/stat-card";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import StatusBadge from "@/components/status-badge";
import Link from "next/link";
import { useAppConfig } from "@/contexts/AppConfigContext";

// ── Types ───────────────────────────────────────────────
type AppointmentRow = {
  client: string;
  service: string;
  time: string;
  status: "pendiente" | "confirmada" | "completada" | "cancelada";
  employee: string;
  amount: string;
};

// ── Static data ─────────────────────────────────────────
const weekData = [
  { day: "Lun", value: 320 },
  { day: "Mar", value: 480 },
  { day: "Mié", value: 410 },
  { day: "Jue", value: 560 },
  { day: "Vie", value: 620 },
  { day: "Sáb", value: 890 },
  { day: "Dom", value: 210 },
];
const maxWeek = Math.max(...weekData.map((d) => d.value));

const topServices = [
  { name: "Corte + Barba", count: 34, pct: 92 },
  { name: "Corte clásico", count: 28, pct: 76 },
  { name: "Diseño de barba", count: 19, pct: 51 },
  { name: "Afeitado completo", count: 12, pct: 32 },
];

const quickActions = [
  {
    label: "Nueva cita",
    icon: Plus,
    href: "/appointments/new",
    iconClass: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Ver agenda",
    icon: Calendar,
    href: "/appointments",
    iconClass: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Nuevo servicio",
    icon: Scissors,
    href: "/services/new",
    iconClass: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Generar reporte",
    icon: FileText,
    href: "/finance/reports",
    iconClass: "text-violet-600",
    bg: "bg-violet-50",
  },
] as const;

const recentActivity = [
  {
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Cita completada",
    sub: "Carlos M. — Corte + Barba",
    time: "hace 5 min",
  },
  {
    icon: Calendar,
    iconClass: "text-blue-600",
    bg: "bg-blue-50",
    title: "Nueva cita agendada",
    sub: "Pedro L. — Diseño de barba",
    time: "hace 18 min",
  },
  {
    icon: DollarSign,
    iconClass: "text-amber-600",
    bg: "bg-amber-50",
    title: "Pago recibido",
    sub: "$45,000 — Luis R.",
    time: "hace 32 min",
  },
  {
    icon: Users,
    iconClass: "text-violet-600",
    bg: "bg-violet-50",
    title: "Empleado llegó",
    sub: "Juan Barbero — On time",
    time: "hace 1h",
  },
];

// ── Column definition outside component so the type is stable ──
const appointmentColumns: Column<AppointmentRow>[] = [
  {
    key: "client",
    label: "Cliente",
    render: (_item, value) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-extrabold shrink-0">
          {String(value).substring(0, 1).toUpperCase()}
        </div>
        <span className="font-semibold text-slate-900 dark:text-white text-sm">
          {String(value)}
        </span>
      </div>
    ),
  },
  { key: "service", label: "Servicio" },
  { key: "time", label: "Hora", align: "center" },
  { key: "employee", label: "Empleado" },
  {
    key: "status",
    label: "Estado",
    sortable: false,
    align: "center",
    render: (_item, value) => (
      <StatusBadge status={value as AppointmentRow["status"]} />
    ),
  },
  {
    key: "amount",
    label: "Monto",
    align: "right",
    render: (_item, value) => (
      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
        {String(value)}
      </span>
    ),
  },
];

// ── Component ────────────────────────────────────────────
export default function DashboardPage() {
  const { formatMoney } = useAppConfig();
  const { companyId, activeBranchId, activeBranch } = useBranch();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companyId && activeBranchId) {
      setIsLoading(true);
      getDashboardStats(companyId, activeBranchId).then((data) => {
        setStats(data);
        setIsLoading(false);
      });
    }
  }, [companyId, activeBranchId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e1a]">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        {/* ── Header ── */}
        <PageHeader
          title={`Dashboard - ${activeBranch?.name || "Cargando..."}`}
          description="Resumen de tu sede hoy"
          breadcrumb="Dashboard"
          actions={
            <>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                <FileText className="w-3.5 h-3.5" /> Exportar
              </button>
              <Link href="/appointments/new">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 transition-all hover:-translate-y-px">
                  <Plus className="w-3.5 h-3.5" /> Nueva cita
                </button>
              </Link>
            </>
          }
        />

        {isLoading || !stats ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* ── KPI Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
              <StatCard
                label="Citas hoy"
                value={stats.todayAppointments}
                icon={<Calendar className="w-5 h-5 text-blue-600" />}
                iconClassName="bg-blue-50"
                trend="up"
                trendPercent={12}
              />
              <StatCard
                label="Ingresos hoy"
                value={formatMoney(stats.todayRevenue)}
                icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                iconClassName="bg-emerald-50 border-emerald-100"
                trend="up"
                trendPercent={8}
              />
              <StatCard
                label="Empleados activos"
                value={stats.activeEmployees.toString()}
                icon={<Users className="w-5 h-5 text-violet-600" />}
                iconClassName="bg-violet-50 border-violet-100"
                subtext="Todos disponibles"
              />
              <StatCard
                label="Satisfacción"
                value="98%"
                icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
                iconClassName="bg-amber-50 border-amber-100"
                trend="up"
                trendPercent={3}
                trendLabel="esta semana"
              />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
              {/* Bar chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      Ingresos últimos 7 días
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Total semana:{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        $
                        {weekData.reduce((s, d) => s + d.value, 0).toLocaleString()}
                        K
                      </span>
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all shrink-0">
                    Esta semana <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-end gap-2 h-44">
                  {weekData.map((d, i) => {
                    const hPct = Math.round((d.value / maxWeek) * 100);
                    const isToday = i === 4;
                    return (
                      <div
                        key={d.day}
                        className="flex-1 flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-full flex flex-col justify-end"
                          style={{ height: "168px" }}
                        >
                          <div
                            className={`w-full rounded-t-lg border transition-all group relative ${
                              isToday
                                ? "bg-blue-600 border-blue-500 hover:bg-blue-700 active:bg-blue-800"
                                : "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            }`}
                            style={{ height: `${hPct}%` }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              ${d.value}K
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-semibold ${isToday ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top services */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Servicios top
                  </h2>
                  <Link href="/services">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 cursor-pointer">
                      Ver todos →
                    </span>
                  </Link>
                </div>
                <div className="space-y-4">
                  {topServices.map((s, i) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {s.name}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {s.count} citas
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            i === 0
                              ? "bg-blue-600"
                              : i === 1
                                ? "bg-blue-400"
                                : i === 2
                                  ? "bg-blue-300"
                                  : "bg-blue-200"
                          }`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Quick Actions + Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
              {/* Quick actions */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                  Acciones rápidas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Link key={a.label} href={a.href}>
                        <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer text-center group">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg} dark:bg-blue-900/20`}
                          >
                            <Icon className={`w-5 h-5 ${a.iconClass} dark:text-blue-400`} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">
                            {a.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Actividad reciente
                  </h2>
                  <button className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentActivity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg} dark:bg-blue-900/20`}
                        >
                          <Icon className={`w-4 h-4 ${item.iconClass} dark:text-blue-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                            {item.sub}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5 text-slate-300 dark:text-slate-700" />
                          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Appointments table ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Citas recientes
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {stats.todayAppointments} citas hoy en total
                  </p>
                </div>
                <Link href="/appointments">
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all shrink-0">
                    Ver todas <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>

              <DataTable<AppointmentRow>
                columns={appointmentColumns}
                data={stats.recentAppointments}
                searchFields={["client", "service", "employee"]}
                searchPlaceholder="Buscar cliente, servicio..."
                pageSize={6}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
