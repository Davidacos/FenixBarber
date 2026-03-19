"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "white",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img
            src="/logo-fenixbarberpro.png"
            alt="FenixBarber Pro"
            style={{
              height: 70,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

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
      <div style={{ padding: "12px 12px 0" }}>
        <button
          style={{
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
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #1B5FFF, #4F83FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Scissors size={13} color="white" />
          </div>
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
              Barbería Principal
            </div>
            <div
              style={{ fontSize: 11, color: "var(--sb-text-3)", marginTop: 1 }}
            >
              Plan Professional
            </div>
          </div>
          <ChevronDown
            size={14}
            color="var(--sb-text-3)"
            style={{ flexShrink: 0 }}
          />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px 12px" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginTop: 20 }}>
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

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 9,
                    marginBottom: 2,
                    textDecoration: "none",
                    transition: "background .15s, color .15s",
                    background: isActive ? "var(--sb-blue-lt)" : "transparent",
                    color: isActive ? "var(--sb-blue)" : "var(--sb-text-2)",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--sb-off)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--sb-navy)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--sb-text-2)";
                    }
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 18,
                        background: "var(--sb-blue)",
                        borderRadius: "0 3px 3px 0",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isActive
                        ? "rgba(27,95,255,.12)"
                        : "transparent",
                      transition: "background .15s",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={13} style={{ opacity: 0.5 }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Upgrade Banner ── */}
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = ".85")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              Ver planes <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── User footer ── */}
      <div style={{ borderTop: "1px solid var(--sb-border)", padding: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 10,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--sb-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "Sora, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
            }}
          >
            CR
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--sb-text-3)",
              padding: 4,
              borderRadius: 6,
              transition: "color .15s, background .15s",
            }}
            title="Cerrar sesión"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#FEF2F2";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--sb-text-3)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <LogOut size={15} />
          </button>
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
          width: 248,
          borderRight: "1px solid var(--sb-border)",
          background: "white",
          display: "flex",
          flexDirection: "column",
        }}
        className="sb-desktop"
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
              width: 248,
              borderRight: "1px solid var(--sb-border)",
              background: "white",
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
