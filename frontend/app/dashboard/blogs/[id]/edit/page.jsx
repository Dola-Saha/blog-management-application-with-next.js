"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import Loader from "@/components/Loader";
import { getBlog, updateBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import { isRequired } from "@/utils/validation";

function EditBlogContent() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ blogTitle: "", category: "", blog: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    getBlog(id)
      .then((res) => {
        const blog = res.data.data;
        setForm({ blogTitle: blog.blogTitle, category: blog.category, blog: blog.blog });
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load blog")))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError("");
    if (!isRequired(form.blogTitle) || !isRequired(form.category) || !isRequired(form.blog)) {
      setError("Blog title, category and content are required");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateBlog(id, form);
      router.push("/dashboard/blogs");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update blog"));
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-black text-slate-900">Edit Blog</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <Loader text="Loading blog..." /> : (
        <BlogForm
          form={form}
          onChange={update}
          onSubmit={submit}
          submitting={submitting}
          submitLabel="Save Changes"
          pendingLabel="Saving..."
        />
      )}
    </>
  );
}

export default function EditBlogPage() {
  return <Suspense fallback={<Loader text="Loading editor..." />}><EditBlogContent /></Suspense>;
}
