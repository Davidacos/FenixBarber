"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBranch } from "@/contexts/BranchContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Coins,
  ChevronRight,
  Flame,
  Bell,
  Building2,
  ChevronDown,
  ShoppingBag,
  UserCircle2,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearDemoData } from "@/lib/api";

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/appointments", label: "Citas", icon: Calendar },
      { href: "/services", label: "Servicios", icon: Scissors },
      { href: "/employees", label: "Empleados", icon: Users },
    ],
  },
  {
    label: "Operativo",
    items: [
      { href: "/caja", label: "Caja", icon: ShoppingBag },
      { href: "/clients", label: "Clientes", icon: UserCircle2 },
      { href: "/shop", label: "Tienda Admin", icon: Store },
    ],
  },
  {
    label: "Gestión",
    items: [
      { href: "/finance", label: "Finanzas", icon: Coins },
      { href: "/branches", label: "Sedes", icon: Building2 },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/settings", label: "Configuración", icon: Settings }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { branches, activeBranch, setActiveBranchId, isLoading } = useBranch();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fenix_sidebar_collapsed');
      if (stored === 'true') {
        setCollapsed(true);
        document.documentElement.style.setProperty('--sidebar-width', '64px');
      } else {
        document.documentElement.style.setProperty('--sidebar-width', '280px');
      }
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { 
        localStorage.setItem('fenix_sidebar_collapsed', String(next));
        document.documentElement.style.setProperty('--sidebar-width', next ? '64px' : '280px');
      } catch {}
      return next;
    });
  };

  const handleLogout = async () => {
    await clearDemoData();
    router.push("/");
  };

  const SidebarContent = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--sb-bg)",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          height: 64,
          borderBottom: "1px solid var(--sb-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            collapsed && "justify-center"
          )}
          style={{ 
            width: collapsed ? '32px' : 'auto',
            opacity: 1
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Flame size={18} color="white" fill="white" />
          </div>
          {!collapsed && (
            <span className="font-black text-slate-900 dark:text-white tracking-tighter text-xl whitespace-nowrap">
              FENIX<span className="text-blue-600 font-extrabold text-lg">BARBER</span>
            </span>
          )}
        </Link>

        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="sb-mobile-close"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--sb-text-2)",
            padding: 4,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Business selector ── */}
      <div style={{ padding: "12px 12px 0", position: "relative" }}>
        {/* Click outside overlay */}
        {branchMenuOpen && (
          <div 
            onClick={() => setBranchMenuOpen(false)} 
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
          />
        )}
        <button
          onClick={() => setBranchMenuOpen(!branchMenuOpen)}
          style={{
            position: "relative",
            zIndex: 11,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--sb-off)",
            border: "1.5px solid var(--sb-border)",
            borderRadius: 10,
            padding: "9px 12px",
            cursor: "pointer",
            transition: "border-color .15s, background .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--sb-blue)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--sb-blue-lt)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--sb-border)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--sb-off)";
          }}
        >
            <div
              className={cn(
                "w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center transition-all",
                collapsed ? "mx-auto" : "shrink-0"
              )}
            >
              <Scissors size={14} color="white" />
            </div>
          {!collapsed && (
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--sb-navy)",
                  letterSpacing: "-.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isLoading ? "Cargando..." : activeBranch?.name || "Seleccionar sede"}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--sb-text-3)", marginTop: 1 }}
              >
                Plan Professional
              </div>
            </div>
          )}
          {!collapsed && (
            <ChevronDown
              size={14}
              color="var(--sb-text-3)"
              style={{ flexShrink: 0 }}
            />
          )}
        </button>

        {branchMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 12,
              right: 12,
              marginTop: 4,
              background: "white",
              border: "1px solid var(--sb-border)",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              zIndex: 20,
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div style={{ padding: "4px 8px 8px", fontSize: 10, fontWeight: 700, color: "var(--sb-text-3)", textTransform: "uppercase" }}>Tus Sedes</div>
            {branches.map(b => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBranchId(b.id);
                  setBranchMenuOpen(false);
                }}
                className={cn(
                  "text-left p-2 rounded-md font-medium text-xs transition-all",
                  b.id === activeBranch?.id 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px 12px" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginTop: 20 }}>
            {!collapsed && (
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--sb-text-3)",
                  padding: "0 8px",
                  marginBottom: 4,
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {group.label}
              </span>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group relative mb-0.5",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 13,
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                  )}
                  
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-blue-600/10 dark:bg-blue-500/10" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50"
                  )}>
                    <Icon size={16} />
                  </div>
                  
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  
                  {!collapsed && isActive && (
                    <ChevronRight size={14} className="ml-auto opacity-40" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Upgrade Banner ── */}
      {!collapsed && (
        <div style={{ padding: "0 12px 12px" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--sb-navy) 0%, #1a3a6b 100%)",
              borderRadius: 12,
              padding: "14px 14px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(27,95,255,.4)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "Sora, sans-serif",
                  marginBottom: 4,
                }}
              >
                Pasa a Enterprise
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                Desbloquea sedes ilimitadas y marca blanca.
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "var(--sb-blue)",
                  color: "white",
                  border: "none",
                  borderRadius: 7,
                  padding: "7px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  transition: "opacity .15s",
                }}
              >
                Ver planes <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Space filler when collapsed */}
      {collapsed && (
        <div className="flex-1" />
      )}

      {/* ── User footer ── */}
      <div 
        className={cn(
          "border-t border-slate-100 dark:border-slate-800",
          collapsed ? "p-3" : "p-4"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl transition-all",
            !collapsed && "p-1.5 hover:bg-slate-50"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 transition-transform",
              collapsed && "mx-auto ring-2 ring-blue-50 ring-offset-1"
            )}
            style={{ fontFamily: 'Sora' }}
          >
            CR
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--sb-navy)",
                    fontFamily: "Sora, sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Carlos Rodríguez
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--sb-text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  admin@barberia.com
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

        :root {
          --sb-navy: #0c1a3a;
          --sb-blue: #1b5fff;
          --sb-blue-lt: #ebf2ff;
          --sb-blue-md: #c7daff;
          --sb-border: #e4eaf4;
          --sb-off: #f7f9fc;
          --sb-text-2: #4a5568;
          --sb-text-3: #8896ab;
        }

        /* Scrollbar inside sidebar */
        nav::-webkit-scrollbar {
          width: 4px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: var(--sb-border);
          border-radius: 2px;
        }

        @media (min-width: 769px) {
          .sb-mobile-close {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 40,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "white",
          border: "1.5px solid var(--sb-border)",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(12,26,58,.08)",
        }}
        className="sb-hamburger"
      >
        <Menu size={18} color="var(--sb-navy)" />
      </button>

      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 30,
          height: "100vh",
          width: collapsed ? 64 : 280,
          borderRight: "1px solid var(--sb-border)",
          background: "var(--sb-bg)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
        }}
        className="sb-desktop"
        data-collapsed={collapsed ? "true" : "false"}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(12,26,58,.4)",
              zIndex: 45,
              backdropFilter: "blur(2px)",
            }}
          />
          <aside
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 50,
              height: "100vh",
              width: 280,
              borderRight: "1px solid var(--sb-border)",
              background: "var(--sb-bg)",
              boxShadow: "8px 0 32px rgba(12,26,58,.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          .sb-desktop {
            display: none !important;
          }
          .sb-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
