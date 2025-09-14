"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  image?: string;
  storage?: string | number;
  color?: string;
  price?: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQty: (id: string, qty: number) => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const i = state.items.findIndex((it) => it.id === item.id);
          if (i >= 0) {
            const clone = [...state.items];
            clone[i] = { ...clone[i], qty: clone[i].qty + qty };
            return { items: clone };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((it) => (it.id === id ? { ...it, qty } : it))
            .filter((it) => it.qty > 0),
        })),
      total: () => get().items.reduce((acc, it) => acc + (it.price || 0) * it.qty, 0),
    }),
    { name: "cart", storage: createJSONStorage(() => localStorage) }
  )
);
