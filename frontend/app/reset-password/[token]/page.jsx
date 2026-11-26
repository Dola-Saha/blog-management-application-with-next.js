"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Navbar from "@/components/Navbar";
import { resetPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";
import { isValidPassword, passwordsMatch } from "@/utils/validation";

function ResetPasswordContent() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!isValidPassword(password)) return setError("Password must be at least 8 characters");
    if (!passwordsMatch(password, confirm)) return setError("Password confirmation does not match");

    setLoading(true);
    try {
      await resetPassword(token, password);
      router.replace("/login?reset=1");
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset password"));
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-black text-slate-900">Choose a new password</h1>
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="mb-1 block text-sm font-semibold text-slate-700">New password</label>
          <input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          <label className="mb-1 block text-sm font-semibold text-slate-700">Confirm password</label>
          <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading...</main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
