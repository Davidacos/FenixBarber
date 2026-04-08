'use client'

import { useState, use, useEffect } from 'react'
import { Calendar, Users, Clock, MapPin, Star, CheckCircle, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockCompanies } from '@/lib/mock-data'
import { getServices, getEmployees, createAppointment } from '@/lib/api'
import { useAppConfig } from '@/contexts/AppConfigContext'
import { toast } from 'sonner'

export default function ReservasPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise)
  const company = mockCompanies.find(c => c.slug === params.slug)
  const { formatMoney } = useAppConfig()
  
  const [step, setStep] = useState<'servicio' | 'empleado' | 'fecha' | 'datos' | 'confirmacion'>('servicio')
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [services, setServices] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [branchId, setBranchId] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    if (company) {
      // In a real app we'd fetch the default branch. Here we assume branch-1 for simplicity or find first.
      const defaultBranchId = "branch-1"; 
      setBranchId(defaultBranchId);
      
      const fetchInitial = async () => {
        const s = await getServices(company.id, defaultBranchId);
        setServices(s.filter(i => i.active));
        const e = await getEmployees(company.id, defaultBranchId);
        setEmployees(e.filter(i => i.active));
      }
      fetchInitial();
    }
  }, [company]);

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Empresa no encontrada
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            El negocio que buscas no existe o el enlace es incorrecto.
          </p>
        </div>
      </div>
    )
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    const res = await createAppointment({
      companyId: company.id,
      branchId: branchId!,
      clientId: "new", // Simplified for demo
      clientName: name,
      serviceId: selectedService.id,
      employeeId: selectedEmployee?.id || "any",
      date: new Date(`${selectedDate}T${selectedTime}`),
      status: 'pendiente'
    });

    if (res.success) {
      setStep('confirmacion');
    } else {
      toast.error("Error al agendar cita");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* ProgressBar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-900 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500" 
          style={{ width: `${(step === 'servicio' ? 20 : step === 'empleado' ? 40 : step === 'fecha' ? 60 : step === 'datos' ? 80 : 100)}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto shadow-xl shadow-indigo-500/20 mb-4">
            {company.logo}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{company.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{company.description}</p>
        </div>

        {step === 'servicio' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Selecciona un servicio</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paso 1 de 4</span>
            </div>

            <div className="grid gap-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service)
                    setStep('empleado')
                  }}
                  className="group relative flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none p-5 rounded-2xl transition-all"
                >
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12}/> {service.duration} min</span>
                      <span className="flex items-center gap-1 font-bold text-indigo-600">{formatMoney(service.price)}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'empleado' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center justify-between">
             <button onClick={() => setStep('servicio')} className="text-sm font-bold text-indigo-600 flex items-center gap-1">← Atrás</button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paso 2 de 4</span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">¿Con quién deseas tu cita?</h2>

            <div className="grid gap-3">
              <button
                onClick={() => { setSelectedEmployee(null); setStep('fecha'); }}
                className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Users size={18}/></div>
                Cualquier profesional disponible
              </button>

              {employees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(emp)
                    setStep('fecha')
                  }}
                  className="group flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-4 rounded-2xl transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-lg font-bold">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{emp.name}</h3>
                    <p className="text-xs text-slate-500">{emp.specialty}</p>
                  </div>
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'fecha' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('empleado')} className="text-sm font-bold text-indigo-600">← Atrás</button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paso 3 de 4</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fecha y Hora</h2>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Fecha de la cita</Label>
                <Input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Horarios disponibles</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedTime === t 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('datos')}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 'datos' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('fecha')} className="text-sm font-bold text-indigo-600">← Atrás</button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paso 4 de 4</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Últimos detalles</h2>

            <form onSubmit={handleConfirmOrder} className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 mb-4">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Resumen de reserva</p>
                <div className="flex justify-between items-end">
                   <div>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedService.name}</p>
                    <p className="text-xs text-slate-500">{selectedDate} a las {selectedTime} con {selectedEmployee?.name || "Cualquiera"}</p>
                   </div>
                   <span className="font-black text-indigo-700 dark:text-indigo-300">{formatMoney(selectedService.price)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Nombre completo</Label>
                  <Input name="name" required placeholder="Ej. Juan Pérez" className="rounded-xl border-slate-200" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Email</Label>
                    <Input name="email" type="email" required placeholder="tu@email.com" className="rounded-xl border-slate-200" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Teléfono</Label>
                    <Input name="phone" required placeholder="+57 300..." className="rounded-xl border-slate-200" />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-500/30 mt-4 active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : "AGENDAR AHORA"}
              </Button>
              <p className="text-[10px] text-center text-slate-400 mt-2">Al confirmar, aceptas nuestras políticas de reserva.</p>
            </form>
          </div>
        )}

        {step === 'confirmacion' && (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¡Cita Agendada!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Tu reserva ha sido procesada con éxito. Te esperamos el {selectedDate} a las {selectedTime}.</p>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-left shadow-xl shadow-slate-200/50 dark:shadow-none mb-8">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detalles del ticket</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Servicio</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Profesional</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedEmployee?.name || "Asignado"}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-bold">Total</span>
                    <span className="font-black text-indigo-600">{formatMoney(selectedService.price)}</span>
                  </div>
               </div>
            </div>

            <Button
              onClick={() => {
                setStep('servicio');
                setSelectedService(null);
                setSelectedEmployee(null);
                setSelectedDate('');
                setSelectedTime('');
              }}
              className="w-full h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-700"
            >
              Realizar otra reserva
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
