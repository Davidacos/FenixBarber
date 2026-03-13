'use client'

import { ReactNode, useState } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T, value: any) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchFields?: string[]
  onRowClick?: (item: T) => void
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchFields = [],
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filtrar datos
  const filteredData = data.filter((item) => {
    if (!search) return true
    return searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(search.toLowerCase())
    )
  })

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0

    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchFields.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400"
                  style={{ width: column.width }}
                >
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    {column.label}
                    {sortKey === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No hay datos</p>
                </td>
              </tr>
            ) : (
              sortedData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${idx}-${column.key}`}
                      className="px-6 py-4 text-slate-900 dark:text-slate-100"
                      style={{ width: column.width }}
                    >
                      {column.render ? column.render(item, item[column.key]) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {filteredData.length} de {data.length} registros
      </p>
    </div>
  )
}
