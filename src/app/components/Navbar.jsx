"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isHome = pathname === "/";
  const isTemplates = pathname.startsWith("/templates");
  const isAbout = pathname.startsWith("/about");
  const profileHref = session?.user?.role === "admin" ? "/admin" : session ? "/userprofile" : `/login?callbackUrl=${encodeURIComponent(pathname)}`;

  return (
    <nav className="w-full border-b border-[#e8e8e3] bg-[#fafaf8]/95 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg text-[#20201e]">
          InvoicePro
        </Link>

        <div className="flex items-center gap-1 bg-[#f0f0ec] rounded-full p-1">
          
          {/* Home */}
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isHome
                ? "bg-[#222220] text-white"
                : "text-[#777771] hover:text-[#20201e]"
            }`}
          >
            Home
          </Link>

          {/* Templates */}
          <Link
            href="/templates"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isTemplates
                ? "bg-[#222220] text-white"
                : "text-[#777771] hover:text-[#20201e]"
            }`}
          >
            Templates
          </Link>

          <Link
            href="/about"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isAbout
                ? "bg-[#222220] text-white"
                : "text-[#777771] hover:text-[#20201e]"
            }`}
          >
            About us
          </Link>
          <Link href={profileHref} className="px-4 py-1.5 rounded-full text-sm font-medium text-[#777771] hover:text-[#20201e]">
            {status === "loading" ? "Profile" : session ? "Profile" : "Login"}
          </Link>

        </div>
      </div>
    </nav>
  );
}