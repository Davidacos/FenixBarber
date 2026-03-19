"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Calendar,
  FileText,
  Loader2,
  Trash2,
  Edit2,
  BarChart3,
  PieChart,
  Wallet,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import DataTable, { type Column } from "@/components/data-table";
import Modal from "@/components/modal";
import { mockTransactions } from "@/lib/mock-data";

// ── Types ──────────────────────────────────────────────────
type TxType = "ingreso" | "gasto";

type TxRow = {
  id: string;
  type: TxType;
  description: string;
  category: string;
  date: string;
  amount: number;
  amountFmt: string;
};

type FormData = {
  type: TxType;
  category: string;
  description: string;
  amount: string;
  date: string;
  time: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  type: "ingreso",
  category: "",
  description: "",
  amount: "",
  date: "",
  time: "",
  notes: "",
};

const expenseCategories = [
  { id: "suministros", name: "Suministros" },
  { id: "mantenimiento", name: "Mantenimiento" },
  { id: "servicios", name: "Servicios" },
  { id: "salarios", name: "Salarios" },
  { id: "comisiones", name: "Comisiones" },
  { id: "otros", name: "Otros" },
];

// ── Helpers ────────────────────────────────────────────────
const fmt = (n: number) =>
  `$${n.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

// ── Bar chart mock data ────────────────────────────────────
const weekData = [
  { label: "Sem 1", income: 820, expense: 310 },
  { label: "Sem 2", income: 960, expense: 420 },
  { label: "Sem 3", income: 740, expense: 280 },
  { label: "Sem 4", income: 1100, expense: 390 },
];
const maxBar = Math.max(...weekData.flatMap((d) => [d.income, d.expense]));

// ── Table columns ──────────────────────────────────────────
function buildColumns(onDelete: (id: string) => void): Column<TxRow>[] {
  return [
    {
      key: "type",
      label: "Tipo",
      sortable: false,
      render: (_item, value) => {
        const isIncome = value === "ingreso";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
              isIncome
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {isIncome ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {isIncome ? "Ingreso" : "Gasto"}
          </span>
        );
      },
    },
    {
      key: "description",
      label: "Descripción",
      render: (_item, value) => (
        <span className="font-semibold text-slate-900 text-sm">
          {String(value)}
        </span>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      render: (_item, value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 capitalize">
          {String(value)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Fecha",
      render: (_item, value) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {String(value)}
        </div>
      ),
    },
    {
      key: "amountFmt",
      label: "Monto",
      align: "right",
      render: (item, value) => (
        <span
          className={`font-extrabold text-sm ${
            item.type === "ingreso" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {item.type === "ingreso" ? "+" : "−"}
          {String(value)}
        </span>
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
              onDelete(item.id);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];
}

// ── Component ──────────────────────────────────────────────
export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<"todos" | TxType>("todos");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // ── Mapped data ──
  const tableData: TxRow[] = useMemo(
    () =>
      mockTransactions.map((t) => ({
        id: t.id,
        type: t.type as TxType,
        description: t.description,
        category: t.category,
        date: t.date.toLocaleDateString("es-ES"),
        amount: t.amount,
        amountFmt: fmt(t.amount),
      })),
    [],
  );

  const filtered =
    filterType === "todos"
      ? tableData
      : tableData.filter((r) => r.type === filterType);

  // ── Totals ──
  const totalIncome = useMemo(
    () =>
      tableData
        .filter((r) => r.type === "ingreso")
        .reduce((s, r) => s + r.amount, 0),
    [tableData],
  );
  const totalExpenses = useMemo(
    () =>
      tableData
        .filter((r) => r.type === "gasto")
        .reduce((s, r) => s + r.amount, 0),
    [tableData],
  );
  const balance = totalIncome - totalExpenses;
  const margin =
    totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  // ── Category breakdown ──
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    tableData
      .filter((r) => r.type === "gasto")
      .forEach((r) => {
        map[r.category] = (map[r.category] ?? 0) + r.amount;
      });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [tableData]);

  const maxCat = categoryTotals[0]?.[1] ?? 1;

  // ── Handlers ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsModalOpen(false);
    setSaving(false);
  };

  const confirmDelete = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setDeleteConfirmId(null);
    setSaving(false);
  };

  const set =
    (k: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setFormData((f) => ({ ...f, [k]: e.target.value }));

  const columns = buildColumns((id) => setDeleteConfirmId(id));

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Topbar />

      <main className="md:ml-64 pt-20 pb-12 px-5 md:px-7">
        <PageHeader
          title="Finanzas"
          description="Gestiona ingresos y gastos de tu negocio"
          breadcrumb="Finanzas"
          actions={
            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <FileText className="w-3.5 h-3.5" /> Exportar
              </button>
              <button
                onClick={() => {
                  setFormData(EMPTY_FORM);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 transition-all hover:-translate-y-px"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo movimiento
              </button>
            </div>
          }
        />

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
          {[
            {
              label: "Total ingresos",
              value: fmt(totalIncome),
              icon: TrendingUp,
              iconClass: "text-emerald-600",
              bg: "bg-emerald-50 border-emerald-100",
              badge: "+15% vs mes anterior",
              badgeClass: "bg-emerald-50 border-emerald-200 text-emerald-700",
              badgeIcon: <ArrowUpRight className="w-3 h-3" />,
            },
            {
              label: "Total gastos",
              value: fmt(totalExpenses),
              icon: TrendingDown,
              iconClass: "text-red-600",
              bg: "bg-red-50 border-red-100",
              badge: "+5% vs mes anterior",
              badgeClass: "bg-red-50 border-red-200 text-red-700",
              badgeIcon: <ArrowUpRight className="w-3 h-3" />,
            },
            {
              label: "Utilidad neta",
              value: fmt(balance),
              icon: Wallet,
              iconClass: balance >= 0 ? "text-blue-600" : "text-red-600",
              bg:
                balance >= 0
                  ? "bg-blue-50 border-blue-100"
                  : "bg-red-50 border-red-100",
              badge: `${margin}% margen`,
              badgeClass:
                balance >= 0
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-red-50 border-red-200 text-red-700",
              badgeIcon:
                balance >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                ),
            },
            {
              label: "Transacciones",
              value: tableData.length,
              icon: BarChart3,
              iconClass: "text-amber-600",
              bg: "bg-amber-50 border-amber-100",
              badge: `${tableData.filter((r) => r.type === "ingreso").length} ingresos`,
              badgeClass: "bg-amber-50 border-amber-200 text-amber-700",
              badgeIcon: <DollarSign className="w-3 h-3" />,
            },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${c.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${c.iconClass}`} />
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${c.badgeClass}`}
                  >
                    {c.badgeIcon}
                    {c.badge}
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  {c.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {c.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {/* Ingresos vs Gastos bars */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Ingresos vs Gastos
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparativa mensual por semana
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                  Ingresos
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />
                  Gastos
                </span>
              </div>
            </div>
            <div className="flex items-end gap-4 h-40">
              {weekData.map((d) => (
                <div
                  key={d.label}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-full flex items-end justify-center gap-1"
                    style={{ height: 128 }}
                  >
                    {/* Income bar */}
                    <div
                      className="flex-1 rounded-t-lg bg-emerald-400 hover:bg-emerald-500 transition-colors relative group/bar"
                      style={{
                        height: `${Math.round((d.income / maxBar) * 100)}%`,
                      }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {fmt(d.income * 1000)}
                      </div>
                    </div>
                    {/* Expense bar */}
                    <div
                      className="flex-1 rounded-t-lg bg-red-300 hover:bg-red-400 transition-colors relative group/bar"
                      style={{
                        height: `${Math.round((d.expense / maxBar) * 100)}%`,
                      }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {fmt(d.expense * 1000)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Gastos por categoría
              </h2>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3.5">
              {categoryTotals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Sin datos
                </p>
              ) : (
                categoryTotals.map(([cat, total]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 capitalize">
                        {cat}
                      </span>
                      <span className="text-xs font-bold text-red-600">
                        {fmt(total)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{
                          width: `${Math.round((total / maxCat) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Transactions table ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Movimientos
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {filtered.length} registros
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2.5">
              {(["todos", "ingreso", "gasto"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterType(opt)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all capitalize ${
                    filterType === opt
                      ? opt === "ingreso"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : opt === "gasto"
                          ? "bg-red-50 border-red-400 text-red-700"
                          : "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {opt === "todos"
                    ? "Todos"
                    : opt === "ingreso"
                      ? "Ingresos"
                      : "Gastos"}
                </button>
              ))}
            </div>
          </div>

          <DataTable<TxRow>
            columns={columns}
            data={filtered}
            searchFields={["description", "category"]}
            searchPlaceholder="Buscar descripción o categoría..."
            pageSize={8}
            emptyMessage="Sin movimientos registrados"
          />
        </div>
      </main>

      {/* ── New Transaction Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo movimiento"
        description="Registra un ingreso o gasto en tu negocio"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tipo de movimiento <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {(["ingreso", "gasto"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData((f) => ({ ...f, type: t }))}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 text-sm font-bold transition-all ${
                    formData.type === t
                      ? t === "ingreso"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {t === "ingreso" ? (
                    <>
                      <ArrowUpRight className="w-4 h-4" /> Ingreso
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4" /> Gasto
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Descripción <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.description}
                onChange={set("description")}
                placeholder="ej: Compra de insumos"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categoría <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={set("category")}
                  className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium outline-none appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Seleccionar categoría
                  </option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Monto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.amount}
                  onChange={set("amount")}
                  placeholder="50000"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Fecha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={set("date")}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hora
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={set("time")}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={set("notes")}
              placeholder="Detalles adicionales..."
              rows={3}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="border-t border-slate-100 pt-2" />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all ${
                formData.type === "ingreso"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Registrar {formData.type}
                </>
              )}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-600 transition-all"
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
        title="Eliminar movimiento"
        description="Esta acción no se puede deshacer"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              ¿Seguro que quieres eliminar este movimiento? Los datos no podrán
              recuperarse.
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
