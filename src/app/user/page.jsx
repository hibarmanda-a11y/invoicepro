"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wide">Loading Templates...</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-lg">
          No templates yet. Ask admin to upload one from the Admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
          Select a Template
        </h1>
        <p className="text-gray-500 text-lg">
          Pick a layout to generate your professional invoice.
        </p>
      </div>

      {/* Grid: 3 Columns on Large Screens, larger gaps for 'bit more' size feel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {templates.map((t) => (
          <div
            key={t._id}
            onClick={() => router.push(`/user/${t._id}`)}
            className="group cursor-pointer"
          >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
              
              {/* Image Wrapper - Aspect Ratio 3:4 is ideal for Invoices */}
              <div className="aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={t.thumbnailUrl}
                  alt={t.name}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Label */}
              <div className="p-6 bg-white flex items-center justify-between">
                <div className="truncate">
                  <h3 className="text-xl font-bold text-gray-800 truncate leading-tight">
                    {t.name}
                  </h3>
                  <span className="text-sm font-medium text-blue-600">Use Template</span>
                </div>
                
                {/* Visual indicator (Arrow) */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}