"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import BlogForm from "@/components/BlogForm";
import { createBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import { isRequired } from "@/utils/validation";

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ blogTitle: "", category: "", blog: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError("");
    if (!isRequired(form.blogTitle) || !isRequired(form.category) || !isRequired(form.blog)) {
      setError("Title, category and content are required");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await createBlog(form);
      router.push("/dashboard/blogs");
    } catch (err) {
      setError(getErrorMessage(err, "Could not publish blog"));
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-black text-slate-900">Create Blog</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <BlogForm
        form={form}
        onChange={update}
        onSubmit={submit}
        submitting={submitting}
        submitLabel="Publish Blog"
        pendingLabel="Publishing..."
      />
    </>
  );
}
