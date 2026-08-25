"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Sliders, Eraser, Upload, Loader2, RotateCcw, Target, Layers, Eye } from "lucide-react";
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

  // Manual Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(100);

  // Interactive Target Object Box for Eraser
  const [targetBox, setTargetBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 65,
    y: 20,
    w: 22,
    h: 28,
  });
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);

  const [result, setResult] = useState<any>({
    action: "AI Remaster & HDR",
    status: "success",
    processingSteps: [
      "Analyzing exposure histogram and color saturation...",
      "Applying multi-frame noise reduction...",
      "Dynamic range expanded with deep blacks and vibrant highlights.",
    ],
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
        showToast(`Galaxy AI Photo Action: ${data.action} applied!`, "ai");
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setTargetBox({
      x: Math.max(0, Math.min(80, clickX - 10)),
      y: Math.max(0, Math.min(80, clickY - 10)),
      w: 20,
      h: 24,
    });
    setIsSelectingTarget(false);
    showToast("Target object erased with Generative Fill!", "ai");
    handleProcess("removeObject");
  };

  const resetManualAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSharpness(100);
    showToast("Manual adjustments reset.", "info");
  };

  // Base filter per action
  const getActionFilter = () => {
    switch (action) {
      case "enhanceImage":
        return "contrast(135%) saturate(140%) brightness(112%) drop-shadow(0 0 20px rgba(0,240,255,0.35))";
      case "removeObject":
        return "contrast(115%) saturate(120%) brightness(105%)";
      case "eraseReflections":
        return "contrast(125%) saturate(125%) brightness(108%)";
      case "generateBackground":
        return "contrast(120%) saturate(130%) brightness(110%) drop-shadow(0 0 30px rgba(99,102,241,0.5))";
      default:
        return "none";
    }
  };

  // Combine action filter with user manual adjustment sliders
  const computedEnhancedFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${
    sharpness > 100 ? `contrast(${100 + (sharpness - 100) * 0.4}%)` : ""
  } ${getActionFilter()}`;

  return (
    <div className="space-y-8">
      {/* Demo Mode Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Sparkles className="w-4 h-4 text-galaxy-cyan animate-pulse flex-shrink-0" />
          <span>
            <strong>Interactive AI Generative Canvas:</strong> Drag split slider to compare <em>Original Raw Shot</em> vs <em>Galaxy AI Enhanced</em>.
          </span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-cyan-400/30">
          NPU: Active
        </span>
      </div>

      {/* Main Canvas & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Canvas with Split Slider */}
        <div className="lg:col-span-8 space-y-4">
          <div
            onClick={handleCanvasClick}
            className={`relative rounded-3xl bg-galaxy-950 border border-slate-700/80 overflow-hidden shadow-2xl h-[400px] sm:h-[460px] flex items-center justify-center select-none ${
              isSelectingTarget ? "cursor-crosshair ring-2 ring-galaxy-cyan" : ""
            }`}
          >
            {/* ------------------------------------------------------------- */}
            {/* LAYER 1: Original Shot (Base Left Side)                       */}
            {/* ------------------------------------------------------------- */}
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-950">
              <img
                src={selectedImage}
                alt="Original Raw"
                className="max-h-full max-w-full object-contain filter grayscale-[35%] brightness-[85%] contrast-[90%]"
              />

              {/* Simulated Glare Lines on Original Shot for Erase Reflection Demo */}
              {action === "eraseReflections" && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -rotate-12 translate-x-4 blur-[1px]" />
              )}

              {/* Simulated Photobomber Object Box on Original Shot */}
              {action === "removeObject" && (
                <div
                  className="absolute border-2 border-dashed border-rose-500 bg-rose-500/20 rounded-lg pointer-events-none flex items-center justify-center z-10"
                  style={{
                    left: `${targetBox.x}%`,
                    top: `${targetBox.y}%`,
                    width: `${targetBox.w}%`,
                    height: `${targetBox.h}%`,
                  }}
                >
                  <span className="text-[9px] font-mono text-rose-300 font-bold bg-black/80 px-1 py-0.5 rounded">
                    Unwanted Object
                  </span>
                </div>
              )}

              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-gray-300 uppercase tracking-wider border border-white/10 z-10">
                Original Shot (Raw)
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LAYER 2: AI Enhanced Image (Right Side Overlay Clipped)        */}
            {/* ------------------------------------------------------------- */}
            <div
              className={`absolute inset-0 flex items-center justify-center p-6 overflow-hidden transition-colors ${
                action === "generateBackground"
                  ? "bg-gradient-to-tr from-cyan-950 via-galaxy-900 to-indigo-950"
                  : "bg-galaxy-950"
              }`}
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              {/* Studio Backdrop Glow for Generative Background */}
              {action === "generateBackground" && (
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/25 via-indigo-500/10 to-transparent blur-2xl" />
              )}

              <img
                src={selectedImage}
                alt="Galaxy AI Enhanced"
                className="max-h-full max-w-full object-contain relative z-10 transition-all"
                style={{ filter: computedEnhancedFilter }}
              />

              {/* Object Eraser Patch: Photobomber Object visually removed on AI side */}
              {action === "removeObject" && (
                <div
                  className="absolute rounded-lg pointer-events-none z-20 flex items-center justify-center bg-cyan-950/90 border border-galaxy-cyan/60 backdrop-blur-md shadow-galaxy-cyan"
                  style={{
                    left: `${targetBox.x}%`,
                    top: `${targetBox.y}%`,
                    width: `${targetBox.w}%`,
                    height: `${targetBox.h}%`,
                  }}
                >
                  <span className="text-[9px] font-mono text-galaxy-cyan font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" /> Erased
                  </span>
                </div>
              )}

              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-950/90 backdrop-blur-md text-[10px] font-bold text-galaxy-cyan uppercase tracking-wider border border-cyan-500/40 z-20 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-galaxy-cyan" /> Galaxy AI: {result?.action || "Remastered"}
              </span>
            </div>

            {/* Target Select Prompt Banner */}
            {isSelectingTarget && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-galaxy-950/95 text-galaxy-cyan border border-galaxy-cyan px-4 py-2 rounded-full text-xs font-bold shadow-2xl z-40 animate-bounce flex items-center gap-2">
                <Target className="w-4 h-4 animate-spin" /> Tap image area to reposition Object Eraser
              </div>
            )}

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-galaxy-cyan shadow-galaxy-cyan z-30 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-galaxy-cyan text-galaxy-950 font-bold flex items-center justify-center text-xs shadow-lg">
                ⇄
              </div>
            </div>

            {/* Range Input for Split Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
              aria-label="Before/After Split Comparison Slider"
            />

            {/* Processing Spinner Overlay */}
            {processing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-galaxy-cyan animate-spin" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Synthesizing with Quantum NPU...
                </span>
              </div>
            )}
          </div>

          {/* Slider Instruction */}
          <div className="flex items-center justify-between text-xs text-gray-400 px-2">
            <span>&larr; Drag slider left to reveal Original Raw Shot</span>
            <span>Drag slider right for Galaxy AI Enhancement &rarr;</span>
          </div>

          {/* Manual Fine-Tuning Sliders */}
          <div className="rounded-2xl bg-galaxy-900/90 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-galaxy-cyan flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Live Manual Adjustments
              </h4>
              <button
                onClick={resetManualAdjustments}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 font-medium mb-1">
                  <span>Brightness</span>
                  <span className="font-mono text-galaxy-cyan">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-galaxy-cyan bg-galaxy-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 font-medium mb-1">
                  <span>Contrast</span>
                  <span className="font-mono text-galaxy-cyan">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-galaxy-cyan bg-galaxy-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 font-medium mb-1">
                  <span>Saturation</span>
                  <span className="font-mono text-galaxy-cyan">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-galaxy-cyan bg-galaxy-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 font-medium mb-1">
                  <span>Sharpness</span>
                  <span className="font-mono text-galaxy-cyan">{sharpness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={sharpness}
                  onChange={(e) => setSharpness(Number(e.target.value))}
                  className="w-full accent-galaxy-cyan bg-galaxy-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Buttons */}
          <div className="rounded-2xl bg-galaxy-900/90 border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-galaxy-cyan">
              Select AI Feature
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "enhanceImage", label: "AI Remaster & HDR", icon: Wand2, desc: "Dramatic color depth and vibrant HDR pop" },
                { id: "removeObject", label: "Object Eraser", icon: Eraser, desc: "Erase unwanted object with generative fill" },
                { id: "eraseReflections", label: "Erase Reflections", icon: Eye, desc: "Strip window glare and polarization reflections" },
                { id: "generateBackground", label: "Generative Studio Background", icon: Layers, desc: "Synthesize vibrant ambient studio bokeh" },
              ].map((btn) => {
                const Icon = btn.icon;
                const isActive = action === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => {
                      if (btn.id === "removeObject") {
                        setIsSelectingTarget(true);
                      }
                      handleProcess(btn.id);
                    }}
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
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{btn.label}</span>
                        {btn.id === "removeObject" && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                            Tap Canvas
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 leading-tight mt-0.5">{btn.desc}</div>
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
