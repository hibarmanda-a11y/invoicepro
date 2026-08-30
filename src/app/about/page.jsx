"use client";

import Link from "next/link";
import { FileText, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c8c87] shadow-xs mb-4">
            <Sparkles size={12} className="text-[#526b5b]" />
            <span>Our Philosophy</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#141413] leading-tight">
            Invoices as considered as the work behind them.
          </h1>
          
          <p className="mt-5 text-sm sm:text-base text-[#777771] leading-relaxed">
            InvoicePro gives independent professionals, agencies, and creators a focused workspace to choose a tailored layout, customize line items in real-time, and download mathematically precise PDF invoices without wrestling with bloated software.
          </p>
        </section>

        {/* Pillars Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f2] text-[#141413] mb-5">
              <Sparkles size={18} />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#8c8c87]">01 / CRAFT</span>
            <h3 className="text-lg font-semibold text-[#141413] mt-2 mb-2">
              Make it Yours
            </h3>
            <p className="text-xs text-[#777771] leading-relaxed">
              Start with a carefully built typographic template and shape the content, branding, logo, and signature to fit your business identity.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f2] text-[#141413] mb-5">
              <Zap size={18} />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#8c8c87]">02 / CLARITY</span>
            <h3 className="text-lg font-semibold text-[#141413] mt-2 mb-2">
              Keep it Clear
            </h3>
            <p className="text-xs text-[#777771] leading-relaxed">
              Every layout is designed for effortless readability, from itemized service deliverables to tax computations and final grand totals.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e8e3] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f2] text-[#141413] mb-5">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#8c8c87]">03 / EXECUTION</span>
            <h3 className="text-lg font-semibold text-[#141413] mt-2 mb-2">
              Move Forward
            </h3>
            <p className="text-xs text-[#777771] leading-relaxed">
              Export high-resolution PDF documents that render consistently across all devices, email clients, and professional printers.
            </p>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl bg-[#11110f] p-8 sm:p-12 text-white text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Ready to create your next invoice?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-md">
            Choose from our collection of professional templates and get your invoice sent in minutes.
          </p>
          <Link
            href="/templates"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold text-[#11110f] shadow-md hover:bg-neutral-100 transition"
          >
            <span>Explore Templates</span>
            <ArrowRight size={14} />
          </Link>
        </section>

      </div>
    </main>
  );
}
