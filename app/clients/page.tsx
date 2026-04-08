"use client";

import { useState, useMemo, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getClients, createClient, updateClient, deleteClient } from "@/lib/api";
import {
  Plus,
  Users,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Award,
  CalendarCheck,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import Modal from "@/components/modal";
import { toast } from "sonner";

type ClientRow = {
  id: string;
  name: string;
  contact: string;
  appointments: number;
  points: number;
  raw: any;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
};

export default function ClientsPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  
  const [rawClients, setRawClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = async () => {
    if (!companyId || !activeBranchId) return;
    setLoading(true);
    try {
      const data = await getClients(companyId, activeBranchId);
      setRawClients(data);
    } catch {
      toast.error("Error cargando clientes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [companyId, activeBranchId]);

  const tableData: ClientRow[] = useMemo(() => {
    return rawClients.map((c) => ({
      id: c.id,
      name: c.name,
      contact: `${c.email} • ${c.phone}`,
      appointments: c.appointments || 0,
      points: c.points || 0,
      raw: c,
    }));
  }, [rawClients]);

  const filtered = useMemo(() => {
    if (!searchTerm) return tableData;
    const s = searchTerm.toLowerCase();
    return tableData.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.contact.toLowerCase().includes(s)
    );
  }, [tableData, searchTerm]);

  // Totals
  const totalClients = tableData.length;
  const topClients = [...tableData].sort((a,b) => b.appointments - a.appointments).slice(0, 5);

  const openCreate = () => {
    setEditingClient(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (row: ClientRow) => {
    setEditingClient(row);
    setFormData({
      name: row.raw.name,
      email: row.raw.email,
      phone: row.raw.phone,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      companyId,
      branchId: activeBranchId,
    };

    let res;
    if (editingClient) {
      res = await updateClient(editingClient.id, payload);
    } else {
      res = await createClient(payload);
    }

    if (res.success) {
      toast.success(editingClient ? "Cliente actualizado" : "Cliente creado");
      fetchClients();
      setIsModalOpen(false);
    } else {
      toast.error("Error al guardar cliente");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    const res = await deleteClient(deleteConfirmId);
    if (res.success) {
      toast.success("Cliente eliminado");
      fetchClients();
    }
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const columns: Column<ClientRow>[] = [
    {
      key: "name",
      label: "Cliente",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">{item.contact}</p>
          </div>
        </div>
      ),
    },
    {
      key: "appointments",
      label: "Citas",
      sortable: true,
      align: "center",
      render: (item) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium text-xs border border-blue-100 dark:border-blue-800">
          <CalendarCheck className="w-3.5 h-3.5" />
          {item.appointments}
        </div>
      ),
    },
    {
      key: "points",
      label: "Puntos",
      sortable: true,
      align: "center",
      render: (item) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-200 dark:border-amber-800 shadow-sm shadow-amber-100 dark:shadow-amber-900/10">
          <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          {item.points} pts
        </div>
      ),
    },
    {
      key: "id",
      label: "Acciones",
      sortable: false,
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmId(item.id);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title={`Clientes - ${activeBranch?.name || "..."}`}
          description="Fidelización y administración de clientes"
          breadcrumb="Clientes"
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:-translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" /> Nuevo Cliente
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
           <div className="lg:col-span-3">
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="relative w-full sm:w-auto">
                    <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      placeholder="Buscar clientes por nombre o contacto..."
                      className="w-full sm:w-[320px] pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-blue-500 transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 p-5">
                   <DataTable
                    columns={columns}
                    data={filtered}
                    loading={loading}
                    emptyMessage="No se encontraron clientes."
                  />
                </div>
             </div>
           </div>

           <div className="flex flex-col gap-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Clientes</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{totalClients}</p>
                   </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl border border-amber-500 shadow-lg p-5 text-white">
                <div className="flex items-center gap-2 mb-4 opacity-90">
                  <Award className="w-5 h-5" />
                  <p className="text-xs font-bold uppercase tracking-wider">Top Fidelidad</p>
                </div>
                
                <div className="space-y-3">
                  {topClients.map((tc, idx) => (
                    <div key={tc.id} className="flex justify-between items-center bg-white/10 rounded-xl p-2.5 border border-white/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black opacity-60">#{idx + 1}</span>
                        <p className="text-sm font-bold leading-tight line-clamp-1">{tc.name}</p>
                      </div>
                      <p className="text-xs font-bold">{tc.points} pts</p>
                    </div>
                  ))}
                  {topClients.length === 0 && (
                    <p className="text-sm opacity-80 py-2">No hay datos suficientes</p>
                  )}
                </div>
              </div>
           </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
          description="Ingresa la información personal y de contacto del cliente."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100"
                placeholder="Ej. email@ejemplo.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100"
                placeholder="Ej. +34 600 000 000"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-10 flex items-center justify-center bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Eliminar Cliente"
          description="¿Estás seguro de eliminar a este cliente? Se perderán sus puntos y de recompensas acumulados."
          size="sm"
        >
          <div className="flex gap-3 pt-4">
            <button
              onClick={confirmDelete}
              disabled={saving}
              className="flex-1 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, eliminar"}
            </button>
            <button
              onClick={() => setDeleteConfirmId(null)}
              disabled={saving}
              className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all"
            >
              Cancelar
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
