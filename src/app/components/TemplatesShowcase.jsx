"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function TemplatesShowcase() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[#eeeee9] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  const displayedTemplates = templates.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c8c87] shadow-sm mb-3">
            <Sparkles size={12} className="text-[#526b5b]" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#141413] sm:text-4xl">
            Choose Your Invoice Style
          </h2>
          <p className="mt-2 text-sm text-[#777771] sm:text-base">
            Every template is meticulously crafted for clarity, typography balance, and client presentation.
          </p>
        </div>

        <Link
          href="/templates"
          className="group inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#141413] hover:text-[#444440] transition"
        >
          <span>View all {templates.length} templates</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {displayedTemplates.map((t) => (
          <div
            key={t._id}
            onClick={() => router.push(`/templates/${t._id}`)}
            className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#e8e8e3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#cfcfc8] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
          >
            {/* Thumbnail Preview */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f4f0]">
              <Image
                src={t.thumbnailUrl}
                alt={t.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top transition duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Hover overlay with CTA */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#11110f] shadow-md">
                  Use This Template <ArrowRight size={13} />
                </span>
              </div>

              {/* Top Tags */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5">
                {t.defaultTaxEnabled && (
                  <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#444440] shadow-sm">
                    Tax Ready
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Label */}
            <div className="flex items-center justify-between p-4 bg-white border-t border-[#f0f0ec]">
              <div className="min-w-0 pr-3">
                <h3 className="truncate text-sm font-semibold tracking-tight text-[#141413]">
                  {t.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#8c8c87]">
                  Instant PDF Export
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f7f5] border border-[#e8e8e3] text-[#141413] transition-all group-hover:bg-[#11110f] group-hover:text-white group-hover:border-[#11110f]">
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/templates"
          className="group inline-flex items-center gap-2 rounded-full bg-[#11110f] px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#252522] hover:-translate-y-0.5"
        >
          <span>Explore All Invoice Templates</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}