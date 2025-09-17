// src/hooks/useCart.client.tsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  color?: string;
  storage?: string;
  variantId?: string;
  freeShipping?: boolean; // compatível com carrinho/page.tsx
};

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  increase: (id: string, step?: number) => void;
  decrease: (id: string, step?: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
  countNumber: number;
  totalNumber: number;
};

const KEY = 'prostore:cart';
const CartCtx = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Persiste no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  function add(item: Omit<CartItem, 'qty'> & { qty?: number }) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 0) + (item.qty ?? 1) };
        return copy;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function setQty(id: string, qty: number) {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, Math.floor(qty)) } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function increase(id: string, step = 1) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: (p.qty || 0) + step } : p))
    );
  }

  function decrease(id: string, step = 1) {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: (p.qty || 0) - step } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function clear() {
    setItems([]);
  }

  const countNumber = useMemo(() => items.reduce((a, b) => a + (b.qty || 0), 0), [items]);
  const totalNumber = useMemo(
    () => items.reduce((a, b) => a + (b.qty || 0) * (b.price || 0), 0),
    [items]
  );

  const value: CartContextType = useMemo(
    () => ({
      items,
      add,
      remove,
      setQty,
      increase,
      decrease,
      clear,
      count: () => countNumber,
      total: () => totalNumber,
      countNumber,
      totalNumber,
    }),
    [items, countNumber, totalNumber]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// Hook de acesso
export function useCart(): CartContextType {
  const ctx = useContext(CartCtx);
  if (!ctx) {
    const noop = () => 0;
    return {
      items: [],
      add: () => {},
      remove: () => {},
      setQty: () => {},
      increase: () => {},
      decrease: () => {},
      clear: () => {},
      count: noop,
      total: noop,
      countNumber: 0,
      totalNumber: 0,
    };
  }
  return ctx;
}
