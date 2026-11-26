"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { deleteBlog, getBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import Notification from "@/components/Notification";

export default function BlogManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBlogs();
      setBlogs(res.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load blogs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const visibleBlogs = user?.role === "admin" ? blogs : blogs.filter((blog) => blog.author?.id === user?.id);
  const filteredBlogs = search.trim()
    ? visibleBlogs.filter((blog) =>
        `${blog.blogTitle} ${blog.category} ${blog.blog}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : visibleBlogs;

  const remove = async (blog) => {
    setSelectedBlog(blog);
  };

  const confirmRemove = async () => {
    if (!selectedBlog || deleting) return;
    setMessage("");
    setError("");
    setDeleting(true);
    try {
      await deleteBlog(selectedBlog.id);
      setMessage("Blog deleted successfully");
      setSelectedBlog(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete blog"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black text-slate-900">{user?.role === "admin" ? "All Blogs" : "My Blogs"}</h1>
        <Link href="/dashboard/blogs/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Create</Link>
      </div>

      <Notification type="success" message={message} onClose={() => setMessage("")} />
      <Notification type="error" message={error} onClose={() => setError("")} />
      <ConfirmDialog
        open={Boolean(selectedBlog)}
        title="Delete blog?"
        message={selectedBlog ? `"${selectedBlog.blogTitle}" will be permanently deleted.` : ""}
        confirmLabel="Delete"
        pending={deleting}
        onCancel={() => setSelectedBlog(null)}
        onConfirm={confirmRemove}
      />
      {loading ? <Loader text="Loading blogs..." /> : filteredBlogs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">{search ? "No blogs match your search." : "You haven't created any blogs yet."}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Author</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr
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
                  className="cursor-pointer border-b border-slate-100 outline-none last:border-0 hover:bg-slate-50 focus-visible:bg-blue-50"
                >
                  <td className="px-4 py-3 font-bold text-slate-800">{blog.blogTitle}</td>
                  <td className="px-4 py-3">{blog.category}</td>
                  <td className="px-4 py-3">{blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown"}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(blog.createAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}><div className="flex gap-2"><Link href={`/blogs/${blog.id}`} className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" />View</Link><Link href={`/dashboard/blogs/${blog.id}/edit`} className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />Edit</Link><button onClick={() => remove(blog)} className="inline-flex items-center gap-1 rounded border border-red-200 px-2 py-1.5 font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
