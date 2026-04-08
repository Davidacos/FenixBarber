"use client";

import { ReactNode, useState } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  Loader2,
} from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T, value: unknown) => ReactNode;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchFields?: string[];
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  pageSize?: number;
  loading?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchFields = [],
  searchPlaceholder = "Buscar...",
  onRowClick,
  emptyMessage = "Sin resultados",
  pageSize = 8,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = data.filter((item) => {
    if (!search) return true;
    return searchFields.some((f) =>
      String(item[f] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const alignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      {searchFields.length > 0 && (
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 font-medium outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
            />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 font-bold text-xs uppercase tracking-wider text-slate-400 ${alignClass(col.align)}`}
                >
                  {col.sortable !== false ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className={`inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors ${
                        sortKey === col.key ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 italic">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm font-bold text-slate-400 not-italic">Cargando datos...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium not-italic">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                  {columns.map((col) => (
                    <td
                      key={`${idx}-${col.key}`}
                      className={`px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium ${alignClass(col.align)}`}
                      style={{ width: col.width }}
                    >
                      {col.render ? (
                        col.render(item, item[col.key])
                      ) : (
                        <span className="text-sm">
                          {String(item[col.key] ?? "—")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-0.5">
        <p className="text-xs text-slate-400 font-medium">
          {filtered.length === 0
            ? "Sin resultados"
            : `Mostrando ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} de ${filtered.length} registros`}
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-lg border text-xs font-bold transition-all ${
                    p === page
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-900/20"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
