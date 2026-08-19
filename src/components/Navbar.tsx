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
    { label: "AI Demos", href: "/ai/demos", badge: "Live Lab" },
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
              <Sparkles className="w-3 h-3 animate-pulse" /> Galaxy AI 2.0 Live
            </span>
            <span className="text-gray-300 hidden sm:inline">
              Experience Live Translate, Circle to Search & Generative Edit on all Galaxy Flagships.
            </span>
            <Link
              href="/ai/demos"
              className="text-galaxy-cyan hover:underline font-semibold flex items-center gap-1 ml-1"
            >
              Try Live Demos &rarr;
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
                Intelligence Engine
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-all flex items-center gap-2 text-xs"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-galaxy-cyan" />
              <span className="hidden md:inline text-gray-400">Search AI & Devices...</span>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-all"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-galaxy-950">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-galaxy-cyan" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-galaxy-950 font-bold text-[10px] flex items-center justify-center border-2 border-galaxy-950">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all text-xs font-semibold text-white"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-galaxy-cyan to-indigo-500 flex items-center justify-center text-galaxy-950 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  {user.role === "ADMIN" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-galaxy-900 border border-slate-700 shadow-2xl p-2 z-40 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-800 text-xs">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-gray-400 truncate">{user.email}</p>
                      </div>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          Admin Portal
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <User className="w-4 h-4 text-galaxy-cyan" />
                        Account Dashboard
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <Package className="w-4 h-4 text-emerald-400" />
                        My Orders
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity shadow-galaxy-cyan flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-galaxy-950 border-b border-slate-800 px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-galaxy-900/60 border border-slate-800/60 text-sm font-semibold text-gray-200 hover:text-galaxy-cyan hover:border-cyan-500/30"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-galaxy-cyan text-galaxy-950 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-sm font-semibold text-indigo-300"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Global Slide-In Cart Drawer */}
      <CartDrawer />
    </>
  );
}
