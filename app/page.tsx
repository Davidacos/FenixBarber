'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Calendar, Lock, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
              BC
            </div>
            <span className="text-slate-900 dark:text-white">BeautyCRM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Características
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Precios
            </a>
            <a href="#contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Contacto
            </a>
          </nav>

          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              Iniciar sesión
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Gestiona tu negocio de belleza con facilidad
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            BeautyCRM es la solución integral para salones, barberías y estudios de tatuajes. Citas, empleados, finanzas y más, todo en un solo lugar.
          </p>

          <div className="flex gap-4">
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 h-auto text-base gap-2">
                Acceso a demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-3 h-auto text-base"
            >
              Ver demostración en vivo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Más de 500 negocios
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Seguro y confiable
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Soporte 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Características completas diseñadas para profesionales como tú
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: 'Gestión de citas',
              description: 'Calendario inteligente con confirmaciones automáticas y recordatorios',
            },
            {
              icon: Users,
              title: 'Gestión de empleados',
              description: 'Asigna especialidades, comisiones y disponibilidad de tu equipo',
            },
            {
              icon: BarChart3,
              title: 'Reportes financieros',
              description: 'Controla ingresos, gastos y rentabilidad en tiempo real',
            },
            {
              icon: Globe,
              title: 'Página pública de reservas',
              description: 'Tus clientes reservan directamente desde su navegador',
            },
            {
              icon: Lock,
              title: 'Multi-empresa',
              description: 'Gestiona varios negocios desde una sola cuenta',
            },
            {
              icon: Zap,
              title: 'Automatizaciones',
              description: 'Ahorra tiempo con recordatorios y confirmaciones automáticas',
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Empieza tu prueba gratuita hoy
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Sin tarjeta de crédito requerida. Acceso completo a todas las características por 14 días.
          </p>

          <Link href="/login">
            <Button className="bg-white hover:bg-slate-100 text-indigo-600 px-8 py-3 h-auto text-base font-bold gap-2">
              Acceder a la demo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                © 2024 BeautyCRM. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Privacidad
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Términos
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
