// "use client";

// import { useEffect, useState } from "react";

// export default function AdminPage() {
//   const [name, setName] = useState("");
//   const [html, setHtml] = useState("");
//   const [css, setCss] = useState("");
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [hasBackgroundImage, setHasBackgroundImage] = useState(false);
//   const [defaultTaxEnabled, setDefaultTaxEnabled] = useState(false);
//   const [defaultDiscountEnabled, setDefaultDiscountEnabled] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [message, setMessage] = useState("");

//   async function loadTemplates() {
//     const res = await fetch("/api/templates");
//     const data = await res.json();
//     setTemplates(data);
//   }

//   useEffect(() => {
//     let cancelled = false;

//     fetch("/api/templates")
//       .then((res) => res.json())
//       .then((data) => {
//         if (!cancelled) {
//           setTemplates(data);
//         }
//       })
//       .catch(() => {
//         if (!cancelled) {
//           setTemplates([]);
//         }
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!name || !html || !css || !thumbnailFile) {
//       setMessage("Please fill all fields and select a thumbnail image.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       // 1. Upload thumbnail to Cloudinary
//       const fd = new FormData();
//       fd.append("file", thumbnailFile);
//       fd.append("folder", "invoicepro/thumbnails");

//       const uploadRes = await fetch("/api/upload", {
//         method: "POST",
//         body: fd,
//       });
//       const uploadData = await uploadRes.json();

//       if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

//       // 2. Save template to MongoDB
//       const res = await fetch("/api/templates", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           html,
//           css,
//           thumbnailUrl: uploadData.url,
//           hasBackgroundImage,
//           defaultTaxEnabled,
//           defaultDiscountEnabled,
//         }),
//       });

//       if (!res.ok) {
//         const d = await res.json();
//         throw new Error(d.error || "Failed to save template");
//       }

//       setMessage("Template uploaded successfully!");
//       setName("");
//       setHtml("");
//       setCss("");
//       setThumbnailFile(null);
//       setHasBackgroundImage(false);
//       setDefaultTaxEnabled(false);
//       setDefaultDiscountEnabled(false);
//       loadTemplates();
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="space-y-10">
//       <div>
//         <h1 className="text-2xl font-bold mb-4">Upload New Template</h1>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white border rounded-xl p-6 space-y-4 shadow-sm"
//         >
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Template Name
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2"
//               placeholder="e.g. Modern Hotel Invoice"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               HTML (must use data-field attributes)
//             </label>
//             <textarea
//               value={html}
//               onChange={(e) => setHtml(e.target.value)}
//               rows={8}
//               className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
//               placeholder='<div data-field="company-name"></div> ...'
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">CSS</label>
//             <textarea
//               value={css}
//               onChange={(e) => setCss(e.target.value)}
//               rows={8}
//               className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
//               placeholder=".invoice { ... }"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Thumbnail Image
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setThumbnailFile(e.target.files[0])}
//             />
//           </div>

//           <div className="flex flex-wrap gap-6 text-sm">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={hasBackgroundImage}
//                 onChange={(e) => setHasBackgroundImage(e.target.checked)}
//               />
//               Has background image
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={defaultTaxEnabled}
//                 onChange={(e) => setDefaultTaxEnabled(e.target.checked)}
//               />
//               Tax enabled by default
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={defaultDiscountEnabled}
//                 onChange={(e) => setDefaultDiscountEnabled(e.target.checked)}
//               />
//               Discount enabled by default
//             </label>
//           </div>

//           {message && (
//             <p className="text-sm text-blue-600 font-medium">{message}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
//           >
//             {loading ? "Uploading..." : "Upload Template"}
//           </button>
//         </form>
//       </div>

//       <div>
//         <h2 className="text-xl font-bold mb-4">
//           Existing Templates ({templates.length})
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {templates.map((t) => (
//             <div
//               key={t._id}
//               className="border rounded-lg overflow-hidden bg-white shadow-sm"
//             >
//               <img
//                 src={t.thumbnailUrl}
//                 alt={t.name}
//                 className="w-full h-32 object-cover"
//               />
//               <div className="p-2">
//                 <p className="text-sm font-medium truncate">{t.name}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [hasBackgroundImage, setHasBackgroundImage] = useState(false);
  const [defaultTaxEnabled, setDefaultTaxEnabled] = useState(false);
  const [defaultDiscountEnabled, setDefaultDiscountEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ templates: 0, users: 0, downloads: 0 });
  const [users, setUsers] = useState([]);

  async function loadTemplates() {
    const res = await fetch("/api/templates");
    if (!res.ok) throw new Error("Unable to load templates");
    const data = await res.json();
    setTemplates(data);
    setStats((current) => ({ ...current, templates: data.length }));
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
        setStats({ ...statsData, templates: Array.isArray(templateData) ? templateData.length : 0, users: usersData.total ?? usersData.users?.length ?? 0 });
        setUsers(usersData.users || []);
      })
      .catch(() => {
        if (!cancelled) {
          setTemplates([]);
          setUsers([]);
          setMessage("Unable to load admin data. Please refresh and try again.");
        }
      });

    return () => { cancelled = true; };
  }, []);

  async function deleteTemplate(id) {
    if (!window.confirm("Delete this template permanently?")) return;
    const response = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTemplates((current) => current.filter((template) => template._id !== id));
      setStats((current) => ({ ...current, templates: Math.max(0, current.templates - 1) }));
    }
  }

  async function makeAdmin(id) {
    const response = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role: "admin" }) });
    if (response.ok) setUsers((current) => current.map((user) => user._id === id ? { ...user, role: "admin" } : user));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !html || !css || !thumbnailFile) {
      setMessage("Please fill all fields and select a thumbnail image.");
      return;
    }

    setLoading(true);
    setMessage("");

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
        throw new Error(uploadData.error || "Upload failed");
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

      setMessage("Template uploaded successfully!");
      setName("");
      setHtml("");
      setCss("");
      setThumbnailFile(null);
      setHasBackgroundImage(false);
      setDefaultTaxEnabled(false);
      setDefaultDiscountEnabled(false);

      loadTemplates();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px] space-y-10">
        {/* =========================
            PAGE HEADER
        ========================== */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9a95]">
            Invoice Pro · Admin
          </p>

          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#20201e] sm:text-3xl">
              Upload New Template
            </h1>

            <p className="mt-1 text-sm text-[#8c8c87]">
              Create and manage professional invoice templates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-y border-[#e8e8e3] py-3">
          <a href="#upload" className="rounded-lg bg-[#222220] px-3 py-2 text-xs font-semibold text-white">Add Templates</a>
          <a href="#library" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#777771] hover:bg-white">All templates</a>
          <a href="#users" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#777771] hover:bg-white">Users</a>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="ml-auto rounded-lg px-3 py-2 text-xs font-semibold text-[#9a625c] hover:bg-white">Log out</button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[['Templates', stats.templates], ['Users', stats.users], ['Total downloads', stats.downloads], ['Role', 'Admin']].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#e8e8e3] bg-white p-4"><p className="text-[10px] uppercase tracking-[0.12em] text-[#a0a09a]">{label}</p><p className="mt-2 text-2xl font-semibold text-[#292927]">{value}</p></div>)}
        </div>

        {/* =========================
            UPLOAD FORM
        ========================== */}
        <form id="upload"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#e9e9e5] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:p-8"
        >
          <div className="space-y-7">
            {/* Template Name */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#4f4f4a]">
                Template name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Modern Hotel Invoice"
                className="h-11 w-full rounded-xl border border-[#e7e7e3] bg-[#fafaf8] px-4 text-sm text-[#292927] outline-none transition placeholder:text-[#b4b4ae] focus:border-[#cfcfca] focus:bg-white focus:ring-4 focus:ring-[#000000]/[0.025]"
              />
            </div>

            {/* HTML + CSS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* HTML */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-[#4f4f4a]">
                    HTML template
                  </label>

                  <span className="rounded-full bg-[#f3f3f0] px-2.5 py-1 text-[10px] font-medium text-[#999993]">
                    HTML
                  </span>
                </div>

                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  rows={10}
                  placeholder='<div data-field="company-name"></div> ...'
                  className="w-full resize-y rounded-xl border border-[#e7e7e3] bg-[#fafaf8] px-4 py-3 font-mono text-xs leading-6 text-[#383834] outline-none transition placeholder:text-[#b4b4ae] focus:border-[#cfcfca] focus:bg-white focus:ring-4 focus:ring-[#000000]/[0.025]"
                />

                <p className="mt-2 text-[11px] text-[#a0a09a]">
                  Use <span className="font-mono">data-field</span> attributes
                  for dynamic invoice content.
                </p>
              </div>

              {/* CSS */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-[#4f4f4a]">
                    CSS styles
                  </label>

                  <span className="rounded-full bg-[#f3f3f0] px-2.5 py-1 text-[10px] font-medium text-[#999993]">
                    CSS
                  </span>
                </div>

                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  rows={10}
                  placeholder=".invoice { ... }"
                  className="w-full resize-y rounded-xl border border-[#e7e7e3] bg-[#fafaf8] px-4 py-3 font-mono text-xs leading-6 text-[#383834] outline-none transition placeholder:text-[#b4b4ae] focus:border-[#cfcfca] focus:bg-white focus:ring-4 focus:ring-[#000000]/[0.025]"
                />

                <p className="mt-2 text-[11px] text-[#a0a09a]">
                  Add custom styling for the generated invoice.
                </p>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#4f4f4a]">
                Thumbnail image
              </label>

              <label className="group flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#dcdcd7] bg-[#fafaf8] px-5 py-6 text-center transition hover:border-[#c8c8c2] hover:bg-[#f7f7f5]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="hidden"
                />

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#ededE8]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="text-[#6d6d67]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5M12 15V4m0 0L8 8m4-4l4 4"
                    />
                  </svg>
                </div>

                <span className="text-sm font-medium text-[#4a4a46]">
                  {thumbnailFile
                    ? thumbnailFile.name
                    : "Choose thumbnail image"}
                </span>

                <span className="mt-1 text-[11px] text-[#a1a19b]">
                  PNG, JPG or WEBP · Recommended invoice preview
                </span>
              </label>
            </div>

            {/* Options */}
            <div className="border-t border-[#eeeeea] pt-6">
              <p className="mb-4 text-xs font-medium text-[#4f4f4a]">
                Template options
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Background */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ecece8] bg-[#fafaf8] px-4 py-3.5 transition hover:bg-[#f6f6f3]">
                  <input
                    type="checkbox"
                    checked={hasBackgroundImage}
                    onChange={(e) =>
                      setHasBackgroundImage(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#d5d5d0] accent-[#222]"
                  />

                  <span>
                    <span className="block text-xs font-medium text-[#4a4a46]">
                      Background image
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[#a1a19b]">
                      Enable background support
                    </span>
                  </span>
                </label>

                {/* Tax */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ecece8] bg-[#fafaf8] px-4 py-3.5 transition hover:bg-[#f6f6f3]">
                  <input
                    type="checkbox"
                    checked={defaultTaxEnabled}
                    onChange={(e) =>
                      setDefaultTaxEnabled(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#d5d5d0] accent-[#222]"
                  />

                  <span>
                    <span className="block text-xs font-medium text-[#4a4a46]">
                      Tax enabled
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[#a1a19b]">
                      Enable tax by default
                    </span>
                  </span>
                </label>

                {/* Discount */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ecece8] bg-[#fafaf8] px-4 py-3.5 transition hover:bg-[#f6f6f3]">
                  <input
                    type="checkbox"
                    checked={defaultDiscountEnabled}
                    onChange={(e) =>
                      setDefaultDiscountEnabled(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#d5d5d0] accent-[#222]"
                  />

                  <span>
                    <span className="block text-xs font-medium text-[#4a4a46]">
                      Discount enabled
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[#a1a19b]">
                      Enable discount by default
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Message + Button */}
            <div className="flex flex-col gap-4 border-t border-[#eeeeea] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-[20px]">
                {message && (
                  <p
                    className={`text-xs font-medium ${
                      message.includes("success")
                        ? "text-[#58705b]"
                        : "text-[#9a625c]"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#222220] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#11110f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Template"}
              </button>
            </div>
          </div>
        </form>

        {/* =========================
            EXISTING TEMPLATES
        ========================== */}
        <section id="library" className="pb-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#a0a09a]">
                Library
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#292927]">
                Existing Templates
              </h2>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#777771] shadow-sm ring-1 ring-[#eaeae5]">
              {templates.length} templates
            </span>
          </div>

          {/* 3 COLUMN GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <div
                key={t._id}
                className="group overflow-hidden rounded-2xl border border-[#e8e8e3] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.025)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-[#f5f5f2]">
                  <img
                    src={t.thumbnailUrl}
                    alt={t.name}
                    className="aspect-[1.5/1] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/[0.08] to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                {/* Details */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#343431]">
                      {t.name}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#aaa9a3]">
                      Invoice template
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#777771]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 18l6-6-6-6"
                      />
                    </svg>
                  </div>
                  <button onClick={() => deleteTemplate(t._id)} className="mx-4 mb-4 text-xs font-semibold text-[#9a625c] hover:underline">Delete template</button>
                </div>
              </div>
            ))}

            {templates.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[#deded9] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f2]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#999993]"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                    />
                    <path d="M8 14l2.5-2.5L13 14l2-2 3 3" />
                  </svg>
                </div>

                <p className="mt-3 text-sm font-medium text-[#555550]">
                  No templates yet
                </p>

                <p className="mt-1 text-xs text-[#a0a09a]">
                  Upload your first invoice template above.
                </p>
              </div>
            )}
          </div>
        </section>

        <section id="users" className="pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#a0a09a]">People</p>
          <h2 className="mt-1 text-xl font-semibold text-[#292927]">Users</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e8e8e3] bg-white">
            {users.map((user) => <div key={user._id} className="flex min-w-[32rem] items-center justify-between gap-4 border-b border-[#eeeeea] px-4 py-3 last:border-0"><div><p className="text-sm font-semibold text-[#343431]">{user.name}</p><p className="text-xs text-[#8c8c87]">{user.email}</p></div><span className="text-xs text-[#777771]">{user.role}</span>{user.role === "user" && <button onClick={() => makeAdmin(user._id)} className="text-xs font-semibold text-[#343431] underline">Make admin</button>}</div>)}
            {!users.length && <p className="p-5 text-sm text-[#8c8c87]">No users found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}