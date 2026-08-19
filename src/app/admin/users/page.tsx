"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, User, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        showToast(`User role updated to: ${newRole}`, "success");
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      showToast("Failed to update user role", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-galaxy-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <span className="text-xs text-gray-400">
          Total Registered Accounts: <strong className="text-white">{users.length}</strong>
        </span>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-galaxy-900/80 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
            Loading accounts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">No users match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-galaxy-950/80 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">User Profile</th>
                  <th className="p-4">Persona</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Member Since</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4 pr-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-gray-400 text-[11px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-cyan-300 font-semibold">{u.savedPersona || "Everyday"}</td>
                    <td className="p-4 text-gray-300">{u._count?.orders || 0} orders</td>
                    <td className="p-4 text-gray-400">{formatDate(u.createdAt)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-700"
                            : "bg-slate-800 text-gray-300 border border-slate-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={updatingId === u.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          u.role === "ADMIN"
                            ? "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800"
                            : "bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700"
                        }`}
                      >
                        {u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
