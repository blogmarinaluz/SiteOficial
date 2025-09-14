"use client";
import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  image?: string;
  storage?: string | number;
  color?: string;
  price?: number;
  freeShipping?: boolean;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;

  count: () => number;
  total: () => number;
};

function save(items: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
}

export const useCart = create<CartState>((set, get) => ({
  items:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart") as string)
      : [],

  add: (item, qty = 1) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        const items = state.items.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
        save(items);
        return { items };
      }
      const items = [...state.items, { ...item, qty }];
      save(items);
      return { items };
    }),

  increase: (id) =>
    set((state) => {
      const items = state.items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      );
      save(items);
      return { items };
    }),

  decrease: (id) =>
    set((state) => {
      const items = state.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
      save(items);
      return { items };
    }),

  remove: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      save(items);
      return { items };
    }),

  clear: () => {
    save([]);
    set({ items: [] });
  },

  count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
  total: () => get().items.reduce((acc, i) => acc + (i.price || 0) * i.qty, 0),
}));

// ✅ Adiciona export default para compatibilizar com imports existentes
export default useCart;
