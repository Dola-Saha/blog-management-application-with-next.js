"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import Avatar from "@/components/Avatar";
import { getUsers, updateUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data.data || []))
      .catch((err) => {
        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }
        setError(getErrorMessage(err, "Could not load users"));
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredUsers = search.trim()
    ? users.filter((item) =>
        `${item.firstname} ${item.lastname} ${item.email} ${item.role}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : users;

  const toggleStatus = async (user) => {
    if (updatingUserId !== null) return;
    setError("");
    setMessage("");
    setUpdatingUserId(user.id);
    try {
      const res = await updateUserStatus(user.id, !user.isActive);
      const updated = res.data.data;
      setUsers((items) => items.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.firstname} ${updated.lastname} is now ${updated.isActive ? "active" : "inactive"}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not update user status"));
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-black text-slate-900">Users</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      <p className="mb-4 text-sm text-slate-600">
        Only active users can log in. Activate an account here to allow access.
      </p>
      {loading ? <Loader text="Loading users..." /> : filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          {search ? "No users match your search." : "No users found."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar user={user} size="sm" /><span className="font-bold text-slate-800">{user.firstname} {user.lastname}</span></div></td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${user.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{user.isActive ? "Active" : "Inactive"}</span></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(user)}
                      disabled={updatingUserId !== null}
                      className={`rounded-lg border px-3 py-1.5 font-bold disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}
                    >
                      {updatingUserId === user.id ? "Updating..." : user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
