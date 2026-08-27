"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTemplates = pathname.startsWith("/templates");
  const isUser = pathname.startsWith("/user");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg text-gray-800">
          InvoicePro
        </Link>

        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          
          {/* Home */}
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isHome
                ? "bg-black text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Home
          </Link>

          {/* Templates */}
          <Link
            href="/templates"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isTemplates
                ? "bg-black text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Templates
          </Link>

          {/* User */}
          {/* <Link
            href="/user"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isUser
                ? "bg-black text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            User
          </Link>

          {/* Admin */}
          {/* <Link
            href="/admin"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isAdmin
                ? "bg-black text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Admin
          </Link> */} 

        </div>
      </div>
    </nav>
  );
}