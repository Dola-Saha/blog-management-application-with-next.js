"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusSquare, UserRound, KeyRound, Users, LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const items = isAdmin
    ? [
        ["/dashboard", "Dashboard", LayoutDashboard],
        ["/dashboard/blogs", "All Blogs", FileText],
        ["/dashboard/blogs/create", "Create Blog", PlusSquare],
        ["/admin/users", "Users", Users],
        ["/dashboard/profile", "Profile", UserRound],
        ["/dashboard/change-password", "Change Password", KeyRound]
      ]
    : [
        ["/dashboard", "Dashboard", LayoutDashboard],
        ["/dashboard/blogs", "My Blogs", FileText],
        ["/dashboard/blogs/create", "Create Blog", PlusSquare],
        ["/dashboard/profile", "Profile", UserRound],
        ["/dashboard/change-password", "Change Password", KeyRound]
      ];
  const activeHref = items
    .filter(([href]) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)) || (href === "/dashboard" && pathname === "/dashboard"))
    .sort(([hrefA], [hrefB]) => hrefB.length - hrefA.length)[0]?.[0];

  return (
    <>
      {open && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" />}
      <aside className={`fixed bottom-0 left-0 top-[7.25rem] z-40 flex w-64 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-sm transition-transform sm:top-16 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{isAdmin ? "Administration" : "My dashboard"}</p>
          </div>
          <button aria-label="Close sidebar" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"><X className="h-4 w-4" /></button>
        </div>
        <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {isAdmin ? "Manage workspace" : "Your workspace"}
          </p>
          {items.map(([href, label, Icon]) => {
            const active = activeHref === href;
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={onClose} className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-semibold transition ${active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-blue-700" : "text-slate-400"}`} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            aria-label="Logout"
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
