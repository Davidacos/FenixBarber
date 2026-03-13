'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockAppointments, mockServices, mockEmployees, mockClients } from '@/lib/mock-data'

const statusOptions = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'confirmada', name: 'Confirmada' },
  { id: 'completada', name: 'Completada' },
  { id: 'cancelada', name: 'Cancelada' },
  { id: 'no-asistio', name: 'No asistió' },
]

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'tabla' | 'calendario'>('tabla')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Citas"
          description="Administra el calendario de citas de tu negocio"
          actions={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva cita
            </Button>
          }
        />

        {/* View Mode Tabs */}
        <div className="mb-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'tabla' | 'calendario')}>
            <TabsList className="border-b border-slate-200 dark:border-slate-800 rounded-none">
              <TabsTrigger value="tabla">Tabla</TabsTrigger>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
            </TabsList>

            <TabsContent value="tabla" className="mt-6">
              {/* Calendar View */}
              <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
                <DataTable
                  columns={[
                    { key: 'client', label: 'Cliente', width: '20%' },
                    { key: 'service', label: 'Servicio', width: '20%' },
                    { key: 'employee', label: 'Empleado', width: '18%' },
                    { key: 'date', label: 'Fecha y hora', width: '18%' },
                    {
                      key: 'duration',
                      label: 'Duración',
                      width: '12%',
                      render: (item, value) => (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {value}
                        </div>
                      ),
                    },
                    {
                      key: 'status',
                      label: 'Estado',
                      width: '12%',
                      render: (item, status) => <StatusBadge status={status} />,
                    },
                  ]}
                  data={mockAppointments.map(apt => {
                    const service = mockServices.find(s => s.id === apt.serviceId)
                    const employee = mockEmployees.find(e => e.id === apt.employeeId)
                    return {
                      client: 'Cliente ' + apt.clientId,
                      service: service?.name || 'N/A',
                      employee: employee?.name || 'N/A',
                      date: apt.date.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                      duration: `${apt.duration} min`,
                      status: apt.status,
                    }
                  })}
                  searchFields={['client', 'service']}
                />
              </div>
            </TabsContent>

            <TabsContent value="calendario" className="mt-6">
              <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
                <div className="h-96 flex items-center justify-center text-slate-400">
                  <p>Vista de calendario (implementar con React Calendar)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* New Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Cita"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Cliente
              </Label>
              <Select>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Servicio
              </Label>
              <Select>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Empleado
              </Label>
              <Select>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Estado
              </Label>
              <Select>
                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Observaciones
            </Label>
            <Textarea
              placeholder="Notas adicionales..."
              className="mt-2 border-slate-200 dark:border-slate-800"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Crear cita
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
