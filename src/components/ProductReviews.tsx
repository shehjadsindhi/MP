"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, ThumbsUp, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  verified: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (e) {
      console.warn("Failed to fetch reviews:", e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to write a review", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...form }),
      });

      if (res.ok) {
        showToast("Review submitted successfully!", "success");
        setShowForm(false);
        setForm({ rating: 5, title: "", comment: "" });
        fetchReviews();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to submit review", "error");
      }
    } catch (e) {
      showToast("Network error. Please retry.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
      />
    ));
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Review deleted successfully.", "info");
        fetchReviews();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete review", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-galaxy-cyan" />
        <p className="text-xs">Loading genuine product reviews...</p>
      </div>
    );
  }

  // Calculate rating distribution
  const totalReviews = data?.reviews?.length || 0;
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  data?.reviews?.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Reviews Summary & Breakdown Header */}
      <div className="rounded-3xl bg-galaxy-900/60 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Verified Customer Ratings</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">{renderStars(Math.round(data?.averageRating || 0))}</div>
              <span className="text-xs text-gray-300 font-bold">
                {data?.averageRating?.toFixed(1) || "0.0"} out of 5.0
              </span>
              <span className="text-xs text-gray-500">({data?.reviewCount || 0} reviews)</span>
            </div>
          </div>
          {user && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-extrabold text-xs hover:opacity-95 transition-opacity shadow-galaxy-cyan"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Rating Distribution Breakdown */}
        {totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 font-semibold">
                      {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>
                    <span>{pct}% ({count})</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-galaxy-950 border border-slate-800 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, rating: i + 1 })}
                  className="p-1"
                >
                  <Star
                    className={`w-5 h-5 ${i < form.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Review Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/40"
              placeholder="e.g., Outstanding battery life and S-Pen responsiveness"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Detailed Feedback</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4}
              required
              className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/40 resize-none leading-relaxed"
              placeholder="Share how the display, Galaxy AI features, and camera performed in your daily workflow..."
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-gray-300 font-semibold text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {data?.reviews?.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-galaxy-900/30 border border-slate-800/80 text-gray-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-galaxy-cyan" />
            <p className="text-sm font-semibold text-white">No customer reviews yet</p>
            <p className="text-xs text-gray-500">Be the first verified customer to share your experience with this device.</p>
          </div>
        ) : (
          data?.reviews?.map((review) => {
            const isAuthor = user && (review.user?.id === user.id || user.role === "ADMIN");
            return (
              <div key={review.id} className="p-5 rounded-2xl bg-galaxy-950 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                    {review.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {isAuthor && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {review.title && <h4 className="text-sm font-bold text-white">{review.title}</h4>}
                <p className="text-xs text-gray-300 leading-relaxed">{review.comment}</p>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1 border-t border-slate-900">
                  <span className="font-semibold text-gray-400">{review.user.name}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
