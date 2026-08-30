"use client";

import { useEffect, useState, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Users,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  LogOut,
  LayoutGrid,
  Sparkles,
  Search,
  Settings
} from "lucide-react";

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("templates"); // "templates", "upload", "users"
  
  // Template form state
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [hasBackgroundImage, setHasBackgroundImage] = useState(false);
  const [defaultTaxEnabled, setDefaultTaxEnabled] = useState(false);
  const [defaultDiscountEnabled, setDefaultDiscountEnabled] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [stats, setStats] = useState({ templates: 0, users: 0, downloads: 0 });
  const [users, setUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  async function loadTemplates() {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Unable to load templates");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
      setStats((current) => ({ ...current, templates: data.length }));
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetch("/api/templates"), fetch("/api/admin/stats"), fetch("/api/admin/users")])
      .then(async ([templatesRes, statsRes, usersRes]) => {
        if (!templatesRes.ok || !statsRes.ok || !usersRes.ok) throw new Error("Admin data request failed");
        const [templateData, statsData, usersData] = await Promise.all([
          templatesRes.json(),
          statsRes.json(),
          usersRes.json(),
        ]);
        if (cancelled) return;
        setTemplates(Array.isArray(templateData) ? templateData : []);
        setStats({
          ...statsData,
          templates: Array.isArray(templateData) ? templateData.length : 0,
          users: usersData.total ?? usersData.users?.length ?? 0,
        });
        setUsers(usersData.users || []);
      })
      .catch(() => {
        if (!cancelled) {
          setMessage({ type: "error", text: "Unable to load admin analytics. Please refresh." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function deleteTemplate(id) {
    if (!window.confirm("Delete this template permanently from the platform?")) return;
    const response = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTemplates((current) => current.filter((template) => template._id !== id));
      setStats((current) => ({ ...current, templates: Math.max(0, current.templates - 1) }));
      setMessage({ type: "success", text: "Template removed successfully." });
    }
  }

  async function makeAdmin(id) {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: "admin" }),
    });
    if (response.ok) {
      setUsers((current) =>
        current.map((user) => (user._id === id ? { ...user, role: "admin" } : user))
      );
      setMessage({ type: "success", text: "User role elevated to Admin." });
    }
  }

  function handleFileSelection(file) {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !html || !css || !thumbnailFile) {
      setMessage({ type: "error", text: "Please fill in all fields (Name, HTML, CSS) and select a thumbnail image." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Upload thumbnail to Cloudinary
      const fd = new FormData();
      fd.append("file", thumbnailFile);
      fd.append("folder", "invoicepro/thumbnails");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      // 2. Save template to MongoDB
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          html,
          css,
          thumbnailUrl: uploadData.url,
          hasBackgroundImage,
          defaultTaxEnabled,
          defaultDiscountEnabled,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save template");
      }

      setMessage({ type: "success", text: `Template "${name}" published successfully!` });
      setName("");
      setHtml("");
      setCss("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setHasBackgroundImage(false);
      setDefaultTaxEnabled(false);
      setDefaultDiscountEnabled(false);

      await loadTemplates();
      setActiveTab("templates");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) =>
      t.name?.toLowerCase().includes(searchFilter.toLowerCase().trim())
    );
  }, [templates, searchFilter]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Admin Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-[#e8e8e3]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c8c87] shadow-xs mb-2">
              <ShieldCheck size={12} className="text-[#526b5b]" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl">
              Platform Administration
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#777771]">
              Manage templates, monitor user activity, and publish new invoice layouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#11110f] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#252522] transition"
            >
              <Plus size={14} />
              <span>Create Template</span>
            </button>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e8e3] bg-white px-4 py-2.5 text-xs font-semibold text-[#8c8c87] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-xs"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </div>
        </section>

        {/* Global Alert Notification */}
        {message.text && (
          <div
            className={`rounded-2xl border p-4 text-xs font-semibold flex items-center justify-between animate-fade-in ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-current opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Platform Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#8c8c87]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Templates</span>
              <FileText size={16} />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#141413]">
              {stats.templates}
            </p>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Published designs</p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#8c8c87]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Total Users</span>
              <Users size={16} />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#141413]">
              {stats.users}
            </p>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Registered accounts</p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#8c8c87]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">PDF Exports</span>
              <Download size={16} />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#141413]">
              {stats.downloads}
            </p>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Total generated files</p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#8c8c87]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Admin Status</span>
              <ShieldCheck size={16} className="text-[#526b5b]" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#141413]">
              Superuser
            </p>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Verified credentials</p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-[#e8e8e3] gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            className={`pb-3 text-xs font-semibold tracking-wide transition border-b-2 flex items-center gap-1.5 ${
              activeTab === "templates"
                ? "border-[#11110f] text-[#141413]"
                : "border-transparent text-[#8c8c87] hover:text-[#141413]"
            }`}
          >
            <LayoutGrid size={14} />
            <span>Templates Catalog ({templates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`pb-3 text-xs font-semibold tracking-wide transition border-b-2 flex items-center gap-1.5 ${
              activeTab === "upload"
                ? "border-[#11110f] text-[#141413]"
                : "border-transparent text-[#8c8c87] hover:text-[#141413]"
            }`}
          >
            <Plus size={14} />
            <span>Create New Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`pb-3 text-xs font-semibold tracking-wide transition border-b-2 flex items-center gap-1.5 ${
              activeTab === "users"
                ? "border-[#11110f] text-[#141413]"
                : "border-transparent text-[#8c8c87] hover:text-[#141413]"
            }`}
          >
            <Users size={14} />
            <span>User Management ({users.length})</span>
          </button>
        </div>

        {/* TAB 1: TEMPLATES CATALOG */}
        {activeTab === "templates" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[#8c8c87]">
                Live templates available to all platform users
              </p>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a94]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter templates..."
                  className="w-full h-9 pl-8.5 pr-3 text-xs rounded-xl border border-[#e5e5df] bg-white focus:outline-none focus:border-[#11110f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((t) => (
                <div
                  key={t._id}
                  className="overflow-hidden rounded-2xl border border-[#e8e8e3] bg-white shadow-xs transition hover:shadow-md flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#f5f5f2] overflow-hidden border-b border-[#f0f0ec]">
                    <Image
                      src={t.thumbnailUrl}
                      alt={t.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#141413] truncate">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-[#8c8c87] mt-0.5">
                      Created: {new Date(t.createdAt || Date.now()).toLocaleDateString()}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f0f0ec]">
                      <Link
                        href={`/templates/${t._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#11110f] hover:underline"
                      >
                        <span>Open Studio</span>
                        <ExternalLink size={12} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => deleteTemplate(t._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTemplates.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-[#d8d8d2] bg-white p-12 text-center">
                  <p className="text-sm font-semibold text-[#141413]">No templates found</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#11110f] px-4 py-2 text-xs font-semibold text-white shadow-sm"
                  >
                    <Plus size={13} />
                    <span>Upload First Template</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: CREATE TEMPLATE STUDIO */}
        {activeTab === "upload" && (
          <section className="rounded-2xl border border-[#e8e8e3] bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-[#f0f0ec]">
              <h2 className="text-lg font-semibold text-[#141413]">Publish New Invoice Template</h2>
              <p className="text-xs text-[#8c8c87] mt-0.5">
                Add HTML document structure with data-field interpolation tags and custom CSS.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-xs font-semibold text-[#333330] mb-1.5">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Minimal Agency Pro Invoice"
                  className="saas-input"
                />
              </div>

              {/* HTML & CSS Editors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#333330]">
                      HTML Layout
                    </label>
                    <span className="text-[10px] font-mono text-[#8c8c87] bg-[#f5f5f2] px-2 py-0.5 rounded">
                      data-field tags
                    </span>
                  </div>
                  <textarea
                    required
                    rows={12}
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    placeholder='<div class="invoice-container">&#10;  <h1 data-field="company-name"></h1>&#10;  <div data-field="items-body">&#10;    <div data-field="item-row-template">&#10;      <span data-field="item-desc"></span>&#10;    </div>&#10;  </div>&#10;</div>'
                    className="w-full resize-y rounded-xl border border-[#e5e5df] bg-[#fafaf8] p-3 font-mono text-xs text-[#1a1a19] focus:bg-white focus:border-[#11110f] focus:outline-none"
                  />
                  <p className="mt-1.5 text-[11px] text-[#8c8c87]">
                    Supported tags: <code className="font-mono text-[#11110f]">company-name</code>, <code className="font-mono text-[#11110f]">from</code>, <code className="font-mono text-[#11110f]">bill-to</code>, <code className="font-mono text-[#11110f]">invoice-number</code>, <code className="font-mono text-[#11110f]">items-body</code>, <code className="font-mono text-[#11110f]">item-row-template</code>, <code className="font-mono text-[#11110f]">grand-total</code>.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#333330]">
                      CSS Stylesheet
                    </label>
                    <span className="text-[10px] font-mono text-[#8c8c87] bg-[#f5f5f2] px-2 py-0.5 rounded">
                      Custom styling
                    </span>
                  </div>
                  <textarea
                    required
                    rows={12}
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    placeholder=".invoice-container { max-width: 800px; margin: auto; font-family: sans-serif; }"
                    className="w-full resize-y rounded-xl border border-[#e5e5df] bg-[#fafaf8] p-3 font-mono text-xs text-[#1a1a19] focus:bg-white focus:border-[#11110f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-xs font-semibold text-[#333330] mb-1.5">
                  Template Thumbnail Preview
                </label>
                
                {thumbnailPreview ? (
                  <div className="flex items-center gap-4 rounded-xl border border-[#e8e8e3] p-3 bg-[#fafaf8]">
                    <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-white border">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#141413]">{thumbnailFile?.name}</p>
                      <p className="text-[11px] text-[#8c8c87]">Ready to upload to Cloudinary CDN</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview("");
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Change image
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8d8d2] bg-[#fafaf8] p-8 hover:bg-white transition text-center">
                    <UploadCloud size={24} className="text-[#8c8c87] mb-2" />
                    <span className="text-xs font-semibold text-[#141413]">
                      Click to choose thumbnail screenshot
                    </span>
                    <span className="text-[11px] text-[#8c8c87] mt-0.5">
                      PNG, JPG or WEBP (Recommended aspect ratio 3:4 or 4:5)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelection(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Options */}
              <div className="pt-4 border-t border-[#f0f0ec]">
                <p className="text-xs font-semibold text-[#333330] mb-3">Template Options</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 rounded-xl border border-[#e8e8e3] p-3 bg-[#fafaf8] cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={hasBackgroundImage}
                      onChange={(e) => setHasBackgroundImage(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#11110f]"
                    />
                    <span className="text-xs font-medium text-[#141413]">Background Image Support</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-[#e8e8e3] p-3 bg-[#fafaf8] cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={defaultTaxEnabled}
                      onChange={(e) => setDefaultTaxEnabled(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#11110f]"
                    />
                    <span className="text-xs font-medium text-[#141413]">Enable Tax by Default</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-[#e8e8e3] p-3 bg-[#fafaf8] cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={defaultDiscountEnabled}
                      onChange={(e) => setDefaultDiscountEnabled(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#11110f]"
                    />
                    <span className="text-xs font-medium text-[#141413]">Enable Discount by Default</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#f0f0ec]">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#11110f] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#252522] transition disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>{loading ? "Publishing Template..." : "Publish Template to Platform"}</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === "users" && (
          <section className="rounded-2xl border border-[#e8e8e3] bg-white shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#f0f0ec]">
              <h2 className="text-base font-semibold text-[#141413]">Registered Platform Users</h2>
              <p className="text-xs text-[#8c8c87] mt-0.5">
                Overview of user accounts and administrative roles
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafaf8] text-[#8c8c87] uppercase text-[10px] tracking-wider border-b border-[#f0f0ec]">
                  <tr>
                    <th className="px-6 py-3 font-semibold">User</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0ec]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#fafaf8] transition">
                      <td className="px-6 py-4 font-semibold text-[#141413]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#11110f] text-white text-[10px] font-bold">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#777771]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            user.role === "admin"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-[#f5f5f2] text-[#666660]"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => makeAdmin(user._id)}
                            className="font-semibold text-[#11110f] hover:underline"
                          >
                            Promote to Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[#8c8c87]">
                        No user accounts registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}