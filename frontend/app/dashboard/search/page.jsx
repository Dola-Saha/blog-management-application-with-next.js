"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FileText, Users } from "lucide-react";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import { getUsers } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";

function AdminSearchContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") || "").trim();
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (String(user?.role || "").toLowerCase() !== "admin") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    Promise.all([getBlogs(), getUsers()])
      .then(([blogsRes, usersRes]) => {
        setBlogs(blogsRes.data.data || []);
        setUsers(usersRes.data.data || []);
      })
      .catch((err) => setError(getErrorMessage(err, "Could not complete search")))
      .finally(() => setLoading(false));
  }, [user?.role]);

  const term = search.toLowerCase();
  const matchedBlogs = term
    ? blogs.filter((blog) =>
        `${blog.blogTitle} ${blog.category} ${blog.blog}`
          .toLowerCase()
          .includes(term)
      )
    : blogs;
  const matchedUsers = term
    ? users.filter((item) =>
        `${item.firstname} ${item.lastname} ${item.email} ${item.role}`
          .toLowerCase()
          .includes(term)
      )
    : users;

  if (String(user?.role || "").toLowerCase() !== "admin") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
        Global search is available to administrators.
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-500">Admin Search</p>
        <h1 className="text-3xl font-black text-slate-900">
          {search ? `Results for "${search}"` : "Search Blogs and Users"}
        </h1>
      </div>

      {loading ? (
        <Loader text="Searching..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-black text-slate-900">
                <FileText className="h-5 w-5 text-blue-600" /> Blogs
              </h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {matchedBlogs.length}
              </span>
            </div>
            {matchedBlogs.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No matching blogs found.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchedBlogs.slice(0, 10).map((blog) => (
                  <Link key={blog.id} href={`/blogs/${blog.id}`} className="block px-5 py-4 hover:bg-slate-50">
                    <p className="font-bold text-slate-900">{blog.blogTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">{blog.category}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-black text-slate-900">
                <Users className="h-5 w-5 text-violet-600" /> Users
              </h2>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                {matchedUsers.length}
              </span>
            </div>
            {matchedUsers.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No matching users found.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchedUsers.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                    <Avatar user={item} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{item.firstname} {item.lastname}</p>
                      <p className="truncate text-xs text-slate-500">{item.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default function AdminSearchPage() {
  return (
    <Suspense fallback={<Loader text="Loading search..." />}>
      <AdminSearchContent />
    </Suspense>
  );
}
