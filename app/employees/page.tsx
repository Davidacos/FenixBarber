"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "@/lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Users,
  Star,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import StatusBadge from "@/components/status-badge";
import Modal from "@/components/modal";
// ── Types ──────────────────────────────────────────────────
type EmployeeStatus = "activo" | "inactivo";

type EmployeeRow = {
  id: string;
  name: string;
  role: string;
  email: string;
  specialty: string;
  commission: number;
  status: EmployeeStatus;
};

type FormData = {
  name: string;
  role: string;
  email: string;
  phone: string;
  specialty: string;
  commission: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  role: "",
  email: "",
  phone: "",
  specialty: "",
  commission: "",
};

// ── Helper: initials ───────────────────────────────────────
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Avatar color pool ──────────────────────────────────────
const avatarColors = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-rose-600",
  "bg-cyan-600",
];
function avatarColor(index: number) {
  return avatarColors[index % avatarColors.length];
}

// ── Table columns ──────────────────────────────────────────
function buildColumns(
  onEdit: (row: EmployeeRow) => void,
  onDelete: (id: string) => void,
): Column<EmployeeRow>[] {
  return [
    {
      key: "name",
      label: "Empleado",
      render: (item, value) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(parseInt(item.id) || 0)}`}
          >
            {initials(String(value))}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">
              {String(value)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.role}</p>
          </div>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "specialty", label: "Especialidad" },
    {
      key: "commission",
      label: "Comisión",
      align: "center",
      render: (_item, value) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          {String(value)}%
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      sortable: false,
      align: "center",
      render: (_item, value) => (
        <StatusBadge status={value as EmployeeStatus} />
      ),
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
            title="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

// ── Component ──────────────────────────────────────────────
export default function EmployeesPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [rawEmployees, setRawEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (companyId && activeBranchId) {
      setIsLoading(true);
      getEmployees(companyId, activeBranchId).then(setRawEmployees).finally(() => setIsLoading(false));
    }
  }, [companyId, activeBranchId]);

  // Map mock data to typed rows
  const employees: EmployeeRow[] = rawEmployees.map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    email: e.email,
    specialty: e.specialty,
    commission: e.commission,
    status: e.active ? "activo" : "inactivo",
  }));

  const filteredEmployees = employees.filter(
    (e) =>
      searchQuery === "" ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = employees.filter((e) => e.status === "activo").length;
  const avgCommission = employees.length
    ? Math.round(
        employees.reduce((s, e) => s + e.commission, 0) / employees.length,
      )
    : 0;

  // ── Modal helpers ──
  const openCreate = () => {
    setEditingEmployee(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (row: EmployeeRow) => {
    setEditingEmployee(row);
    const raw = rawEmployees.find((e) => e.id === row.id);
    setFormData({
      name: raw?.name ?? "",
      role: raw?.role ?? "",
      email: raw?.email ?? "",
      phone: raw?.phone ?? "",
      specialty: raw?.specialty ?? "",
      commission: String(raw?.commission ?? ""),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...formData,
      commission: parseFloat(formData.commission) || 0,
      companyId: companyId,
      branchId: activeBranchId,
    };

    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, payload);
    } else {
      await createEmployee(payload);
    }
    
    const refreshed = await getEmployees(companyId!, activeBranchId!);
    setRawEmployees(refreshed);

    setIsModalOpen(false);
    setSaving(false);
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    await deleteEmployee(deleteConfirmId);
    
    const refreshed = await getEmployees(companyId!, activeBranchId!);
    setRawEmployees(refreshed);
    
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const columns = buildColumns(openEdit, handleDelete);

  const field = (
    label: string,
    key: keyof FormData,
    type = "text",
    placeholder = "",
    required = false,
    icon?: React.ReactNode,
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </span>
        )}
        <input
          required={required}
          type={type}
          value={formData[key]}
          onChange={(e) =>
            setFormData((f) => ({ ...f, [key]: e.target.value }))
          }
          placeholder={placeholder}
          className={`w-full h-10 ${icon ? "pl-9" : "pl-3"} pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title={`Empleados - ${activeBranch?.name || "..."}`}
          description="Gestiona tu equipo y sus especialidades"
          breadcrumb="Empleados"
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:-translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" /> Nuevo empleado
            </button>
          }
        />
        
        {isLoading ? (
             <div className="flex justify-center items-center h-48 py-20">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
        ) : (
          <>
            {/* ── Summary cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            {
              label: "Total equipo",
              value: employees.length,
              icon: Users,
              iconClass: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Activos",
              value: activeCount,
              icon: UserCheck,
              iconClass: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Inactivos",
              value: employees.length - activeCount,
              icon: Users,
              iconClass: "text-slate-400",
              bg: "bg-slate-50",
            },
            {
              label: "Comisión promedio",
              value: `${avgCommission}%`,
              icon: TrendingUp,
              iconClass: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 ${c.bg} dark:bg-slate-950`}
                >
                  <Icon className={`w-5 h-5 ${c.iconClass}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                    {c.value}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {c.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Equipo de trabajo
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {filteredEmployees.length} empleados
            </p>
          </div>
          <div className="sm:ml-auto flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-48 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            {/* View toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-950">
              {(["grid", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    viewMode === mode
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  {mode === "grid" ? "Tarjetas" : "Tabla"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid view ── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map((emp, i) => (
              <div
                key={emp.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 flex flex-col"
              >
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0 ${avatarColor(i)}`}
                    >
                      {initials(emp.name)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} size="sm" />
                </div>

                {/* Specialty tag */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {emp.specialty}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-slate-800 mb-4" />

                {/* Contact */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {rawEmployees.find((e) => e.id === emp.id)?.phone ?? "—"}
                    </span>
                  </div>
                </div>

                {/* Commission */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Comisión
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {emp.commission}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${emp.commission}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(emp)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-slate-400 dark:text-slate-500 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add card */}
            <button
              onClick={openCreate}
              className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 min-h-[280px] group"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 group-hover:border-blue-300 dark:group-hover:border-blue-800 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold">Agregar empleado</p>
            </button>
          </div>
        )}

        {/* ── Table view ── */}
        {viewMode === "table" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <DataTable<EmployeeRow>
              columns={columns}
              data={filteredEmployees}
              searchFields={["name", "email", "specialty"]}
              searchPlaceholder="Buscar empleado..."
              pageSize={8}
            />
          </div>
        )}
        </>
        )}
      </main>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Editar empleado" : "Nuevo empleado"}
        description={
          editingEmployee
            ? "Modifica los datos del empleado"
            : "Agrega un nuevo miembro al equipo"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Nombre completo", "name", "text", "ej: Juan Pérez", true)}
            {field("Cargo", "role", "text", "ej: Barbero Senior", true)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field(
              "Email",
              "email",
              "email",
              "email@negocio.com",
              true,
              <Mail className="w-3.5 h-3.5" />,
            )}
            {field(
              "Teléfono",
              "phone",
              "tel",
              "+57 300 000 0000",
              false,
              <Phone className="w-3.5 h-3.5" />,
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Especialidad", "specialty", "text", "ej: Corte + Barba")}
            {field(
              "Comisión (%)",
              "commission",
              "number",
              "15",
              true,
              <TrendingUp className="w-3.5 h-3.5" />,
            )}
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
              ) : editingEmployee ? (
                "Guardar cambios"
              ) : (
                "Crear empleado"
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

      {/* ── Delete confirmation Modal ── */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Eliminar empleado"
        description="Esta acción no se puede deshacer"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <Trash2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-relaxed">
              ¿Estás seguro de que quieres eliminar este empleado? Se perderán
              todos sus datos asociados.
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
              className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold text-slate-600 dark:text-slate-400 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
