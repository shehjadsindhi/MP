"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Server,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  Layers,
  Lock,
  Activity
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/lib/utils";

interface BackupItem {
  filename: string;
  size: number;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.warn("Health check failed", e);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchBackups = async () => {
    setLoadingBackups(true);
    try {
      const res = await fetch("/api/admin/backup?action=list");
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      }
    } catch (e) {
      console.warn("Fetch backups failed", e);
    } finally {
      setLoadingBackups(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });

      if (res.ok) {
        showToast("Database backup created successfully!", "success");
        fetchBackups();
      } else {
        showToast("Failed to create backup", "error");
      }
    } catch {
      showToast("Backup operation failed", "error");
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete backup: ${filename}?`)) return;

    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", filename }),
      });

      if (res.ok) {
        showToast("Backup deleted", "info");
        fetchBackups();
      } else {
        showToast("Failed to delete backup", "error");
      }
    } catch {
      showToast("Error deleting backup", "error");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-400" /> System Settings & Operations
          </h1>
          <p className="text-xs text-gray-400">
            Monitor infrastructure health, execute database backups, and view security enclave configurations.
          </p>
        </div>

        <button
          onClick={() => {
            fetchHealth();
            fetchBackups();
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Infrastructure Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Database Service */}
        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Database Engine</h2>
                <p className="text-[11px] text-gray-400 font-mono">Prisma Client ORM</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                health?.checks?.database === "healthy"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                  : "bg-amber-950/80 text-amber-400 border border-amber-500/40"
              }`}
            >
              {health?.checks?.database || "ONLINE"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-xs text-gray-400 space-y-1">
            <p className="flex justify-between">
              <span>Provider:</span>
              <strong className="text-gray-200">SQLite / PostgreSQL Ready</strong>
            </p>
            <p className="flex justify-between">
              <span>Data Resilience:</span>
              <strong className="text-emerald-400">Zero-Downtime Fallback</strong>
            </p>
          </div>
        </div>

        {/* Cache & Queue Subsystem */}
        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-galaxy-cyan">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Cache & Queue</h2>
                <p className="text-[11px] text-gray-400 font-mono">Redis / In-Memory</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                health?.checks?.redis === "healthy"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                  : "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
              }`}
            >
              {health?.checks?.redis === "healthy" ? "CONNECTED" : "IN-MEMORY FALLBACK"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-xs text-gray-400 space-y-1">
            <p className="flex justify-between">
              <span>Sliding Window Limit:</span>
              <strong className="text-gray-200">60s / Bucket Active</strong>
            </p>
            <p className="flex justify-between">
              <span>Cache Expiration:</span>
              <strong className="text-gray-200">300s TTL</strong>
            </p>
          </div>
        </div>

        {/* Knox Security Enclave */}
        <div className="p-6 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Security Enclave</h2>
                <p className="text-[11px] text-gray-400 font-mono">Knox EAL5+ Standard</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
              PROTECTED
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-xs text-gray-400 space-y-1">
            <p className="flex justify-between">
              <span>Token Hashing:</span>
              <strong className="text-gray-200">Bcrypt 12 Rounds</strong>
            </p>
            <p className="flex justify-between">
              <span>Session Policy:</span>
              <strong className="text-emerald-400">HTTP-Only Signed JWT</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Database Backup Operations Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-galaxy-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Database Backup & Recovery</h2>
            </div>
            <p className="text-xs text-gray-400">
              Create instant snapshots of products, orders, users, and AI interaction history.
            </p>
          </div>

          <button
            onClick={handleCreateBackup}
            disabled={creatingBackup}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-950 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {creatingBackup ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Snapshot...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Create Database Backup</span>
              </>
            )}
          </button>
        </div>

        {/* Backups List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Available Backups ({backups.length})
          </h3>

          {loadingBackups ? (
            <div className="py-8 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Scanning backup storage...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs border border-dashed border-slate-800 rounded-2xl">
              No backups created yet. Click &quot;Create Database Backup&quot; to generate your first snapshot.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
              {backups.map((b) => (
                <div key={b.filename} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white font-mono">{b.filename}</p>
                    <p className="text-[11px] text-gray-400">
                      Created: {formatDate(b.createdAt)} &bull; Size: {(b.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteBackup(b.filename)}
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Backup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
