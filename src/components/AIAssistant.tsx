"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot, ArrowRight, Loader2, Cpu, Camera, Languages, ShieldCheck, Gamepad2, GraduationCap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedLinks?: { label: string; url: string }[];
}

const QUICK_CHIPS = [
  { label: "Best for photography?", icon: Camera },
  { label: "Knox Security?", icon: ShieldCheck },
  { label: "Best for gaming?", icon: Gamepad2 },
  { label: "Student deals?", icon: GraduationCap },
  { label: "Live Translate offline?", icon: Languages },
];

// Animated NPU waveform bars
function NPUWaveform() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.75, 0.45, 0.85].map((h, i) => (
        <div
          key={i}
          className="w-0.5 bg-galaxy-cyan rounded-full"
          style={{
            height: `${h * 100}%`,
            animation: `pulse ${0.5 + i * 0.07}s ease-in-out infinite alternate`,
            opacity: 0.7 + h * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi there! I'm your **Galaxy AI Copilot**. Ask me anything about Galaxy smartphones, Knox privacy, camera zoom, interactive AI demos, or student discounts!",
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
      {/* Floating Toggle Button with Glowing Aura Ring */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 blur-md opacity-75 animate-pulse" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 rounded-full bg-gradient-to-tr from-galaxy-cyan via-cyan-400 to-blue-600 text-galaxy-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
          aria-label="Galaxy AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-galaxy-950 animate-spin-slow" />
          <span className="hidden sm:inline text-xs font-extrabold tracking-wide text-galaxy-950 pr-1">
            Galaxy AI Copilot
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[600px] h-[540px] rounded-3xl bg-galaxy-950/97 border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-galaxy-900 via-galaxy-850 to-galaxy-900 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-galaxy-cyan">
                <div className="w-full h-full bg-galaxy-950 rounded-[14px] flex items-center justify-center text-galaxy-cyan">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  Galaxy AI Copilot <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-galaxy-cyan" /> Quantum NPU Engine • Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
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
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-galaxy-950 font-semibold rounded-tr-none shadow-md"
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
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-galaxy-950 flex-shrink-0 mt-0.5 text-[10px] font-extrabold">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* NPU Waveform Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan flex-shrink-0">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-galaxy-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-3 flex flex-col gap-1.5 shadow-lg">
                  <NPUWaveform />
                  <span className="text-[10px] text-gray-400 font-medium">Synthesizing via Quantum NPU...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action chips with icons */}
          <div className="px-3 py-2 bg-galaxy-950/90 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {QUICK_CHIPS.map((chip, i) => {
              const Icon = chip.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(chip.label)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-gray-300 hover:text-galaxy-cyan whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3" />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-galaxy-900/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Galaxy AI Copilot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-galaxy-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-galaxy-cyan to-blue-500 hover:opacity-90 disabled:opacity-50 text-galaxy-950 transition-all shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}


