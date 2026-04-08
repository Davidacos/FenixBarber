"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getBranches, createBranch, updateBranch, deleteBranch } from "@/lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  MapPin,
  Phone,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import Modal from "@/components/modal";
import { toast } from "sonner";

type BranchRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type FormData = {
  name: string;
  address: string;
  phone: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  address: "",
  phone: "",
};

export default function SedesPage() {
  const { companyId, activeBranchId, setActiveBranchId } = useBranch();
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchRow | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadBranches = async () => {
    if (!companyId) return;
    setLoading(true);
    const data = await getBranches(companyId);
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBranches();
  }, [companyId]);

  const openCreate = () => {
    setEditingBranch(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (row: BranchRow) => {
    setEditingBranch(row);
    setFormData({
      name: row.name,
      address: row.address,
      phone: row.phone,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Refresh page data manually after API simulated request since context may need update
    let res;
    if (editingBranch) {
      res = await updateBranch(editingBranch.id, formData);
    } else {
      res = await createBranch({ ...formData, companyId });
    }

    if (res.success) {
      toast.success(editingBranch ? "Sede actualizada" : "Sede creada");
      setIsModalOpen(false);
      await loadBranches();
      // Wait for a small timeout to let the app fully reconcile the branches update, we would ideally force reload Context here.
      setTimeout(() => window.location.reload(), 500); 
    } else {
      toast.error(res.error || "Hubo un error");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    const res = await deleteBranch(deleteConfirmId);
    if (res.success) {
      toast.success("Sede eliminada");
      if (activeBranchId === deleteConfirmId && branches.length > 1) {
        const otherBranch = branches.find((b) => b.id !== deleteConfirmId);
        if (otherBranch) setActiveBranchId(otherBranch.id);
      }
      setIsModalOpen(false);
      await loadBranches();
      setTimeout(() => window.location.reload(), 500); 
    } else {
      toast.error("Error al eliminar la sede");
    }
    setDeleteConfirmId(null);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title="Sedes"
          description="Gestiona todas las sucursales de tu empresa"
          breadcrumb="Sedes"
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm dark:shadow-blue-900/20 transition-all hover:-translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Sede
            </button>
          }
        />

        {loading ? (
             <div className="flex justify-center items-center h-48 py-20">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative group overflow-hidden box-border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
              >
                {b.id === activeBranchId && (
                  <div className="absolute top-0 right-0 pt-2 pr-3">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Activa
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rounded-xl">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                      {b.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{b.address}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{b.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                        setActiveBranchId(b.id);
                        toast.success(`Cambiando a base de datos de ${b.name}...`);
                    }}
                    className={`flex-1 flex items-center justify-center text-xs font-bold leading-tight py-2.5 rounded-xl border transition-all ${
                        b.id === activeBranchId 
                        ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-default" 
                        : "bg-white dark:bg-slate-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                    disabled={b.id === activeBranchId}
                  >
                    {b.id === activeBranchId ? "Seleccionada" : "Seleccionar"}
                  </button>
                  <button
                    onClick={() => openEdit(b)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(b.id)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={openCreate}
              className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 p-6 min-h-[200px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <Plus className="w-6 h-6 mb-1" />
              <p className="text-sm font-bold">Agregar Nueva Sede</p>
            </button>
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? "Editar Sede" : "Nueva Sede"}
        description={
          editingBranch
            ? "Edita la información de esta sucursal"
            : "Añade una nueva sucursal y empieza a gestionar sus datos"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nombre de la sede <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="Ej. Sede Norte"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="Ej. Av. Siempre Viva 123"
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
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="Ej. +34 600 000 000"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Eliminar Sede"
        description="Esta acción eliminará la sede, estás descartando todos sus datos asociados y no se podrá deshacer."
        size="sm"
      >
        <div className="flex gap-3 pt-2">
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
            className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
