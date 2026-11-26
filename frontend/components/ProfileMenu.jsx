"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Avatar";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
      >
        <Avatar user={user} size="sm" />
        <span className="hidden text-sm font-semibold text-slate-800 md:block">
          {user.firstname} {user.lastname}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
          <button
            type="button"
            onClick={() => router.push("/dashboard/profile")}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50"
          >
            <UserRound className="h-4 w-4" /> Profile
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/change-password")}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
