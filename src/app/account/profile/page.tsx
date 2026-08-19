"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    savedPersona: "Everyday User",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: user.country || "United States",
        savedPersona: user.savedPersona || "Everyday User",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateProfile(formData);
    setSaving(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 text-galaxy-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <Link href="/account" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <span>/</span>
          <span className="text-galaxy-cyan">Profile Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Profile & Preferences</h1>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSave}
        className="rounded-3xl bg-galaxy-900/80 border border-slate-800 p-6 sm:p-10 space-y-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Address (Account ID)</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-gray-400 cursor-not-allowed"
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
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Primary AI Persona</label>
            <select
              name="savedPersona"
              value={formData.savedPersona}
              onChange={handleChange}
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            >
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
              <option value="Creator">Creator</option>
              <option value="Traveler">Traveler</option>
              <option value="Everyday User">Everyday User</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Innovation Parkway"
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="San Jose"
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Postal / ZIP Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="95110"
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-90 shadow-galaxy-cyan transition-opacity flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
