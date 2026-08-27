"use client";

import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Invoice Creator", href: "/create" },
    { name: "Templates", href: "/templates" },
    { name: "Features", href: "/features" },
    { name: "PDF Export", href: "/features/pdf-export" },
  ],

  Resources: [
    { name: "Invoice Guide", href: "/guide" },
    { name: "Invoice Examples", href: "/examples" },
    { name: "Help Center", href: "/help" },
    { name: "FAQ", href: "/faq" },
  ],

  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f2] text-[#111]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid gap-12 border-b border-black/[0.07] py-14 sm:py-16 lg:grid-cols-[1.25fr_2fr] lg:py-20">

          {/* Brand */}
          <div className="max-w-[380px]">

            <Link
              href="/"
              aria-label="Invoice Pro home"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] text-white transition-transform duration-300 group-hover:-rotate-3">
                <FileText
                  size={18}
                  strokeWidth={1.7}
                />
              </div>

              <span className="text-xl font-semibold tracking-[-0.05em]">
                Invoice Pro
              </span>
            </Link>

            <p className="mt-5 max-w-[350px] text-sm leading-6 text-black/40">
              A simple, elegant invoice creator built for
              freelancers, creators, small businesses, and
              independent professionals.
            </p>

            {/* System Status */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-2 shadow-[0_5px_20px_rgba(0,0,0,0.025)]">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#526b5b] opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#526b5b]" />
              </span>

              <span className="text-xs text-black/45">
                All systems operational
              </span>

            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">

            {Object.entries(footerLinks).map(
              ([category, links]) => (
                <div key={category}>

                  <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                    {category}
                  </h2>

                  <nav
                    aria-label={`${category} links`}
                    className="space-y-3.5"
                  >
                    {links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="group flex w-fit items-center gap-1.5 text-sm text-black/45 transition-colors duration-200 hover:text-black"
                      >
                        <span>{link.name}</span>

                        <ArrowUpRight
                          size={12}
                          strokeWidth={1.7}
                          className="translate-y-[1px] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-50"
                        />
                      </Link>
                    ))}
                  </nav>

                </div>
              )
            )}

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-black/35">
            © {new Date().getFullYear()} Invoice Pro. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">

            <Link
              href="/privacy"
              className="text-xs text-black/35 transition-colors duration-200 hover:text-black"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-black/35 transition-colors duration-200 hover:text-black"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-xs text-black/35 transition-colors duration-200 hover:text-black"
            >
              Contact
            </Link>

            <span className="hidden h-3 w-px bg-black/10 sm:block" />

            <span className="text-xs text-black/25">
              Made for independent creators.
            </span>

          </div>
        </div>

      </div>
    </footer>
  );
}