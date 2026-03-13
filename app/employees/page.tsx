'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import PageHeader from '@/components/page-header'
import DataTable from '@/components/data-table'
import StatusBadge from '@/components/status-badge'
import Modal from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockEmployees } from '@/lib/mock-data'

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Empleados"
          description="Gestiona tu equipo y sus especialidades"
          actions={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo empleado
            </Button>
          }
        />

        {/* Staff Cards - Premium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <StatusBadge status={emp.active ? 'activo' : 'inactivo'} />
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{emp.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{emp.specialty}</p>

              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-800 my-4" />

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>{emp.phone}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Comisión</span>
                  <span className="font-bold text-slate-900 dark:text-white">{emp.commission}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 gap-2 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button className="p-2 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Resumen</h2>
          <DataTable
            columns={[
              { key: 'name', label: 'Nombre', width: '20%' },
              { key: 'role', label: 'Cargo', width: '18%' },
              { key: 'email', label: 'Email', width: '22%' },
              { key: 'specialty', label: 'Especialidad', width: '20%' },
              {
                key: 'commission',
                label: 'Comisión',
                width: '12%',
                render: (item, value) => <span className="font-bold">{value}%</span>,
              },
              {
                key: 'status',
                label: 'Estado',
                width: '8%',
                render: (item, value) => <StatusBadge status={value ? 'activo' : 'inactivo'} />,
              },
            ]}
            data={mockEmployees.map(emp => ({
              name: emp.name,
              role: emp.role,
              email: emp.email,
              specialty: emp.specialty,
              commission: emp.commission,
              status: emp.active,
            }))}
            searchFields={['name', 'email']}
          />
        </div>
      </main>

      {/* New Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Empleado"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nombre completo
              </Label>
              <Input
                placeholder="ej: Juan Pérez"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Cargo
              </Label>
              <Input
                placeholder="ej: Estilista"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <Input
                type="email"
                placeholder="email@ejemplo.com"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Teléfono
              </Label>
              <Input
                placeholder="+34 600 000 000"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Especialidad
              </Label>
              <Input
                placeholder="ej: Cortes y peinados"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Comisión (%)
              </Label>
              <Input
                type="number"
                placeholder="15"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Crear empleado
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
