"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { login as loginRequest } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clearForm = () => {
      setForm({ email: "", password: "" });
      setError("");
      setLoading(false);
      if (formRef.current) formRef.current.reset();
      if (emailRef.current) {
        emailRef.current.value = "";
      }
      if (passwordRef.current) {
        passwordRef.current.value = "";
      }
    };

    clearForm();
    window.addEventListener("pageshow", clearForm);

    const params = new URLSearchParams(window.location.search);
    const expired = params.get("session") === "expired";
    const registered = params.get("registered") === "1";
    if (expired) {
      setNotice("Your session expired. Please log in again.");
      sessionStorage.removeItem("session-expired");
      window.history.replaceState({}, "", "/login");
    } else if (registered) {
      setNotice("Registration successful. Please log in.");
      window.history.replaceState({}, "", "/login");
    }

    return () => {
      window.removeEventListener("pageshow", clearForm);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginRequest(form);
      const { token, user } = res.data.data;
      login(token, user);
      router.replace("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="new-password"
          autoCapitalize="none"
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="mb-6 text-2xl font-black text-slate-900">Welcome back</h1>
          {notice && <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{notice}</p>}
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            ref={emailRef}
            name="blogspace-login-email-field"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
            autoComplete="off"
            readOnly
            data-1p-ignore="true"
            data-lpignore="true"
            data-bwignore="true"
            data-form-type="other"
            onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            placeholder="you@example.com"
          />

          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <Link href="/forgot-password" className="text-sm font-semibold text-blue-600">Forgot password?</Link>
          </div>
          <input
            ref={passwordRef}
            name="blogspace-credential-117-field"
            type="text"
            required
            value={form.password}
            onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
            autoComplete="off"
            data-1p-ignore="true"
            data-lpignore="true"
            data-bwignore="true"
            data-form-type="other"
            aria-label="Password"
            className="blogspace-password mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            placeholder="Enter password"
          />

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account? <Link href="/register" className="font-bold text-blue-600">Create account</Link>
          </p>
        </form>
      </main>
    </>
  );
}
