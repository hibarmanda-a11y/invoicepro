"use client";

import React, { useEffect, useState } from "react";

const items = [
  {
    number: "01",
    title: "Professional Templates",
    text: "Choose from beautiful and professional invoice templates.",
  },
  {
    number: "02",
    title: "Easy to Customize",
    text: "Edit your invoice quickly with simple and powerful tools.",
  },
  {
    number: "03",
    title: "Fast & Simple",
    text: "Create professional invoices in just a few seconds.",
  },
  {
    number: "04",
    title: "Download Anywhere",
    text: "Download your invoice and use it whenever you need.",
  },
];

export default function Whyus() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <span className="text-xs font-bold tracking-[3px] text-gray-500">
            WHY INVOICEPRO
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-[-2px] leading-tight text-black">
            Everything you need to
            <br />
            create better invoices.
          </h2>

          <p className="mt-6 max-w-md text-gray-500 leading-7">
            Simple tools and beautiful templates to help you create
            professional invoices faster.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const isActive = active === index;

            return (
              <button
                key={item.number}
                onClick={() => setActive(index)}
                className={`
                  w-full text-left flex items-center gap-5 p-5
                  rounded-2xl border
                  transition-all duration-700 ease-out
                  ${
                    isActive
                      ? "bg-black text-white border-black translate-x-2 shadow-xl"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }
                `}
              >
                {/* NUMBER */}
                <div
                  className={`
                    text-sm font-bold min-w-[30px]
                    transition-all duration-500
                    ${isActive ? "text-white" : "text-gray-400"}
                  `}
                >
                  {item.number}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3
                    className={`
                      text-lg font-semibold
                      transition-all duration-500
                      ${isActive ? "translate-x-1" : ""}
                    `}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`
                      mt-1 text-sm leading-6
                      transition-all duration-700
                      ${
                        isActive
                          ? "text-gray-300 opacity-100"
                          : "text-gray-500 opacity-70"
                      }
                    `}
                  >
                    {item.text}
                  </p>
                </div>

                {/* ARROW */}
                <div
                  className={`
                    text-2xl
                    transition-all duration-700
                    ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }
                  `}
                >
                  →
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOTS */}
      <div className="max-w-6xl mx-auto mt-10 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.number}
            onClick={() => setActive(index)}
            className={`
              h-1.5 rounded-full
              transition-all duration-500
              ${
                active === index
                  ? "w-10 bg-black"
                  : "w-2 bg-gray-300"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}