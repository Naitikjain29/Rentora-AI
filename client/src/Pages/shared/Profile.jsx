
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiLock,
  FiTrash2,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
  FiHome,
  FiSave,
  FiLoader,
} from "react-icons/fi";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../services/api";
import Navbar from "../../Components/Navbar";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
  });

  const [role, setRole] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/my-profile");
      const user = res.data.user;

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        password: "",
      });

      setRole(user.role || "user");
      setExistingImage(user.profileImage || "");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const changeImageHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be less than 2MB");
      e.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);

      if (formData.password) {
        data.append("password", formData.password);
      }

      if (newImage) {
        data.append("profileImage", newImage);
      }

      const res = await api.put("/users/update", data);

      toast.success(res.data.msg || "Profile updated successfully");

      setFormData((prev) => ({ ...prev, password: "" }));
      setExistingImage(
        res.data.updatedUserProfile?.profileImage || existingImage
      );

      setNewImage(null);

      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await api.delete("/users/delete");

      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "mb-2 block text-sm font-medium text-slate-300";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Navbar />
        <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <FiLoader className="animate-spin text-2xl text-indigo-400" />
          </div>
          <p className="text-sm text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Top navigation */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <FiArrowLeft />
              Go back
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl text-indigo-400">
                <FiUser />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Profile
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your personal information and account settings.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 sm:flex">
            <FiCheckCircle />
            Account Settings
          </div>
        </div>

        {/* Profile banner */}
        <section className="relative mb-7 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative mx-auto sm:mx-0">
              <div className="h-28 w-28 overflow-hidden rounded-[2rem] border-2 border-indigo-400/40 bg-slate-800 p-1 shadow-xl shadow-indigo-950/40">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.7rem] bg-slate-950 text-4xl font-bold text-indigo-300">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : existingImage ? (
                    <img
                      src={imageUrl(existingImage)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (formData.fullName?.charAt(0) || "U").toUpperCase()
                  )}
                </div>
              </div>

              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={changeImageHandler}
                className="hidden"
              />

              <label
                htmlFor="profileImage"
                title="Change profile photo"
                className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-4 border-slate-900 bg-indigo-500 text-white shadow-lg transition hover:bg-indigo-400"
              >
                <FiCamera size={17} />
              </label>
            </div>

            {/* User details */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="max-w-full break-words text-2xl font-bold">
                  {formData.fullName || "Your Name"}
                </h2>
                <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold capitalize text-indigo-300">
                  {role}
                </span>
              </div>

              <p className="break-all text-sm text-slate-400">
                {formData.email}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {formData.bio || "Add a short bio to tell us about yourself."}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                JPG, PNG or WEBP · Maximum size 2MB
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-center gap-2 self-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:self-auto">
              <FiShield className="text-emerald-400" />
              <span>Private account</span>
            </div>
          </div>
        </section>

        {/* Main form */}
        <form onSubmit={submitHandler} className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400">
                  <FiUser />
                </div>
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Update the details associated with your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-8">
              {/* Full name */}
              <div>
                <label className={labelClass}>Full name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={changeHandler}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={changeHandler}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className={labelClass}>Account role</label>
                <div className="flex min-h-[46px] items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/50 px-4">
                  <FiShield className="text-indigo-400" />
                  <span className="text-sm capitalize text-slate-300">
                    {role || "User"}
                  </span>
                  <span className="ml-auto text-xs text-slate-600">
                    Assigned
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-300">
                    About you
                  </label>
                  <span className="text-xs text-slate-500">Optional</span>
                </div>
                <textarea
                  rows={4}
                  name="bio"
                  value={formData.bio}
                  onChange={changeHandler}
                  maxLength={500}
                  placeholder="Write a little about yourself..."
                  className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <p className="mt-2 text-right text-xs text-slate-600">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </section>

          {/* Security section */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-400">
                  <FiLock />
                </div>
                <div>
                  <h3 className="font-semibold">Security Settings</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Change your password to keep your account secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <label className={labelClass}>New password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  minLength={6}
                  className={inputClass}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Leave this field empty if you don't want to change your
                current password.
              </p>
            </div>
          </section>

          {/* Save actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <FiCheckCircle className="shrink-0 text-emerald-400" />
              Your changes are saved only when you click Save Changes.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-red-500/20 bg-red-500/[0.035]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-xl text-red-400">
                <FiTrash2 />
              </div>
              <div>
                <h3 className="font-semibold text-red-300">Danger Zone</h3>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                  Permanently delete your account and associated access.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/15 disabled:opacity-60"
            >
              {deleting ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiTrash2 />
              )}
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-600 sm:flex-row">
          <p>© Rentora AI · Your property journey, simplified.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 transition hover:text-indigo-400"
          >
            <FiHome />
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
