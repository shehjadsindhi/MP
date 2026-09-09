"use client";

import React, { useState, useEffect } from "react";
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

  const fetchReviews = async () => {
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
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

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

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">{renderStars(Math.round(data?.averageRating || 0))}</div>
            <span className="text-xs text-gray-400">
              {data?.averageRating?.toFixed(1) || "0.0"} ({data?.reviewCount || 0} reviews)
            </span>
          </div>
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-galaxy-950 border border-slate-800 space-y-4">
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
            <label className="text-xs font-semibold text-gray-300">Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
              placeholder="Summarize your experience"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Review</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4}
              required
              className="w-full bg-galaxy-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40 resize-none"
              placeholder="Share your thoughts about this product"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 font-semibold text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {data?.reviews?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          data?.reviews?.map((review) => (
            <div key={review.id} className="p-4 rounded-2xl bg-galaxy-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                  {review.verified && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && <h4 className="text-sm font-bold text-white">{review.title}</h4>}
              <p className="text-xs text-gray-300 leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="font-semibold text-gray-400">{review.user.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
