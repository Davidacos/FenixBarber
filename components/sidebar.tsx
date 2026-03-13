'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, BarChart3, Users, Calendar, Settings, LogOut, Menu, LayoutDashboard, Scissors, Coins } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/services', label: 'Servicios', icon: Scissors },
  { href: '/employees', label: 'Empleados', icon: Users },
  { href: '/appointments', label: 'Citas', icon: Calendar },
  { href: '/finance', label: 'Finanzas', icon: Coins },
  { href: '/settings', label: 'Configuración', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6">
            <Link href="/dashboard" className="flex items-center gap-3 font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                BC
              </div>
              <span className="text-slate-900 dark:text-white">BeautyCRM</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
