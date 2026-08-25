"use client";

import React, { useState } from "react";
import { Languages, Volume2, Copy, Check, Sparkles, ArrowRightLeft, Loader2, History, Mic, Square } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { BCP47_LANG_MAP } from "@/lib/mockAI";

const LANGUAGES = [
  "English",
  "Korean",
  "Japanese",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Hindi",
  "Italian",
  "Arabic",
];

const PRESETS = [
  "Hello, how can I help you today?",
  "I would like to book a table for two at 7 PM.",
  "Where is the nearest subway station?",
];

interface TranscriptEntry {
  id: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  timestamp: string;
}

export default function AIDemoTranslate() {
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Korean");
  const [inputText, setInputText] = useState(PRESETS[0]);
  const [outputText, setOutputText] = useState("안녕하세요, 오늘 어떻게 도와드릴까요?");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [engineInfo, setEngineInfo] = useState("Galaxy Quantum NPU (On-Device)");
  const [transcriptLog, setTranscriptLog] = useState<TranscriptEntry[]>([
    {
      id: "log-1",
      sourceLang: "English",
      targetLang: "Korean",
      sourceText: "Hello, how can I help you today?",
      translatedText: "안녕하세요, 오늘 어떻게 도와드릴까요?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const { showToast } = useToast();

  const handleTranslate = async (overrideText?: string, overrideSource?: string, overrideTarget?: string) => {
    const textToTranslate = overrideText !== undefined ? overrideText : inputText;
    const src = overrideSource || sourceLang;
    const tgt = overrideTarget || targetLang;

    if (!textToTranslate.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: src,
          targetLang: tgt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOutputText(data.translatedText);
        setEngineInfo(data.engine);

        const entry: TranscriptEntry = {
          id: Math.random().toString(),
          sourceLang: src,
          targetLang: tgt,
          sourceText: textToTranslate,
          translatedText: data.translatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setTranscriptLog((prev) => [entry, ...prev.slice(0, 4)]);
        showToast(`Live Translated to ${tgt}!`, "ai");
      }
    } catch (e) {
      showToast("Translation error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMicSim = () => {
    if (isRecordingMic) return;
    setIsRecordingMic(true);
    showToast("Listening... Speak into microphone.", "info");

    setTimeout(() => {
      setIsRecordingMic(false);
      const spokenText = "Can you recommend a great local restaurant nearby?";
      setInputText(spokenText);
      handleTranslate(spokenText, sourceLang, targetLang);
      showToast("Voice captured & translated live!", "ai");
    }, 2500);
  };

  const handleSwap = () => {
    const newSrc = targetLang;
    const newTgt = sourceLang;
    const newIn = outputText;
    const newOut = inputText;

    setSourceLang(newSrc);
    setTargetLang(newTgt);
    setInputText(newIn);
    setOutputText(newOut);

    handleTranslate(newIn, newSrc, newTgt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    showToast("Translation copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(outputText);
      const bcpCode = BCP47_LANG_MAP[targetLang] || "en-US";
      utterance.lang = bcpCode;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("Audio synthesis simulated.", "info");
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Languages className="w-4 h-4 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong>Live Translate Demo:</strong> Two-way real-time voice and text translations with native BCP-47 speech synthesis and automatic sync.
          </span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-emerald-400/30">
          Latency: ~12ms
        </span>
      </div>

      {/* Language Selector Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-galaxy-900/90 border border-slate-800 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold">From:</span>
          <select
            value={sourceLang}
            onChange={(e) => {
              const val = e.target.value;
              setSourceLang(val);
              handleTranslate(inputText, val, targetLang);
            }}
            className="bg-galaxy-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-galaxy-cyan transition-colors"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold">To:</span>
          <select
            value={targetLang}
            onChange={(e) => {
              const val = e.target.value;
              setTargetLang(val);
              handleTranslate(inputText, sourceLang, val);
            }}
            className="bg-galaxy-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-galaxy-cyan"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets & Live Mic Simulator */}
      <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 font-medium">Quick Phrases:</span>
          {PRESETS.map((phrase, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(phrase);
                handleTranslate(phrase, sourceLang, targetLang);
              }}
              className="px-3 py-1 rounded-lg bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 transition-colors"
            >
              &ldquo;{phrase.slice(0, 24)}...&rdquo;
            </button>
          ))}
        </div>

        <button
          onClick={handleMicSim}
          disabled={isRecordingMic}
          className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all ${
            isRecordingMic
              ? "bg-rose-950 text-rose-300 border-rose-500 animate-pulse"
              : "bg-cyan-950 hover:bg-cyan-900 text-galaxy-cyan border-cyan-500/40"
          }`}
        >
          <Mic className={`w-4 h-4 ${isRecordingMic ? "animate-spin text-rose-400" : ""}`} />
          <span>{isRecordingMic ? "Listening Spoken Audio..." : "Simulate Live Voice Input"}</span>
        </button>
      </div>

      {/* Two Panes: Input & Translated Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Box */}
        <div className="rounded-2xl bg-galaxy-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
              <span>Input Text ({sourceLang})</span>
              <span>{inputText.length} chars</span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any sentence or message to translate..."
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleTranslate()}
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-galaxy-cyan"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" /> Live Translate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Box */}
        <div className="rounded-2xl bg-galaxy-900 border border-cyan-500/30 p-5 flex flex-col justify-between space-y-4 relative shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between text-xs text-galaxy-cyan font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Galaxy AI Output ({targetLang})
              </span>
              <span className="text-gray-500 font-mono text-[10px]">{engineInfo}</span>
            </div>
            <div className="w-full min-h-[148px] bg-galaxy-950 border border-cyan-500/20 rounded-xl p-4 text-base text-cyan-200 font-medium leading-relaxed select-text">
              {outputText || <span className="text-gray-500 text-sm italic">Translation will appear here...</span>}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border border-slate-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs ${
                isPlayingAudio ? "bg-cyan-500/20 text-galaxy-cyan border-cyan-500/40 animate-pulse" : "bg-galaxy-950 hover:bg-slate-800"
              }`}
              title="Play Native Voice Pronunciation"
            >
              <Volume2 className="w-4 h-4" /> Speak ({BCP47_LANG_MAP[targetLang] || "Native"})
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-galaxy-950 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Conversation Transcript Log */}
      {transcriptLog.length > 0 && (
        <div className="rounded-2xl bg-galaxy-900 border border-slate-800 p-5 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-galaxy-cyan" /> Conversation Log & Session Transcript
          </h4>
          <div className="space-y-2">
            {transcriptLog.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-galaxy-950 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono">[{log.timestamp}] {log.sourceLang} &rarr; {log.targetLang}</span>
                  <div className="text-gray-300 mt-0.5">&ldquo;{log.sourceText}&rdquo;</div>
                  <div className="text-galaxy-cyan font-semibold mt-0.5">{log.translatedText}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
