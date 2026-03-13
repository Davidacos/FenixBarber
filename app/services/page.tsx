'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import PageHeader from '@/components/page-header'
import DataTable from '@/components/data-table'
import StatusBadge from '@/components/status-badge'
import Modal from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockServices } from '@/lib/mock-data'

const categories = [
  { id: 'belleza', name: 'Belleza' },
  { id: 'barberia', name: 'Barbería' },
  { id: 'tattoo', name: 'Tatuajes' },
  { id: 'estetica', name: 'Estética' },
]

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const filteredServices = selectedCategory
    ? mockServices.filter(s => s.category === selectedCategory)
    : mockServices

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Servicios"
          description="Gestiona los servicios que ofrece tu negocio"
          actions={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo servicio
            </Button>
          }
        />

        {/* Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Filtrar por categoría
            </Label>
            <Select value={selectedCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? '' : v)}>
              <SelectTrigger className="border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <DataTable
            columns={[
              { key: 'name', label: 'Nombre', width: '25%' },
              { key: 'description', label: 'Descripción', width: '25%' },
              { key: 'duration', label: 'Duración', width: '15%' },
              { key: 'price', label: 'Precio', width: '15%' },
              {
                key: 'active',
                label: 'Estado',
                width: '12%',
                render: (item, value) => (
                  <StatusBadge status={value ? 'activo' : 'inactivo'} />
                ),
              },
              {
                key: 'actions',
                label: 'Acciones',
                width: '8%',
                render: () => (
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredServices.map(s => ({
              name: s.name,
              description: s.description,
              duration: `${s.duration} min`,
              price: `$${s.price.toFixed(2)}`,
              active: s.active,
              actions: null,
            }))}
            searchFields={['name', 'description']}
          />
        </div>
      </main>

      {/* New Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Servicio"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nombre del servicio
              </Label>
              <Input
                placeholder="ej: Corte de cabello"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
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
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Descripción
            </Label>
            <Textarea
              placeholder="Describe el servicio..."
              className="mt-2 border-slate-200 dark:border-slate-800"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Duración (minutos)
              </Label>
              <Input
                type="number"
                placeholder="30"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Precio ($)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="25.00"
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Crear servicio
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
