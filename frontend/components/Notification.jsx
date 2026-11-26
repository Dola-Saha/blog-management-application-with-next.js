"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";

export default function Notification({ type = "success", message, onClose }) {
  if (!message) return null;
  const success = type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`mb-4 flex items-start gap-3 rounded-xl border p-4 text-sm font-medium ${success ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
    >
      {success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
