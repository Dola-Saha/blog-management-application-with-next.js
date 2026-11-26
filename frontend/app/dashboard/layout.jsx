"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <main className="min-h-screen"><Loader text="Checking session..." /></main>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-screen bg-slate-50 pt-[7.25rem] sm:pt-16 md:pl-64">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <p className="text-sm font-bold text-slate-700">Dashboard menu</p>
          <button aria-label="Open sidebar" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"><Menu className="h-5 w-5" /></button>
        </div>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </>
  );
}
