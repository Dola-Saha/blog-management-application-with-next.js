"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { forgotPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-black text-slate-900">Reset your password</h1>
          <p className="mb-6 text-sm text-slate-600">Enter your email to generate a password reset link.</p>
          {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <p className="mt-5 text-center"><Link href="/login" className="text-sm font-bold text-blue-600">Back to login</Link></p>
        </form>
      </main>
    </>
  );
}
