'use client'

import { Bell, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Topbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getTitle = (path: string) => {
    if (path.startsWith('/services')) return 'Servicios'
    if (path.startsWith('/employees')) return 'Empleados'
    if (path.startsWith('/appointments')) return 'Citas'
    if (path.startsWith('/finance')) return 'Finanzas'
    if (path.startsWith('/settings')) return 'Configuración'
    if (path.startsWith('/reservas')) return 'Página de Reservas'
    return 'Dashboard'
  }

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Título dinámico */}
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{getTitle(pathname)}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Bienvenido a BeautyCRM</p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          )}

          <Link href="/profile" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
