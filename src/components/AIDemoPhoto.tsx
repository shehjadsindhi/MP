"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Sliders, Eraser, Image as ImageIcon, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const SAMPLE_IMAGES = [
  { id: "sample-1", name: "Flagship Phone & Scenery", url: "/images/nova_ultra.jpg" },
  { id: "sample-2", name: "Foldable Flex Architecture", url: "/images/flex_5.jpg" },
  { id: "sample-3", name: "Tablet Ultra Creator Studio", url: "/images/tab_ultra.jpg" },
  { id: "sample-4", name: "Watch Ultra Outdoor Terrain", url: "/images/watch_7_pro.jpg" },
];

export default function AIDemoPhoto() {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].url);
  const [action, setAction] = useState<string>("enhanceImage");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>({
    action: "AI Remaster & HDR",
    status: "success",
    processingSteps: [
      "Analyzing exposure histogram and color saturation...",
      "Applying multi-frame noise reduction...",
      "Dynamic range expanded with deep blacks and vibrant highlights.",
    ],
    filterCss: "contrast(115%) saturate(125%) brightness(108%)",
    details: "Dynamic range remastered with 24-bit studio color depth.",
    enhancedMetrics: { sharpness: "+34%", dynamicRange: "+45%", reflectionReduction: "82%" },
  });

  const { showToast } = useToast();

  const handleProcess = async (act: string) => {
    setAction(act);
    setProcessing(true);
    try {
      const res = await fetch("/api/ai/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: act }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        showToast(`Galaxy AI Photo Action: ${data.action} completed!`, "ai");
      }
    } catch (e) {
      showToast("Error processing photo action", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
          showToast("Custom photo loaded into AI Studio!", "info");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Demo Mode Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Sparkles className="w-4 h-4 text-galaxy-cyan animate-pulse flex-shrink-0" />
          <span>
            <strong>Interactive AI Studio (Demo Mode):</strong> Real-time on-device simulation of Galaxy Generative Edit & Remaster filters.
          </span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-cyan-400/30">
          NPU: Ready
        </span>
      </div>

      {/* Main Canvas & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Canvas with Split Slider */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl bg-galaxy-900 border border-slate-700/80 overflow-hidden shadow-2xl h-[400px] sm:h-[460px] flex items-center justify-center select-none">
            {/* Original Image (Left Side) */}
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-galaxy-950">
              <img
                src={selectedImage}
                alt="Original"
                className="max-h-full max-w-full object-contain filter grayscale-[20%]"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-gray-300 uppercase tracking-wider border border-white/10">
                Original Shot
              </span>
            </div>

            {/* Processed Image (Right Side Overlay Clipped by Slider) */}
            <div
              className="absolute inset-0 flex items-center justify-center p-6 bg-galaxy-950 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img
                src={selectedImage}
                alt="AI Enhanced"
                className="max-h-full max-w-full object-contain"
                style={{ filter: result?.filterCss || "none" }}
              />
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md text-[10px] font-bold text-galaxy-cyan uppercase tracking-wider border border-cyan-500/40">
                Galaxy AI: {result?.action || "Remastered"}
              </span>
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-galaxy-cyan shadow-galaxy-cyan z-20 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-galaxy-cyan text-galaxy-950 font-bold flex items-center justify-center text-xs shadow-lg">
                ⇄
              </div>
            </div>

            {/* Invisible Range Input for Split Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
              aria-label="Before/After Split Comparison Slider"
            />

            {/* Processing Spinner Overlay */}
            {processing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-galaxy-cyan animate-spin" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Processing with Quantum NPU...
                </span>
              </div>
            )}
          </div>

          {/* Slider Instruction */}
          <div className="flex items-center justify-between text-xs text-gray-400 px-2">
            <span>&larr; Drag slider left to reveal AI Enhancement</span>
            <span>Drag slider right for Original &rarr;</span>
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Buttons */}
          <div className="rounded-2xl bg-galaxy-900/90 border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-galaxy-cyan">
              Select AI Action
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "enhanceImage", label: "AI Remaster & HDR", icon: Wand2, desc: "Enhance dynamic range and 24-bit depth" },
                { id: "removeObject", label: "Object Eraser", icon: Eraser, desc: "Generative removal with background fill" },
                { id: "eraseReflections", label: "Erase Reflections", icon: Sliders, desc: "Remove glass reflections and glares" },
                { id: "generateBackground", label: "Generative Studio Background", icon: Sparkles, desc: "Synthesize realistic studio depth" },
              ].map((btn) => {
                const Icon = btn.icon;
                const isActive = action === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => handleProcess(btn.id)}
                    disabled={processing}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? "bg-cyan-950/50 border-cyan-500/50 text-cyan-200 shadow-galaxy-cyan"
                        : "bg-galaxy-950/60 hover:bg-slate-800 border-slate-800 text-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? "bg-cyan-500 text-galaxy-950" : "bg-slate-800 text-gray-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{btn.label}</div>
                      <div className="text-[11px] text-gray-400 leading-tight">{btn.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sample Images & Custom Upload */}
          <div className="rounded-2xl bg-galaxy-900/90 border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-galaxy-cyan">
              Choose or Upload Photo
            </h4>

            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative rounded-xl overflow-hidden border p-1 bg-galaxy-950 aspect-square transition-all ${
                    selectedImage === img.url ? "border-galaxy-cyan shadow-galaxy-cyan scale-105" : "border-slate-800 hover:border-slate-600"
                  }`}
                  title={img.name}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white cursor-pointer bg-galaxy-950/50 transition-colors">
              <Upload className="w-3.5 h-3.5 text-galaxy-cyan" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>
          </div>

          {/* Live NPU Metrics */}
          {result?.enhancedMetrics && (
            <div className="rounded-2xl bg-galaxy-950 border border-cyan-500/20 p-4 space-y-2">
              <h5 className="text-[11px] font-bold text-galaxy-cyan uppercase tracking-wider">
                Quantum NPU Optics Scorecard
              </h5>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-galaxy-900 border border-slate-800">
                  <div className="text-gray-400 text-[10px]">Sharpness</div>
                  <div className="font-bold text-cyan-300">{result.enhancedMetrics.sharpness}</div>
                </div>
                <div className="p-2 rounded-lg bg-galaxy-900 border border-slate-800">
                  <div className="text-gray-400 text-[10px]">Dynamic Range</div>
                  <div className="font-bold text-indigo-300">{result.enhancedMetrics.dynamicRange}</div>
                </div>
                <div className="p-2 rounded-lg bg-galaxy-900 border border-slate-800">
                  <div className="text-gray-400 text-[10px]">Glare Erased</div>
                  <div className="font-bold text-emerald-300">{result.enhancedMetrics.reflectionReduction}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
