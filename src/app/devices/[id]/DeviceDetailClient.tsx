"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  CheckCircle2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Share2,
  Layers,
  MessageSquare,
  Package,
  ThumbsUp,
  X,
  Check,
  Shield
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export default function DeviceDetailClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  let gallery: string[] = [product.image];
  let colors: { name: string; hex: string; inStock: boolean }[] = [];
  let storageOptions: { size: string; priceOffset: number }[] = [];
  let specs: Record<string, string> = {};
  let aiFeatures: string[] = [];

  try {
    if (product.galleryJson) {
      const g = JSON.parse(product.galleryJson);
      if (Array.isArray(g) && g.length > 0) gallery = g;
    }
    if (product.colorsJson) colors = JSON.parse(product.colorsJson);
    if (product.storageJson) storageOptions = JSON.parse(product.storageJson);
    if (product.specsJson) specs = JSON.parse(product.specsJson);
    if (product.aiFeaturesJson) aiFeatures = JSON.parse(product.aiFeaturesJson);
  } catch (e) {}

  const [activeImage, setActiveImage] = useState(gallery[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Default");
  const [selectedStorage, setSelectedStorage] = useState(
    storageOptions[0] || { size: "Standard", priceOffset: 0 }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "ai" | "reviews" | "box">("overview");

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, title: "", comment: "" });

  // Compare Modal State
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Mock Reviews List
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      author: "Alex Morgan",
      rating: 5,
      date: "2 days ago",
      title: "Mindblowing NPU & Circle to Search!",
      comment:
        "The build quality with Titanium is unreal. Live Translate during phone calls with clients overseas worked flawlessly without any delay. Highly recommended!",
      verified: true,
      helpfulCount: 24,
    },
    {
      id: "rev-2",
      author: "Samantha Reed",
      rating: 5,
      date: "1 week ago",
      title: "Generative Edit is magic",
      comment:
        "I was able to erase photobombers from my vacation photos in seconds. Battery life easily lasts 1.5 days of heavy use.",
      verified: true,
      helpfulCount: 18,
    },
    {
      id: "rev-3",
      author: "Dr. Ryan Vance",
      rating: 4,
      date: "2 weeks ago",
      title: "Outstanding performance & Knox Security",
      comment:
        "Display brightness of 2600 nits under direct sunlight is incredible. Note Assist makes meeting notes effortless.",
      verified: true,
      helpfulCount: 12,
    },
  ]);

  const isLiked = isInWishlist(product.id);
  const livePrice = product.price + (selectedStorage?.priceOffset || 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: livePrice,
      originalPrice: product.originalPrice ? product.originalPrice + (selectedStorage?.priceOffset || 0) : undefined,
      image: activeImage,
      selectedColor,
      selectedStorage: selectedStorage.size,
      quantity,
    });
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      badge: product.badge,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "info");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      showToast("Please complete all required review fields.", "error");
      return;
    }

    const created: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newReview.name,
      rating: newReview.rating,
      date: "Just now",
      title: newReview.title || "Great Galaxy Device!",
      comment: newReview.comment,
      verified: true,
      helpfulCount: 0,
    };

    setReviewsList([created, ...reviewsList]);
    setIsReviewModalOpen(false);
    setNewReview({ name: "", rating: 5, title: "", comment: "" });
    showToast("Thank you! Your product review has been published.", "success");
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast("Feedback recorded!", "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* Breadcrumbs & Actions Header */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Link href="/devices" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Devices
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.category}</span>
          <span>/</span>
          <span className="text-galaxy-cyan font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            <Layers className="w-3.5 h-3.5" /> Compare Model
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Active Image Viewport */}
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl bg-gradient-to-b from-galaxy-900 to-galaxy-950 border border-slate-800 p-8 flex items-center justify-center shadow-2xl overflow-hidden group">
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan font-bold text-xs uppercase tracking-wider backdrop-blur-md z-10">
                {product.badge}
              </span>
            )}
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-galaxy-900 border transition-all flex-shrink-0 flex items-center justify-center ${
                    activeImage === imgUrl
                      ? "border-galaxy-cyan shadow-galaxy-cyan scale-105"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-galaxy-cyan font-semibold uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-galaxy-900/80 border border-slate-800 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(livePrice)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-gray-500 line-through">
                  {formatPrice(product.originalPrice + (selectedStorage?.priceOffset || 0))}
                </span>
              )}
            </div>

            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units ready)
            </div>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold font-mono">Finish / Color:</span>
                <strong className="text-white">{selectedColor}</strong>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-all ${
                      selectedColor === c.name
                        ? "border-galaxy-cyan bg-cyan-950/40 text-cyan-200 shadow-galaxy-cyan font-bold"
                        : "border-slate-800 hover:border-slate-600 bg-galaxy-900 text-gray-300"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {storageOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold font-mono">Storage Capacity:</span>
                <strong className="text-white">{selectedStorage?.size}</strong>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {storageOptions.map((s, idx) => {
                  const isSelected = selectedStorage.size === s.size;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedStorage(s)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-galaxy-cyan bg-cyan-950/50 text-white shadow-galaxy-cyan font-bold"
                          : "border-slate-800 hover:border-slate-700 bg-galaxy-900 text-gray-300"
                      }`}
                    >
                      <div className="text-sm">{s.size}</div>
                      <div className="text-[11px] text-gray-400 font-normal">
                        {s.priceOffset === 0 ? "Standard Base" : `+${formatPrice(s.priceOffset)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Counter */}
              <div className="flex items-center border border-slate-700 rounded-2xl bg-galaxy-900 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isLiked
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                    : "bg-galaxy-900 border-slate-700 text-gray-400 hover:text-white hover:border-slate-500"
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-galaxy-cyan" /> Add to Cart
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-extrabold text-sm hover:opacity-95 shadow-galaxy-cyan transition-opacity flex items-center justify-center gap-2"
            >
              Buy Now with 1-Click Checkout &rarr;
            </button>
          </div>

          {/* Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center text-xs text-gray-400">
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-galaxy-cyan" />
              <span>Free Express Delivery</span>
            </div>
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>2-Year Galaxy Care</span>
            </div>
            <div className="p-3 rounded-xl bg-galaxy-950/60 border border-slate-800/80 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>30-Day Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Tabs Header */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                : "bg-galaxy-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Overview & Highlights
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "specs"
                ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                : "bg-galaxy-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" /> Technical Specifications
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "ai"
                ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                : "bg-galaxy-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Galaxy AI Suite ({aiFeatures.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "reviews"
                ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                : "bg-galaxy-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Star className="w-4 h-4" /> Reviews & Ratings ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab("box")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "box"
                ? "bg-galaxy-cyan text-galaxy-950 shadow-galaxy-cyan"
                : "bg-galaxy-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Package className="w-4 h-4" /> What&apos;s In The Box
          </button>
        </div>

        {/* Tab 1: Overview & Highlights */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-galaxy-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-galaxy-cyan flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Quantum NPU Intelligence</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Dedicated on-device Neural Processing Unit processes generative translation, writing assist, and image reconstruction with sub-15ms latency and total privacy.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-galaxy-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Samsung Knox Vault Protection</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Hardware-isolated enclave certified EAL5+ guarantees biometric credentials, private keys, and on-device AI embeddings remain tamper-proof.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-galaxy-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Titanium Craftsmanship</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Precision engineered Grade 4 Titanium shield with Corning Gorilla Armor glass delivering 4x scratch resistance and anti-reflective display clarity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Specifications */}
        {activeTab === "specs" && (
          <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-galaxy-cyan" /> Complete Hardware & Performance Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 divide-y md:divide-y-0 divide-slate-800">
              {Object.entries(specs).map(([key, val], idx) => (
                <div key={idx} className="py-3 flex justify-between text-xs border-b border-slate-800/80">
                  <span className="font-semibold text-gray-400">{key}</span>
                  <span className="text-white text-right font-semibold max-w-xs">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Galaxy AI Suite */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-galaxy-cyan" /> Integrated Galaxy AI Suite
              </h3>
              <Link
                href="/ai/demos"
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-galaxy-cyan text-xs font-bold transition-colors"
              >
                Launch AI Demo Lab &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiFeatures.map((slug, idx) => (
                <Link
                  key={idx}
                  href={`/ai/features/${slug}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-galaxy-950 border border-slate-800 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 text-galaxy-cyan flex items-center justify-center text-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white group-hover:text-galaxy-cyan capitalize block">
                        {slug.replace(/-/g, " ")}
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Native hardware acceleration enabled
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Customer Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Rating Summary Bar */}
            <div className="p-8 rounded-3xl bg-galaxy-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 text-center md:text-left space-y-2">
                <div className="text-5xl font-extrabold text-white">{product.rating.toFixed(1)}</div>
                <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-gray-400">Based on verified customer reviews</div>
              </div>

              <div className="md:col-span-5 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-8 text-gray-400 font-semibold">5 ★</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="w-8 text-right text-gray-400">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-gray-400 font-semibold">4 ★</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "12%" }} />
                  </div>
                  <span className="w-8 text-right text-gray-400">12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-gray-400 font-semibold">3 ★</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "3%" }} />
                  </div>
                  <span className="w-8 text-right text-gray-400">3%</span>
                </div>
              </div>

              <div className="md:col-span-3 text-center md:text-right">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-galaxy-cyan text-galaxy-950 font-extrabold text-xs hover:opacity-90 shadow-galaxy-cyan transition-opacity"
                >
                  Write a Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-galaxy-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-950 text-galaxy-cyan font-bold flex items-center justify-center text-xs border border-cyan-500/30">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{rev.author}</span>
                          {rev.verified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">{rev.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-galaxy-cyan" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: What's in the box */}
        {activeTab === "box" && (
          <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-8 space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-galaxy-cyan" /> Standard Box Contents & Protection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center gap-3">
                <Check className="w-5 h-5 text-galaxy-cyan" />
                <div>
                  <div className="text-xs font-bold text-white">{product.name}</div>
                  <div className="text-[10px] text-gray-400">Flagship Hardware Unit</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center gap-3">
                <Check className="w-5 h-5 text-galaxy-cyan" />
                <div>
                  <div className="text-xs font-bold text-white">Braided USB-C to USB-C Cable</div>
                  <div className="text-[10px] text-gray-400">3A Super-Speed Fast Charging</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center gap-3">
                <Check className="w-5 h-5 text-galaxy-cyan" />
                <div>
                  <div className="text-xs font-bold text-white">SIM Tray Ejector Pin</div>
                  <div className="text-[10px] text-gray-400">Stainless Steel Tool</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800 flex items-center gap-3">
                <Check className="w-5 h-5 text-galaxy-cyan" />
                <div>
                  <div className="text-xs font-bold text-white">Quick Start & Warranty Card</div>
                  <div className="text-[10px] text-gray-400">2-Year Galaxy Care Pass</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <h3 className="text-2xl font-bold text-white">Compare Similar Galaxy Devices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="p-5 rounded-2xl bg-galaxy-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="h-40 flex items-center justify-center p-2">
                  <img src={rel.image} alt={rel.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{rel.name}</h4>
                  <div className="text-sm font-extrabold text-galaxy-cyan mt-1">
                    {formatPrice(rel.price)}
                  </div>
                </div>
                <Link
                  href={`/devices/${rel.slug}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white text-center transition-colors block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-galaxy-950 border border-slate-800 rounded-3xl p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Write a Customer Review</h3>
              <p className="text-xs text-gray-400 mt-1">Share your experience with {product.name}</p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-4 py-2.5 rounded-xl bg-galaxy-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-galaxy-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Best Galaxy AI phone ever!"
                  className="w-full px-4 py-2.5 rounded-xl bg-galaxy-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-galaxy-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Comments</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Tell us what you liked about performance, camera, or AI features..."
                  className="w-full px-4 py-2.5 rounded-xl bg-galaxy-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-galaxy-cyan"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-galaxy-cyan text-galaxy-950 text-xs font-bold shadow-galaxy-cyan hover:opacity-90"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compare Models Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-galaxy-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-galaxy-cyan" /> Model Comparison Matrix
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Side-by-side comparison of {product.name} with related devices
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 text-gray-400 font-semibold">Feature</th>
                    <th className="p-3 text-galaxy-cyan font-bold">{product.name}</th>
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <th key={rel.id} className="p-3 text-white font-bold">{rel.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-gray-300">
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">Price</td>
                    <td className="p-3 text-white font-bold">{formatPrice(product.price)}</td>
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <td key={rel.id} className="p-3">{formatPrice(rel.price)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">Category</td>
                    <td className="p-3 text-white">{product.category}</td>
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <td key={rel.id} className="p-3">{rel.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">Rating</td>
                    <td className="p-3 text-amber-400 font-bold">★ {product.rating.toFixed(1)}</td>
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <td key={rel.id} className="p-3 text-amber-400">★ {rel.rating.toFixed(1)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">Badge</td>
                    <td className="p-3 text-galaxy-cyan font-semibold">{product.badge || "Standard"}</td>
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <td key={rel.id} className="p-3">{rel.badge || "Standard"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-galaxy-cyan text-galaxy-950 font-bold text-xs shadow-galaxy-cyan"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
