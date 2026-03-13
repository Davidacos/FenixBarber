'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Navegar al dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold">
              BC
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
            BeautyCRM
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-8">
            Gestiona tu negocio de belleza profesionalmente
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company ID */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                ID de compañía
              </Label>
              <Input
                placeholder="ej: salon-premium"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                El slug único asignado a tu empresa
              </p>
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo electrónico
              </Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-slate-600 dark:text-slate-400">Recuérdame</span>
              </label>
              <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 h-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-500 dark:text-slate-400">O</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-sm">
            <p className="text-blue-900 dark:text-blue-400">
              <strong>Demo:</strong> Usar compañía <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">salon-premium</code> para probar
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            ¿Eres nuevo?{' '}
            <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Solicita acceso
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            Seguro
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            Rápido
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            Confiable
          </div>
        </div>
      </div>
    </div>
  )
}
