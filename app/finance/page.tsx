'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import PageHeader from '@/components/page-header'
import DataTable from '@/components/data-table'
import StatCard from '@/components/stat-card'
import Modal from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockTransactions } from '@/lib/mock-data'

const expenseCategories = [
  { id: 'suministros', name: 'Suministros' },
  { id: 'mantenimiento', name: 'Mantenimiento' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'salarios', name: 'Salarios' },
  { id: 'otros', name: 'Otros' },
]

export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<'ingreso' | 'gasto'>('ingreso')

  const totalIncome = mockTransactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Finanzas"
          description="Gestiona ingresos y gastos de tu negocio"
          actions={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo movimiento
            </Button>
          }
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total de ingresos"
            value={`$${totalIncome.toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            trend="up"
            trendPercent={15}
          />
          <StatCard
            label="Total de gastos"
            value={`$${totalExpenses.toFixed(2)}`}
            icon={<TrendingDown className="w-6 h-6 text-red-600" />}
            trend="down"
            trendPercent={5}
          />
          <StatCard
            label="Utilidad"
            value={`$${balance.toFixed(2)}`}
            icon={
              <div className="text-2xl font-bold">
                {balance > 0 ? '✓' : '×'}
              </div>
            }
            trend={balance > 0 ? 'up' : 'down'}
            trendPercent={Math.abs(((balance / totalIncome) * 100).toFixed(0)) as any}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Ingresos vs Gastos</h2>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <p>Gráfico comparativo (implementar con Recharts)</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Movimientos</h2>

            <div className="w-full sm:w-80">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Filtrar por tipo
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ingresos">Ingresos</SelectItem>
                  <SelectItem value="gastos">Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            columns={[
              {
                key: 'type',
                label: 'Tipo',
                width: '12%',
                render: (item, type) => (
                  <div className={`flex items-center gap-2 font-medium ${
                    type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {type === 'ingreso' ? (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Ingreso
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4" />
                        Gasto
                      </>
                    )}
                  </div>
                ),
              },
              { key: 'description', label: 'Descripción', width: '30%' },
              { key: 'category', label: 'Categoría', width: '20%' },
              { key: 'date', label: 'Fecha', width: '18%' },
              {
                key: 'amount',
                label: 'Monto',
                width: '15%',
                render: (item, value, type) => (
                  <span className={`font-bold ${
                    item.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.type === 'ingreso' ? '+' : '-'}${value.toFixed(2)}
                  </span>
                ),
              },
            ]}
            data={mockTransactions.map(t => ({
              type: t.type,
              description: t.description,
              category: t.category,
              date: t.date.toLocaleDateString('es-ES'),
              amount: t.amount,
            }))}
            searchFields={['description', 'category']}
          />
        </div>
      </main>

      {/* New Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Movimiento"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipo de movimiento
              </Label>
              <Select value={transactionType} onValueChange={(v) => setTransactionType(v as 'ingreso' | 'gasto')}>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="gasto">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Categoría
              </Label>
              <Select>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Descripción
              </Label>
              <Input
                placeholder="ej: Compra de productos"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Monto ($)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Fecha
              </Label>
              <Input
                type="date"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Hora
              </Label>
              <Input
                type="time"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Notas
            </Label>
            <Textarea
              placeholder="Detalles adicionales..."
              className="mt-2 border-slate-200 dark:border-slate-800"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Registrar movimiento
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
