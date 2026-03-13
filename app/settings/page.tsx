'use client'

import { useState } from 'react'
import { Save, Copy, Check } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import PageHeader from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCompanies } from '@/lib/mock-data'

const company = mockCompanies[0]

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 md:ml-64">
        <PageHeader
          title="Configuración"
          description="Personaliza tu negocio y preferencias"
        />

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="border-b border-slate-200 dark:border-slate-800 rounded-none">
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="reservas">Reservas públicas</TabsTrigger>
            <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          </TabsList>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Información de la empresa</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nombre de la empresa
                    </Label>
                    <Input
                      defaultValue={company.name}
                      className="mt-2 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </Label>
                    <Input
                      type="email"
                      defaultValue={company.email}
                      className="mt-2 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Teléfono
                    </Label>
                    <Input
                      defaultValue={company.phone}
                      className="mt-2 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Slug para reservas
                    </Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        defaultValue={company.slug}
                        readOnly
                        className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCopy(`/reservas/${company.slug}`)}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Descripción
                  </Label>
                  <Textarea
                    defaultValue={company.description}
                    className="mt-2 border-slate-200 dark:border-slate-800"
                    rows={4}
                  />
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personalización visual</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Color principal
                    </Label>
                    <div className="mt-2 flex gap-3 items-center">
                      <input
                        type="color"
                        defaultValue={company.primaryColor}
                        className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                      />
                      <Input
                        defaultValue={company.primaryColor}
                        className="border-slate-200 dark:border-slate-800 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Color secundario
                    </Label>
                    <div className="mt-2 flex gap-3 items-center">
                      <input
                        type="color"
                        defaultValue={company.secondaryColor}
                        className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                      />
                      <Input
                        defaultValue={company.secondaryColor}
                        className="border-slate-200 dark:border-slate-800 flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-4">
                    Tema visual
                  </Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        defaultChecked
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Claro</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Oscuro</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="auto"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Automático</span>
                    </label>
                  </div>
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Guardar branding
                </Button>
              </form>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Vista previa</h2>
              <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400">Preview del branding</p>
              </div>
            </div>
          </TabsContent>

          {/* Reservas públicas Tab */}
          <TabsContent value="reservas" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Página de reservas pública</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Tu URL pública</h3>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`https://beautycRM.com/reservas/${company.slug}`}
                      className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(`https://beautycRM.com/reservas/${company.slug}`)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Comparte este enlace con tus clientes para que reserven directamente
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Switch defaultChecked />
                    Habilitar reservas públicas
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Permite que clientes hagan reservas sin crear cuenta
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Switch defaultChecked />
                    Requerir confirmación por email
                  </Label>
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Guardar configuración
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Cuenta Tab */}
          <TabsContent value="cuenta" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Seguridad de cuenta</h2>

              <form className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Contraseña actual
                  </Label>
                  <Input
                    type="password"
                    className="mt-2 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nueva contraseña
                  </Label>
                  <Input
                    type="password"
                    className="mt-2 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirmar contraseña
                  </Label>
                  <Input
                    type="password"
                    className="mt-2 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Cambiar contraseña
                </Button>
              </form>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-6">
              <h3 className="text-sm font-bold text-red-900 dark:text-red-400 mb-2">Zona de peligro</h3>
              <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                Esta acción no se puede deshacer. Asegúrate de que quieres eliminar tu cuenta.
              </p>
              <Button variant="destructive">
                Eliminar cuenta
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
