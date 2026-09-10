"use client";

import Link from "next/link";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { user } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-galaxy-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-galaxy-cyan transition-colors"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link
          href="/search"
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-galaxy-cyan transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </Link>
        <Link
          href="/wishlist"
          className="relative flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-rose-400 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5" />
          {wishCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {wishCount}
            </span>
          )}
          <span className="text-[10px]">Saved</span>
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-galaxy-cyan transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-galaxy-cyan text-galaxy-950 rounded-full text-[9px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[10px]">Cart</span>
        </button>
        <Link
          href={user ? "/account" : "/login"}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-indigo-400 transition-colors"
          aria-label="Account"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </nav>
  );
}
