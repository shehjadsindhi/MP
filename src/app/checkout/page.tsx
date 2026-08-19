"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Loader2,
  PackageCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, discountTotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping & Info, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "100 Innovation Parkway, Suite 400",
    city: user?.city || "San Jose",
    postalCode: user?.postalCode || "95110",
    country: user?.country || "United States",
    paymentMethod: "Demo Credit Card (•••• 4242)",
    cardNumber: "4242 •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "888",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "100 Innovation Parkway",
        city: prev.city || user.city || "San Jose",
        postalCode: prev.postalCode || user.postalCode || "95110",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showToast("Cannot checkout with an empty cart", "error");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name || "Customer",
          customerEmail: formData.email || "customer@example.com",
          customerPhone: formData.phone,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          paymentMethod: formData.paymentMethod,
          subtotal,
          discount: discountTotal,
          shipping,
          tax,
          total,
          notes: formData.notes,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            selectedColor: i.selectedColor,
            selectedStorage: i.selectedStorage,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedOrder(data.order);
        clearCart();
        setStep(3);
        showToast("Order placed successfully! Generated receipt in database.", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to place order", "error");
      }
    } catch (e: any) {
      showToast("Network error during checkout", "error");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <PackageCheck className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-galaxy-cyan uppercase tracking-wider">
            Order Confirmation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Thank you! Your Galaxy Order is Confirmed
          </h1>
          <p className="text-xs text-gray-400">
            A confirmation receipt has been generated and dispatched to <strong className="text-white">{confirmedOrder.customerEmail}</strong>.
          </p>
        </div>

        {/* Order Details Receipt Card */}
        <div className="rounded-3xl bg-galaxy-900/80 border border-cyan-500/30 p-6 sm:p-8 text-left space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Order Reference</span>
              <span className="text-base font-extrabold font-mono text-galaxy-cyan">
                {confirmedOrder.orderNumber}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-galaxy-cyan border border-cyan-500/40">
                {confirmedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Purchased Hardware</h4>
            <div className="divide-y divide-slate-800">
              {confirmedOrder.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{item.productName}</div>
                    <div className="text-gray-400 text-[11px]">
                      {item.selectedColor && `${item.selectedColor} • `}
                      {item.selectedStorage && `${item.selectedStorage} • `}
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">
                Shipping Destination
              </span>
              <p className="text-gray-300">{confirmedOrder.customerName}</p>
              <p className="text-gray-400">{confirmedOrder.shippingAddress}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">
                Payment & Security
              </span>
              <p className="text-gray-300">{confirmedOrder.paymentMethod}</p>
              <p className="text-emerald-400 font-semibold">Payment Status: {confirmedOrder.paymentStatus}</p>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline text-sm">
            <span className="font-bold text-gray-300">Total Paid (Demo)</span>
            <span className="text-2xl font-extrabold text-galaxy-cyan font-mono">
              {formatPrice(confirmedOrder.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            View in My Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/devices"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-galaxy-900 hover:bg-slate-800 border border-slate-700 text-gray-300 font-semibold text-xs transition-colors"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Galaxy Checkout</h1>
          <p className="text-xs text-gray-400 mt-1">
            Step {step} of 2 • Safe On-Device Demo Payment
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-galaxy-cyan">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Knox 256-Bit SSL Demo Sandbox</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form (Steps 1 & 2) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-galaxy-cyan" /> 1. Shipping & Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex@example.com"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Innovation Boulevard, Suite 100"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Jose"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Postal / ZIP Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="95110"
                    className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.name || !formData.email || !formData.address) {
                      showToast("Please fill in required shipping fields", "error");
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Continue to Demo Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Demo Payment Method */}
          {step === 2 && (
            <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-galaxy-cyan" /> 2. Demo Payment Method
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-galaxy-cyan hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Shipping
                </button>
              </div>

              {/* Demo Payment Notice */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-galaxy-cyan flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Mode Active:</strong> No actual card charges will take place. This simulates real payment authorization and records the order securely into the local Prisma database.
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Demo Credit Card (•••• 4242)", label: "Demo Card", icon: CreditCard },
                  { id: "Demo Apple Pay", label: "Apple / G-Pay", icon: ShieldCheck },
                  { id: "Demo UPI / QR", label: "Demo UPI / QR", icon: Sparkles },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = formData.paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "border-galaxy-cyan bg-cyan-950/50 text-white shadow-galaxy-cyan font-bold"
                          : "border-slate-800 hover:border-slate-700 bg-galaxy-950 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-galaxy-cyan" />
                      <span className="text-xs">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fake Card Form for realism */}
              <div className="space-y-4 p-5 rounded-2xl bg-galaxy-950 border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400">Card Number (Simulated)</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full bg-galaxy-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-galaxy-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400">Expiration</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      className="w-full bg-galaxy-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-galaxy-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400">CVV / CVC</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      className="w-full bg-galaxy-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-galaxy-cyan"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Delivery Instructions (Optional)</label>
                <textarea
                  rows={2}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Leave at the front desk..."
                  className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan resize-none"
                />
              </div>

              {/* Place Order Button */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  &larr; Back to Shipping
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-sm hover:opacity-95 shadow-galaxy-cyan transition-opacity flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Authorizing Demo Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Place Demo Order ({formatPrice(total)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4 rounded-3xl bg-galaxy-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Your Cart Items ({itemCount})</h3>
            <Link href="/cart" className="text-xs text-galaxy-cyan hover:underline">
              Edit
            </Link>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-800/80 pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-galaxy-950 p-1 flex items-center justify-center flex-shrink-0 border border-slate-800">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                  <div className="text-[11px] text-gray-400">
                    {item.selectedStorage && `${item.selectedStorage} • `}Qty: {item.quantity}
                  </div>
                </div>
                <span className="text-xs font-bold text-white font-mono">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs text-gray-300 pt-3 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-galaxy-cyan font-medium">
                <span>Discount</span>
                <span>-{formatPrice(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-white font-medium">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="text-white font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
              <span>Final Total</span>
              <span className="text-galaxy-cyan text-xl font-mono">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
