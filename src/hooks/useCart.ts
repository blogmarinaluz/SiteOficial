"use client";

import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  image?: string;
  storage?: string | number;
  color?: string;
  price?: number;
  qty: number;
  /** usado para exibir “Frete: Grátis” no carrinho */
  freeShipping?: boolean;
};

type AddItem = Omit<CartItem, "qty"> & { qty?: number };

type CartState = {
  items: CartItem[];
  add: (item: AddItem) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

// util
const save = (items: CartItem[]) =>
  typeof window !== "undefined" &&
  localStorage.setItem("cart", JSON.stringify(items));

const load = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const useCart = create<CartState>((set, get) => ({
  items: load(),

  add: (item) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx].qty += item.qty ?? 1;
    } else {
      items.push({
        id: String(item.id),
        name: item.name,
        price: item.price,
        image: item.image,
        color: item.color,
        storage: item.storage,
        freeShipping: item.freeShipping ?? false,
        qty: item.qty ?? 1,
      });
    }
    save(items);
    set({ items });
  },

  decrease: (id) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) {
      items[idx].qty -= 1;
      if (items[idx].qty <= 0) items.splice(idx, 1);
    }
    save(items);
    set({ items });
  },

  remove: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    save(items);
    set({ items });
  },

  clear: () => {
    save([]);
    set({ items: [] });
  },
}));
