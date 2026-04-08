"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Scissors,
  Tag,
  Clock,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import StatusBadge from "@/components/status-badge";
import Modal from "@/components/modal";
import { toast } from "sonner";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api";

// ── Types ─────────────────────────────────────────────────
type ServiceStatus = "activo" | "inactivo";

type ServiceRow = {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  status: ServiceStatus;
  raw: Record<string, unknown>;
};

type FormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  duration: string;
};

// ── Constants ─────────────────────────────────────────────
const categories = [
  { id: "barberia", name: "Barbería", icon: "✂️" },
  { id: "belleza", name: "Belleza", icon: "💄" },
  { id: "tattoo", name: "Tatuajes", icon: "🖋️" },
  { id: "estetica", name: "Estética", icon: "🧖" },
];

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  category: "",
  price: "",
  duration: "",
};

// ── Column definition ─────────────────────────────────────
function buildColumns(
  onEdit: (row: ServiceRow) => void,
  onDelete: (id: string) => void,
): Column<ServiceRow>[] {
  return [
    {
      key: "name",
      label: "Servicio",
      render: (_item, value) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
            <Scissors className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {String(value)}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      render: (_item, value) => {
        const cat = categories.find((c) => c.id === String(value));
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {cat?.icon} {cat?.name ?? String(value)}
          </span>
        );
      },
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
      key: "price",
      label: "Precio",
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
      render: (_item, value) => <StatusBadge status={value as ServiceStatus} />,
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

// ── Component ─────────────────────────────────────────────
export default function ServicesPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRow | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Fetch ──
  const fetchServices = async () => {
    if (!companyId || !activeBranchId) return;
    setLoading(true);
    try {
      const res = await getServices(companyId, activeBranchId);
      setServices(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res as any[]).map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          duration: `${s.duration} min`,
          price: `$${parseFloat(s.price).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`,
          status: s.active ? "activo" : "inactivo",
          raw: s,
        })),
      );
    } catch {
      toast.error("Error al cargar los servicios");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [companyId, activeBranchId]);

  // ── Modal helpers ──
  const openCreate = () => {
    setEditingService(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (row: ServiceRow) => {
    setEditingService(row);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = row.raw as any;
    setFormData({
      name: raw.name ?? "",
      description: raw.description ?? "",
      category: raw.category ?? "",
      price: String(raw.price ?? ""),
      duration: String(raw.duration ?? ""),
    });
    setIsModalOpen(true);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      companyId: companyId,
      branchId: activeBranchId || "",
    };

    const res = editingService
      ? await updateService(editingService.id, payload)
      : await createService(payload);

    if (res.success) {
      toast.success(
        editingService ? "Servicio actualizado" : "Servicio creado",
      );
      setIsModalOpen(false);
      fetchServices();
    } else {
      toast.error("Error al guardar el servicio");
    }
    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    const res = await deleteService(deleteConfirmId);
    if (res.success) {
      toast.success("Servicio eliminado");
      fetchServices();
    } else {
      toast.error("Error al eliminar el servicio");
    }
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const filtered = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const columns = buildColumns(openEdit, handleDelete);

  // ── Stats ──
  const activeCount = services.filter((s) => s.status === "activo").length;
  const inactiveCount = services.filter((s) => s.status === "inactivo").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title={`Servicios - ${activeBranch?.name || "..."}`}
          description="Gestiona el catálogo de servicios de tu negocio"
          breadcrumb="Servicios"
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:-translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" /> Nuevo servicio
            </button>
          }
        />

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            {
              label: "Total servicios",
              value: services.length,
              icon: Scissors,
              iconClass: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Activos",
              value: activeCount,
              icon: Tag,
              iconClass: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Inactivos",
              value: inactiveCount,
              icon: Tag,
              iconClass: "text-slate-400",
              bg: "bg-slate-50",
            },
            {
              label: "Categorías",
              value: categories.length,
              icon: DollarSign,
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
                  <Icon className={`w-4.5 h-4.5 ${c.iconClass}`} />
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

        {/* ── Table card ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Todos los servicios
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {filtered.length} servicios encontrados
              </p>
            </div>

            <div className="sm:ml-auto flex items-center gap-2.5">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none appearance-none cursor-pointer hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">
                Cargando servicios...
              </p>
            </div>
          ) : (
            <DataTable<ServiceRow>
              columns={columns}
              data={filtered}
              searchFields={["name", "category"]}
              searchPlaceholder="Buscar servicio..."
              pageSize={8}
            />
          )}
        </div>
      </main>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Editar servicio" : "Nuevo servicio"}
        description={
          editingService
            ? "Modifica los datos del servicio"
            : "Completa los datos para agregar un nuevo servicio"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nombre del servicio <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="ej: Corte + Barba"
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Categoría <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium outline-none appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Seleccionar categoría
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe brevemente el servicio..."
              rows={3}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none"
            />
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Duración (min) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="30"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Precio (COP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="50000"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />{" "}
                  {editingService ? "Guardando..." : "Creando..."}
                </>
              ) : editingService ? (
                "Guardar cambios"
              ) : (
                "Crear servicio"
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
        title="Eliminar servicio"
        description="Esta acción no se puede deshacer"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <Trash2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-relaxed">
              ¿Estás seguro de que quieres eliminar este servicio? Los datos no
              se podrán recuperar.
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
