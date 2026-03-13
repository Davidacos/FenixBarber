'use client'

import { BarChart, Users, Calendar, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import StatCard from '@/components/stat-card'
import PageHeader from '@/components/page-header'
import DataTable from '@/components/data-table'
import StatusBadge from '@/components/status-badge'
import { mockAppointments, mockServices } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const todayAppointments = mockAppointments.filter(a => a.date.toDateString() === new Date().toDateString())
  const todayRevenue = mockAppointments
    .filter(a => a.status === 'completada')
    .reduce((sum, a) => {
      const service = mockServices.find(s => s.id === a.serviceId)
      return sum + (service?.price || 0)
    }, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Dashboard"
          description="Resumen de tu negocio hoy"
          actions={
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Generar reporte
            </Button>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Citas hoy"
            value={todayAppointments.length}
            icon={<Calendar className="w-6 h-6 text-indigo-600" />}
            trend="up"
            trendPercent={12}
          />
          <StatCard
            label="Ingresos hoy"
            value={`$${todayRevenue.toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            trend="up"
            trendPercent={8}
          />
          <StatCard
            label="Empleados activos"
            value="3"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            subtext="Listos para trabajar"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Ingresos últimos 7 días</h2>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>Gráfico de barras (implementar con Recharts)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Servicios top</h2>
            <div className="space-y-3">
              {mockServices.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{service.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">5 citas</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Próximas citas</h2>
            <a href="/appointments" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Ver todas →
            </a>
          </div>

          <DataTable
            columns={[
              { key: 'clientName', label: 'Cliente', width: '25%' },
              { key: 'service', label: 'Servicio', width: '25%' },
              { key: 'time', label: 'Hora', width: '20%' },
              {
                key: 'status',
                label: 'Estado',
                width: '20%',
                render: (item, status) => <StatusBadge status={status} />,
              },
              { key: 'employee', label: 'Empleado', width: '10%' },
            ]}
            data={mockAppointments.map(a => {
              const service = mockServices.find(s => s.id === a.serviceId)
              return {
                clientName: 'Cliente ' + a.id,
                service: service?.name || 'N/A',
                time: a.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                status: a.status,
                employee: 'Empleado ' + a.employeeId,
              }
            })}
          />
        </div>
      </main>
    </div>
  )
}
