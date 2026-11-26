"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { register } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";
import { isRequired, isValidEmail, isValidPassword, passwordsMatch } from "@/utils/validation";

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setLoading(false);
    if (formRef.current) formRef.current.reset();
  }, []);

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isRequired(form.firstname) || !isRequired(form.lastname)) return setError("Firstname and lastname are required");
    if (!isValidEmail(form.email)) return setError("Enter a valid email address");
    if (!isValidPassword(form.password)) return setError("Password must be at least 8 characters");
    if (!passwordsMatch(form.password, form.confirmPassword)) return setError("Password confirmation does not match");

    setLoading(true);
    try {
      await register({ firstname: form.firstname, lastname: form.lastname, email: form.email, password: form.password });
      setForm({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
      if (formRef.current) formRef.current.reset();
      router.replace("/login?registered=1");
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500";

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
        <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-black text-slate-900">Create account</h1>
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            {[["firstname", "First name"], ["lastname", "Last name"]].map(([name, label]) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  {label}<span className="ml-1 text-red-600">*</span>
                </label>
                <input name={name} value={form[name]} onChange={update} autoComplete="off" required className={inputClass} />
              </div>
            ))}
          </div>

          <label className="mb-1 mt-4 block text-sm font-semibold text-slate-700">Email<span className="ml-1 text-red-600">*</span></label>
          <input name="email" type="email" value={form.email} onChange={update} autoComplete="off" required className={`${inputClass} mb-4`} />

          <label className="mb-1 block text-sm font-semibold text-slate-700">Password<span className="ml-1 text-red-600">*</span></label>
          <input name="password" type="password" minLength={8} value={form.password} onChange={update} autoComplete="new-password" required className={`${inputClass} mb-4`} />

          <label className="mb-1 block text-sm font-semibold text-slate-700">Confirm password<span className="ml-1 text-red-600">*</span></label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} autoComplete="new-password" required className={`${inputClass} mb-6`} />

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Creating account..." : "Register"}
          </button>
          <p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-bold text-blue-600">Login</Link></p>
        </form>
      </main>
    </>
  );
}
