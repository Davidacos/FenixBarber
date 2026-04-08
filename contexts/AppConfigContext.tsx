"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const CURRENCIES = [
  { code: "COP", symbol: "$", name: "Peso Colombiano", locale: "es-CO" },
  { code: "USD", symbol: "$", name: "Dólar Americano", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "es-ES" },
  { code: "MXN", symbol: "$", name: "Peso Mexicano", locale: "es-MX" },
  { code: "PEN", symbol: "S/", name: "Sol Peruano", locale: "es-PE" },
  { code: "CLP", symbol: "$", name: "Peso Chileno", locale: "es-CL" },
  { code: "ARS", symbol: "$", name: "Peso Argentino", locale: "es-AR" },
];

type Currency = (typeof CURRENCIES)[0];

interface AppConfig {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (amount: number) => string;
}

const AppConfigContext = createContext<AppConfig>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  formatMoney: (n) => `$${n}`,
});

const STORAGE_KEY = "fenix_app_config";

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = CURRENCIES.find((c) => c.code === parsed.currencyCode);
        if (found) setCurrencyState(found);
      }
    } catch {}
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currencyCode: c.code }));
    }
  };

  const formatMoney = (amount: number) => {
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toLocaleString()}`;
    }
  };

  return (
    <AppConfigContext.Provider value={{ currency, setCurrency, formatMoney }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  return useContext(AppConfigContext);
}
