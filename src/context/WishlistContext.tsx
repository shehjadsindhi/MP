"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useCart } from "./CartContext";

export interface WishlistItemType {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string | null;
}

interface WishlistContextType {
  items: WishlistItemType[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: Omit<WishlistItemType, "id">) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (item: WishlistItemType) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItemType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { showToast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("galaxy_wishlist");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("galaxy_wishlist", JSON.stringify(items));
    } catch (e) {}
  }, [items, isMounted]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const toggleWishlist = (newItem: Omit<WishlistItemType, "id">) => {
    const exists = items.some((item) => item.productId === newItem.productId);
    if (exists) {
      setItems((prev) => prev.filter((item) => item.productId !== newItem.productId));
      showToast(`Removed ${newItem.name} from Wishlist.`, "info");
    } else {
      const id = `wish-${newItem.productId}`;
      setItems((prev) => [...prev, { ...newItem, id }]);
      showToast(`Added ${newItem.name} to Wishlist!`, "success");
    }
  };

  const removeFromWishlist = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    if (item) showToast(`Removed ${item.name} from Wishlist.`, "info");
  };

  const moveToCart = (item: WishlistItemType) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.productId);
    showToast(`Moved ${item.name} to your Cart!`, "success");
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
