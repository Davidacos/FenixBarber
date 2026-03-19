"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  Lock,
  Zap,
  Globe,
  Star,
  Check,
  ChevronDown,
  Flame,
  Shield,
  Clock,
  TrendingUp,
  Smartphone,
  MessageSquare,
  CreditCard,
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Building2,
  Sparkles,
  LayoutDashboard,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);

  // ── Mouse parallax + particle canvas ──────────────────────────
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothRef = useRef({ x: 0.5, y: 0.5 });
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle state lives in a ref so it doesn't cause re-renders
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number }[]
  >([]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Initialise / resize particles
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const count = Math.floor((w * h) / 14000); // density
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 1,
    }));
  }, []);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const section = heroRef.current;
    if (!canvas || !section) return;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    initParticles();
  }, [initParticles]);

  const tick = useCallback(() => {
    const s = smoothRef.current;
    const m = mouseRef.current;
    s.x = lerp(s.x, m.x, 0.06);
    s.y = lerp(s.y, m.y, 0.06);

    const dx = (s.x - 0.5) * 2;
    const dy = (s.y - 0.5) * 2;

    // Orb parallax
    if (orb1Ref.current)
      orb1Ref.current.style.transform = `translate(${dx * 40}px, ${dy * 30}px)`;
    if (orb2Ref.current)
      orb2Ref.current.style.transform = `translate(${dx * -28}px, ${dy * -22}px)`;
    if (orb3Ref.current)
      orb3Ref.current.style.transform = `translate(${dx * 18}px, ${dy * 14}px)`;

    // Dashboard 3-D tilt
    if (frameRef.current) {
      frameRef.current.style.transform = `perspective(1200px) rotateX(${dy * -5}deg) rotateY(${dx * 7}deg) translateZ(0)`;
    }

    // ── Particle canvas ──────────────────────────────────────────
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const W = canvas.width;
      const H = canvas.height;
      const mx = s.x * W; // smooth mouse in px
      const my = s.y * H;
      const maxDist = 130;
      const repelDist = 90;
      const repelStr = 0.6;

      ctx.clearRect(0, 0, W, H);

      const pts = particlesRef.current;
      for (const p of pts) {
        // Mouse repulsion
        const ex = p.x - mx;
        const ey = p.y - my;
        const ed = Math.sqrt(ex * ex + ey * ey);
        if (ed < repelDist && ed > 0) {
          const f = (repelDist - ed) / repelDist;
          p.vx += (ex / ed) * f * repelStr;
          p.vy += (ey / ed) * f * repelStr;
        }

        // Damping + move
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(27,95,255,0.35)";
        ctx.fill();
      }

      // Draw connection lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const lx = pts[i].x - pts[j].x;
          const ly = pts[i].y - pts[j].y;
          const d = Math.sqrt(lx * lx + ly * ly);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(27,95,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }
    // ─────────────────────────────────────────────────────────────

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const onHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  const onHeroMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0.5, y: 0.5 };
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [tick, resizeCanvas]);
  // ────────────────────────────────────────────────────────────────

  const plans = [
    {
      name: "Starter",
      monthly: 29,
      annual: 23,
      description: "Para negocios que están comenzando",
      features: [
        "1 sede",
        "Hasta 3 empleados",
        "Agenda de citas",
        "Recordatorios WhatsApp",
        "Perfil público de reservas",
        "Reportes básicos",
        "Soporte por email",
      ],
      cta: "Empezar gratis",
      popular: false,
    },
    {
      name: "Professional",
      monthly: 69,
      annual: 55,
      description: "Para negocios en crecimiento",
      features: [
        "Hasta 3 sedes",
        "Empleados ilimitados",
        "Gestión de comisiones",
        "Inventario y productos",
        "Pagos en línea",
        "Reportes avanzados",
        "Programa de lealtad",
        "Soporte prioritario 24/7",
      ],
      cta: "Iniciar prueba gratis",
      popular: true,
    },
    {
      name: "Enterprise",
      monthly: 149,
      annual: 119,
      description: "Para cadenas y franquicias",
      features: [
        "Sedes ilimitadas",
        "Multi-franquicia",
        "API personalizada",
        "Marca blanca (white-label)",
        "Panel central consolidado",
        "Integración con POS",
        "Onboarding personalizado",
        "Gerente de cuenta dedicado",
      ],
      cta: "Hablar con ventas",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "¿Puedo usar FenixBarberPro sin tarjeta de crédito?",
      a: "Sí. Ofrecemos 14 días de prueba gratuita con acceso completo al plan Professional. No pedimos datos de pago hasta que decidas continuar.",
    },
    {
      q: "¿Qué tipos de negocios pueden usar la plataforma?",
      a: "FenixBarberPro está diseñado para barberías, salones de belleza, estudios de tatuajes, centros de estética, spas y cualquier negocio de servicios personales.",
    },
    {
      q: "¿Cómo funciona la agenda en línea para clientes?",
      a: "Cada negocio recibe una URL pública personalizada donde los clientes pueden ver servicios, disponibilidad y reservar directamente, sin apps adicionales.",
    },
    {
      q: "¿Puedo migrar mis datos desde otro sistema?",
      a: "Sí. Nuestro equipo te ayuda a importar clientes, historial y servicios desde Excel, CSV o sistemas como Fresha, Acuity o SimplyBook.",
    },
    {
      q: "¿Los recordatorios de WhatsApp tienen costo adicional?",
      a: "En el plan Starter incluimos 200 mensajes/mes. En Professional y Enterprise los mensajes son ilimitados.",
    },
    {
      q: "¿Puedo cambiar de plan cuando quiera?",
      a: "Sí, puedes subir o bajar de plan en cualquier momento. Los cambios se aplican de inmediato y el cobro se proratea automáticamente.",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Agenda inteligente",
      description:
        "Calendario por empleado con confirmaciones automáticas y recordatorios vía WhatsApp. Reduce ausencias hasta un 70%.",
    },
    {
      icon: Users,
      title: "Gestión de equipo",
      description:
        "Asigna servicios, comisiones y horarios. Métricas individuales de desempeño en tiempo real.",
    },
    {
      icon: BarChart3,
      title: "Finanzas y reportes",
      description:
        "Dashboard financiero con ingresos, gastos, comisiones y caja diaria. Exporta en PDF o Excel.",
    },
    {
      icon: Globe,
      title: "Reservas en línea 24/7",
      description:
        "Tu propio microsite con tu logo y colores. Clientes reservan sin llamarte, a cualquier hora.",
    },
    {
      icon: CreditCard,
      title: "Cobros integrados",
      description:
        "Acepta pagos digitales, genera facturas y registra propinas. Compatible con efectivo, tarjeta y PSE.",
    },
    {
      icon: TrendingUp,
      title: "Programa de lealtad",
      description:
        "Sistema de puntos y membresías para fidelizar clientes y aumentar el ticket promedio.",
    },
    {
      icon: MessageSquare,
      title: "Marketing automático",
      description:
        "Campañas de reactivación, cumpleaños y promociones enviadas automáticamente por WhatsApp.",
    },
    {
      icon: Building2,
      title: "Multi-sede",
      description:
        "Gestiona todas tus sedes desde una cuenta. Panel central con vista consolidada de tu operación.",
    },
    {
      icon: Smartphone,
      title: "App móvil",
      description:
        "Control total desde tu celular. Disponible para iOS y Android con notificaciones en tiempo real.",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Herrera",
      role: "Dueño — Barbería La Navaja",
      city: "Medellín",
      initials: "CH",
      stars: 5,
      text: 'Las citas "no show" bajaron un 70%. Los recordatorios automáticos son un salvavidas. Recuperé 3 horas diarias que perdía en llamadas.',
    },
    {
      name: "Valentina Ríos",
      role: "Directora — Studio V Beauty",
      city: "Bogotá",
      initials: "VR",
      stars: 5,
      text: "Manejo 4 salones desde una sola pantalla. Los reportes financieros me dieron claridad total sobre cuál sede era más rentable.",
    },
    {
      name: "Diego Montoya",
      role: "Fundador — Ink & Soul Tattoo",
      city: "Cali",
      initials: "DM",
      stars: 5,
      text: "El perfil público de reservas es increíble. Mis clientes reservan de madrugada, yo llego y la agenda ya está llena.",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");
        :root {
          --navy: #0c1a3a;
          --blue: #1b5fff;
          --blue-h: #1450e0;
          --blue-lt: #ebf2ff;
          --blue-md: #c7daff;
          --border: #e4eaf4;
          --border-2: #d0dbee;
          --text: #0c1a3a;
          --text-2: #4a5568;
          --text-3: #8896ab;
          --white: #ffffff;
          --off: #f7f9fc;
          --shadow-sm: 0 1px 3px rgba(12, 26, 58, 0.06);
          --shadow:
            0 4px 16px rgba(12, 26, 58, 0.08), 0 1px 4px rgba(12, 26, 58, 0.04);
          --shadow-lg:
            0 16px 48px rgba(12, 26, 58, 0.12),
            0 4px 16px rgba(12, 26, 58, 0.06);
          --shadow-blue: 0 8px 32px rgba(27, 95, 255, 0.24);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background: var(--white);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        h1,
        h2,
        h3,
        h4 {
          font-family: "Sora", sans-serif;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--blue);
          color: white;
          font-family: "Sora", sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition:
            background 0.18s,
            transform 0.18s,
            box-shadow 0.18s;
          box-shadow: var(--shadow-blue);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: var(--blue-h);
          transform: translateY(-1px);
          box-shadow: 0 12px 36px rgba(27, 95, 255, 0.32);
        }
        .btn-primary.lg {
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: var(--text);
          font-family: "Sora", sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 10px;
          border: 1.5px solid var(--border-2);
          cursor: pointer;
          text-decoration: none;
          transition:
            border-color 0.18s,
            background 0.18s,
            transform 0.18s;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .btn-secondary:hover {
          border-color: var(--blue);
          background: var(--blue-lt);
          transform: translateY(-1px);
        }
        .btn-secondary.lg {
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue-lt);
          color: var(--blue);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid var(--blue-md);
        }
        .section-label {
          font-family: "Sora", sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 14px;
          display: block;
        }

        .feat-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          transition:
            border-color 0.2s,
            box-shadow 0.2s,
            transform 0.2s;
        }
        .feat-card:hover {
          border-color: var(--blue);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--blue-lt);
          border: 1px solid var(--blue-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .plan-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          transition:
            box-shadow 0.2s,
            transform 0.2s;
        }
        .plan-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .plan-card.popular {
          border-color: var(--blue);
          box-shadow:
            0 0 0 4px rgba(27, 95, 255, 0.08),
            var(--shadow);
        }

        .testi-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          transition:
            box-shadow 0.2s,
            transform 0.2s;
        }
        .testi-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-3px);
        }

        .faq-row {
          border-bottom: 1px solid var(--border);
        }
        .faq-row:last-child {
          border-bottom: none;
        }

        .toggle {
          width: 46px;
          height: 26px;
          border-radius: 13px;
          background: var(--border-2);
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.25s;
          flex-shrink: 0;
        }
        .toggle.on {
          background: var(--blue);
        }
        .toggle::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.25s;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
        .toggle.on::after {
          transform: translateX(20px);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--blue);
          color: white;
          font-family: "Sora", sans-serif;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .browser-chrome {
          background: #f0f4f8;
          border-radius: 12px 12px 0 0;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border);
        }
        .browser-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .browser-bar {
          flex: 1;
          height: 24px;
          background: white;
          border-radius: 6px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 11px;
          color: var(--text-3);
          gap: 6px;
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(27, 95, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27, 95, 255, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(
            ellipse 80% 60% at 50% 0%,
            black 20%,
            transparent 100%
          );
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .anim-1 {
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .anim-2 {
          animation: fadeUp 0.6s ease 0.22s both;
        }
        .anim-3 {
          animation: fadeUp 0.6s ease 0.36s both;
        }
        .anim-4 {
          animation: fadeUp 0.6s ease 0.5s both;
        }
        .float {
          animation: floatY 5s ease-in-out infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--off);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border-2);
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .hide-m {
            display: none !important;
          }
          .show-m {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .show-m {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
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
                height: 55,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <nav
            className="hide-m"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {[
              ["Características", "#características"],
              ["Precios", "#precios"],
              ["Testimonios", "#testimonios"],
              ["FAQ", "#faq"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-2)",
                  textDecoration: "none",
                  transition: "color .15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "var(--blue)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color =
                    "var(--text-2)")
                }
              >
                {l}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              className="hide-m"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-2)",
                textDecoration: "none",
                transition: "color .15s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--blue)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--text-2)")
              }
            >
              Iniciar sesión
            </Link>
            <Link href="/register">
              <button
                className="btn-primary"
                style={{ fontSize: 13, padding: "10px 20px" }}
              >
                Prueba gratis <ArrowRight size={14} />
              </button>
            </Link>
            <button
              className="show-m"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                padding: 4,
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "white",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <img
              src="/logo-fenixbarberpro.png"
              alt="FenixBarber Pro"
              style={{
                height: 32,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={22} />
            </button>
          </div>
          {[
            ["Características", "#características"],
            ["Precios", "#precios"],
            ["Testimonios", "#testimonios"],
            ["FAQ", "#faq"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 22,
                fontFamily: "Sora,sans-serif",
                fontWeight: 700,
                color: "var(--text)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {l}
            </a>
          ))}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Link href="/login">
              <button
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Iniciar sesión
              </button>
            </Link>
            <Link href="/register">
              <button
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Prueba gratis <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--white)",
          paddingTop: 96,
          paddingBottom: 0,
        }}
      >
        {/* Particle canvas background */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Parallax orb layer 1 — slow, large, front */}
        <div
          ref={orb1Ref}
          style={{
            position: "absolute",
            top: "5%",
            left: "55%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(27,95,255,.13) 0%, transparent 68%)",
            pointerEvents: "none",
            willChange: "transform",
            transition: "none",
          }}
        />
        {/* Parallax orb layer 2 — faster, medium, back-left */}
        <div
          ref={orb2Ref}
          style={{
            position: "absolute",
            top: "30%",
            left: "5%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,179,255,.10) 0%, transparent 65%)",
            pointerEvents: "none",
            willChange: "transform",
            transition: "none",
          }}
        />
        {/* Parallax orb layer 3 — medium, accent */}
        <div
          ref={orb3Ref}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(27,95,255,.08) 0%, transparent 65%)",
            pointerEvents: "none",
            willChange: "transform",
            transition: "none",
          }}
        />
        {/* Static gradient orb center */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(27,95,255,.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
            <div className="anim-1" style={{ marginBottom: 24 }}>
              <span className="chip">
                <Sparkles size={10} /> Plataforma #1 para barberías en LATAM
              </span>
            </div>

            <h1
              className="anim-2"
              style={{
                fontFamily: "Sora,sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px,6vw,76px)",
                lineHeight: 1.06,
                letterSpacing: "-.04em",
                color: "var(--navy)",
                marginBottom: 24,
              }}
            >
              Gestiona tu barbería
              <br />
              <span style={{ color: "var(--blue)" }}>como un profesional</span>
            </h1>

            <p
              className="anim-3"
              style={{
                fontSize: 19,
                color: "var(--text-2)",
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto 40px",
                fontWeight: 400,
              }}
            >
              La plataforma todo-en-uno para barberías, salones y estudios de
              tatuajes. Agenda, equipo, finanzas y reservas en línea —
              centralizado.
            </p>

            <div
              className="anim-4"
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <Link href="/register">
                <button className="btn-primary lg">
                  Empieza gratis — 14 días <ArrowRight size={16} />
                </button>
              </Link>
              <button className="btn-secondary lg">
                Ver demo en vivo <ArrowRight size={16} />
              </button>
            </div>

            <p
              style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 72 }}
            >
              Sin tarjeta de crédito &nbsp;·&nbsp; Cancela cuando quieras
              &nbsp;·&nbsp; Soporte en español
            </p>

            {/* DASHBOARD FRAME — 3-D tilt on mouse */}
            <div
              ref={frameRef}
              className="float"
              style={{
                position: "relative",
                maxWidth: 960,
                margin: "0 auto",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 32px 80px rgba(12,26,58,.14), 0 8px 32px rgba(27,95,255,.08)",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="browser-chrome">
                <div
                  className="browser-dot"
                  style={{ background: "#FF5F57" }}
                />
                <div
                  className="browser-dot"
                  style={{ background: "#FEBC2E" }}
                />
                <div
                  className="browser-dot"
                  style={{ background: "#28C840" }}
                />
                <div className="browser-bar">
                  <Lock size={10} color="var(--text-3)" />
                  app.fenixbarberpro.com/dashboard
                </div>
              </div>

              {/* ↓↓↓  REPLACE THIS DIV with your <Image> screenshot  ↓↓↓ */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "var(--off)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Grid bg */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.5,
                  }}
                />

                {/* Skeleton dashboard */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: "88%",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  {/* Sidebar */}
                  <div
                    style={{
                      width: 155,
                      flexShrink: 0,
                      background: "white",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 8px",
                        background: "var(--blue-lt)",
                        borderRadius: 7,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: "var(--blue)",
                        }}
                      />
                      <div
                        style={{
                          height: 8,
                          width: 60,
                          background: "var(--blue)",
                          borderRadius: 4,
                          opacity: 0.55,
                        }}
                      />
                    </div>
                    {[70, 80, 55, 65, 48].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 8px",
                          borderRadius: 7,
                        }}
                      >
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            background: "var(--border-2)",
                          }}
                        />
                        <div
                          style={{
                            height: 7,
                            width: w,
                            background: "var(--border-2)",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Main */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 32,
                          background: "white",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                        }}
                      />
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          background: "white",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Bell size={13} color="var(--text-3)" />
                      </div>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--blue)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "white",
                            fontWeight: 700,
                          }}
                        >
                          VR
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 8,
                      }}
                    >
                      {[
                        { v: "24", c: "var(--blue)" },
                        { v: "$480K", c: "#10B981" },
                        { v: "1,280", c: "#F59E0B" },
                        { v: "98%", c: "#6366F1" },
                      ].map((k, i) => (
                        <div
                          key={i}
                          style={{
                            background: "white",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            padding: "10px 10px 8px",
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 40,
                              background: "var(--border-2)",
                              borderRadius: 3,
                              marginBottom: 8,
                            }}
                          />
                          <div
                            style={{
                              fontFamily: "Sora,sans-serif",
                              fontSize: 15,
                              fontWeight: 800,
                              color: k.c,
                            }}
                          >
                            {k.v}
                          </div>
                          <div
                            style={{
                              height: 5,
                              width: 55,
                              background: "var(--border)",
                              borderRadius: 3,
                              marginTop: 6,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div
                        style={{
                          flex: 1,
                          background: "white",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          padding: 12,
                        }}
                      >
                        <div
                          style={{
                            height: 6,
                            width: 80,
                            background: "var(--border-2)",
                            borderRadius: 3,
                            marginBottom: 10,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 4,
                            height: 54,
                          }}
                        >
                          {[30, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88].map(
                            (h, i) => (
                              <div
                                key={i}
                                style={{
                                  flex: 1,
                                  height: `${h}%`,
                                  background:
                                    i === 10 ? "var(--blue)" : "var(--blue-lt)",
                                  borderRadius: "3px 3px 0 0",
                                  border: "1px solid var(--blue-md)",
                                }}
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 130,
                          background: "white",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          padding: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: 7,
                        }}
                      >
                        <div
                          style={{
                            height: 6,
                            width: 60,
                            background: "var(--border-2)",
                            borderRadius: 3,
                            marginBottom: 4,
                          }}
                        />
                        {[85, 70, 55, 42].map((w, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: "var(--blue-lt)",
                                border: "1px solid var(--blue-md)",
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  height: 5,
                                  width: w * 0.8,
                                  background: "var(--border-2)",
                                  borderRadius: 3,
                                  marginBottom: 3,
                                }}
                              />
                              <div
                                style={{
                                  height: 4,
                                  width: w * 0.5,
                                  background: "var(--border)",
                                  borderRadius: 3,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(27,95,255,.92)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "Sora,sans-serif",
                    padding: "8px 18px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <LayoutDashboard size={13} /> Reemplaza esto con tu captura de
                  pantalla
                </div>
              </div>
              {/* ↑↑↑  END screenshot zone  ↑↑↑ */}
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                background: "var(--off)",
                borderTop: "1px solid var(--border)",
              }}
            >
              {[
                { v: "2,400+", l: "Negocios activos" },
                { v: "850K+", l: "Citas gestionadas" },
                { v: "98%", l: "Satisfacción" },
                { v: "40%", l: "Más ingresos" },
              ].map((s, i) => (
                <div
                  key={s.v}
                  style={{
                    padding: "24px 20px",
                    textAlign: "center",
                    borderRight: i < 3 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Sora,sans-serif",
                      fontSize: 28,
                      fontWeight: 800,
                      color: "var(--blue)",
                      letterSpacing: "-.03em",
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-3)",
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section
        style={{ padding: "64px 24px", borderTop: "1px solid var(--border)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-3)",
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Diseñado para
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              ["✂️", "Barberías"],
              ["💄", "Salones de belleza"],
              ["🖋️", "Estudios de tatuajes"],
              ["💅", "Centros de uñas"],
              ["🧖", "Spas & estética"],
              ["🏢", "Cadenas y franquicias"],
            ].map(([icon, name]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--off)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 40,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-2)",
                  transition: "border-color .15s, background .15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--blue)";
                  (e.currentTarget as HTMLDivElement).style.background =
                    "var(--blue-lt)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background =
                    "var(--off)";
                }}
              >
                <span>{icon}</span>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="características"
        style={{ padding: "96px 24px", background: "var(--off)" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ maxWidth: 580, marginBottom: 56 }}>
            <span className="section-label">Características</span>
            <h2
              style={{
                fontFamily: "Sora,sans-serif",
                fontSize: "clamp(28px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--navy)",
                lineHeight: 1.12,
                marginBottom: 18,
              }}
            >
              Todo lo que necesitas,
              <br />
              en un solo lugar
            </h2>
            <p
              style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.7 }}
            >
              Sin apps adicionales ni integraciones complicadas. FenixBarberPro
              centraliza tu operación completa.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 16,
            }}
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="feat-card">
                  <div className="icon-box">
                    <Icon size={20} color="var(--blue)" />
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: 8,
                      fontFamily: "Sora,sans-serif",
                      letterSpacing: "-.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-2)",
                      lineHeight: 1.7,
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "96px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="section-label">Cómo funciona</span>
            <h2
              style={{
                fontFamily: "Sora,sans-serif",
                fontSize: "clamp(28px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--navy)",
                lineHeight: 1.1,
              }}
            >
              Listo en menos de 10 minutos
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 40,
            }}
          >
            {[
              {
                n: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate gratis. Sin tarjeta ni configuración técnica.",
              },
              {
                n: "02",
                title: "Configura tu negocio",
                desc: "Agrega servicios, empleados y horarios en minutos.",
              },
              {
                n: "03",
                title: "Comparte tu enlace",
                desc: "Envía tu URL de reservas por WhatsApp o redes sociales.",
              },
              {
                n: "04",
                title: "Cobra y crece",
                desc: "Recibe citas 24/7, cobra en línea y analiza tus resultados.",
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--blue)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Sora,sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    marginBottom: 20,
                    boxShadow: "var(--shadow-blue)",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontFamily: "Sora,sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--navy)",
                    marginBottom: 10,
                    letterSpacing: "-.02em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="precios"
        style={{ padding: "96px 24px", background: "var(--off)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="section-label">Precios</span>
            <h2
              style={{
                fontFamily: "Sora,sans-serif",
                fontSize: "clamp(28px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--navy)",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              Planes para cada etapa
              <br />
              de tu negocio
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: !billingAnnual ? "var(--navy)" : "var(--text-3)",
                }}
              >
                Mensual
              </span>
              <button
                className={`toggle ${billingAnnual ? "on" : ""}`}
                onClick={() => setBillingAnnual(!billingAnnual)}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: billingAnnual ? "var(--navy)" : "var(--text-3)",
                }}
              >
                Anual
              </span>
              {billingAnnual && (
                <span
                  className="chip"
                  style={{ fontSize: 10, padding: "3px 10px" }}
                >
                  20% descuento
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`plan-card ${plan.popular ? "popular" : ""}`}
                style={{ position: "relative" }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--blue)",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      padding: "4px 14px",
                      borderRadius: 20,
                      fontFamily: "Sora,sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Más popular
                  </div>
                )}
                <div style={{ marginBottom: 6 }}>
                  <span
                    style={{
                      fontFamily: "Sora,sans-serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--navy)",
                      letterSpacing: "-.02em",
                    }}
                  >
                    {plan.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    marginBottom: 24,
                  }}
                >
                  {plan.description}
                </p>
                <div style={{ marginBottom: 24 }}>
                  <span
                    style={{
                      fontFamily: "Sora,sans-serif",
                      fontSize: 46,
                      fontWeight: 800,
                      color: "var(--navy)",
                      letterSpacing: "-.04em",
                    }}
                  >
                    ${billingAnnual ? plan.annual : plan.monthly}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-3)",
                      marginLeft: 4,
                    }}
                  >
                    USD/mes
                  </span>
                  {billingAnnual && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--blue)",
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      Ahorras ${(plan.monthly - plan.annual) * 12} al año
                    </div>
                  )}
                </div>
                <button
                  className={plan.popular ? "btn-primary" : "btn-secondary"}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: 28,
                    padding: "13px 0",
                    fontSize: 14,
                  }}
                >
                  {plan.cta} <ArrowRight size={14} />
                </button>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 11 }}
                >
                  {plan.features.map((feat) => (
                    <div
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        color="var(--blue)"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      />
                      <span style={{ fontSize: 14, color: "var(--text-2)" }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: 32,
              fontSize: 13,
              color: "var(--text-3)",
            }}
          >
            14 días de prueba gratis en todos los planes · Sin tarjeta de
            crédito · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* TRUST BAND */}
      <section
        style={{
          padding: "80px 24px",
          background: "var(--navy)",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 40,
          }}
        >
          {[
            {
              icon: Shield,
              title: "Seguridad enterprise",
              desc: "Datos cifrados con TLS 1.3 y AES-256. Copias de seguridad automáticas diarias.",
            },
            {
              icon: Clock,
              title: "99.9% de disponibilidad",
              desc: "Infraestructura en AWS con monitoreo 24/7 y SLA garantizado.",
            },
            {
              icon: Globe,
              title: "Soporte en español",
              desc: "Equipo dedicado para toda Latinoamérica. Respuesta en menos de 2 horas.",
            },
            {
              icon: Zap,
              title: "Actualizaciones continuas",
              desc: "Nuevas funciones cada semana, sin costo adicional ni interrupciones.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(27,95,255,.25)",
                  border: "1px solid rgba(27,95,255,.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color="#7BB3FF" />
              </div>
              <h4
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-.02em",
                }}
              >
                {title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,.6)",
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonios"
        style={{ padding: "96px 24px", background: "var(--white)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 480, marginBottom: 56 }}>
            <span className="section-label">Testimonios</span>
            <h2
              style={{
                fontFamily: "Sora,sans-serif",
                fontSize: "clamp(28px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--navy)",
                lineHeight: 1.1,
              }}
            >
              Lo que dicen
              <br />
              nuestros clientes
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 20,
            }}
          >
            {testimonials.map((t) => (
              <div key={t.name} className="testi-card">
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="var(--blue)"
                      color="var(--blue)"
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-2)",
                    lineHeight: 1.75,
                    marginBottom: 24,
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar">{t.initials}</div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--navy)",
                        fontFamily: "Sora,sans-serif",
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {t.role}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--blue)",
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontWeight: 600,
                      }}
                    >
                      <MapPin size={9} />
                      {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        style={{ padding: "96px 24px", background: "var(--off)" }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-label">FAQ</span>
            <h2
              style={{
                fontFamily: "Sora,sans-serif",
                fontSize: "clamp(28px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--navy)",
                lineHeight: 1.1,
              }}
            >
              Preguntas frecuentes
            </h2>
          </div>
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {faqs.map((faq, i) => (
              <div key={i} className="faq-row">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    gap: 16,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Sora,sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--navy)",
                      letterSpacing: "-.01em",
                    }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={17}
                    color="var(--text-3)"
                    style={{
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(180deg)" : "none",
                      transition: "transform .25s",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-2)",
                      lineHeight: 1.8,
                      padding: "0 24px 20px",
                    }}
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "96px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              background: "var(--navy)",
              borderRadius: 24,
              padding: "72px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
                width: 600,
                height: 400,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(27,95,255,.35) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span
                className="chip"
                style={{
                  background: "rgba(27,95,255,.25)",
                  borderColor: "rgba(27,95,255,.5)",
                  color: "#93BBFF",
                  marginBottom: 24,
                  display: "inline-flex",
                }}
              >
                <Flame size={10} fill="currentColor" /> Sin tarjeta de crédito
              </span>
              <h2
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: "clamp(28px,4vw,52px)",
                  fontWeight: 800,
                  letterSpacing: "-.03em",
                  color: "white",
                  marginBottom: 18,
                  lineHeight: 1.1,
                }}
              >
                Transforma tu negocio hoy
              </h2>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,.65)",
                  maxWidth: 480,
                  margin: "0 auto 40px",
                  lineHeight: 1.7,
                }}
              >
                Únete a más de 2,400 negocios que ya gestionan sus salones con
                FenixBarberPro.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link href="/register">
                  <button className="btn-primary lg">
                    Comenzar prueba gratis <ArrowRight size={16} />
                  </button>
                </Link>
                <button
                  className="btn-secondary lg"
                  style={{
                    background: "rgba(255,255,255,.08)",
                    borderColor: "rgba(255,255,255,.2)",
                    color: "white",
                  }}
                >
                  <Phone size={15} /> Hablar con ventas
                </button>
              </div>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  color: "rgba(255,255,255,.4)",
                }}
              >
                14 días gratis · Sin compromisos · Soporte en español
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "var(--off)",
          borderTop: "1px solid var(--border)",
          padding: "64px 24px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 48,
              marginBottom: 56,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <img
                  src="/logo-fenixbarberpro.png"
                  alt="FenixBarber Pro"
                  style={{
                    height: 32,
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-3)",
                  lineHeight: 1.8,
                  maxWidth: 220,
                  marginBottom: 24,
                }}
              >
                La plataforma todo-en-uno para barberías, salones y estudios de
                tatuajes en Latinoamérica.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "var(--white)",
                      border: "1.5px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-3)",
                      textDecoration: "none",
                      transition: "border-color .15s, color .15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--blue)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--blue)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--border)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--text-3)";
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Producto",
                links: [
                  "Características",
                  "Precios",
                  "Demo en vivo",
                  "Novedades",
                  "Integraciones",
                ],
              },
              {
                title: "Empresa",
                links: [
                  "Sobre nosotros",
                  "Blog",
                  "Casos de éxito",
                  "Empleos",
                  "Contacto",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontFamily: "Sora,sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                    marginBottom: 18,
                  }}
                >
                  {col.title}
                </h4>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      display: "block",
                      fontSize: 14,
                      color: "var(--text-2)",
                      textDecoration: "none",
                      marginBottom: 11,
                      fontWeight: 500,
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        "var(--blue)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        "var(--text-2)")
                    }
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}

            <div>
              <h4
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  marginBottom: 18,
                }}
              >
                Contacto
              </h4>
              {[
                { Icon: Mail, text: "hola@fenixbarberpro.com" },
                { Icon: Phone, text: "+57 300 000 0000" },
                { Icon: MapPin, text: "Bogotá, Colombia" },
              ].map(({ Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 13,
                  }}
                >
                  <Icon size={13} color="var(--blue)" />
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>
              © 2025 FenixBarberPro. Todos los derechos reservados.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacidad", "Términos", "Cookies", "Soporte"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    textDecoration: "none",
                    transition: "color .15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLAnchorElement).style.color =
                      "var(--navy)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLAnchorElement).style.color =
                      "var(--text-3)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
