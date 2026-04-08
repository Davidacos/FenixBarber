"use client";

import { useState, useMemo, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useAppConfig } from "@/contexts/AppConfigContext";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import {
  Plus, Edit2, Trash2, Loader2, Package, Tag, ShoppingBag,
  Search, Star, BarChart3, AlertTriangle,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import Modal from "@/components/modal";
import { toast } from "sonner";

const CATEGORIES = ["Cuidado Capilar", "Styling", "Barba", "Coloración", "Kits", "Accesorios", "Otro"];

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  image: string;
  raw: any;
};

type FormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  image: string;
};

const EMPTY: FormData = { name: "", description: "", category: "Styling", price: "", stock: "0", image: "🛍️" };
const EMOJI_OPTIONS = ["🧴", "🫙", "💧", "💈", "🌿", "✨", "🪮", "💎", "🧼", "🛍️", "🎁", "🌸", "⚡", "🔥"];

export default function ShopAdminPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  const { formatMoney } = useAppConfig();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetch = async () => {
    if (!companyId || !activeBranchId) return;
    setLoading(true);
    try {
      const data = await getProducts(companyId, activeBranchId);
      setProducts(data);
    } catch { toast.error("Error cargando productos"); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [companyId, activeBranchId]);

  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }
    return list;
  }, [products, searchTerm, categoryFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    totalValue: products.reduce((s, p) => s + p.price * p.stock, 0),
    lowStock: products.filter((p) => p.stock <= 5 && p.active).length,
    activeCount: products.filter((p) => p.active).length,
  }), [products]);

  const openCreate = () => { setEditingProduct(null); setFormData(EMPTY); setIsModalOpen(true); };
  const openEdit = (row: ProductRow) => {
    setEditingProduct(row);
    setFormData({ name: row.raw.name, description: row.raw.description || "", category: row.raw.category, price: String(row.raw.price), stock: String(row.raw.stock), image: row.raw.image || "🛍️" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), companyId, branchId: activeBranchId };
    const res = editingProduct ? await updateProduct(editingProduct.id, payload) : await createProduct(payload);
    if (res.success) {
      toast.success(editingProduct ? "Producto actualizado" : "Producto creado");
      fetch();
      setIsModalOpen(false);
    } else { toast.error("Error guardando producto"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setSaving(true);
    await deleteProduct(deleteConfirmId);
    toast.success("Producto eliminado");
    fetch();
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const columns: Column<ProductRow>[] = [
    {
      key: "name", label: "Producto", sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 border border-slate-200 dark:border-slate-700">{item.image}</div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</p>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: "price", label: "Precio", sortable: true, align: "right",
      render: (item) => <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{formatMoney(item.price)}</span>,
    },
    {
      key: "stock", label: "Stock", sortable: true, align: "center",
      render: (item) => (
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${item.stock <= 5 ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"}`}>
          {item.stock <= 5 && <AlertTriangle className="w-3 h-3" />}
          {item.stock} uds
        </div>
      ),
    },
    {
      key: "id", label: "Acciones", sortable: false, align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  const tableData: ProductRow[] = filtered.map((p) => ({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock, active: p.active, image: p.image, raw: p }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar />
      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title={`Tienda - ${activeBranch?.name || "..."}`}
          description="Catálogo de productos para venta directa al cliente"
          breadcrumb="Tienda"
          actions={
            <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:-translate-y-px">
              <Plus className="w-3.5 h-3.5" /> Nuevo Producto
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Productos", value: stats.total, icon: Package, color: "blue" },
            { label: "Activos", value: stats.activeCount, icon: Star, color: "emerald" },
            { label: "Stock Bajo", value: stats.lowStock, icon: AlertTriangle, color: "amber" },
            { label: "Valor Inventario", value: formatMoney(stats.totalValue), icon: BarChart3, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 flex items-center justify-center shrink-0 border border-${color}-100 dark:border-${color}-800`}><Icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Buscar productos..." className="w-full sm:w-[280px] pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-blue-500 transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              <button onClick={() => setCategoryFilter("")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!categoryFilter ? "bg-slate-900 dark:bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>Todos</button>
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat === categoryFilter ? "" : cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${categoryFilter === cat ? "bg-slate-900 dark:bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <DataTable columns={columns} data={tableData} loading={loading} emptyMessage="No hay productos. ¡Crea el primero!" />
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Editar Producto" : "Nuevo Producto"} description="Completa la información del producto para tu catálogo.">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emoji picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ícono del Producto</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((em) => (
                  <button key={em} type="button" onClick={() => setFormData({ ...formData, image: em })} className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${formData.image === em ? "bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500 dark:border-blue-400" : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}>{em}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nombre <span className="text-red-500">*</span></label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Ej. Shampoo Premium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Precio <span className="text-red-500">*</span></label>
                <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all" placeholder="0" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Stock inicial</label>
                <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all" placeholder="0" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Categoría</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all appearance-none">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 transition-all resize-none" placeholder="Descripción del producto..." />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-1 h-10 flex items-center justify-center bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all">Cancelar</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Eliminar Producto" description="¿Estás seguro? Esta acción no se puede deshacer." size="sm">
          <div className="flex gap-3 pt-4">
            <button onClick={handleDelete} disabled={saving} className="flex-1 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </button>
            <button onClick={() => setDeleteConfirmId(null)} disabled={saving} className="flex-1 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-all">Cancelar</button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
