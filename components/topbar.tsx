"use client";

import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  CheckCircle2,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Resumen general de tu negocio",
  },
  "/appointments": { title: "Citas", description: "Agenda y gestión de citas" },
  "/services": { title: "Servicios", description: "Catálogo de servicios" },
  "/employees": { title: "Empleados", description: "Gestión del equipo" },
  "/finance": { title: "Finanzas", description: "Ingresos, gastos y reportes" },
  "/branches": { title: "Sedes", description: "Gestión de sucursales" },
  "/settings": { title: "Configuración", description: "Ajustes de tu cuenta" },
};

const notifications = [
  {
    id: 1,
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    bg: "bg-emerald-50",
    text: "Cita completada",
    sub: "Carlos M. — Corte + Barba",
    time: "hace 5 min",
  },
  {
    id: 2,
    icon: Calendar,
    iconClass: "text-blue-600",
    bg: "bg-blue-50",
    text: "Nueva cita",
    sub: "Pedro L. — Diseño de barba",
    time: "hace 18 min",
  },
  {
    id: 3,
    icon: DollarSign,
    iconClass: "text-amber-600",
    bg: "bg-amber-50",
    text: "Pago recibido",
    sub: "$85,000 — Luis Rodríguez",
    time: "hace 32 min",
  },
];

export default function Topbar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const meta = Object.entries(routeMeta).find(
    ([path]) => pathname === path || pathname.startsWith(path + "/"),
  )?.[1] ?? { title: "Dashboard", description: "Bienvenido a FenixBarberPro" };

  const closeAll = () => {
    setNotifOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      {/* Click-outside layer */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-10" onClick={closeAll} />
      )}

      <header 
        className="fixed top-0 right-0 z-20 h-16 bg-white dark:bg-[#0c111d] border-b border-slate-200 dark:border-slate-800 flex items-center px-5 gap-4 justify-between transition-all duration-200"
        style={{ left: 'var(--sidebar-width)' }}
      >
        {/* Left – page title */}
        <div className="min-w-0 hidden md:block">
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
            {meta.title}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden lg:block">
            {meta.description}
          </p>
        </div>

        {/* Center – search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar citas, clientes, servicios..."
            className="w-full h-9 pl-9 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-xs font-medium placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:bg-white dark:focus:bg-slate-900"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 text-xs font-mono leading-none">
            ⌘K
          </kbd>
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications */}
          <div className="relative z-20">
            <button
              onClick={() => {
                setNotifOpen((o) => !o);
                setProfileOpen(false);
              }}
              className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                notifOpen
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>

            {notifOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Notificaciones
                  </span>
                  <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    Marcar todo leído
                  </button>
                </div>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.bg}`}
                      >
                        <Icon className={`w-4 h-4 ${n.iconClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {n.text}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {n.sub}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap mt-0.5 shrink-0">
                        {n.time}
                      </span>
                    </div>
                  );
                })}
                <div className="p-3">
                  <button className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Settings shortcut */}
          <Link href="/settings">
            <button className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Profile */}
          <div className="relative z-20">
            <button
              onClick={() => {
                setProfileOpen((o) => !o);
                setNotifOpen(false);
              }}
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border transition-all ${
                profileOpen
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                CR
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Carlos R.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Administrador</p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    Carlos Rodríguez
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    admin@barberia.com
                  </p>
                </div>
                {[
                  { label: "Mi perfil", href: "/profile" },
                  { label: "Configuración", href: "/settings" },
                  { label: "Cambiar negocio", href: "/branches" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} onClick={closeAll}>
                    <div className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors">
                      {item.label}
                    </div>
                  </Link>
                ))}
                <div className="border-t border-slate-100">
                  <button className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
