'use client'

import { useState, use } from 'react'
import { Calendar, Users, Clock, MapPin, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockCompanies, mockServices, mockEmployees } from '@/lib/mock-data'

export default function ReservasPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise)
  const company = mockCompanies.find(c => c.slug === params.slug)
  const [step, setStep] = useState<'servicio' | 'empleado' | 'fecha' | 'datos' | 'confirmacion'>('servicio')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{company.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              4.9
            </div>
            <p className="text-xs text-slate-500">150 valoraciones</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {step === 'servicio' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ¿Qué servicio deseas?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Elige el servicio que te gustaría reservar
              </p>
            </div>

            <div className="grid gap-3">
              {mockServices.filter(s => s.active).map(service => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id)
                    setStep('empleado')
                  }}
                  className="group text-left bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-600 p-5 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        ${service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'empleado' && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('servicio')}
                className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 font-medium"
              >
                ← Atrás
              </button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Elige a tu profesional
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                O elige cualquiera para que te atienda
              </p>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => setStep('fecha')}
                className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-4 font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cualquier profesional
              </button>

              {mockEmployees.filter(e => e.active).map(emp => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(emp.id)
                    setStep('fecha')
                  }}
                  className="text-left bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-600 p-5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{emp.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{emp.specialty}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'fecha' && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('empleado')}
                className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 font-medium"
              >
                ← Atrás
              </button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Elige fecha y hora
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Selecciona el horario que mejor te convenga
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
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
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-3">
                  Hora disponible
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(time => (
                    <button
                      key={time}
                      className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-sm font-medium transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep('datos')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 'datos' && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('fecha')}
                className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 font-medium"
              >
                ← Atrás
              </button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Tus datos
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Necesitamos tus datos de contacto para confirmar la cita
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nombre completo
                </Label>
                <Input
                  placeholder="Juan Pérez"
                  className="mt-2 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Correo electrónico
                </Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
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

              <Button
                onClick={() => setStep('confirmacion')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Confirmar cita
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmacion' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ¡Cita confirmada!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Hemos enviado los detalles a tu correo
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6 text-left space-y-3">
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-400 font-medium">Fecha y hora</p>
                <p className="text-blue-700 dark:text-blue-300">Viernes, 15 de marzo • 10:00</p>
              </div>
              <div className="border-t border-blue-200 dark:border-blue-900 pt-3">
                <p className="text-sm text-blue-900 dark:text-blue-400 font-medium">En</p>
                <p className="text-blue-700 dark:text-blue-300">{company.name}</p>
              </div>
            </div>

            <Button
              onClick={() => setStep('servicio')}
              variant="outline"
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
