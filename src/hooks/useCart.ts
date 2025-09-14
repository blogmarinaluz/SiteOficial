"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withCoupon } from "@/lib/format";
type Item = any;
type S = { items: Item[]; add:(p:Item)=>void; remove:(id:string)=>void; clear:()=>void; total:()=>number; totalWithCoupon:()=>number; };
export const useCart = create<S>()(persist((set,get)=>({
  items:[], add:(p)=>set({items:[...get().items,p]}), remove:(id)=>set({items:get().items.filter(i=>i.id!==id)}),
  clear:()=>set({items:[]}), total:()=>get().items.reduce((s,i)=>s+(i.price||0),0), totalWithCoupon:()=>get().items.reduce((s,i)=>s+(i.price?withCoupon(i.price):0),0)
}),{name:'prostore-cart'}));
