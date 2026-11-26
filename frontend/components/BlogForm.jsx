export default function BlogForm({
  form,
  onChange,
  onSubmit,
  submitting,
  submitLabel = "Publish Blog",
  pendingLabel = "Saving..."
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <label className="mb-1 block text-sm font-semibold text-slate-700">Blog title</label>
      <input
        name="blogTitle"
        value={form.blogTitle}
        onChange={onChange}
        required
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        placeholder="Introduction to Playwright"
      />

      <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
      <input
        name="category"
        value={form.category}
        onChange={onChange}
        required
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        placeholder="Testing"
      />

      <label className="mb-1 block text-sm font-semibold text-slate-700">Blog content</label>
      <textarea
        name="blog"
        value={form.blog}
        onChange={onChange}
        required
        rows={12}
        className="mb-6 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm leading-6 outline-none focus:border-blue-500"
        placeholder="Write your blog content..."
      />

      <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
        {submitting ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
