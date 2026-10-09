import React from "react";
import { ShieldCheck, Smartphone, Tv, Watch, Laptop, WashingMachine, AirVent, Monitor, Projector, Refrigerator, Info, PhoneCall } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty Policy — Galaxy AI Hub",
  description: "Samsung India warranty coverage terms for smartphones, wearables, TVs, appliances and more.",
};

const warrantyCategories = [
  {
    icon: Smartphone,
    category: "Smartphones & Foldables",
    coverage: [
      { item: "Handset (device)", period: "12 months" },
      { item: "Battery", period: "12 months" },
      { item: "Accessories (charger, cable, earphones)", period: "6 months" },
      { item: "Cover & back glass (manufacturing defect)", period: "6 months" },
    ],
    notes: "Warranty covers manufacturing defects only. Physical damage, liquid damage, and unauthorized repairs are excluded.",
  },
  {
    icon: Watch,
    category: "Wearables (Watches, Rings, Buds)",
    coverage: [
      { item: "Galaxy Watch / Galaxy Ring", period: "12 months" },
      { item: "Galaxy Buds", period: "12 months (case & buds)" },
      { item: "Straps & ear tips", period: "Not covered (consumables)" },
    ],
    notes: "Water damage beyond rated IP/ATM depth, cosmetic wear, and battery degradation from normal use are excluded.",
  },
  {
    icon: Tv,
    category: "Televisions & Monitors",
    coverage: [
      { item: "TV panel & main unit", period: "12 months" },
      { item: "Monitors", period: "36 months" },
      { item: "Panel burn-in (with proper usage)", period: "Covered per policy" },
    ],
    notes: "Registration on Samsung India portal recommended for seamless claims.",
  },
  {
    icon: Projector,
    category: "Projectors",
    coverage: [{ item: "Projector unit & lamp (manufacturing defect)", period: "24 months" }],
    notes: "Lamp replacement due to normal lifespan depletion is a consumable and not covered.",
  },
  {
    icon: WashingMachine,
    category: "Washing Machines",
    coverage: [
      { item: "Complete unit", period: "24 months" },
      { item: "Motor & drum (manufacturing defect)", period: "Covered within 24 months" },
    ],
    notes: "Installation must be done by authorized technician to keep warranty valid.",
  },
  {
    icon: Refrigerator,
    category: "Refrigerators",
    coverage: [
      { item: "Complete unit", period: "12 months" },
      { item: "Compressor", period: "120 months (10 years)" },
    ],
    notes: "Compressor warranty requires annual servicing by authorized service center.",
  },
  {
    icon: AirVent,
    category: "Air Conditioners",
    coverage: [
      { item: "Complete unit", period: "12 months" },
      { item: "Compressor", period: "60–120 months (model dependent)" },
    ],
    notes: "Split ACs require authorized installation; warranty void on self-installation.",
  },
  {
    icon: Laptop,
    category: "Laptops (Galaxy Book)",
    coverage: [
      { item: "Complete unit", period: "12 months" },
      { item: "Battery (manufacturing defect)", period: "12 months" },
    ],
    notes: "Accidental damage protection available as separate Samsung Care+ plan.",
  },
];

const serviceSteps = [
  "Visit samsung.com/in/support or call Samsung India customer care at 1800 5 7267864 (toll-free).",
  "Register your product with the serial number (Settings > About Phone > Status) for faster claims.",
  "Carry the original invoice — it is mandatory for all warranty service.",
  "Visit an authorized Samsung service center; list available on the support portal.",
  "For DOA (dead on arrival) issues within 7 days, the store may offer replacement subject to verification.",
];

const exclusions = [
  "Physical damage, drops, scratches, and cosmetic wear",
  "Liquid ingress beyond rated IP/ATM water resistance",
  "Unauthorized repairs, software flashing, or rooting/unlocking",
  "Normal battery capacity degradation over time",
  "Consumables: straps, ear tips, SIM trays, and lamps",
  "Damage from power surges, voltage mismatch, or force majeure",
];

export default function WarrantyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-galaxy-cyan text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> Warranty & Protection
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Warranty Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Standard Samsung India limited warranty coverage by product category. Terms are factual summaries; always confirm on the official Samsung India support portal.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warrantyCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.category}
              className="rounded-2xl bg-galaxy-900/60 border border-slate-800 p-6 space-y-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  <Icon className="w-5 h-5 text-galaxy-cyan" />
                </div>
                <h2 className="text-base font-bold text-white">{cat.category}</h2>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {cat.coverage.map((row) => (
                    <tr key={row.item} className="border-t border-slate-800/70">
                      <td className="py-2.5 pr-3 text-gray-400">{row.item}</td>
                      <td className="py-2.5 text-right font-bold text-galaxy-cyan whitespace-nowrap">
                        {row.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-gray-500 leading-relaxed flex gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{cat.notes}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* How to Claim */}
      <section className="rounded-2xl bg-galaxy-900/60 border border-slate-800 p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-extrabold text-white">How to Claim Warranty Service</h2>
        <ol className="space-y-3">
          {serviceSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-galaxy-950/70 border border-slate-800 rounded-xl px-4 py-3">
          <PhoneCall className="w-4 h-4 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong className="text-white">Samsung India Customer Care:</strong> 1800 5 7267864 (toll-free) •
            Samsung India, 6th Floor, DLF Centre, Sansad Marg, New Delhi-110001 • CIN: U31900DL1995PTC071387
          </span>
        </div>
      </section>

      {/* Exclusions */}
      <section className="rounded-2xl bg-galaxy-900/60 border border-slate-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-white">Common Warranty Exclusions</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {exclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-500 text-center leading-relaxed max-w-3xl mx-auto">
        This page is an educational summary of standard Samsung India warranty terms. Coverage periods and conditions may change — verify the current policy at samsung.com/in/support before purchase. Galaxy AI Hub is an unofficial demonstration platform and is not affiliated with Samsung Electronics.
      </p>
    </div>
  );
}
