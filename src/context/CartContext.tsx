"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

export interface CartItemType {
  id: string;
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
  const { user } = useAuth();

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

  // Synchronize cart with database on user login
  useEffect(() => {
    if (!user) return;
    const syncCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            setItems((prev) => {
              const combined = [...data.items];
              for (const localItem of prev) {
                if (
                  !combined.some(
                    (c: any) =>
                      c.productId === localItem.productId &&
                      c.selectedColor === localItem.selectedColor &&
                      c.selectedStorage === localItem.selectedStorage
                  )
                ) {
                  combined.push(localItem);
                  fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      productId: localItem.productId,
                      quantity: localItem.quantity,
                      selectedColor: localItem.selectedColor,
                      selectedStorage: localItem.selectedStorage,
                    }),
                  }).catch(() => {});
                }
              }
              return combined;
            });
          }
        }
      } catch (e) {}
    };
    syncCart();
  }, [user]);

  const addItem = (newItem: Omit<CartItemType, "id">) => {
    const id = `${newItem.productId}-${newItem.selectedColor || "default"}-${newItem.selectedStorage || "default"}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item));
      }
      return [...prev, { ...newItem, id, quantity: newItem.quantity || 1 }];
    });
    showToast(`Added ${newItem.name} to cart!`, "success");
    setIsCartOpen(true);

    if (user) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newItem.productId,
          quantity: newItem.quantity || 1,
          selectedColor: newItem.selectedColor,
          selectedStorage: newItem.selectedStorage,
        }),
      }).catch(() => {});
    }
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (item) showToast(`Removed ${item.name} from cart.`, "info");

    if (user) {
      fetch(`/api/cart?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
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

    const targetItem = items.find((i) => i.id === id);
    if (user && targetItem) {
      const newQty = targetItem.quantity + delta;
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQty }),
      }).catch(() => {});
    }
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
    if (user) {
      fetch("/api/cart?all=true", { method: "DELETE" }).catch(() => {});
    }
  };

  const applyPromo = (codeStr: string) => {
    const code = codeStr.trim().toUpperCase();
    if (!code) {
      showToast("Please enter a valid promo code.", "error");
      return { success: false, message: "Code cannot be empty" };
    }

    // Call server validation API
    fetch("/api/offers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setPromo({
            code: data.code,
            discountPercent: data.discountPercent || 0,
            discountAmount: data.discountAmount || 0,
          });
          showToast(`Promo ${data.code} applied! ${data.title}`, "ai");
        } else {
          showToast(data.error || "Invalid or expired promo code.", "error");
        }
      })
      .catch(() => {
        // Fallback for offline/demo codes
        const knownFallbackCodes: Record<string, { percent?: number; amount?: number; label: string }> = {
          GALAXYAI2025: { percent: 15, label: "15% launch discount" },
          FOLD6AI: { percent: 10, label: "10% foldable discount" },
          STUDENTAI12: { percent: 12, label: "12% education discount" },
          WELCOME50: { amount: 50, label: "$50 off your order" },
        };
        const matched = knownFallbackCodes[code];
        if (matched) {
          setPromo({
            code,
            discountPercent: matched.percent || 0,
            discountAmount: matched.amount || 0,
          });
          showToast(`Promo ${code} applied! ${matched.label}`, "ai");
        } else {
          showToast("Invalid promo code.", "error");
        }
      });

    return { success: true, message: "Validating promo code..." };
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
