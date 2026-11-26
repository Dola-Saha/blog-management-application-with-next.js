import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import Avatar from "@/components/Avatar";

export default function BlogCard({ blog }) {
  const preview = blog.blog?.length > 180 ? `${blog.blog.slice(0, 180)}...` : blog.blog;
  const parsedDate = new Date(blog.createAt);
  const date = Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric"
      });

  return (
    <Link href={`/blogs/${blog.id}`} aria-label={`Read ${blog.blogTitle}`} className="group block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
      <article className="blog-card flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{blog.category}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{date}</span>
        </div>
        <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-700">{blog.blogTitle}</h2>
        <p className="mb-6 flex-1 text-sm leading-6 text-slate-600">{preview}</p>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            {blog.author?.profileImage ? <Avatar user={blog.author} size="sm" /> : <UserRound className="h-8 w-8 rounded-full bg-slate-100 p-2 text-slate-500" />}
            <span className="font-semibold">{blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown author"}</span>
          </div>
          <span className="text-sm font-bold text-blue-600">Read more</span>
        </div>
      </article>
    </Link>
  );
}
