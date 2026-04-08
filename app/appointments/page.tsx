"use client";

import { useState, useMemo, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getAppointments, getClients, getEmployees, getServices, createAppointment, updateAppointment, deleteAppointment } from "@/lib/api";
import {
  Plus,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  UserX,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import StatusBadge from "@/components/status-badge";
import Modal from "@/components/modal";

// ── Types ──────────────────────────────────────────────────
type AppStatus =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada"
  | "no-asistio";

type AppRow = {
  id: string;
  client: string;
  service: string;
  employee: string;
  date: string;
  duration: string;
  status: AppStatus;
  amount: string;
};

type FormData = {
  clientId: string;
  serviceId: string;
  employeeId: string;
  status: AppStatus;
  date: string;
  time: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  clientId: "",
  serviceId: "",
  employeeId: "",
  status: "pendiente",
  date: "",
  time: "",
  notes: "",
};

const statusOptions: {
  id: AppStatus;
  label: string;
  icon: typeof CheckCircle2;
  color: string;
}[] = [
  { id: "pendiente", label: "Pendiente", icon: Clock, color: "text-amber-500" },
  {
    id: "confirmada",
    label: "Confirmada",
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  {
    id: "completada",
    label: "Completada",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  { id: "cancelada", label: "Cancelada", icon: XCircle, color: "text-red-500" },
  {
    id: "no-asistio",
    label: "No asistió",
    icon: UserX,
    color: "text-slate-400",
  },
];

// ── Calendar helpers ───────────────────────────────────────
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Table columns ──────────────────────────────────────────
function buildColumns(
  onEdit: (r: AppRow) => void,
  onDelete: (id: string) => void,
): Column<AppRow>[] {
  return [
    {
      key: "client",
      label: "Cliente",
      render: (_item, value) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-extrabold shrink-0">
            {String(value)
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {String(value)}
          </span>
        </div>
      ),
    },
    { key: "service", label: "Servicio" },
    { key: "employee", label: "Empleado" },
    {
      key: "date",
      label: "Fecha y hora",
      render: (_item, value) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {String(value)}
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duración",
      align: "center",
      render: (_item, value) => (
        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {String(value)}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Monto",
      align: "right",
      render: (_item, value) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
          {String(value)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      sortable: false,
      align: "center",
      render: (_item, value) => <StatusBadge status={value as AppStatus} />,
    },
    {
      key: "id",
      label: "Acciones",
      sortable: false,
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-slate-400 dark:text-slate-500 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

// ── Select field helper ───────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium outline-none appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
        >
          <option value="" disabled>
            {placeholder ?? `Seleccionar ${label.toLowerCase()}`}
          </option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────
export default function AppointmentsPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  
  const [viewMode, setViewMode] = useState<"tabla" | "calendario">("tabla");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppRow | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const today = new Date();

  // ── State for data ──
  const [rawAppointments, setRawAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    if (companyId && activeBranchId) {
      setIsLoading(true);
      Promise.all([
        getAppointments(companyId, activeBranchId),
        getServices(companyId, activeBranchId),
        getEmployees(companyId, activeBranchId),
        getClients(companyId, activeBranchId)
      ]).then(([apps, svcs, emps, clis]) => {
        setRawAppointments(apps);
        setServices(svcs);
        setEmployees(emps);
        setClients(clis);
        setIsLoading(false);
      });
    }
  }, [companyId, activeBranchId]);

  // ── Data ──
  const tableData: AppRow[] = useMemo(
    () =>
      rawAppointments.map((apt) => {
        const svc = services.find((s) => s.id === apt.serviceId);
        const emp = employees.find((e) => e.id === apt.employeeId);
        const cli = clients.find((c) => c.id === apt.clientId);
        return {
          id: apt.id,
          client: cli?.name || `Cliente ${apt.clientId}`,
          service: svc?.name ?? "N/A",
          employee: emp?.name ?? "N/A",
          date: apt.date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          duration: `${apt.duration} min`,
          status: apt.status as AppStatus,
          amount: `$${(svc?.price ?? 0).toLocaleString("es-CO")}`,
        };
      }),
    [rawAppointments, services, employees, clients],
  );

  const filtered = filterStatus
    ? tableData.filter((r) => r.status === filterStatus)
    : tableData;

  // ── Summary counts ──
  const counts = useMemo(
    () => ({
      total: tableData.length,
      pendiente: tableData.filter((r) => r.status === "pendiente").length,
      confirmada: tableData.filter((r) => r.status === "confirmada").length,
      completada: tableData.filter((r) => r.status === "completada").length,
      cancelada: tableData.filter((r) => r.status === "cancelada").length,
    }),
    [tableData],
  );

  // ── Calendar grid ──
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const calendarDays = useMemo(() => {
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [calYear, calMonth, firstDay, daysInMonth]);

  // Map appointments to calendar day
  const appsByDay = useMemo(() => {
    const map: Record<number, number> = {};
    rawAppointments.forEach((apt) => {
      if (
        apt.date.getFullYear() === calYear &&
        apt.date.getMonth() === calMonth
      ) {
        const d = apt.date.getDate();
        map[d] = (map[d] ?? 0) + 1;
      }
    });
    return map;
  }, [calYear, calMonth, rawAppointments]);

  // ── Handlers ──
  const openCreate = () => {
    setEditingApp(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };
  const openEdit = (r: AppRow) => {
    setEditingApp(r);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Add company and branch contexts to data
    const payload = {
      ...formData,
      companyId: companyId,
      branchId: activeBranchId,
      date: new Date(formData.date + "T" + formData.time),
    };

    if (editingApp) {
      await updateAppointment(editingApp.id, payload);
    } else {
      await createAppointment(payload);
    }
    
    const refreshed = await getAppointments(companyId!, activeBranchId!);
    setRawAppointments(refreshed);

    setIsModalOpen(false);
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    await deleteAppointment(deleteConfirmId);
    
    const refreshed = await getAppointments(companyId!, activeBranchId!);
    setRawAppointments(refreshed);
    
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const columns = buildColumns(openEdit, (id) => setDeleteConfirmId(id));

  const set = (k: keyof FormData) => (v: string) =>
    setFormData((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title={`Citas - ${activeBranch?.name || "..."}`}
          description="Administra el calendario de citas de tu negocio"
          breadcrumb="Citas"
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:-translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva cita
            </button>
          }
        />

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[
            {
              label: "Total",
              value: counts.total,
              color: "text-slate-900",
              bg: "bg-white",
            },
            {
              label: "Pendientes",
              value: counts.pendiente,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Confirmadas",
              value: counts.confirmada,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Completadas",
              value: counts.completada,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Canceladas",
              value: counts.cancelada,
              color: "text-red-500",
              bg: "bg-red-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all`}
              onClick={() =>
                setFilterStatus(
                  s.label === "Total"
                    ? ""
                    : s.label
                        .toLowerCase()
                        .replace("das", "da")
                        .replace("das", "da"),
                )
              }
            >
              <p
                className={`text-2xl font-extrabold tracking-tight leading-none ${s.color} dark:text-white`}
              >
                {s.value}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── View tabs ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-950">
              {(["tabla", "calendario"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                    viewMode === mode
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  {mode === "tabla" ? (
                    <>
                      <Search className="w-3 h-3" /> Tabla
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3" /> Calendario
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Filter by status */}
            {viewMode === "tabla" && (
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none appearance-none cursor-pointer hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all whitespace-nowrap"
                >
                  <option value="">Todos los estados</option>
                  {statusOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>
          
          {isLoading ? (
             <div className="flex justify-center items-center h-48 py-20">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
          ) : (
            <>
              {/* ── Table view ── */}
              {viewMode === "tabla" && (
                <div className="p-5">
                  <DataTable<AppRow>
                    columns={columns}
                    data={filtered}
                    searchFields={["client", "service", "employee"]}
                    searchPlaceholder="Buscar cliente, servicio o empleado..."
                    pageSize={8}
                    emptyMessage="No se encontraron citas"
                  />
                </div>
              )}

              {/* ── Calendar view ── */}
              {viewMode === "calendario" && (
                <div className="p-5">
                  {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {MONTHS[calMonth]} {calYear}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (calMonth === 0) {
                        setCalMonth(11);
                        setCalYear((y) => y - 1);
                      } else setCalMonth((m) => m - 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCalYear(today.getFullYear());
                      setCalMonth(today.getMonth());
                    }}
                    className="px-3 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => {
                      if (calMonth === 11) {
                        setCalMonth(0);
                        setCalYear((y) => y + 1);
                      } else setCalMonth((m) => m + 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const isToday =
                    day !== null &&
                    day === today.getDate() &&
                    calMonth === today.getMonth() &&
                    calYear === today.getFullYear();
                  const appCount = day ? (appsByDay[day] ?? 0) : 0;

                  return (
                    <div
                      key={idx}
                      className={`min-h-[72px] rounded-xl p-2 border transition-all cursor-default ${
                        day === null
                          ? "border-transparent"
                          : isToday
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {day !== null && (
                        <>
                          <p
                            className={`text-xs font-bold leading-none ${isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}
                          >
                            {day}
                          </p>
                          {appCount > 0 && (
                            <div className="mt-1.5 space-y-1">
                              <div
                                className={`px-1.5 py-0.5 rounded-md text-xs font-bold text-center ${
                                  isToday
                                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                                    : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                }`}
                              >
                                {appCount} cita{appCount > 1 ? "s" : ""}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <div className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-400" />
                  Hoy
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <div className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/40" />
                  Con citas
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </main>

      {/* ── New / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? "Editar cita" : "Nueva cita"}
        description={
          editingApp
            ? "Modifica los datos de la cita"
            : "Agenda una nueva cita para tu negocio"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Cliente"
              value={formData.clientId}
              onChange={set("clientId")}
              required
              options={clients.map((c) => ({ id: c.id, name: c.name }))}
            />
            <SelectField
              label="Servicio"
              value={formData.serviceId}
              onChange={set("serviceId")}
              required
              options={services.map((s) => ({
                id: s.id,
                name: `${s.name} ($${s.price})`,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Empleado"
              value={formData.employeeId}
              onChange={set("employeeId")}
              required
              options={employees.map((e) => ({ id: e.id, name: e.name }))}
            />
            <SelectField
              label="Estado"
              value={formData.status}
              onChange={(v) => set("status")(v)}
              required
              options={statusOptions.map((s) => ({ id: s.id, name: s.label }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fecha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => set("date")(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Hora <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="time"
                  value={formData.time}
                  onChange={(e) => set("time")(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Observaciones
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Notas adicionales sobre la cita..."
              rows={3}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-2" />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </>
              ) : editingApp ? (
                "Guardar cambios"
              ) : (
                "Crear cita"
              )}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold text-slate-600 dark:text-slate-400 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete confirmation ── */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Eliminar cita"
        description="Esta acción no se puede deshacer"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              ¿Estás seguro de que quieres eliminar esta cita? El cliente no
              recibirá notificación automática.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition-all"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Sí, eliminar
            </button>
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-600 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
