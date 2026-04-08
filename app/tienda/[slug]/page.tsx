"use client";

import { useState, useMemo, use, useEffect } from "react";
import { ShoppingCart, Search, X, Plus, Minus, CheckCircle2, Star, Package, Loader2 } from "lucide-react";
import { getProducts, getBranches, getCompanies } from "@/lib/api";
import { useAppConfig } from "@/contexts/AppConfigContext";
import Link from "next/link";
import { toast } from "sonner";

type CartItem = { product: any; qty: number };

export default function StorefrontPage({ params: pp }: { params: Promise<{ slug: string }> }) {
  const { formatMoney } = useAppConfig();
  const params = use(pp);
  
  const [company, setCompany] = useState<any>(null);
  const [branch, setBranch] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const companies = await getCompanies();
        const foundCo = companies.find((c: any) => c.slug === params.slug);
        if (foundCo) {
          setCompany(foundCo);
          const [branches, prods] = await Promise.all([
            getBranches(foundCo.id),
            getProducts(foundCo.id)
          ]);
          setBranch(branches[0]);
          setProducts(prods.filter(p => p.active));
        }
      } catch (err) {
        toast.error("Error cargando la tienda");
      }
      setLoading(false);
    }
    fetchData();
  }, [params.slug]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [products, search, category]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));
  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
      return updated;
    });
  };

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-bold">Cargando tienda premium...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-2">Tienda no encontrada</h1>
          <p className="text-slate-400">El enlace que buscas no existe.</p>
        </div>
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">¡Pedido recibido!</h1>
          <p className="text-slate-400 mb-6">Nuestro equipo te contactará pronto para confirmar tu pedido. Gracias por tu compra.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resumen</p>
            {cart.map((i) => (
              <div key={i.product.id} className="flex justify-between text-sm">
                <span className="text-slate-300">{i.product.image} {i.product.name} × {i.qty}</span>
                <span className="text-white font-bold">{formatMoney(i.product.price * i.qty)}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 flex justify-between font-black text-white">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
          <button onClick={() => { setOrdered(false); setCart([]); }} className="w-full h-12 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all">Seguir comprando</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-black text-xl leading-tight">{company.name}</h1>
            <p className="text-xs text-slate-400">{branch?.address || "Tienda Online"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/reservas/${params.slug}`} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 text-sm font-bold text-slate-300 hover:text-white transition-all">
              Reservar Cita
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 to-slate-800 border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 py-16 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-5">
              <Star className="w-3.5 h-3.5 fill-current" /> Productos Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Todo lo que<br /><span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">necesitas</span>
            </h2>
            <p className="text-slate-400 text-lg mb-7">Lleva los mejores productos profesionales directo a tu hogar.</p>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:border-blue-400 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setCategory("")} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!category ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white border border-white/10 hover:border-white/30"}`}>Todo</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat === category ? "" : cat)} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${category === cat ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white border border-white/10 hover:border-white/30"}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto px-5 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-bold">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => {
              const inCart = cart.find((i) => i.product.id === p.id);
              return (
                <div key={p.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:bg-white/8 transition-all duration-300 flex flex-col">
                  {/* Image area */}
                  <div className="aspect-square bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {p.image}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-1">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{p.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-auto">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-black text-white">{formatMoney(p.price)}</p>
                      <p className="text-xs text-slate-500 font-bold">{p.stock} <span className="opacity-60 font-medium">UDS</span></p>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className={`mt-3 w-full h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${inCart ? "bg-blue-600/20 border border-blue-500/40 text-blue-400" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                    >
                      {inCart ? <><CheckCircle2 className="w-4 h-4" /> En carrito (+{inCart.qty})</> : <><Plus className="w-4 h-4" /> Añadir</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-black text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-blue-400" /> Mi Carrito</h2>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                  <ShoppingCart className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-medium">Tu carrito está vacío</p>
                </div>
              ) : cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">{item.product.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-400">{formatMoney(item.product.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => changeQty(item.product.id, -1)} className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item.product.id, 1)} className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => removeFromCart(item.product.id)} className="w-6 h-6 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-400 font-bold">Total</span>
                  <span className="text-2xl font-black text-white">{formatMoney(total)}</span>
                </div>
                <button
                  onClick={() => { setOrdered(true); setCartOpen(false); }}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/50"
                >
                  Confirmar Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
