"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export interface CartItemType {
  id: string; // unique key combining productId + color + storage
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  selectedColor?: string;
  selectedStorage?: string;
  quantity: number;
}

export interface PromoCodeType {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
}

interface CartContextType {
  items: CartItemType[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shipping: number;
  tax: number;
  total: number;
  promo: PromoCodeType | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItemType, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [promo, setPromo] = useState<PromoCodeType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("galaxy_cart");
      if (saved) setItems(JSON.parse(saved));
      const savedPromo = localStorage.getItem("galaxy_promo");
      if (savedPromo) setPromo(JSON.parse(savedPromo));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("galaxy_cart", JSON.stringify(items));
    } catch (e) {}
  }, [items, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      if (promo) {
        localStorage.setItem("galaxy_promo", JSON.stringify(promo));
      } else {
        localStorage.removeItem("galaxy_promo");
      }
    } catch (e) {}
  }, [promo, isMounted]);

  const addItem = (newItem: Omit<CartItemType, "id">) => {
    const id = `${newItem.productId}-${newItem.selectedColor || "default"}-${newItem.selectedStorage || "default"}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item
        );
      }
      return [...prev, { ...newItem, id, quantity: newItem.quantity || 1 }];
    });
    showToast(`Added ${newItem.name} to cart!`, "success");
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (item) showToast(`Removed ${item.name} from cart.`, "info");
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItemType[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
  };

  const applyPromo = (codeStr: string) => {
    const code = codeStr.trim().toUpperCase();
    if (code === "GALAXYAI2025") {
      setPromo({ code, discountPercent: 15, discountAmount: 150 });
      showToast("Promo Code GALAXYAI2025 applied! 15% discount.", "ai");
      return { success: true, message: "15% off applied!" };
    }
    if (code === "FOLD6AI") {
      setPromo({ code, discountPercent: 10, discountAmount: 190 });
      showToast("Promo Code FOLD6AI applied! 10% discount.", "ai");
      return { success: true, message: "10% foldable discount applied!" };
    }
    if (code === "STUDENTAI12") {
      setPromo({ code, discountPercent: 12, discountAmount: 140 });
      showToast("Promo Code STUDENTAI12 applied! 12% education discount.", "ai");
      return { success: true, message: "12% student discount applied!" };
    }
    if (code === "WELCOME50") {
      setPromo({ code, discountPercent: 0, discountAmount: 50 });
      showToast("Promo Code WELCOME50 applied! $50 off storewide.", "ai");
      return { success: true, message: "$50 off your order!" };
    }
    if (code === "ECOSYSTEM25") {
      setPromo({ code, discountPercent: 25, discountAmount: 60 });
      showToast("Promo Code ECOSYSTEM25 applied! 25% wearables bundle discount.", "ai");
      return { success: true, message: "25% bundle discount applied!" };
    }
    showToast("Invalid or expired promo code.", "error");
    return { success: false, message: "Invalid promo code" };
  };

  const removePromo = () => {
    setPromo(null);
    showToast("Promo code removed.", "info");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountTotal = 0;
  if (promo && subtotal > 0) {
    if (promo.discountPercent && promo.discountPercent > 0) {
      discountTotal = (subtotal * promo.discountPercent) / 100;
    } else if (promo.discountAmount) {
      discountTotal = Math.min(subtotal, promo.discountAmount);
    }
  }

  const shipping = subtotal > 0 ? (subtotal > 150 ? 0 : 15) : 0;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const tax = subtotal > 0 ? taxableAmount * 0.08 : 0;
  const total = Math.max(0, taxableAmount + shipping + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountTotal,
        shipping,
        tax,
        total,
        promo,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
