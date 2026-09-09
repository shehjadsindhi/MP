"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot, ArrowRight, Loader2, Cpu, Camera, Languages, ShieldCheck, Gamepad2, GraduationCap, History, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedLinks?: { label: string; url: string }[];
}

interface Conversation {
  id: string;
  messages: Message[];
  messageCount: number;
  firstMessage: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

const QUICK_CHIPS = [
  { label: "Best for photography?", icon: Camera },
  { label: "Knox Security?", icon: ShieldCheck },
  { label: "Best for gaming?", icon: Gamepad2 },
  { label: "Student deals?", icon: GraduationCap },
  { label: "Live Translate offline?", icon: Languages },
];

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
  const [view, setView] = useState<"chat" | "history">("chat");
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && chatPanelRef.current) {
      chatPanelRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && isOpen && view === "history") {
      fetchConversations();
    }
  }, [user, isOpen, view]);

  const fetchConversations = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/ai/chat/history");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      showToast("Failed to load chat history", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewChat = () => {
    setMessages([
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
    setCurrentConversationId(null);
    setView("chat");
  };

  const loadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages);
    setCurrentConversationId(conversation.id);
    setView("chat");
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          conversationId: currentConversationId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          suggestedLinks: data.suggestedLinks,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        if (data.conversationId && !currentConversationId) {
          setCurrentConversationId(data.conversationId);
        }
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to send message", "error");
      }
    } catch (e) {
      showToast("Network error. Please retry.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickChip = (label: string) => {
    sendMessage(label);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "rotate-90" : ""
        }`}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div 
          ref={chatPanelRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="fixed bottom-24 right-6 z-40 w-[400px] max-h-[600px] h-[500px] bg-galaxy-900/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Galaxy AI Assistant"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-galaxy-cyan">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Galaxy AI Copilot</h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <button
                  onClick={() => setView(view === "chat" ? "history" : "chat")}
                  className="p-2 rounded-xl hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
                  title={view === "chat" ? "History" : "New Chat"}
                >
                  {view === "chat" ? <History className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {view === "history" ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-white">Chat History</h4>
                <button
                  onClick={startNewChat}
                  className="text-[10px] px-2 py-1 rounded-lg bg-cyan-500/10 text-galaxy-cyan border border-cyan-500/30 font-semibold hover:bg-cyan-500/20 transition-colors"
                >
                  New Chat
                </button>
              </div>
              {loadingHistory ? (
                <div className="text-center py-8 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading history...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No chat history yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv)}
                    className="w-full text-left p-3 rounded-2xl bg-galaxy-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-1"
                  >
                    <div className="text-xs font-semibold text-white line-clamp-1">
                      {conv.firstMessage || "New Conversation"}
                    </div>
                    <div className="text-[10px] text-gray-500 line-clamp-2">
                      {conv.lastMessage || "No messages"}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      {conv.messageCount} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950"
                          : "bg-galaxy-950 border border-slate-800 text-gray-200"
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                      {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1">
                          {msg.suggestedLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.url}
                              className="block text-[10px] text-galaxy-cyan hover:underline"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-galaxy-950 border border-slate-800 p-3 rounded-2xl">
                      <NPUWaveform />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chips */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHIPS.map((chip) => {
                      const Icon = chip.icon;
                      return (
                        <button
                          key={chip.label}
                          onClick={() => handleQuickChip(chip.label)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-galaxy-950 border border-slate-800 text-[10px] text-gray-300 hover:text-white hover:border-cyan-500/40 transition-all"
                        >
                          <Icon className="w-3 h-3" />
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Galaxy AI..."
                    className="flex-1 bg-galaxy-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/40"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
