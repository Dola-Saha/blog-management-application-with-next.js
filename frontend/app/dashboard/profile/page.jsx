"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, uploadProfileImage } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import { isRequired, isValidProfileImage } from "@/utils/validation";

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const photoInput = useRef(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstname: "", lastname: "" });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data.data;
        setProfile(user);
        setForm({ firstname: user.firstname, lastname: user.lastname });
        updateUser(user);
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load profile")))
      .finally(() => setLoading(false));
  }, [updateUser]);

  const saveProfile = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    if (!isRequired(form.firstname) || !isRequired(form.lastname)) {
      setError("First name and last name are required");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await updateProfile(form);
      setProfile(res.data.data);
      updateUser(res.data.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update profile"));
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  const uploadPhoto = async (event) => {
    event.preventDefault();
    if (!photo) return setError("Choose an image first");
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await uploadProfileImage(photo);
      setProfile(res.data.data);
      updateUser(res.data.data);
      setPhoto(null);
      if (photoInput.current) photoInput.current.value = "";
      setMessage("Profile image updated successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Could not upload image"));
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  return (
    <>
      <h1 className="mb-6 text-3xl font-black text-slate-900">My Profile</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <div className="flex justify-center"><Avatar user={profile} size="lg" imageSrc={photoPreview} /></div>
          <h2 className="mt-4 text-xl font-black text-slate-900">{profile?.firstname} {profile?.lastname}</h2>
          <p className="mt-1 text-sm text-slate-500">{profile?.email}</p>
          <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">{profile?.role}</span>

          <form onSubmit={uploadPhoto} className="mt-6 text-left">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Profile image</label>
            <input
              ref={photoInput}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                if (!file) {
                  setPhoto(null);
                  return;
                }
                if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
                  setError("Choose a JPG, PNG, GIF or WEBP image");
                  setPhoto(null);
                  event.target.value = "";
                  return;
                }
                if (file.size > 3 * 1024 * 1024) {
                  setError("Profile image must be 3 MB or smaller");
                  setPhoto(null);
                  event.target.value = "";
                  return;
                }
                setError("");
                setPhoto(file);
              }}
              className="block w-full text-xs text-slate-500 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-bold file:text-blue-700"
            />
            <p className="mt-2 text-xs text-slate-500">JPG, PNG, GIF or WEBP up to 3 MB. The preview updates when you select an image; upload it to save and update the Navbar image.</p>
            <button type="submit" disabled={saving} className="mt-3 w-full rounded-lg bg-slate-900 py-2 text-sm font-bold text-white disabled:opacity-50">
              {saving ? "Uploading..." : "Upload image"}
            </button>
          </form>
        </div>

        <form onSubmit={saveProfile} className="rounded-lg border border-slate-200 bg-white p-6">
          <label className="mb-1 block text-sm font-semibold text-slate-700">First name</label>
          <input value={form.firstname} onChange={(event) => setForm((value) => ({ ...value, firstname: event.target.value }))} required className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          <label className="mb-1 block text-sm font-semibold text-slate-700">Last name</label>
          <input value={form.lastname} onChange={(event) => setForm((value) => ({ ...value, lastname: event.target.value }))} required className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input value={profile?.email || ""} readOnly className="mb-6 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" />
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </>
  );
}
