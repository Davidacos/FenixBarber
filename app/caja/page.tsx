"use client";

import { useState, useMemo, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { getAppointments, getClients, getServices, getEmployees, checkoutAppointment } from "@/lib/api";
import {
  ShoppingCart,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Banknote,
  Search,
  Loader2,
  Gift,
  X,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import PageHeader from "@/components/page-header";
import { toast } from "sonner";
import Modal from "@/components/modal";

export default function CajaPage() {
  const { companyId, activeBranchId, activeBranch } = useBranch();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [cartAppt, setCartAppt] = useState<any | null>(null);
  const [usePoints, setUsePoints] = useState(false);

  const fetchData = async () => {
    if (!companyId || !activeBranchId) return;
    setLoading(true);
    try {
      const [apps, clis, svcs, emps] = await Promise.all([
        getAppointments(companyId, activeBranchId),
        getClients(companyId, activeBranchId),
        getServices(companyId, activeBranchId),
        getEmployees(companyId, activeBranchId)
      ]);
      setAppointments(apps);
      setClients(clis);
      setServices(svcs);
      setEmployees(emps);
    } catch {
      toast.error("Error cargando caja");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [companyId, activeBranchId]);

  // Today's pending apps
  const pendingApps = useMemo(() => {
    const todayStr = new Date().toDateString();
    return appointments.filter(
      (a) => a.status === "pendiente" && new Date(a.date).toDateString() === todayStr
    ).map(a => {
      const svc = services.find(s => s.id === a.serviceId);
      const cli = clients.find(c => c.id === a.clientId);
      const emp = employees.find(e => e.id === a.employeeId);
      return {
        ...a,
        serviceObj: svc,
        clientObj: cli,
        employeeObj: emp,
        time: new Date(a.date).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [appointments, services, clients, employees]);

  const filteredApps = useMemo(() => {
    if (!searchTerm) return pendingApps;
    const s = searchTerm.toLowerCase();
    return pendingApps.filter((a) =>
      a.clientObj?.name.toLowerCase().includes(s) ||
      a.serviceObj?.name.toLowerCase().includes(s)
    );
  }, [pendingApps, searchTerm]);

  // Pricing calculations
  const subtotal = cartAppt?.serviceObj?.price || 0;
  // Let's say 1 point = 1 unit of currency logic
  const clientPoints = cartAppt?.clientObj?.points || 0;
  
  // Can redeem up to 50% of the cost logically if we want, or just full point equivalence
  // We'll allow taking max points that don't exceed subtotal
  const pointsDiscount = usePoints ? Math.min(clientPoints, subtotal) : 0;
  const total = subtotal - pointsDiscount;

  const handleCheckout = async () => {
    if (!cartAppt) return;
    setProcessing(true);
    
    // In our api mock we added checkoutAppointment
    const res = await checkoutAppointment(
      cartAppt.id,
      companyId!,
      activeBranchId!,
      total,
      `Cobro Servicio: ${cartAppt.serviceObj?.name} (Puntos usados: ${pointsDiscount})`,
      cartAppt.clientId
    );
    
    if (res.success) {
      toast.success("Pago procesado exitosamente");
      setCartAppt(null);
      setUsePoints(false);
      fetchData(); // reload
    } else {
      toast.error("Error al procesar el pago");
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Sidebar />
      <Topbar />

      <main className="transition-all duration-200 pt-20 pb-12 px-5 md:px-7 flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <PageHeader
          title="Caja Registradora"
          description="Punto de Venta para cobrar servicios y manejar descuentos."
          breadcrumb="Caja"
        />

        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          
          {/* Left Panel - Appts List */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Citas Pendientes de Hoy
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-3 py-1 rounded-lg text-sm">
                {pendingApps.length} Turnos
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Buscar por cliente o servicio..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-blue-500 transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-300" />
                <p className="text-sm font-medium">No hay citas pendientes para cobrar hoy.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
                {filteredApps.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                        setCartAppt(a);
                        setUsePoints(false);
                    }}
                    className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-all ${
                      cartAppt?.id === a.id 
                      ? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20" 
                      : "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md bg-white dark:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{a.clientObj?.name || "Cliente Sin Nombre"}</p>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-md">{a.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">{a.serviceObj?.name || "Sin servicio"}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                        ${(a.serviceObj?.price || 0).toLocaleString("es-CO")}
                      </p>
                      <button className="text-xs font-bold text-slate-500 hover:text-blue-600 underline">Añadir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Ticket/Checkout */}
          <div className="w-full lg:w-[400px] bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-xl flex flex-col overflow-hidden self-start sticky top-24 border border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-white font-black text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" /> 
                Ticket Virtual
              </h2>
              {cartAppt && (
                <button onClick={() => setCartAppt(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col min-h-[300px]">
              {!cartAppt ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
                  <Banknote className="w-16 h-16 mb-4" />
                  <p className="text-sm font-medium text-center">Selecciona una cita pendiente<br/>para cobrar.</p>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                  
                  {/* Client Info */}
                  <div className="bg-slate-800 rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cliente</p>
                    <p className="text-white font-bold">{cartAppt.clientObj?.name}</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Gift className="w-4 h-4" />
                        <span className="text-xs font-bold">{clientPoints} pts disponibles</span>
                      </div>
                      <button
                        onClick={() => setUsePoints(!usePoints)}
                        disabled={clientPoints === 0}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          usePoints ? "bg-amber-500 text-slate-900" 
                          : clientPoints > 0 ? "bg-slate-700 text-white hover:bg-slate-600" 
                          : "bg-slate-800 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        {usePoints ? "Canjeando" : "Canjear"}
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-800 rounded-xl p-4 mb-6 flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detalle</p>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium text-white">{cartAppt.serviceObj?.name}</p>
                        <p className="text-xs text-slate-400">Barbero: {cartAppt.employeeObj?.name}</p>
                      </div>
                      <p className="text-sm font-medium text-white">${subtotal.toLocaleString("es-CO")}</p>
                    </div>

                    {usePoints && pointsDiscount > 0 && (
                      <div className="flex justify-between items-center text-amber-400 mt-2">
                        <p className="text-sm font-medium">Descuento Puntos</p>
                        <p className="text-sm font-bold">-${pointsDiscount.toLocaleString("es-CO")}</p>
                      </div>
                    )}
                  </div>

                  {/* Total & Action */}
                  <div className="mt-auto pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-end mb-5">
                      <p className="text-slate-400 font-bold">Total a cobrar</p>
                      <p className="text-3xl font-black text-white leading-none">${total.toLocaleString("es-CO")}</p>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50"
                    >
                       {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                         <><CreditCard className="w-5 h-5" /> Confirmar Pago</>
                       )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
