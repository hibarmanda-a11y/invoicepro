"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ArrowRight, Sparkles, SlidersHorizontal, Check } from "lucide-react";

const CATEGORIES = ["All", "Business", "Freelancer", "Minimal", "Modern", "Creative"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (selectedCategory === "All") return matchesSearch;
      // Filter heuristic: check if name includes category or default match
      const matchesCategory = t.name?.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && (matchesCategory || selectedCategory === "All");
    });
  }, [templates, searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c8c87] shadow-sm mb-3">
              <Sparkles size={12} className="text-[#526b5b]" />
              <span>Verified Layouts</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#141413] sm:text-4xl lg:text-5xl">
              Invoice Templates
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm text-[#777771] sm:text-base">
              Choose a design tailored for your workflow. Customize details in real-time and export high-resolution PDFs instantly.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <span className="rounded-full bg-white border border-[#e8e8e3] px-3.5 py-1.5 text-xs font-semibold text-[#555550] shadow-sm">
              {templates.length} {templates.length === 1 ? "template" : "templates"} available
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Categories Pill Group */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#eeeee9] border border-[#e2e2dc] w-fit">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-[#11110f] text-white shadow-sm"
                      : "text-[#666660] hover:text-[#141413] hover:bg-white/50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9a94]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template name..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#e5e5df] bg-white text-xs font-medium text-[#1a1a19] placeholder:text-[#9a9a94] shadow-sm focus:border-[#11110f] focus:outline-none focus:ring-2 focus:ring-[#11110f]/5 transition"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#e8e8e3] bg-white p-4 shadow-sm animate-pulse"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-[#f0f0ec]" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 w-32 rounded bg-[#f0f0ec]" />
                  <div className="h-4 w-16 rounded bg-[#f0f0ec]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!loading && templates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dcdcd6] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f7f5] text-[#8c8c87] mb-3">
              <SlidersHorizontal size={20} />
            </div>
            <h3 className="text-base font-semibold text-[#141413]">No templates published yet</h3>
            <p className="mt-1 text-xs text-[#8c8c87]">
              Admins can upload HTML/CSS templates from the Admin Console.
            </p>
          </div>
        )}

        {!loading && templates.length > 0 && filteredTemplates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dcdcd6] bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#141413]">No matching templates found</p>
            <p className="mt-1 text-xs text-[#8c8c87]">
              Try adjusting your search query or reset the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-[#11110f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#252522]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Template Cards Grid */}
        {!loading && filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((t) => (
              <div
                key={t._id}
                onClick={() => router.push(`/templates/${t._id}`)}
                className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#e8e8e3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cfcfc8] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
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

                  {/* Gradient Overlay & Hover Action Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#11110f] shadow-md">
                      Customize in Editor <ArrowRight size={13} />
                    </span>
                  </div>

                  {/* Top Features Badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    {t.defaultTaxEnabled && (
                      <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#444440] shadow-sm">
                        Tax Ready
                      </span>
                    )}
                    {t.defaultDiscountEnabled && (
                      <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#444440] shadow-sm">
                        Discount Support
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between p-4 bg-white border-t border-[#f0f0ec]">
                  <div className="min-w-0 pr-3">
                    <h2 className="truncate text-sm font-semibold tracking-tight text-[#141413]">
                      {t.name}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-[#8c8c87]">
                      Professional Document Layout
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f7f5] border border-[#e8e8e3] text-[#141413] transition-all group-hover:bg-[#11110f] group-hover:text-white group-hover:border-[#11110f]">
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}