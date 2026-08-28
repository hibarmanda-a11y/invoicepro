// "use client";

// import { useEffect, useState } from "react";
// import { ArrowRight, FileText, Gift, UserRound } from "lucide-react";
// import Link from "next/link";
// const numbers = [
//   "0000",
//   "0007",
//   "0018",
//   "0042",
//   "0084",
//   "0148",
//   "0248",
//   "0482",
//   "1024",
//   "2480",
//   "4820",
// ];

// const invoices = [
//   {
//     id: 1,
//     type: "minimal",
//     className:
//       "left-[2%] top-[18%] w-[280px] -rotate-[7deg] md:w-[300px]",
//   },
//   {
//     id: 2,
//     type: "classic",
//     className:
//       "left-[27%] top-[3%] w-[290px] rotate-[2deg] md:w-[310px]",
//   },
//   {
//     id: 3,
//     type: "modern",
//     className:
//       "left-[34%] top-[29%] w-[290px] -rotate-[1deg] md:w-[310px]",
//   },
//   {
//     id: 4,
//     type: "receipt",
//     className:
//       "right-[1%] top-[18%] w-[245px] rotate-[7deg] md:w-[265px]",
//   },
// ];

// function Line({ width = "w-20", dark = false }) {
//   return (
//     <div
//       className={`h-[5px] rounded-full ${
//         dark ? "bg-black/25" : "bg-black/[0.09]"
//       } ${width}`}
//     />
//   );
// }

// /* ---------------- MINIMAL ---------------- */

// function MinimalInvoice() {
//   return (
//     <div className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
//       <div className="p-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-[7px] uppercase tracking-[0.25em] text-black/35">
//               Invoice
//             </p>

//             <h3 className="mt-2 text-[25px] font-semibold tracking-[-0.07em]">
//               INV—0248
//             </h3>
//           </div>

//           <div className="h-8 w-8 rounded-full border border-black/10" />
//         </div>

//         <div className="my-6 h-px bg-black/[0.07]" />

//         <div className="grid grid-cols-2 gap-5">
//           <div>
//             <p className="mb-2 text-[6px] uppercase tracking-[0.2em] text-black/30">
//               From
//             </p>

//             <Line width="w-24" dark />
//             <Line width="w-16" />
//           </div>

//           <div>
//             <p className="mb-2 text-[6px] uppercase tracking-[0.2em] text-black/30">
//               Bill To
//             </p>

//             <Line width="w-24" dark />
//             <Line width="w-20" />
//           </div>
//         </div>

//         <div className="mt-8">
//           <p className="text-[6px] uppercase tracking-[0.2em] text-black/30">
//             Amount Due
//           </p>

//           <div className="mt-1 text-[37px] font-semibold tracking-[-0.08em]">
//             $4,820
//           </div>
//         </div>

//         <div className="mt-7 space-y-3">
//           {[
//             ["Brand identity", "$1,200"],
//             ["Website design", "$2,400"],
//             ["Art direction", "$1,220"],
//           ].map(([name, price]) => (
//             <div
//               key={name}
//               className="flex items-center justify-between border-b border-black/[0.06] pb-3"
//             >
//               <div>
//                 <p className="text-[8px] font-medium text-black/65">
//                   {name}
//                 </p>

//                 <p className="mt-1 text-[6px] text-black/30">
//                   Professional service
//                 </p>
//               </div>

//               <span className="text-[8px] text-black/60">{price}</span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-between">
//           <div>
//             <p className="text-[6px] uppercase text-black/30">Due</p>
//             <p className="mt-1 text-[8px] font-medium">03 Jun 2024</p>
//           </div>

//           <div className="h-8 w-8 rounded-full bg-[#526b5b]" />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- CLASSIC ---------------- */

// function ClassicInvoice() {
//   return (
//     <div className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-[#fcfcfb] shadow-[0_35px_90px_rgba(0,0,0,0.13)]">
//       <div className="p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#191919] text-white">
//               <span className="text-[10px]">N</span>
//             </div>

//             <div>
//               <Line width="w-20" dark />
//               <div className="mt-1.5">
//                 <Line width="w-12" />
//               </div>
//             </div>
//           </div>

//           <div className="text-right">
//             <p className="text-[9px] font-bold">INVOICE</p>
//             <p className="mt-1 text-[6px] text-black/30">#00482</p>
//           </div>
//         </div>

//         <div className="mt-7 grid grid-cols-3 gap-2">
//           {[
//             ["Client", "Nova Labs"],
//             ["Date", "20 MAY"],
//             ["Due", "03 JUN"],
//           ].map(([label, value]) => (
//             <div
//               key={label}
//               className="rounded-lg bg-[#f4f3ef] p-3"
//             >
//               <p className="text-[5px] uppercase text-black/30">
//                 {label}
//               </p>

//               <p className="mt-2 text-[7px] font-semibold">
//                 {value}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6">
//           <div className="grid grid-cols-[1fr_35px_55px] border-b border-black/10 pb-2">
//             <span className="text-[6px] uppercase text-black/30">
//               Description
//             </span>

//             <span className="text-[6px] uppercase text-black/30">
//               Qty
//             </span>

//             <span className="text-right text-[6px] uppercase text-black/30">
//               Amount
//             </span>
//           </div>

//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="grid grid-cols-[1fr_35px_55px] items-center border-b border-black/[0.05] py-3"
//             >
//               <div>
//                 <Line width="w-24" dark />
//                 <div className="mt-1">
//                   <Line width="w-14" />
//                 </div>
//               </div>

//               <span className="text-[7px] text-black/40">01</span>

//               <span className="text-right text-[7px]">
//                 $920
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-5 ml-auto w-[145px]">
//           <div className="flex justify-between text-[7px] text-black/40">
//             <span>Subtotal</span>
//             <span>$3,680</span>
//           </div>

//           <div className="mt-2 flex justify-between text-[7px] text-black/40">
//             <span>Tax</span>
//             <span>$368</span>
//           </div>

//           <div className="mt-2 flex justify-between border-t border-black/10 pt-2 text-[9px] font-bold">
//             <span>Total</span>
//             <span>$4,048</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- MODERN ---------------- */

// function ModernInvoice() {
//   return (
//     <div className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-white shadow-[0_35px_90px_rgba(0,0,0,0.14)]">
//       <div className="p-6">
//         <div className="flex justify-between">
//           <div>
//             <p className="text-[8px] font-bold tracking-[0.2em]">
//               STUDIO
//             </p>

//             <p className="mt-1 text-[6px] text-black/30">
//               Creative department
//             </p>
//           </div>

//           <p className="text-[8px] font-semibold">
//             0248
//           </p>
//         </div>

//         <div className="mt-8">
//           <p className="text-[6px] uppercase tracking-[0.2em] text-black/30">
//             Total
//           </p>

//           <p className="mt-1 text-[40px] font-semibold tracking-[-0.08em]">
//             $7,240
//           </p>
//         </div>

//         <div className="mt-7 rounded-xl bg-[#f5f4f1] p-4">
//           <p className="text-[6px] uppercase tracking-[0.15em] text-black/30">
//             Project
//           </p>

//           <p className="mt-2 text-[9px] font-semibold">
//             Brand & Digital Experience
//           </p>

//           <div className="mt-4 grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-[5px] text-black/30">
//                 CLIENT
//               </p>

//               <p className="mt-1 text-[7px]">North Labs</p>
//             </div>

//             <div>
//               <p className="text-[5px] text-black/30">
//                 PAYMENT
//               </p>

//               <p className="mt-1 text-[7px]">Net 30</p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 space-y-3">
//           {[
//             ["Research", "$1,200"],
//             ["Design", "$3,840"],
//             ["Development", "$2,200"],
//           ].map(([name, price]) => (
//             <div
//               key={name}
//               className="flex justify-between border-b border-black/[0.06] pb-3"
//             >
//               <span className="text-[8px] text-black/60">
//                 {name}
//               </span>

//               <span className="text-[8px] font-medium">
//                 {price}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- RECEIPT ---------------- */

// function ReceiptInvoice() {
//   return (
//     <div className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-[#faf9f6] shadow-[0_30px_75px_rgba(0,0,0,0.12)]">
//       <div className="px-5 py-6">
//         <div className="text-center">
//           <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#8b765f] text-white">
//             <span className="text-[10px] font-bold">N</span>
//           </div>

//           <p className="mt-3 text-[9px] font-bold tracking-wide">
//             NORTH STUDIO
//           </p>

//           <p className="mt-1 text-[6px] text-black/30">
//             Creative Services
//           </p>
//         </div>

//         <div className="my-7 text-center">
//           <p className="text-[6px] uppercase tracking-[0.25em] text-black/30">
//             Amount Due
//           </p>

//           <p className="mt-1 text-[31px] font-semibold tracking-[-0.07em]">
//             $1,850
//           </p>
//         </div>

//         <div className="border-t border-dashed border-black/15" />

//         <div className="py-5">
//           {[
//             ["Design consultation", "$350"],
//             ["Brand system", "$900"],
//             ["UI design", "$600"],
//           ].map(([name, price]) => (
//             <div
//               key={name}
//               className="flex justify-between py-2.5"
//             >
//               <span className="text-[7px] text-black/55">
//                 {name}
//               </span>

//               <span className="text-[7px] font-medium">
//                 {price}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="border-t border-dashed border-black/15" />

//         <div className="mt-5 space-y-3">
//           <div className="flex justify-between">
//             <span className="text-[6px] text-black/30">
//               Invoice
//             </span>
//             <span className="text-[7px]">#NS-248</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-[6px] text-black/30">
//               Date
//             </span>
//             <span className="text-[7px]">20 May 2024</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-[6px] text-black/30">
//               Payment
//             </span>
//             <span className="text-[7px]">Bank Transfer</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    INVOICE CARD
// ============================================================ */

// function InvoiceCard({ invoice, index, started }) {
//   let content = null;

//   if (invoice.type === "minimal") {
//     content = <MinimalInvoice />;
//   }

//   if (invoice.type === "classic") {
//     content = <ClassicInvoice />;
//   }

//   if (invoice.type === "modern") {
//     content = <ModernInvoice />;
//   }

//   if (invoice.type === "receipt") {
//     content = <ReceiptInvoice />;
//   }

//   return (
//     <div
//       className={`absolute ${invoice.className} ${
//         started ? "invoice-show" : "invoice-hidden"
//       }`}
//       style={{
//         animationDelay: `${index * 220}ms`,
//       }}
//     >
//       {content}
//     </div>
//   );
// }

// /* ============================================================
//    FEATURE
// ============================================================ */

// function Feature({ icon: Icon, children }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.07] bg-white">
//         <Icon size={14} className="text-black/50" />
//       </div>

//       <span className="text-sm text-black/50">
//         {children}
//       </span>
//     </div>
//   );
// }

// /* ============================================================
//    HERO
// ============================================================ */

// export default function HeroSection() {
//   const [numberIndex, setNumberIndex] = useState(0);
//   const [introFinished, setIntroFinished] = useState(false);
//   const [showTitle, setShowTitle] = useState(false);
//   const [showInvoices, setShowInvoices] = useState(false);
//   const [showContent, setShowContent] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setNumberIndex((current) => {
//         if (current >= numbers.length - 1) {
//           clearInterval(timer);

//           setTimeout(() => {
//             setIntroFinished(true);

//             setTimeout(() => {
//               setShowTitle(true);

//               setTimeout(() => {
//                 setShowInvoices(true);

//                 setTimeout(() => {
//                   setShowContent(true);
//                 }, 700);
//               }, 650);
//             }, 250);
//           }, 450);

//           return current;
//         }

//         return current + 1;
//       });
//     }, 100);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative min-h-[680px] overflow-hidden bg-[#f7f7f5] sm:min-h-[720px]">

//       {/* BACKGROUND */}

//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-1/2 top-[35%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white blur-[100px]" />

//         <div className="absolute left-[55%] top-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-black/[0.018] blur-[100px]" />
//       </div>

//       {/* SMALL DOTS */}

//       <span className="absolute left-[20%] top-[14%] h-1.5 w-1.5 rounded-full bg-black/15" />
//       <span className="absolute left-[52%] top-[18%] h-1 w-1 rounded-full bg-black/20" />
//       <span className="absolute right-[15%] top-[28%] h-2 w-2 rounded-full bg-black/10" />

//       {/* ======================================================
//           NUMBER INTRO
//       ======================================================= */}

//       {!introFinished && (
//         <div className="absolute inset-0 z-[100] flex items-center justify-center">
//           <div className="number-intro text-center">
//             <p className="mb-5 text-[9px] uppercase tracking-[0.35em] text-black/30">
//               Generating Invoice
//             </p>

//             <div className="w-[250px] text-[clamp(4rem,9vw,7rem)] font-semibold leading-none tracking-[-0.09em] tabular-nums text-[#111]">
//               {numbers[numberIndex]}
//             </div>

//             <div className="mx-auto mt-5 h-px w-14 bg-black/10" />
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           MAIN
//       ======================================================= */}

//       <div className="relative mx-auto flex min-h-[680px] max-w-[1450px] items-center px-6 py-12 sm:min-h-[720px] lg:px-10">

//         <div className="grid w-full items-center lg:grid-cols-[0.78fr_1.22fr]">

//           {/* ==================================================
//               LEFT
//           =================================================== */}

//           <div className="relative z-50 max-w-[540px]">

//             {/* BADGE */}

//             <div
//               className={`content-animation mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 shadow-sm ${
//                 showContent ? "content-visible" : ""
//               }`}
//             >
//               <span className="h-1.5 w-1.5 rounded-full bg-black/60" />

//               <span className="text-sm text-black/55">
//                 Simple. Fast. Professional.
//               </span>
//             </div>

//             {/* TITLE */}

//             <div className="min-h-[145px]">
//               {showTitle && (
//                 <h1 className="title-animation text-[clamp(4rem,7.5vw,7.4rem)] font-semibold leading-[0.82] tracking-[-0.085em] text-[#111]">
//                   Invoice
//                   <br />
//                   <span className="text-black/35">Pro</span>
//                 </h1>
//               )}
//             </div>

//             {/* SUBTITLE */}

//             <div
//               className={`content-animation ${
//                 showContent ? "content-visible" : ""
//               }`}
//             >
//               <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
//                 Free Invoice Creator
//               </h2>

//               <p className="mt-3 max-w-[460px] text-base leading-7 text-black/45 sm:text-lg">
//                 Create clean, professional invoices in seconds.
//                 Customize them, download as PDF, and send them to
//                 your clients.
//               </p>
//             </div>

//             {/* BUTTONS */}

//             <div
//               className={`content-animation mt-6 flex flex-col gap-3 sm:flex-row ${
//                 showContent ? "content-visible" : ""
//               }`}
//             >
//               <Link href="/templates" className="group flex items-center justify-center gap-3 rounded-xl bg-[#111] px-7 py-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1">
//                 View Templates

//                 <ArrowRight
//                   size={17}
//                   className="transition-transform duration-300 group-hover:translate-x-1"
//                 />
//               </Link>


//             </div>

//             {/* FEATURES */}

//             <div
//               className={`content-animation mt-7 flex flex-wrap gap-x-6 gap-y-3 ${
//                 showContent ? "content-visible" : ""
//               }`}
//             >
//               <Feature icon={Gift}>Easy To use</Feature>
//               <Feature icon={UserRound}>Customize it</Feature>
//               <Feature icon={FileText}>Export PDF</Feature>
//             </div>
//           </div>

//           {/* ==================================================
//               INVOICE AREA
//           =================================================== */}

//           <div className="relative mt-10 h-[500px] w-full lg:mt-0">

//             {/* FLOOR SHADOW */}

//             <div className="absolute bottom-[5%] left-1/2 h-14 w-[420px] -translate-x-1/2 rounded-full bg-black/[0.05] blur-[40px]" />

//             {/* INVOICES */}

//             {invoices.map((invoice, index) => (
//               <InvoiceCard
//                 key={invoice.id}
//                 invoice={invoice}
//                 index={index}
//                 started={showInvoices}
//               />
//             ))}

//             {/* TEMPLATE COUNT */}

//             <div
//               className={`absolute bottom-[1%] left-1/2 z-[60] -translate-x-1/2 rounded-full border border-black/[0.08] bg-white/95 px-4 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] backdrop-blur ${
//                 showInvoices ? "badge-show" : "badge-hidden"
//               }`}
//             >
//               <div className="flex items-center gap-3 whitespace-nowrap">
//                 <div className="flex -space-x-1.5">
//                   <span className="h-5 w-5 rounded-full border-2 border-white bg-[#526b5b]" />
//                   <span className="h-5 w-5 rounded-full border-2 border-white bg-[#69747d]" />
//                   <span className="h-5 w-5 rounded-full border-2 border-white bg-[#191919]" />
//                   <span className="h-5 w-5 rounded-full border-2 border-white bg-[#9a8064]" />
//                 </div>

//                 <span className="text-xs font-semibold text-black/55">
//                   12+ Professional Templates
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ======================================================
//           ANIMATION CSS
//       ======================================================= */}

//       <style>{`
//         .number-intro {
//           animation: numberEnter 500ms cubic-bezier(.22,1,.36,1);
//         }

//         @keyframes numberEnter {
//           from {
//             opacity: 0;
//             transform: scale(.88);
//             filter: blur(10px);
//           }

//           to {
//             opacity: 1;
//             transform: scale(1);
//             filter: blur(0);
//           }
//         }

//         .title-animation {
//           animation: titleEnter 700ms cubic-bezier(.22,1,.36,1) both;
//         }

//         @keyframes titleEnter {
//           from {
//             opacity: 0;
//             transform: translateY(22px);
//             filter: blur(8px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//             filter: blur(0);
//           }
//         }

//         .content-animation {
//           opacity: 0;
//           transform: translateY(14px);
//           transition:
//             opacity 700ms cubic-bezier(.22,1,.36,1),
//             transform 700ms cubic-bezier(.22,1,.36,1);
//         }

//         .content-visible {
//           opacity: 1;
//           transform: translateY(0);
//         }

//         .invoice-hidden {
//           opacity: 0;
//           transform: translateY(45px) scale(.88);
//           filter: blur(8px);
//         }

//         .invoice-show {
//           opacity: 0;
//           animation:
//             invoiceEnter
//             850ms
//             cubic-bezier(.22,1,.36,1)
//             forwards,
//             invoiceFloat
//             6s
//             ease-in-out
//             2s
//             infinite;
//         }

//         @keyframes invoiceEnter {
//           0% {
//             opacity: 0;
//             transform: translateY(45px) scale(.88);
//             filter: blur(8px);
//           }

//           65% {
//             opacity: 1;
//             transform: translateY(-5px) scale(1.02);
//             filter: blur(0);
//           }

//           100% {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//             filter: blur(0);
//           }
//         }

//         @keyframes invoiceFloat {
//           0%, 100% {
//             margin-top: 0;
//           }

//           50% {
//             margin-top: -9px;
//           }
//         }

//         .badge-hidden {
//           opacity: 0;
//           transform: translate(-50%, 20px);
//         }

//         .badge-show {
//           opacity: 1;
//           transform: translate(-50%, 0);
//           transition:
//             opacity 700ms ease,
//             transform 700ms cubic-bezier(.22,1,.36,1);
//         }

//         @media (max-width: 1023px) {
//           .invoice-editorial {
//             left: -5%;
//           }
//         }

//         @media (max-width: 640px) {
//           .invoice-editorial {
//             left: -8%;
//             top: 25%;
//             width: 190px;
//           }

//           .invoice-minimal {
//             left: 16%;
//             top: 5%;
//             width: 205px;
//           }

//           .invoice-grid {
//             left: 30%;
//             top: 34%;
//             width: 200px;
//           }

//           .invoice-receipt {
//             right: -10%;
//             top: 25%;
//             width: 180px;
//           }

//           .badge-show,
//           .badge-hidden {
//             transform: translateX(-50%);
//           }

//           .badge-show {
//             opacity: 1;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .number-intro,
//           .title-animation,
//           .invoice-show {
//             animation: none !important;
//           }

//           .content-animation {
//             opacity: 1;
//             transform: none;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Gift,
  UserRound,
} from "lucide-react";

/* ============================================================
   INVOICE COLOR SYSTEM
============================================================ */

const invoiceColors = {
  sage: {
    accent: "#526b5b",
    soft: "#edf1ed",
    light: "#f6f8f5",
  },

  slate: {
    accent: "#687580",
    soft: "#eef1f3",
    light: "#f7f8f9",
  },

  clay: {
    accent: "#a66b57",
    soft: "#f3eae6",
    light: "#faf6f3",
  },

  sand: {
    accent: "#927b62",
    soft: "#f1ece5",
    light: "#faf8f4",
  },
};

/* ============================================================
   INVOICE DATA
============================================================ */

const invoices = [
  {
    id: 1,
    type: "minimal",
    color: "sage",
    className:
      "invoice-one left-[2%] top-[18%] w-[280px] -rotate-[7deg] md:w-[300px]",
  },

  {
    id: 2,
    type: "classic",
    color: "slate",
    className:
      "invoice-two left-[27%] top-[3%] w-[290px] rotate-[2deg] md:w-[310px]",
  },

  {
    id: 3,
    type: "modern",
    color: "clay",
    className:
      "invoice-three left-[34%] top-[29%] w-[290px] -rotate-[1deg] md:w-[310px]",
  },

  {
    id: 4,
    type: "receipt",
    color: "sand",
    className:
      "invoice-four right-[1%] top-[18%] w-[245px] rotate-[7deg] md:w-[265px]",
  },
];

/* ============================================================
   SKELETON LINE
============================================================ */

function Line({
  width = "w-20",
  dark = false,
}) {
  return (
    <div
      aria-hidden="true"
      className={`h-[5px] rounded-full ${dark
          ? "bg-black/25"
          : "bg-black/[0.09]"
        } ${width}`}
    />
  );
}

/* ============================================================
   MINIMAL INVOICE
============================================================ */

function MinimalInvoice({ color }) {
  return (
    <article
      aria-label="Minimal professional invoice template"
      className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
    >
      <div className="p-6">

        <header className="flex items-start justify-between">

          <div>
            <p className="text-[7px] uppercase tracking-[0.25em] text-black/35">
              Invoice
            </p>

            <h3 className="mt-2 text-[25px] font-semibold tracking-[-0.07em]">
              INV—0248
            </h3>
          </div>

          <div
            className="h-8 w-8 rounded-full border"
            style={{
              backgroundColor: color.soft,
              borderColor: color.accent,
            }}
          />

        </header>

        <div className="my-6 h-px bg-black/[0.07]" />

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="mb-2 text-[6px] uppercase tracking-[0.2em] text-black/30">
              From
            </p>

            <Line width="w-24" dark />

            <div className="mt-1.5">
              <Line width="w-16" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[6px] uppercase tracking-[0.2em] text-black/30">
              Bill To
            </p>

            <Line width="w-24" dark />

            <div className="mt-1.5">
              <Line width="w-20" />
            </div>
          </div>

        </div>

        <div className="mt-8">

          <p className="text-[6px] uppercase tracking-[0.2em] text-black/30">
            Amount Due
          </p>

          <p className="mt-1 text-[37px] font-semibold tracking-[-0.08em]">
            $4,820
          </p>

        </div>

        <div className="mt-7 space-y-3">

          {[
            ["Brand identity", "$1,200"],
            ["Website design", "$2,400"],
            ["Art direction", "$1,220"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between border-b border-black/[0.06] pb-3"
            >

              <div>
                <p className="text-[8px] font-medium text-black/65">
                  {name}
                </p>

                <p className="mt-1 text-[6px] text-black/30">
                  Professional service
                </p>
              </div>

              <span className="text-[8px] text-black/60">
                {price}
              </span>

            </div>
          ))}

        </div>

        <footer className="mt-6 flex justify-between">

          <div>
            <p className="text-[6px] uppercase text-black/30">
              Due
            </p>

            <p className="mt-1 text-[8px] font-medium">
              03 Jun 2024
            </p>
          </div>

          <div
            className="h-8 w-8 rounded-full"
            style={{
              backgroundColor: color.accent,
            }}
          />

        </footer>

      </div>
    </article>
  );
}

/* ============================================================
   CLASSIC INVOICE
============================================================ */

function ClassicInvoice({ color }) {
  return (
    <article
      aria-label="Classic professional invoice template"
      className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-[#fcfcfb] shadow-[0_35px_90px_rgba(0,0,0,0.13)]"
    >
      <div className="p-6">

        <header className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{
                backgroundColor: color.accent,
              }}
            >
              <span className="text-[10px] font-semibold">
                N
              </span>
            </div>

            <div>
              <Line width="w-20" dark />

              <div className="mt-1.5">
                <Line width="w-12" />
              </div>
            </div>

          </div>

          <div className="text-right">

            <p className="text-[9px] font-bold">
              INVOICE
            </p>

            <p className="mt-1 text-[6px] text-black/30">
              #00482
            </p>

          </div>

        </header>

        <div className="mt-7 grid grid-cols-3 gap-2">

          {[
            ["Client", "Nova Labs"],
            ["Date", "20 MAY"],
            ["Due", "03 JUN"],
          ].map(([label, value]) => (

            <div
              key={label}
              className="rounded-lg p-3"
              style={{
                backgroundColor: color.soft,
              }}
            >

              <p className="text-[5px] uppercase text-black/30">
                {label}
              </p>

              <p className="mt-2 text-[7px] font-semibold">
                {value}
              </p>

            </div>

          ))}

        </div>

        <div className="mt-6">

          <div className="grid grid-cols-[1fr_35px_55px] border-b border-black/10 pb-2">

            <span className="text-[6px] uppercase text-black/30">
              Description
            </span>

            <span className="text-[6px] uppercase text-black/30">
              Qty
            </span>

            <span className="text-right text-[6px] uppercase text-black/30">
              Amount
            </span>

          </div>

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="grid grid-cols-[1fr_35px_55px] items-center border-b border-black/[0.05] py-3"
            >

              <div>
                <Line width="w-24" dark />

                <div className="mt-1">
                  <Line width="w-14" />
                </div>
              </div>

              <span className="text-[7px] text-black/40">
                01
              </span>

              <span className="text-right text-[7px]">
                $920
              </span>

            </div>

          ))}

        </div>

        <div className="mt-5 ml-auto w-[145px]">

          <div className="flex justify-between text-[7px] text-black/40">
            <span>Subtotal</span>
            <span>$3,680</span>
          </div>

          <div className="mt-2 flex justify-between text-[7px] text-black/40">
            <span>Tax</span>
            <span>$368</span>
          </div>

          <div
            className="mt-2 flex justify-between border-t pt-2 text-[9px] font-bold"
            style={{
              borderColor: color.accent,
            }}
          >
            <span>Total</span>
            <span>$4,048</span>
          </div>

        </div>

      </div>
    </article>
  );
}

/* ============================================================
   MODERN INVOICE
============================================================ */

function ModernInvoice({ color }) {
  return (
    <article
      aria-label="Modern professional invoice template"
      className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-white shadow-[0_35px_90px_rgba(0,0,0,0.14)]"
    >
      <div className="p-6">

        <header className="flex justify-between">

          <div>

            <p
              className="text-[8px] font-bold tracking-[0.2em]"
              style={{
                color: color.accent,
              }}
            >
              STUDIO
            </p>

            <p className="mt-1 text-[6px] text-black/30">
              Creative department
            </p>

          </div>

          <p className="text-[8px] font-semibold">
            0248
          </p>

        </header>

        <div className="mt-8">

          <p className="text-[6px] uppercase tracking-[0.2em] text-black/30">
            Total
          </p>

          <p className="mt-1 text-[40px] font-semibold tracking-[-0.08em]">
            $7,240
          </p>

        </div>

        <div
          className="mt-7 rounded-xl p-4"
          style={{
            backgroundColor: color.soft,
          }}
        >

          <p className="text-[6px] uppercase tracking-[0.15em] text-black/30">
            Project
          </p>

          <p className="mt-2 text-[9px] font-semibold">
            Brand & Digital Experience
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>
              <p className="text-[5px] text-black/30">
                CLIENT
              </p>

              <p className="mt-1 text-[7px]">
                North Labs
              </p>
            </div>

            <div>
              <p className="text-[5px] text-black/30">
                PAYMENT
              </p>

              <p className="mt-1 text-[7px]">
                Net 30
              </p>
            </div>

          </div>

        </div>

        <div className="mt-6 space-y-3">

          {[
            ["Research", "$1,200"],
            ["Design", "$3,840"],
            ["Development", "$2,200"],
          ].map(([name, price]) => (

            <div
              key={name}
              className="flex justify-between border-b border-black/[0.06] pb-3"
            >

              <span className="text-[8px] text-black/60">
                {name}
              </span>

              <span className="text-[8px] font-medium">
                {price}
              </span>

            </div>

          ))}

        </div>

      </div>
    </article>
  );
}

/* ============================================================
   RECEIPT INVOICE
============================================================ */

function ReceiptInvoice({ color }) {
  return (
    <article
      aria-label="Receipt style invoice template"
      className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-[#faf9f6] shadow-[0_30px_75px_rgba(0,0,0,0.12)]"
    >
      <div className="px-5 py-6">

        <header className="text-center">

          <div
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{
              backgroundColor: color.accent,
            }}
          >
            <span className="text-[10px] font-bold">
              N
            </span>
          </div>

          <p className="mt-3 text-[9px] font-bold tracking-wide">
            NORTH STUDIO
          </p>

          <p className="mt-1 text-[6px] text-black/30">
            Creative Services
          </p>

        </header>

        <div className="my-7 text-center">

          <p className="text-[6px] uppercase tracking-[0.25em] text-black/30">
            Amount Due
          </p>

          <p className="mt-1 text-[31px] font-semibold tracking-[-0.07em]">
            $1,850
          </p>

        </div>

        <div className="border-t border-dashed border-black/15" />

        <div className="py-5">

          {[
            ["Design consultation", "$350"],
            ["Brand system", "$900"],
            ["UI design", "$600"],
          ].map(([name, price]) => (

            <div
              key={name}
              className="flex justify-between py-2.5"
            >

              <span className="text-[7px] text-black/55">
                {name}
              </span>

              <span className="text-[7px] font-medium">
                {price}
              </span>

            </div>

          ))}

        </div>

        <div className="border-t border-dashed border-black/15" />

        <footer className="mt-5 space-y-3">

          <div className="flex justify-between">
            <span className="text-[6px] text-black/30">
              Invoice
            </span>

            <span className="text-[7px]">
              #NS-248
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[6px] text-black/30">
              Date
            </span>

            <span className="text-[7px]">
              20 May 2024
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[6px] text-black/30">
              Payment
            </span>

            <span className="text-[7px]">
              Bank Transfer
            </span>
          </div>

        </footer>

      </div>
    </article>
  );
}

/* ============================================================
   INVOICE CARD
============================================================ */

function InvoiceCard({
  invoice,
  index,
  started,
}) {
  const color =
    invoiceColors[invoice.color];

  let content = null;

  switch (invoice.type) {
    case "minimal":
      content = (
        <MinimalInvoice color={color} />
      );
      break;

    case "classic":
      content = (
        <ClassicInvoice color={color} />
      );
      break;

    case "modern":
      content = (
        <ModernInvoice color={color} />
      );
      break;

    case "receipt":
      content = (
        <ReceiptInvoice color={color} />
      );
      break;

    default:
      content = null;
  }

  return (
    <div
      className={`absolute ${invoice.className} ${started
          ? "invoice-show"
          : "invoice-hidden"
        }`}
      style={{
        animationDelay: `${index * 160}ms`,
      }}
    >
      {content}
    </div>
  );
}

/* ============================================================
   FEATURE
============================================================ */

function Feature({
  icon: Icon,
  children,
}) {
  return (
    <div className="flex items-center gap-2">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white">
        <Icon
          size={14}
          strokeWidth={1.8}
          className="text-black/50"
        />
      </div>

      <span className="text-sm text-black/50">
        {children}
      </span>

    </div>
  );
}

/* ============================================================
   HERO SECTION
============================================================ */

export default function HeroSection() {

  /*
   * Invoice calculation values.
   *
   * All three are updated from the SAME animation frame.
   */

  const [subtotal, setSubtotal] =
    useState(0);

  const [tax, setTax] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  /*
   * Intro state.
   */

  const [introFinished, setIntroFinished] =
    useState(false);

  const [showTitle, setShowTitle] =
    useState(false);

  const [showInvoices, setShowInvoices] =
    useState(false);

  const [showContent, setShowContent] =
    useState(false);

  /* ==========================================================
     FAST SYNCHRONIZED CALCULATION
  ========================================================== */

  useEffect(() => {

    let frameId = null;

    let resetTimer = null;

    let finishTimer = null;

    let titleTimer = null;

    let invoiceTimer = null;

    let contentTimer = null;

    /*
     * Random subtotal.
     *
     * This changes on every page load.
     */

    const finalSubtotal =
      Math.floor(
        Math.random() * 8000
      ) + 1200;

    /*
     * Tax = 10%.
     */

    const finalTax =
      Math.round(
        finalSubtotal * 0.1
      );

    /*
     * Total = subtotal + tax.
     */

    const finalTotal =
      finalSubtotal + finalTax;

    /*
     * 2 seconds.
     *
     * Fast enough for a hero intro,
     * but still visible to the user.
     */

    const duration = 2000;

    let startTime = null;

    const animate = (currentTime) => {

      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      /*
       * Ease-out curve.
       *
       * Starts quickly and slows
       * slightly near the final value.
       */

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      /*
       * Small calculation noise.
       *
       * This makes the numbers feel
       * like they are being generated,
       * rather than simply counting.
       */

      const amountNoise =
        progress < 0.9
          ? Math.floor(
            Math.random() * 220
          )
          : 0;

      const taxNoise =
        progress < 0.9
          ? Math.floor(
            Math.random() * 25
          )
          : 0;

      /*
       * Current subtotal.
       */

      const currentSubtotal =
        Math.min(
          Math.floor(
            finalSubtotal * eased
          ) + amountNoise,
          finalSubtotal
        );

      /*
       * Current tax.
       */

      const currentTax =
        Math.min(
          Math.floor(
            finalTax * eased
          ) + taxNoise,
          finalTax
        );

      /*
       * Current total.
       *
       * IMPORTANT:
       *
       * Total is calculated from the
       * current subtotal + current tax.
       *
       * Therefore all three values
       * remain connected.
       */

      const currentTotal =
        Math.min(
          currentSubtotal +
          currentTax,
          finalTotal
        );

      /*
       * UPDATE ALL THREE TOGETHER.
       */

      setSubtotal(
        currentSubtotal
      );

      setTax(
        currentTax
      );

      setTotal(
        currentTotal
      );

      /*
       * Continue animation.
       */

      if (progress < 1) {

        frameId =
          requestAnimationFrame(
            animate
          );

        return;
      }

      /*
       * Make sure final values
       * are perfectly accurate.
       */

      setSubtotal(
        finalSubtotal
      );

      setTax(
        finalTax
      );

      setTotal(
        finalTotal
      );

      /*
       * Hold the final calculation
       * for a very short time.
       */

      finishTimer =
        window.setTimeout(() => {

          /*
           * Reset EVERYTHING together.
           */

          setSubtotal(0);
          setTax(0);
          setTotal(0);

          /*
           * Keep 00000 visible briefly.
           */

          resetTimer =
            window.setTimeout(() => {

              setIntroFinished(
                true
              );

              /*
               * Title.
               */

              titleTimer =
                window.setTimeout(() => {

                  setShowTitle(true);

                  /*
                   * Invoices.
                   */

                  invoiceTimer =
                    window.setTimeout(() => {

                      setShowInvoices(
                        true
                      );

                      /*
                       * Main content.
                       */

                      contentTimer =
                        window.setTimeout(() => {

                          setShowContent(
                            true
                          );

                        }, 350);

                    }, 450);

                }, 100);

            }, 250);

        }, 350);

    };

    frameId =
      requestAnimationFrame(
        animate
      );

    return () => {

      if (frameId) {
        cancelAnimationFrame(
          frameId
        );
      }

      if (resetTimer) {
        clearTimeout(
          resetTimer
        );
      }

      if (finishTimer) {
        clearTimeout(
          finishTimer
        );
      }

      if (titleTimer) {
        clearTimeout(
          titleTimer
        );
      }

      if (invoiceTimer) {
        clearTimeout(
          invoiceTimer
        );
      }

      if (contentTimer) {
        clearTimeout(
          contentTimer
        );
      }

    };

  }, []);

  return (
    <section
      aria-labelledby="invoice-hero-title"
      className="relative min-h-[680px] overflow-hidden bg-[#f7f7f5] sm:min-h-[720px]"
    >

      {/* ======================================================
          BACKGROUND
      ======================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >

        <div className="absolute left-1/2 top-[35%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white blur-[100px]" />

        <div className="absolute left-[55%] top-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-black/[0.018] blur-[100px]" />

      </div>

      {/* ======================================================
          DECORATIVE DOTS
      ======================================================= */}

      <span
        aria-hidden="true"
        className="absolute left-[20%] top-[14%] h-1.5 w-1.5 rounded-full bg-black/15"
      />

      <span
        aria-hidden="true"
        className="absolute left-[52%] top-[18%] h-1 w-1 rounded-full bg-black/20"
      />

      <span
        aria-hidden="true"
        className="absolute right-[15%] top-[28%] h-2 w-2 rounded-full bg-black/10"
      />

      {/* ======================================================
          CALCULATION INTRO
      ======================================================= */}

      {!introFinished && (

        <div
          className="absolute inset-0 z-[100] flex items-center justify-center bg-[#f7f7f5]"
          aria-live="polite"
          aria-label="Generating invoice"
        >

          <div className="w-full max-w-[360px] px-6">

            <p className="mb-8 text-center text-[9px] font-medium uppercase tracking-[0.35em] text-black/30">
              Creating invoice
            </p>

            {/* =================================================
                SUBTOTAL
            ================================================== */}

            <div className="flex items-baseline justify-between border-b border-black/[0.08] pb-5">

              <span className="text-sm text-black/40">
                Subtotal
              </span>

              <span className="number-value text-3xl font-semibold tracking-[-0.05em] tabular-nums text-[#111] sm:text-4xl">
                $
                {String(
                  subtotal
                ).padStart(5, "0")}
              </span>

            </div>

            {/* =================================================
                TAX
            ================================================== */}

            <div className="flex items-baseline justify-between border-b border-black/[0.08] py-5">

              <span className="text-sm text-black/40">
                Tax 10%
              </span>

              <span className="number-value text-2xl font-medium tracking-[-0.04em] tabular-nums text-black/55 sm:text-3xl">
                +$
                {String(
                  tax
                ).padStart(4, "0")}
              </span>

            </div>

            {/* =================================================
                TOTAL
            ================================================== */}

            <div className="flex items-baseline justify-between pt-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                  Total
                </p>

              </div>

              <span className="number-value text-[42px] font-semibold tracking-[-0.07em] tabular-nums text-[#111] sm:text-5xl">
                $
                {String(
                  total
                ).padStart(5, "0")}
              </span>

            </div>

            {/* PROGRESS LINE */}

            <div
              aria-hidden="true"
              className="mx-auto mt-9 h-px w-16 bg-black/10"
            />

          </div>

        </div>

      )}

      {/* ======================================================
          MAIN HERO
      ======================================================= */}

      <div className="relative mx-auto flex min-h-[680px] max-w-[1450px] items-center px-6 py-12 sm:min-h-[720px] lg:px-10">

        <div className="grid w-full items-center lg:grid-cols-[0.78fr_1.22fr]">

          {/* ==================================================
              LEFT CONTENT
          =================================================== */}

          <div className="relative z-50 max-w-[540px]">

            {/* BADGE */}

            <div
              className={`content-animation mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 shadow-sm ${showContent
                  ? "content-visible"
                  : ""
                }`}
            >

              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-black/60"
              />

              <span className="text-sm text-black/55">
                Simple. Fast. Professional.
              </span>

            </div>

            {/* =================================================
                SEO-FRIENDLY H1
            ================================================== */}

            <div className="min-h-[145px]">

              {showTitle && (

                <h1
                  id="invoice-hero-title"
                  className="title-animation text-[clamp(4rem,7.5vw,7.4rem)] font-semibold leading-[0.82] tracking-[-0.085em] text-[#111]"
                >
                  Invoice
                  <br />
                  <span className="text-black/35">
                    Pro
                  </span>
                </h1>

              )}

            </div>

            {/* SUBTITLE */}

            <div
              className={`content-animation ${showContent
                  ? "content-visible"
                  : ""
                }`}
            >

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Free Invoice Creator
              </h2>

              <p className="mt-3 max-w-[460px] text-base leading-7 text-black/45 sm:text-lg">
                Create clean, professional
                invoices in seconds.
                Customize your invoice,
                download it as a PDF,
                and send it to your clients.
              </p>

            </div>

            {/* CTA */}

            <div
              className={`content-animation mt-6 flex flex-col gap-3 sm:flex-row ${showContent
                  ? "content-visible"
                  : ""
                }`}
            >

              <Link
                href="/templates"
                aria-label="View invoice templates"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#111] px-7 py-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >

                View Templates

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </Link>

            </div>

            {/* FEATURES */}

            <div
              className={`content-animation mt-7 flex flex-wrap gap-x-6 gap-y-3 ${showContent
                  ? "content-visible"
                  : ""
                }`}
            >

              <Feature icon={Gift}>
                Easy To Use
              </Feature>

              <Feature icon={UserRound}>
                Customize It
              </Feature>

              <Feature icon={FileText}>
                Export PDF
              </Feature>

            </div>

          </div>

          {/* ==================================================
              INVOICE VISUAL AREA
          =================================================== */}

          <div
            aria-label="Professional invoice template previews"
            className="relative mt-10 h-[500px] w-full lg:mt-0"
          >

            {/* FLOOR SHADOW */}

            <div
              aria-hidden="true"
              className="absolute bottom-[5%] left-1/2 h-14 w-[420px] -translate-x-1/2 rounded-full bg-black/[0.05] blur-[40px]"
            />

            {/* INVOICES */}

            {invoices.map(
              (invoice, index) => (

                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  index={index}
                  started={
                    showInvoices
                  }
                />

              )
            )}

            {/* TEMPLATE COUNT */}

            <div
              className={`absolute bottom-[1%] left-1/2 z-[60] -translate-x-1/2 rounded-full border border-black/[0.08] bg-white/95 px-4 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] backdrop-blur ${showInvoices
                  ? "badge-show"
                  : "badge-hidden"
                }`}
            >

              <div className="flex items-center gap-3 whitespace-nowrap">

                <div
                  aria-hidden="true"
                  className="flex -space-x-1.5"
                >

                  <span
                    className="h-5 w-5 rounded-full border-2 border-white"
                    style={{
                      backgroundColor:
                        invoiceColors
                          .sage
                          .accent,
                    }}
                  />

                  <span
                    className="h-5 w-5 rounded-full border-2 border-white"
                    style={{
                      backgroundColor:
                        invoiceColors
                          .slate
                          .accent,
                    }}
                  />

                  <span
                    className="h-5 w-5 rounded-full border-2 border-white"
                    style={{
                      backgroundColor:
                        invoiceColors
                          .clay
                          .accent,
                    }}
                  />

                  <span
                    className="h-5 w-5 rounded-full border-2 border-white"
                    style={{
                      backgroundColor:
                        invoiceColors
                          .sand
                          .accent,
                    }}
                  />

                </div>

                <span className="text-xs font-semibold text-black/55">
                  12+ Professional Templates
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          COMPONENT CSS
      ======================================================= */}

      <style>{`

        /* =====================================================
           NUMBER TICK
        ===================================================== */

        .number-value {
          font-variant-numeric: tabular-nums;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        /* =====================================================
           TITLE
        ===================================================== */

        .title-animation {
          animation:
            titleEnter
            650ms
            cubic-bezier(.22,1,.36,1)
            both;
        }

        @keyframes titleEnter {

          from {
            opacity: 0;
            transform:
              translateY(20px);
            filter:
              blur(7px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
            filter:
              blur(0);
          }

        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .content-animation {
          opacity: 0;

          transform:
            translateY(12px);

          transition:
            opacity
              550ms
              cubic-bezier(.22,1,.36,1),

            transform
              550ms
              cubic-bezier(.22,1,.36,1);
        }

        .content-visible {
          opacity: 1;

          transform:
            translateY(0);
        }

        /* =====================================================
           INVOICE INITIAL STATE
        ===================================================== */

        .invoice-hidden {
          opacity: 0;

          transform:
            translateY(35px)
            scale(.9);

          filter:
            blur(7px);
        }

        /* =====================================================
           INVOICE ENTER + FLOAT
        ===================================================== */

        .invoice-show {
          opacity: 0;

          animation:
            invoiceEnter
              700ms
              cubic-bezier(.22,1,.36,1)
              forwards,

            invoiceFloat
              6s
              ease-in-out
              1.8s
              infinite;
        }

        @keyframes invoiceEnter {

          0% {
            opacity: 0;

            transform:
              translateY(35px)
              scale(.9);

            filter:
              blur(7px);
          }

          65% {
            opacity: 1;

            transform:
              translateY(-4px)
              scale(1.015);

            filter:
              blur(0);
          }

          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              blur(0);
          }

        }

        @keyframes invoiceFloat {

          0%,
          100% {
            margin-top: 0;
          }

          50% {
            margin-top: -8px;
          }

        }

        /* =====================================================
           TEMPLATE BADGE
        ===================================================== */

        .badge-hidden {
          opacity: 0;

          transform:
            translate(-50%, 16px);
        }

        .badge-show {
          opacity: 1;

          transform:
            translate(-50%, 0);

          transition:
            opacity
              550ms
              ease,

            transform
              550ms
              cubic-bezier(.22,1,.36,1);
        }

        /* =====================================================
           MOBILE INVOICE LAYOUT
        ===================================================== */

        @media (max-width: 767px) {

          .invoice-one {
            left: 0;
            top: 20%;
            width: 215px;
          }

          .invoice-two {
            left: 27%;
            top: 3%;
            width: 220px;
          }

          .invoice-three {
            left: 31%;
            top: 37%;
            width: 215px;
          }

          .invoice-four {
            right: -5%;
            top: 20%;
            width: 185px;
          }

        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .invoice-one {
            left: -4%;
            top: 22%;
            width: 185px;
          }

          .invoice-two {
            left: 25%;
            top: 5%;
            width: 190px;
          }

          .invoice-three {
            left: 29%;
            top: 40%;
            width: 185px;
          }

          .invoice-four {
            right: -12%;
            top: 24%;
            width: 165px;
          }

          .badge-show,
          .badge-hidden {
            transform:
              translateX(-50%);
          }

          .badge-show {
            opacity: 1;
          }

        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .title-animation,
          .invoice-show {
            animation: none !important;
          }

          .content-animation {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .number-value {
            transition: none;
          }

        }

      `}</style>

    </section>
  );
}