"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot, ArrowRight, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedLinks?: { label: string; url: string }[];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi there! I'm your **Galaxy AI Assistant**. Ask me anything about Galaxy smartphones, Knox privacy, camera zoom, interactive AI demos, or student discounts!",
      suggestedLinks: [
        { label: "📸 Best for Photography", url: "/devices/galaxy-s25-ultra" },
        { label: "🎓 Best for Students", url: "/devices/galaxy-tab-s10-ultra" },
        { label: "✨ Try Live AI Demos", url: "/ai/demos" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: Math.random().toString(),
          role: "assistant",
          content: data.reply,
          suggestedLinks: data.suggestedLinks,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: "Sorry, I encountered a hiccup connecting to the Galaxy AI service. Please try again.",
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Network issue. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-galaxy-950 font-bold shadow-2xl shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
        aria-label="Galaxy AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
        <span className="hidden sm:inline text-xs font-extrabold tracking-wide text-white pr-1">
          Galaxy AI
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[580px] h-[520px] rounded-2xl bg-galaxy-950/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-galaxy-900 via-galaxy-850 to-galaxy-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-galaxy-cyan">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  Galaxy AI Assistant <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-gray-400">On-Device Intelligence & Hardware Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-galaxy-950 font-medium rounded-tr-none"
                      : "bg-galaxy-900/90 border border-slate-800 text-gray-200 rounded-tl-none space-y-2 shadow-lg"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800/80">
                      {msg.suggestedLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1 rounded-lg bg-galaxy-800/80 hover:bg-cyan-950 hover:border-cyan-500/40 border border-slate-700 text-cyan-300 hover:text-cyan-200 text-[10px] font-semibold transition-all flex items-center gap-1"
                        >
                          {link.label} <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-gray-300 flex-shrink-0 mt-0.5 text-[10px] font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Synthesizing response with Quantum NPU...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick starter chips */}
          <div className="px-3 py-2 bg-galaxy-950/80 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {["Best phone for photo?", "Knox Security?", "Student deals?", "Live Translate offline?"].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-300 whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-galaxy-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Galaxy AI Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-galaxy-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-galaxy-cyan hover:bg-cyan-400 disabled:opacity-50 text-galaxy-950 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
