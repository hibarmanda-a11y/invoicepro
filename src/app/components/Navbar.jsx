"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FileText, Menu, X, ArrowRight, User, ShieldCheck, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const isTemplates = pathname.startsWith("/templates");
  const isAbout = pathname.startsWith("/about");
  const isAdmin = pathname.startsWith("/admin");
  const isProfile = pathname.startsWith("/userprofile");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e8e8e3] bg-[#fafaf8]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-[0.98]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11110f] text-white shadow-sm transition-transform duration-300 group-hover:-rotate-3">
            <FileText size={16} strokeWidth={2.2} />
          </div>
          <span className="text-base font-semibold tracking-[-0.04em] text-[#141413]">
            Invoice<span className="text-black/40">Pro</span>
          </span>
        </Link>

        {/* Center Pill Nav (Desktop) */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-[#e8e8e3] bg-[#f0f0ec]/70 p-1 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${isHome
                ? "bg-[#11110f] text-white shadow-sm"
                : "text-[#666660] hover:text-[#141413]"
              }`}
          >
            Home
          </Link>

          <Link
            href="/templates"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${isTemplates
                ? "bg-[#11110f] text-white shadow-sm"
                : "text-[#666660] hover:text-[#141413]"
              }`}
          >
            Templates
          </Link>

          <Link
            href="/about"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${isAbout
                ? "bg-[#11110f] text-white shadow-sm"
                : "text-[#666660] hover:text-[#141413]"
              }`}
          >
            About
          </Link>
        </div>

        {/* Right CTA / User Status (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-[#e8e8e3]" />
          ) : session ? (
            <div className="flex items-center gap-2">
              {session.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 rounded-full border border-[#d8d8d2] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] shadow-sm transition hover:bg-[#f5f5f2] ${isAdmin ? "ring-2 ring-[#11110f]" : ""
                    }`}
                >
                  <ShieldCheck size={13} className="text-[#526b5b]" />
                  Admin
                </Link>
              )}

              <Link
                href="/userprofile"
                className={`inline-flex items-center gap-2 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-xs font-semibold text-[#222220] shadow-sm transition hover:border-[#d4d4cd] hover:bg-[#fafaf8] ${isProfile ? "ring-2 ring-[#11110f]" : ""
                  }`}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#11110f] text-[10px] font-bold text-white">
                  {(session.user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{session.user?.name || "Account"}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="text-xs font-semibold text-[#555550] transition hover:text-[#11110f]"
              >
                Sign in
              </Link>

              <Link
                href="/templates"
                className="group inline-flex items-center gap-1.5 rounded-full bg-[#11110f] px-4 py-2 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-[#252522] active:scale-[0.98]"
              >
                <span>Create Invoice</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e8e3] bg-white text-[#292927] md:hidden shadow-sm"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="border-b border-[#e8e8e3] bg-[#fafaf8] px-5 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isHome ? "bg-[#11110f] text-white" : "text-[#555550] hover:bg-black/5"
                }`}
            >
              Home
            </Link>

            <Link
              href="/templates"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isTemplates ? "bg-[#11110f] text-white" : "text-[#555550] hover:bg-black/5"
                }`}
            >
              Browse Templates
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isAbout ? "bg-[#11110f] text-white" : "text-[#555550] hover:bg-black/5"
                }`}
            >
              About InvoicePro
            </Link>

            <div className="my-2 h-px bg-[#e8e8e3]" />

            {session ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/userprofile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl bg-white border border-[#e8e8e3] px-4 py-2.5 text-sm font-semibold text-[#141413]"
                >
                  <User size={16} />
                  <span>My Account ({session.user?.name})</span>
                </Link>

                {session.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl bg-white border border-[#e8e8e3] px-4 py-2.5 text-sm font-semibold text-[#141413]"
                  >
                    <ShieldCheck size={16} className="text-[#526b5b]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#9a625c] hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-[#e8e8e3] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#141413]"
                >
                  Sign in
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-[#11110f] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}