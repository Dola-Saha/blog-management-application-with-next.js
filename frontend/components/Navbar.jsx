"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileMenu from "@/components/ProfileMenu";
import SearchBar from "@/components/SearchBar";

export default function Navbar({ searchValue = "", onSearch }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dashboardSearch, setDashboardSearch] = useState("");
  const liveSearchStartedRef = useRef(false);
  const liveSearchActiveRef = useRef(false);
  const dashboardNavbar = Boolean(user && !onSearch && (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")));

  useEffect(() => {
    if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
      liveSearchActiveRef.current = false;
      setDashboardSearch(new URLSearchParams(window.location.search).get("search") || "");
      liveSearchStartedRef.current = Boolean(new URLSearchParams(window.location.search).get("search"));
    }
  }, [pathname]);

  useEffect(() => {
    if (!user || !liveSearchActiveRef.current) return;

    const timer = setTimeout(() => {
      const query = dashboardSearch.trim();
      const isAdmin = String(user.role || "").toLowerCase() === "admin";
      const destination = isAdmin
        ? `/dashboard/search${query ? `?search=${encodeURIComponent(query)}` : ""}`
        : `/dashboard/blogs${query ? `?search=${encodeURIComponent(query)}` : ""}`;

      if (`${pathname}${window.location.search}` !== destination) {
        if (query && !liveSearchStartedRef.current) {
          liveSearchStartedRef.current = true;
          router.push(destination);
        } else {
          router.replace(destination);
        }
      }
      if (!query) {
        liveSearchStartedRef.current = false;
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [dashboardSearch, pathname, router, user]);

  const updateDashboardSearch = (value) => {
    liveSearchActiveRef.current = true;
    setDashboardSearch(value);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = dashboardSearch.trim();
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";

    if (isAdmin) {
      router.push(`/dashboard/search${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      return;
    }

    router.push(`/dashboard/blogs${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur ${dashboardNavbar ? "h-[7.25rem] sm:h-16" : "h-16"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          href={user ? "/dashboard" : "/"}
          className="shrink-0 text-xl font-black text-slate-900 transition-colors duration-250 hover:text-blue-700"
        >
          Blog<span className="text-blue-600">Space</span>
        </Link>

        {onSearch && (
          <div className="relative mx-auto hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search blogs..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        {!onSearch && user && (
          <SearchBar
            value={dashboardSearch}
            onChange={updateDashboardSearch}
            onSubmit={submitSearch}
            placeholder={String(user?.role || "").toLowerCase() === "admin" ? "Search blogs or users..." : "Search blogs..."}
          />
        )}

        {!onSearch && user && (
          <SearchBar
            value={dashboardSearch}
            onChange={updateDashboardSearch}
            onSubmit={submitSearch}
            placeholder={String(user?.role || "").toLowerCase() === "admin" ? "Search blogs or users..." : "Search blogs..."}
            mobile
          />
        )}

        {user ? (
          <ProfileMenu />
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              aria-current={pathname === "/login" ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                pathname === "/login"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              aria-current={pathname === "/register" ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                pathname === "/register" || pathname !== "/login"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
