"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  Sliders,
  ExternalLink,
  Layers,
  Bot
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { user, logout } = useAuth();

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Galaxy AI", href: "/ai" },
    { label: "Features", href: "/ai/features" },
    { label: "AI Demos", href: "/ai/demos", badge: "Simulator" },
    { label: "Devices", href: "/devices" },
    { label: "Compare", href: "/compare" },
    { label: "Learn", href: "/learn" },
    { label: "Offers", href: "/offers", badge: "Deals" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <aside className="bg-gradient-to-r from-galaxy-950 via-galaxy-850 to-galaxy-950 border-b border-cyan-500/20 text-xs py-2 px-4 text-center relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="bg-cyan-500/10 border border-cyan-400/30 text-galaxy-cyan px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5 shadow-galaxy-cyan text-[11px]">
              <Sparkles className="w-3 h-3" /> Concept Showcase
            </span>
            <span className="text-gray-300 hidden sm:inline">
              Experience simulated Live Translate, Circle to Search & Generative Edit on Galaxy flagships.
            </span>
            <Link
              href="/ai/demos"
              className="text-galaxy-cyan hover:underline font-semibold flex items-center gap-1 ml-1"
            >
              Launch Simulator &rarr;
            </Link>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            aria-label="Close Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-galaxy-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl"
            : "bg-galaxy-950/60 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-galaxy-cyan to-indigo-600 p-0.5 shadow-galaxy-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-galaxy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-galaxy-cyan" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
                GALAXY <span className="text-galaxy-cyan">AI</span> HUB
              </span>
              <span className="text-[10px] tracking-widest text-gray-400 uppercase font-medium -mt-1">
                Concept Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? "text-galaxy-cyan bg-cyan-950/30 border border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-gradient-to-r from-cyan-500 to-blue-500 text-galaxy-950 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              title="Search Catalog & AI Features (Ctrl+K)"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs text-gray-400 hidden xl:inline">Search...</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-colors relative"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-colors relative"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-galaxy-cyan text-galaxy-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-gray-200"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-galaxy-cyan to-indigo-600 flex items-center justify-center text-galaxy-950 text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[90px]">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-galaxy-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    {user.role === "ADMIN" && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-slate-800"
                  >
                    <User className="w-3.5 h-3.5 text-galaxy-cyan" /> Account Dashboard
                  </Link>

                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-slate-800"
                  >
                    <Package className="w-3.5 h-3.5 text-galaxy-cyan" /> Order History
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-indigo-300 hover:text-white hover:bg-indigo-950/40"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin Control
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 text-left border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-galaxy-900 border border-slate-800 text-gray-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-galaxy-950 px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-galaxy-900/60 border border-slate-800 text-sm font-medium text-gray-200 hover:text-galaxy-cyan"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-500/20 text-galaxy-cyan rounded-full border border-cyan-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-gray-400">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white"
              >
                User Account
              </Link>
              <span>•</span>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white"
              >
                Compare Matrix
              </Link>
              <span>•</span>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-indigo-400 hover:underline"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
