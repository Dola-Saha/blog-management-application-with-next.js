"use client";

import { useState } from "react";
import { updatePassword } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import { isValidPassword, passwordsMatch } from "@/utils/validation";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!isValidPassword(password)) return setError("Password must be at least 8 characters");
    if (!passwordsMatch(password, confirm)) return setError("Password confirmation does not match");

    setLoading(true);
    try {
      await updatePassword(password);
      setMessage("Password changed successfully");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not change password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-black text-slate-900">Change Password</h1>
      <form onSubmit={submit} className="max-w-lg rounded-lg border border-slate-200 bg-white p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        <label className="mb-1 block text-sm font-semibold text-slate-700">New password</label>
        <input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        <label className="mb-1 block text-sm font-semibold text-slate-700">Confirm new password</label>
        <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? "Changing..." : "Change Password"}</button>
      </form>
    </>
  );
}
