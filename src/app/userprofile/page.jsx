"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  User,
  Download,
  FileText,
  Calendar,
  ShieldCheck,
  LogOut,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && !data.error) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDownloads = useMemo(() => {
    if (!user?.downloads) return [];
    return user.downloads
      .slice()
      .reverse()
      .filter((d) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          d.templateName?.toLowerCase().includes(q) ||
          d.invoiceNumber?.toLowerCase().includes(q)
        );
      });
  }, [user?.downloads, searchQuery]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        
        {/* Page Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-[#e8e8e3]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c8c87] shadow-xs mb-2">
              <User size={12} className="text-[#526b5b]" />
              <span>Personal Workspace</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl">
              Account & Activity
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#777771]">
              Manage your user profile and review your generated invoice history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl bg-[#11110f] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#252522] transition"
            >
              <span>New Invoice</span>
              <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e8e3] bg-white px-4 py-2.5 text-xs font-semibold text-[#8c8c87] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-xs"
            >
              <LogOut size={13} />
              <span>Log out</span>
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87]">
              Invoices Exported
            </span>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#141413]">
              {user?.downloads?.length || 0}
            </p>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Total generated PDFs</p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87]">
              Account Status
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#526b5b]" />
              <p className="text-2xl font-bold tracking-tight text-[#141413]">
                Active
              </p>
            </div>
            <p className="mt-1 text-[11px] text-[#8c8c87]">Full access enabled</p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87]">
              Access Level
            </span>
            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#526b5b]" />
              <p className="text-2xl font-bold tracking-tight text-[#141413] capitalize">
                {session?.user?.role || "User"}
              </p>
            </div>
            <p className="mt-1 text-[11px] text-[#8c8c87]">
              {session?.user?.role === "admin" ? "Administrative Console Access" : "Standard Professional"}
            </p>
          </div>
        </div>

        {/* Profile Details Card */}
        <section className="rounded-2xl border border-[#e8e8e3] bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#11110f] text-2xl font-bold text-white shadow-sm">
              {(session?.user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87]">
                  Account Name
                </p>
                <p className="text-sm font-semibold text-[#141413] mt-0.5">
                  {session?.user?.name || "InvoicePro User"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87]">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-[#141413] mt-0.5">
                  {session?.user?.email || "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity & Download History */}
        <section className="rounded-2xl border border-[#e8e8e3] bg-white shadow-xs overflow-hidden">
          
          {/* Activity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-[#f0f0ec]">
            <div>
              <h2 className="text-base font-semibold text-[#141413]">
                Recent Invoices & Activity
              </h2>
              <p className="text-xs text-[#8c8c87] mt-0.5">
                History of invoice documents downloaded from your account
              </p>
            </div>

            {user?.downloads?.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a94]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoice number..."
                  className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl border border-[#e5e5df] bg-[#fafaf8] focus:bg-white focus:outline-none focus:border-[#11110f]"
                />
              </div>
            )}
          </div>

          {/* Activity List */}
          <div>
            {filteredDownloads.length > 0 ? (
              <div className="divide-y divide-[#f0f0ec]">
                {filteredDownloads.map((item, index) => (
                  <article
                    key={`${item.templateId || index}-${item.downloadedAt}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-[#fafaf8] transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#141413]">
                          {item.templateName || "Custom Invoice"}
                        </h3>
                        <p className="text-xs font-mono text-[#8c8c87] mt-0.5">
                          {item.invoiceNumber || "INV-0000"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#777771]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#9a9a94]" />
                        <span>
                          {new Date(item.downloadedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {item.templateId && (
                        <Link
                          href={`/templates/${item.templateId}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#11110f] hover:underline"
                        >
                          <span>Open Template</span>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f7f5] text-[#8c8c87] mb-3">
                  <Download size={20} />
                </div>
                <h3 className="text-sm font-semibold text-[#141413]">No downloads yet</h3>
                <p className="mt-1 text-xs text-[#8c8c87] max-w-sm mx-auto">
                  When you customize and download invoices from our templates catalog, they will appear here.
                </p>
                <Link
                  href="/templates"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#11110f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#252522]"
                >
                  Browse Templates Catalog
                </Link>
              </div>
            )}
          </div>

        </section>

      </div>
    </main>
  );
}