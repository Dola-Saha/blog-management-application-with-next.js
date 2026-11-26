"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import { getBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

function BlogDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlog(id)
      .then((res) => setBlog(res.data.data))
      .catch((err) => setError(getErrorMessage(err, "Could not load blog")))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:px-6">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
              return;
            }
            router.replace(user ? "/dashboard/blogs" : "/");
          }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> {user ? "Back to dashboard" : "Back to blogs"}
        </button>

        {loading ? <Loader text="Loading blog..." /> : error ? (
          <div className="rounded-lg border border-red-100 bg-white p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900">Blog Not Found</h1>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : (
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{blog.category}</span>
            <h1 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">{blog.blogTitle}</h1>

            <div className="mt-6 flex items-center gap-3 border-b border-slate-100 pb-6">
              <Avatar user={blog.author} />
              <div>
                <p className="font-bold text-slate-800">{blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown author"}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{new Date(blog.createAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-700">{blog.blog}</div>
          </article>
        )}
      </main>
    </>
  );
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<main className="pt-24"><Loader text="Loading blog..." /></main>}>
      <BlogDetailContent />
    </Suspense>
  );
}
