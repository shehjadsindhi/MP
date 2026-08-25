"use client";

import React, { useState } from "react";
import { FileCheck, Sparkles, CheckSquare, Square, ListTodo, AlignLeft, Copy, Check, Loader2, Mic, Clock } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const SAMPLE_NOTES = `Team Meeting Notes - Galaxy AI Launch
- Discussed Quantum NPU latency benchmarks (12ms for Live Translate)
- Sarah to finalize S25 Ultra titanium gallery assets by Thursday 2pm
- Need to sync with Knox Vault team for hardware certification audit
- Customer survey showed 94% satisfaction with Circle to Search
- Mark will coordinate student discount promo rollout for Tab S10 Ultra`;

export default function AIDemoNotes() {
  const [inputNotes, setInputNotes] = useState(SAMPLE_NOTES);
  const [activeAction, setActiveAction] = useState<"summarize" | "extractTasks" | "todoList" | "formatNotes" | "transcript">("extractTasks");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean; priority: string }[]>([
    { id: "t1", text: "Finalize S25 Ultra titanium gallery assets (Sarah - Thu 2pm)", done: false, priority: "High" },
    { id: "t2", text: "Schedule Knox Vault hardware certification audit sync", done: true, priority: "High" },
    { id: "t3", text: "Roll out Tab S10 Ultra student discount campaign (Mark)", done: false, priority: "Medium" },
    { id: "t4", text: "Archive Quantum NPU 12ms latency benchmark report", done: false, priority: "Low" },
  ]);

  const [transcriptData, setTranscriptData] = useState<{ timestamp: string; speaker: string; text: string }[]>([
    { timestamp: "00:04", speaker: "Prof. Harrison", text: "Welcome everyone. Today we're reviewing the Quantum NPU architecture and latency metrics." },
    { timestamp: "00:22", speaker: "Sarah (Lead)", text: "Our benchmarks show 12ms for Live Translate and under 15ms for Knox Vault verification." },
    { timestamp: "01:05", speaker: "Student", text: "Does the on-device NPU operate without internet connectivity?" },
    { timestamp: "01:18", speaker: "Prof. Harrison", text: "Yes, complete hardware isolation guarantees offline privacy." },
  ]);

  const [summaryData, setSummaryData] = useState<any>({
    title: "Action Items & Deliverables",
    summary: [
      "Extracted 4 actionable deliverables with assigned team members and urgency deadlines.",
    ],
  });

  const { showToast } = useToast();

  const handleProcess = async (act: "summarize" | "extractTasks" | "todoList" | "formatNotes" | "transcript", textToUse?: string) => {
    setActiveAction(act);
    const txt = textToUse !== undefined ? textToUse : inputNotes;
    if (!txt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: txt, action: act }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData({
          title: data.resultTitle,
          summary: data.summary,
          formattedContent: data.formattedContent,
        });
        if (data.tasks) {
          setTasks(data.tasks);
        }
        if (data.transcriptDiarization) {
          setTranscriptData(data.transcriptDiarization);
        }
        showToast(`Note Assist: ${data.resultTitle} generated!`, "ai");
      }
    } catch (e) {
      showToast("Error processing notes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordLectureSim = () => {
    if (isRecordingAudio) return;
    setIsRecordingAudio(true);
    showToast("Recording live lecture audio...", "info");

    setTimeout(() => {
      setIsRecordingAudio(false);
      const audioNotes = "Lecture Recording:\n- Professor Harrison explained on-device NPU vs cloud AI.\n- Student asked about S-Pen handwriting OCR accuracy.\n- Final exam will cover Knox Vault EAL5+ security specs.";
      setInputNotes(audioNotes);
      handleProcess("transcript", audioNotes);
      showToast("Lecture transcript diarized automatically!", "ai");
    }, 2500);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleCopy = () => {
    let textToCopy = "";
    if (activeAction === "extractTasks" || activeAction === "todoList") {
      textToCopy = tasks.map((t) => `[${t.done ? "X" : " "}] ${t.text}`).join("\n");
    } else if (activeAction === "transcript") {
      textToCopy = transcriptData.map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join("\n");
    } else if (activeAction === "formatNotes") {
      textToCopy = summaryData.formattedContent || inputNotes;
    } else {
      textToCopy = summaryData.summary ? summaryData.summary.join("\n") : inputNotes;
    }

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast("Notes copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <FileCheck className="w-4 h-4 text-galaxy-cyan flex-shrink-0" />
          <span>
            <strong>Note Assist & Transcript Assist Demo:</strong> Automatically structure notes, extract task checklists, and diarize multi-speaker transcripts in Samsung Notes.
          </span>
        </div>
        <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border border-indigo-400/30">
          Samsung Notes NPU
        </span>
      </div>

      {/* Action Selector Buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: "extractTasks", label: "Extract Action Items", icon: ListTodo },
            { id: "summarize", label: "Executive Summary", icon: Sparkles },
            { id: "transcript", label: "Transcript & Diarization", icon: Mic },
            { id: "formatNotes", label: "Auto-Format Document", icon: AlignLeft },
          ].map((btn) => {
            const Icon = btn.icon;
            const isSelected = activeAction === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => handleProcess(btn.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 shadow-galaxy-cyan font-bold"
                    : "bg-galaxy-900 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRecordLectureSim}
          disabled={isRecordingAudio}
          className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all ${
            isRecordingAudio
              ? "bg-rose-950 text-rose-300 border-rose-500 animate-pulse"
              : "bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border-indigo-500/40"
          }`}
        >
          <Mic className={`w-4 h-4 ${isRecordingAudio ? "animate-spin text-rose-400" : ""}`} />
          <span>{isRecordingAudio ? "Recording Live Lecture..." : "Simulate Record Lecture Audio"}</span>
        </button>
      </div>

      {/* Main Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raw Notes Input */}
        <div className="rounded-2xl bg-galaxy-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
              <span>Raw Meeting / Lecture Notes</span>
              <button
                onClick={() => {
                  setInputNotes(SAMPLE_NOTES);
                  handleProcess(activeAction, SAMPLE_NOTES);
                }}
                className="text-galaxy-cyan hover:underline text-[11px] font-normal"
              >
                Reset Sample
              </button>
            </div>
            <textarea
              rows={8}
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              placeholder="Paste unformatted meeting minutes, scribbles, or lecture notes..."
              className="w-full bg-galaxy-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-galaxy-cyan resize-none leading-relaxed font-mono text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleProcess(activeAction)}
              disabled={loading || !inputNotes.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-galaxy-cyan to-blue-600 text-galaxy-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-galaxy-cyan"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Process with Note Assist
                </>
              )}
            </button>
          </div>
        </div>

        {/* Note Assist Result */}
        <div className="rounded-2xl bg-galaxy-900 border border-cyan-500/30 p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between text-xs text-galaxy-cyan font-bold uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {summaryData.title}
              </span>
              <span className="text-gray-500 font-mono text-[10px]">On-Device AI</span>
            </div>

            {/* Task list with interactive checkboxes */}
            {(activeAction === "extractTasks" || activeAction === "todoList") && (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      task.done
                        ? "bg-slate-900/50 border-slate-800 text-gray-500 line-through"
                        : "bg-galaxy-950 border-cyan-500/20 hover:border-cyan-500/40 text-gray-200"
                    }`}
                  >
                    <div className="mt-0.5 text-galaxy-cyan">
                      {task.done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 text-xs font-medium">{task.text}</div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        task.priority === "High"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Multi-Speaker Transcript Diarization */}
            {activeAction === "transcript" && (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {transcriptData.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-galaxy-950 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span className="text-galaxy-cyan font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> [{item.timestamp}]
                      </span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-gray-300">{item.speaker}</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}

            {/* Formatted document or Summary view */}
            {activeAction !== "extractTasks" && activeAction !== "todoList" && activeAction !== "transcript" && (
              <div className="w-full min-h-[180px] bg-galaxy-950 border border-cyan-500/20 rounded-xl p-4 text-xs text-cyan-100 whitespace-pre-line leading-relaxed select-text space-y-2">
                {summaryData.formattedContent ? (
                  <div>{summaryData.formattedContent}</div>
                ) : (
                  <ul className="space-y-2">
                    {summaryData.summary?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-200">
                        <span className="text-galaxy-cyan">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <span className="text-xs text-gray-500">Auto-saved to Samsung Notes</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-galaxy-950 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied" : "Copy Content"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
