"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader";
import { getBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogs()
      .then((res) => {
        const allBlogs = res.data.data || [];
        const availableCategories = [...new Set(
          allBlogs
            .map((blog) => blog.category?.trim())
            .filter(Boolean)
        )].sort();
        setCategories(["All", ...availableCategories]);
      })
      .catch(() => {
        setCategories(["All"]);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (search.trim()) params.title = search.trim();
        if (category !== "All") params.category = category;
        const res = await getBlogs(params);
        setBlogs(res.data.data || []);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load blogs"));
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <>
      <Navbar searchValue={search} onSearch={setSearch} />
      <main className="pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">Discover</p>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Ideas worth reading.</h1>
            <p className="mt-3 max-w-xl text-slate-600">Explore practical stories on testing, automation, programming and modern software delivery.</p>

            <CategoryFilter
              categories={categories}
              activeCategory={category}
              onChange={setCategory}
            />

            <div className="mt-4 sm:hidden">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search blogs..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {!loading && !error && (
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-600">
                {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} found
              </p>
              {(search.trim() || category !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
          {loading ? <Loader text="Loading blogs..." /> : error ? (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
          ) : blogs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">No blogs found.</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
