'use client'

import { useState } from 'react'
import { Save, Copy, Check, Globe, CreditCard } from 'lucide-react'
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
import { useAppConfig, CURRENCIES } from '@/contexts/AppConfigContext'
import { toast } from 'sonner'

const company = mockCompanies[0]

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const { currency, setCurrency } = useAppConfig()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <Topbar />

      <main className="pt-24 pb-12 px-4 md:px-8 transition-all" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title="Configuración"
          description="Personaliza tu negocio y preferencias"
        />

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="border-b border-slate-200 dark:border-slate-800 rounded-none bg-transparent">
            <TabsTrigger 
              value="empresa"
              className="data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:border-slate-900 dark:data-[state=active]:border-white border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Empresa
            </TabsTrigger>
            <TabsTrigger 
              value="branding"
              className="data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:border-slate-900 dark:data-[state=active]:border-white border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Branding
            </TabsTrigger>
            <TabsTrigger 
              value="preferencias"
              className="data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:border-slate-900 dark:data-[state=active]:border-white border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Preferencias
            </TabsTrigger>
            <TabsTrigger 
              value="reservas"
              className="data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:border-slate-900 dark:data-[state=active]:border-white border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Reservas públicas
            </TabsTrigger>
            <TabsTrigger 
              value="cuenta"
              className="data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:border-slate-900 dark:data-[state=active]:border-white border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Cuenta
            </TabsTrigger>
          </TabsList>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Información de la empresa</h2>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success("Información actualizada"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
                      Nombre de la empresa
                    </Label>
                    <Input
                      defaultValue={company.name}
                      className="mt-2 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
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
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
                      Teléfono
                    </Label>
                    <Input
                      defaultValue={company.phone}
                      className="mt-2 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
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
                        onClick={() => handleCopy(`${window.location.origin}/reservas/${company.slug}`)}
                        className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-100"
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

                <Button type="submit" className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white gap-2">
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
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
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
                        className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-100">
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
                        className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Button className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Guardar branding
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Preferencias Tab */}
          <TabsContent value="preferencias" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Localización y Moneda</h2>
              </div>
              
              <div className="space-y-6">
                <div className="max-w-md">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-100 mb-2 block">
                    Moneda del Sistema
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Selecciona la moneda principal para tus cobros y reportes financieros.</p>
                  <div className="grid grid-cols-1 gap-2">
                    {CURRENCIES.map((cur) => (
                      <button
                        key={cur.code}
                        onClick={() => {
                          setCurrency(cur);
                          toast.success(`Moneda cambiada a ${cur.name}`);
                        }}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          currency.code === cur.code
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                            {cur.symbol}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{cur.code}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{cur.name}</p>
                          </div>
                        </div>
                        {currency.code === cur.code && <Check className="w-5 h-5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reservas públicas Tab */}
          <TabsContent value="reservas" className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Página de reservas pública</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-100 mb-3">Tu URL pública</h3>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/reservas/${company.slug}`}
                      className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(`${window.location.origin}/reservas/${company.slug}`)}
                      className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-100"
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
                </div>

                <Button className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white gap-2">
                  <Save className="w-4 h-4" />
                  Guardar configuración
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Cuenta Tab */}
          <TabsContent value="cuenta" className="space-y-6">
            {/* ... simplified ... */}
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Seguridad</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Opciones de seguridad de tu cuenta.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

