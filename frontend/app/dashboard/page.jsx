"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users
} from "lucide-react";
import Loader from "@/components/Loader";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import { getUsers } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getBlogs(),
      user?.role === "admin" ? getUsers() : Promise.resolve(null)
    ])
      .then(([blogsRes, usersRes]) => {
        setBlogs(blogsRes.data.data || []);
        if (usersRes) setUsers(usersRes.data.data || []);
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load dashboard")))
      .finally(() => setLoading(false));
  }, [user?.role]);

  const isAdmin = user?.role === "admin";
  const visibleBlogs = isAdmin ? blogs : blogs.filter((blog) => blog.author?.id === user?.id);
  const recentBlogs = [...visibleBlogs].sort((a, b) => {
    const dateA = new Date(a.createAt).getTime() || 0;
    const dateB = new Date(b.createAt).getTime() || 0;
    return dateB - dateA;
  }).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              {isAdmin ? "Admin workspace" : "Creator workspace"}
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {user?.firstname || "there"}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
              {isAdmin
                ? "Your overview of the BlogSpace community, content, and account."
                : "Your content and account, all together in one place."}
            </p>
          </div>
          <Link
            href="/dashboard/blogs/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 shadow-lg shadow-slate-950/10 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Plus className="h-4 w-4" />
            Create a blog
          </Link>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-10 shadow-sm">
          <Loader text="Loading dashboard..." />
        </div>
      ) : !error && (
        <>
          <section aria-label="Dashboard statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{isAdmin ? "All blogs" : "My blogs"}</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{visibleBlogs.length}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{isAdmin ? "Content across BlogSpace" : "Published to BlogSpace"}</p>
                </div>
                <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <FileText className="h-5 w-5" />
                </span>
              </div>
              <Link href="/dashboard/blogs" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900">
                {isAdmin ? "Manage all blogs" : "Manage my blogs"} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>

            {isAdmin && (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Registered users</p>
                    <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{users.length}</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">Accounts in your community</p>
                  </div>
                  <span className="rounded-xl bg-violet-50 p-3 text-violet-700">
                    <Users className="h-5 w-5" />
                  </span>
                </div>
                <Link href="/admin/users" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-violet-700 hover:text-violet-900">
                  Manage users <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            )}

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-4">
                <Avatar user={user} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-500">Your profile</p>
                  <p className="mt-2 truncate text-lg font-extrabold text-slate-950">{user?.firstname} {user?.lastname}</p>
                  <p className="truncate text-sm text-slate-500">{user?.email}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700">
                    {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                    {user?.role || "member"}
                  </span>
                </div>
              </div>
              <Link href="/dashboard/profile" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-slate-950">
                View profile <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          </section>

          <section aria-labelledby="quick-actions-heading">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Get things done</p>
              <h2 id="quick-actions-heading" className="mt-1 text-xl font-black tracking-tight text-slate-950">Quick actions</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Link href="/dashboard/blogs/create" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Plus className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">Write a blog</span>
                  <span className="mt-1 block text-sm text-slate-500">Create and publish a new post</span>
                </span>
                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
              </Link>
              <Link href="/dashboard/blogs" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <span className="rounded-xl bg-amber-50 p-3 text-amber-700"><FileText className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">{isAdmin ? "Browse all blogs" : "Manage my blogs"}</span>
                  <span className="mt-1 block text-sm text-slate-500">Review, edit, or remove posts</span>
                </span>
                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
              </Link>
              {isAdmin ? (
                <Link href="/admin/users" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <span className="rounded-xl bg-violet-50 p-3 text-violet-700"><Users className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900">Manage users</span>
                    <span className="mt-1 block text-sm text-slate-500">Review community accounts</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                </Link>
              ) : (
                <Link href="/dashboard/profile" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><UserRound className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900">Update profile</span>
                    <span className="mt-1 block text-sm text-slate-500">Keep your account up to date</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                </Link>
              )}
            </div>
          </section>

          <section aria-labelledby="recent-blogs-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Content overview</p>
                <h2 id="recent-blogs-heading" className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  {isAdmin ? "Recent blogs" : "Your recent blogs"}
                </h2>
              </div>
              <Link href="/dashboard/blogs" className="inline-flex items-center gap-1 self-start rounded-lg px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 sm:self-auto">
                View all blogs <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {recentBlogs.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><FileText className="h-5 w-5" /></span>
                <p className="mt-4 font-bold text-slate-900">No blogs to show yet</p>
                <p className="mt-1 text-sm text-slate-500">Create your first post to get started.</p>
                <Link href="/dashboard/blogs/create" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
                  <Plus className="h-4 w-4" /> Create a blog
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    onClick={() => router.push(`/blogs/${blog.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/blogs/${blog.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open blog details: ${blog.blogTitle}`}
                    className="flex cursor-pointer flex-col gap-3 px-5 py-4 outline-none transition hover:bg-slate-50/80 focus-visible:bg-blue-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 rounded-xl bg-blue-50 p-2.5 text-blue-700"><FileText className="h-4 w-4" /></span>
                      <div className="min-w-0">
                        <Link href={`/blogs/${blog.id}`} className="block truncate font-bold text-slate-900 hover:text-blue-700">
                          {blog.blogTitle || "Untitled blog"}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          {blog.category && <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">{blog.category}</span>}
                          {isAdmin && blog.author && <span>{blog.author.firstname} {blog.author.lastname}</span>}
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(blog.createAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0" onClick={(event) => event.stopPropagation()}>
                      <Link href={`/blogs/${blog.id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">
                        Preview
                      </Link>
                      <Link href={`/dashboard/blogs/${blog.id}/edit`} className="rounded-lg px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                        Edit
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
