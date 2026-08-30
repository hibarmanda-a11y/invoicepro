"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  Building2,
  Users,
  Receipt,
  Percent,
  ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3,
  CheckCircle2,
  X,
  FileText
} from "lucide-react";

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit"); // "edit" or "preview"

  const iframeRef = useRef(null);
  const iframeDocRef = useRef(null);
  const itemRowTemplateRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    from: "",
    billTo: "",
    invoiceNumber: "",
    date: new Date().toISOString().slice(0, 10),
    logoUrl: "",
    signatureUrl: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      description: "Consulting & Development Services",
      qty: 1,
      price: 1500,
    },
  ]);

  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState(10);

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(5);

  const [uploading, setUploading] = useState({
    logo: false,
    signature: false,
  });

  /* ============================================================
     LOAD TEMPLATE + AUTO INVOICE NUMBER
  ============================================================ */

  const fetchInvoiceNumber = useCallback(async () => {
    try {
      const numRes = await fetch("/api/invoice-number");
      const numData = await numRes.json();
      if (numData?.invoiceNumber) {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: numData.invoiceNumber,
        }));
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/templates/${id}`);
        const data = await res.json();

        setTemplate(data);
        setTaxEnabled(!!data.defaultTaxEnabled);
        setDiscountEnabled(!!data.defaultDiscountEnabled);

        await fetchInvoiceNumber();
        setLoading(false);
      } catch (error) {
        console.error("Failed to load template:", error);
        setLoading(false);
      }
    }

    load();
  }, [id, fetchInvoiceNumber]);

  /* ============================================================
     PREPARE IFRAME
  ============================================================ */

  function handleIframeLoad() {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    iframeDocRef.current = doc;

    const templateRow = doc.querySelector('[data-field="item-row-template"]');
    if (templateRow) {
      itemRowTemplateRef.current = templateRow.cloneNode(true);
      itemRowTemplateRef.current.removeAttribute("data-field");
      itemRowTemplateRef.current.style.display = "";
      templateRow.remove();
    }

    updatePreview();
  }

  /* ============================================================
     IFRAME HELPERS
  ============================================================ */

  function setText(doc, field, value) {
    doc.querySelectorAll(`[data-field="${field}"]`).forEach((el) => {
      el.textContent = value ?? "";
    });
  }

  function setImage(doc, field, url) {
    const el = doc.querySelector(`[data-field="${field}"]`);
    if (el) {
      if (url) {
        el.src = url;
        el.crossOrigin = "anonymous";
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    }
  }

  /* ============================================================
     LIVE PREVIEW
  ============================================================ */

  const updatePreview = useCallback(() => {
    const doc = iframeDocRef.current;
    if (!doc) return;

    setText(doc, "company-name", formData.companyName || "Your Company");
    setText(doc, "from", formData.from || "Sender details & contact");
    setText(doc, "bill-to", formData.billTo || "Client details & address");
    setText(doc, "invoice-number", formData.invoiceNumber || "INV-0001");
    setText(doc, "invoice-date", formData.date);

    setImage(doc, "logo", formData.logoUrl);
    setImage(doc, "signature", formData.signatureUrl);

    // Items
    const tbody = doc.querySelector('[data-field="items-body"]');
    if (tbody && itemRowTemplateRef.current) {
      tbody.innerHTML = "";

      items.forEach((item) => {
        const row = itemRowTemplateRef.current.cloneNode(true);
        const total = (Number(item.qty) || 0) * (Number(item.price) || 0);

        const descEl = row.querySelector('[data-field="item-desc"]');
        const qtyEl = row.querySelector('[data-field="item-qty"]');
        const priceEl = row.querySelector('[data-field="item-price"]');
        const totalEl = row.querySelector('[data-field="item-total"]');

        if (descEl) descEl.textContent = item.description || "Item description";
        if (qtyEl) qtyEl.textContent = item.qty ?? 1;
        if (priceEl) priceEl.textContent = Number(item.price || 0).toFixed(2);
        if (totalEl) totalEl.textContent = total.toFixed(2);

        tbody.appendChild(row);
      });
    }

    // Calculations
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );
    const taxAmount = taxEnabled ? subtotal * (Number(taxPercent || 0) / 100) : 0;
    const discountAmount = discountEnabled ? subtotal * (Number(discountPercent || 0) / 100) : 0;
    const grandTotal = subtotal + taxAmount - discountAmount;

    setText(doc, "subtotal", subtotal.toFixed(2));
    setText(doc, "tax-percent", taxPercent || 0);
    setText(doc, "tax-amount", taxAmount.toFixed(2));
    setText(doc, "discount-percent", discountPercent || 0);
    setText(doc, "discount-amount", discountAmount.toFixed(2));
    setText(doc, "grand-total", grandTotal.toFixed(2));

    const taxRow = doc.querySelector('[data-field="tax-row"]');
    if (taxRow) taxRow.style.display = taxEnabled ? "" : "none";

    const discountRow = doc.querySelector('[data-field="discount-row"]');
    if (discountRow) discountRow.style.display = discountEnabled ? "" : "none";
  }, [formData, items, taxEnabled, taxPercent, discountEnabled, discountPercent]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  /* ============================================================
     ITEM HANDLERS
  ============================================================ */

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        qty: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(itemId) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function updateItem(itemId, field, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    );
  }

  /* ============================================================
     LOGO / SIGNATURE UPLOADER
  ============================================================ */

  async function handleFileUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [field]: true }));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", `invoicepro/${field}`);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          [field === "logo" ? "logoUrl" : "signatureUrl"]: data.url,
        }));
      }
    } catch (error) {
      console.error(`${field} upload failed:`, error);
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  }

  function removeFile(field) {
    setFormData((prev) => ({
      ...prev,
      [field === "logo" ? "logoUrl" : "signatureUrl"]: "",
    }));
  }

  /* ============================================================
     PDF DOWNLOAD
  ============================================================ */

  async function handleDownloadPDF() {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const doc = iframeDocRef.current;

      if (!doc?.body) {
        throw new Error("Invoice preview is not ready");
      }

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      if (doc.fonts?.ready) {
        await doc.fonts.ready;
      }

      await Promise.all(
        Array.from(doc.images).map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            })
        )
      );

      const target = doc.body;
      const targetWidth = Math.ceil(
        Math.max(
          target.scrollWidth,
          target.offsetWidth,
          doc.documentElement.scrollWidth,
          doc.documentElement.offsetWidth,
          800
        )
      );
      const targetHeight = Math.ceil(
        Math.max(
          target.scrollHeight,
          target.offsetHeight,
          doc.documentElement.scrollHeight,
          doc.documentElement.offsetHeight,
          1000
        )
      );

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        width: targetWidth,
        height: targetHeight,
        windowWidth: targetWidth,
        windowHeight: targetHeight,
        window: iframeRef.current?.contentWindow || window,
        document: doc,
      });

      const imgData = canvas.toDataURL("image/png");
      const canvasWidth = Number(canvas.width);
      const canvasHeight = Number(canvas.height);

      const landscape = canvasWidth > canvasHeight;
      const pageWidth = landscape ? 297 : 210;
      const pageHeight = landscape ? 210 : 297;
      const margin = 10;
      const imageRatio = canvasWidth / canvasHeight;
      let imageWidth = pageWidth - margin * 2;
      let imageHeight = imageWidth / imageRatio;

      if (imageHeight > pageHeight - margin * 2) {
        imageHeight = pageHeight - margin * 2;
        imageWidth = imageHeight * imageRatio;
      }

      const pdf = new jsPDF({
        orientation: landscape ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - imageWidth) / 2,
        (pageHeight - imageHeight) / 2,
        imageWidth,
        imageHeight
      );

      pdf.save(`${formData.invoiceNumber || "invoice"}.pdf`);

      fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, invoiceNumber: formData.invoiceNumber }),
      }).catch(() => { });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  /* ============================================================
     CALCULATIONS
  ============================================================ */

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );
  const taxAmount = taxEnabled ? subtotal * (Number(taxPercent || 0) / 100) : 0;
  const discountAmount = discountEnabled ? subtotal * (Number(discountPercent || 0) / 100) : 0;
  const grandTotal = subtotal + taxAmount - discountAmount;

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f7f7f5] px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#11110f] border-t-transparent" />
          <p className="text-xs font-medium text-[#777771]">Loading workspace...</p>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#e8e8e3] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#141413]">Template Not Found</h2>
          <p className="mt-2 text-xs text-[#777771]">
            The requested template could not be loaded or was removed.
          </p>
          <Link
            href="/templates"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#11110f] px-5 py-2.5 text-xs font-semibold text-white shadow-sm"
          >
            <ArrowLeft size={14} />
            Back to Templates
          </Link>
        </div>
      </main>
    );
  }

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; background: #ffffff; }
          ${template.css}
        </style>
      </head>
      <body>
        ${template.html}
      </body>
    </html>
  `;

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-20">
      
      {/* Top Workspace Header */}
      <div className="sticky top-[57px] z-40 border-b border-[#e8e8e3] bg-[#fafaf8]/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8e8e3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#555550] shadow-sm transition hover:bg-[#f5f5f2] hover:text-[#11110f]"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Templates</span>
            </Link>

            <span className="h-4 w-px bg-[#e8e8e3]" />

            <div className="min-w-0">
              <span className="truncate text-xs font-semibold text-[#141413] block">
                {template.name}
              </span>
              <span className="text-[10px] text-[#8c8c87] hidden sm:block">
                Interactive Invoice Studio
              </span>
            </div>
          </div>

          {/* Center Mobile View Tabs */}
          <div className="flex xl:hidden items-center gap-1 rounded-xl bg-[#eeeee9] p-1 border border-[#e2e2dc]">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                mobileTab === "edit" ? "bg-white text-[#141413] shadow-sm" : "text-[#777771]"
              }`}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                mobileTab === "preview" ? "bg-white text-[#141413] shadow-sm" : "text-[#777771]"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {/* Right Header Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e3] bg-white px-2.5 py-1 text-[10px] font-medium text-[#555550]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#526b5b] opacity-40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#526b5b]" />
              </span>
              <span>Live Sync</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading || sessionStatus === "loading"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#11110f] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#252522] active:scale-[0.98] disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloading ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* ========================================================
              LEFT COLUMN — STRUCTURED EDITOR
          ========================================================= */}
          <section className={`space-y-6 ${mobileTab === "preview" ? "hidden xl:block" : "block"}`}>
            
            {/* Step 1: General & Invoice Info */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <Building2 size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">1. Invoice & Business Info</h2>
                  <p className="text-[11px] text-[#8c8c87]">Core identifiers and company profile</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="companyName" className="block text-xs font-semibold text-[#333330] mb-1.5">
                    Company / Business Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Design Studio LLC"
                    className="saas-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="invoiceNumber" className="block text-xs font-semibold text-[#333330]">
                      Invoice Number
                    </label>
                    <button
                      type="button"
                      onClick={fetchInvoiceNumber}
                      title="Generate new invoice number"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#666660] hover:text-[#11110f]"
                    >
                      <RefreshCw size={10} /> Auto-generate
                    </button>
                  </div>
                  <input
                    id="invoiceNumber"
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    placeholder="INV-0001"
                    className="saas-input font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="invoiceDate" className="block text-xs font-semibold text-[#333330] mb-1.5">
                    Invoice Date
                  </label>
                  <input
                    id="invoiceDate"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="saas-input"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Sender & Client Details */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <Users size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">2. Parties & Contact Details</h2>
                  <p className="text-[11px] text-[#8c8c87]">Sender and recipient addresses</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="from" className="block text-xs font-semibold text-[#333330] mb-1.5">
                    From (Your Details)
                  </label>
                  <textarea
                    id="from"
                    rows={4}
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Your Name / Studio&#10;123 Creative Blvd&#10;contact@studio.com&#10;+1 (555) 019-2834"
                    className="w-full resize-none rounded-xl border border-[#e5e5df] bg-[#fafaf8] p-3 text-xs leading-5 text-[#1a1a19] placeholder:text-[#9a9a94] focus:bg-white focus:border-[#11110f] focus:outline-none focus:ring-2 focus:ring-[#11110f]/5 transition"
                  />
                </div>

                <div>
                  <label htmlFor="billTo" className="block text-xs font-semibold text-[#333330] mb-1.5">
                    Bill To (Client Details)
                  </label>
                  <textarea
                    id="billTo"
                    rows={4}
                    value={formData.billTo}
                    onChange={(e) => setFormData({ ...formData, billTo: e.target.value })}
                    placeholder="Client Name / Corporation&#10;Attn: Accounts Payable&#10;456 Enterprise Way&#10;billing@client.com"
                    className="w-full resize-none rounded-xl border border-[#e5e5df] bg-[#fafaf8] p-3 text-xs leading-5 text-[#1a1a19] placeholder:text-[#9a9a94] focus:bg-white focus:border-[#11110f] focus:outline-none focus:ring-2 focus:ring-[#11110f]/5 transition"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Line Items */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                    <Receipt size={15} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#141413]">3. Line Items & Services</h2>
                    <p className="text-[11px] text-[#8c8c87]">Billable deliverables and prices</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#e8e8e3] bg-[#fafaf8] px-3 py-1.5 text-xs font-semibold text-[#141413] shadow-sm transition hover:bg-[#f0f0ec] hover:border-[#d4d4cd]"
                >
                  <Plus size={13} /> Add Item
                </button>
              </div>

              {/* Items List */}
              <div className="mt-5 space-y-3">
                {items.map((item, index) => {
                  const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-xl border border-[#e8e8e3] bg-[#fafaf8] p-3 sm:p-4 transition hover:bg-white hover:border-[#cfcfc8]"
                    >
                      <div className="grid grid-cols-12 gap-3 items-start">
                        {/* Description */}
                        <div className="col-span-12 sm:col-span-6">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="e.g. Brand Identity Design & Strategy"
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-3 text-xs text-[#1a1a19] placeholder:text-[#9a9a94] focus:border-[#11110f] focus:outline-none"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-4 sm:col-span-2">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none"
                          />
                        </div>

                        {/* Price */}
                        <div className="col-span-5 sm:col-span-2">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none"
                          />
                        </div>

                        {/* Total & Remove */}
                        <div className="col-span-3 sm:col-span-2 flex items-center justify-between pt-5 sm:pt-0">
                          <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1 sm:hidden">
                              Total
                            </span>
                            <span className="text-xs font-semibold text-[#141413]">
                              ${lineTotal.toFixed(2)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length <= 1}
                            title="Delete line item"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c87] hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8c8c87] transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Taxes, Discounts & Adjustments */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <Percent size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">4. Adjustments & Taxes</h2>
                  <p className="text-[11px] text-[#8c8c87]">Optional taxes and client discounts</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Tax Option */}
                <div className={`rounded-xl border p-4 transition ${taxEnabled ? "border-[#11110f]/20 bg-[#fafaf8]" : "border-[#e8e8e3] bg-white"}`}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-xs font-semibold text-[#141413]">Apply Sales Tax</span>
                    <input
                      type="checkbox"
                      checked={taxEnabled}
                      onChange={(e) => setTaxEnabled(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#11110f]"
                    />
                  </label>
                  {taxEnabled && (
                    <div className="mt-3 pt-3 border-t border-[#e8e8e3]">
                      <label className="block text-[10px] font-medium text-[#777771] mb-1">
                        Tax Rate Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Number(e.target.value))}
                        className="w-full h-8 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Discount Option */}
                <div className={`rounded-xl border p-4 transition ${discountEnabled ? "border-[#11110f]/20 bg-[#fafaf8]" : "border-[#e8e8e3] bg-white"}`}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-xs font-semibold text-[#141413]">Apply Discount</span>
                    <input
                      type="checkbox"
                      checked={discountEnabled}
                      onChange={(e) => setDiscountEnabled(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#11110f]"
                    />
                  </label>
                  {discountEnabled && (
                    <div className="mt-3 pt-3 border-t border-[#e8e8e3]">
                      <label className="block text-[10px] font-medium text-[#777771] mb-1">
                        Discount Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="w-full h-8 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 5: Visual Branding & Assets */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <ImageIcon size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">5. Media & Branding</h2>
                  <p className="text-[11px] text-[#8c8c87]">Upload company logo and signature</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Logo Upload */}
                <div className="rounded-xl border border-[#e8e8e3] bg-[#fafaf8] p-4">
                  <span className="block text-xs font-semibold text-[#141413]">Company Logo</span>
                  <span className="block text-[10px] text-[#8c8c87] mb-3">PNG, JPG, or WEBP</span>

                  {formData.logoUrl ? (
                    <div className="flex items-center justify-between rounded-lg border border-[#e8e8e3] bg-white p-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#526b5b]" />
                        <span className="text-xs font-medium text-[#141413]">Logo Active</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("logo")}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d8d8d2] bg-white py-3 text-xs font-semibold text-[#141413] hover:bg-[#f5f5f2] transition shadow-sm">
                      <span>{uploading.logo ? "Uploading..." : "Upload Logo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Signature Upload */}
                <div className="rounded-xl border border-[#e8e8e3] bg-[#fafaf8] p-4">
                  <span className="block text-xs font-semibold text-[#141413]">Authorized Signature</span>
                  <span className="block text-[10px] text-[#8c8c87] mb-3">PNG with transparent background</span>

                  {formData.signatureUrl ? (
                    <div className="flex items-center justify-between rounded-lg border border-[#e8e8e3] bg-white p-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#526b5b]" />
                        <span className="text-xs font-medium text-[#141413]">Signature Active</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("signature")}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d8d8d2] bg-white py-3 text-xs font-semibold text-[#141413] hover:bg-[#f5f5f2] transition shadow-sm">
                      <span>{uploading.signature ? "Uploading..." : "Upload Signature"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "signature")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-[#11110f] p-6 text-white shadow-md">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Invoice Breakdown
              </span>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span className="font-mono text-sm font-medium text-white">${subtotal.toFixed(2)}</span>
                </div>

                {taxEnabled && (
                  <div className="flex justify-between text-white/70">
                    <span>Tax ({taxPercent}%)</span>
                    <span className="font-mono text-sm font-medium text-white">+${taxAmount.toFixed(2)}</span>
                  </div>
                )}

                {discountEnabled && (
                  <div className="flex justify-between text-white/70">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono text-sm font-medium text-emerald-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="my-3 border-t border-white/10" />

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-semibold text-white">Grand Total</span>
                  <span className="font-mono text-2xl font-bold tracking-tight text-white">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading || sessionStatus === "loading"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-semibold text-[#11110f] shadow-lg transition hover:bg-neutral-100 active:scale-[0.99] disabled:opacity-50"
              >
                <Download size={14} />
                <span>
                  {downloading
                    ? "Rendering PDF Document..."
                    : session
                      ? "Download Finished PDF"
                      : "Sign in & Download PDF"}
                </span>
              </button>
            </div>

          </section>

          {/* ========================================================
              RIGHT COLUMN — LIVE PREVIEW WORKSPACE
          ========================================================= */}
          <section className={`xl:sticky xl:top-[125px] h-fit ${mobileTab === "edit" ? "hidden xl:block" : "block"}`}>
            
            <div className="rounded-2xl border border-[#e8e8e3] bg-[#eeeee9] p-3 sm:p-4 shadow-sm">
              
              {/* Document Viewport Header */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 rounded-full bg-[#526b5b]" />
                  <span className="text-xs font-semibold text-[#333330]">
                    Document Output Preview
                  </span>
                </div>
                <span className="text-[10px] font-medium text-[#777771] bg-white border border-[#e8e8e3] rounded-full px-2.5 py-0.5 shadow-xs">
                  Standard A4 Canvas
                </span>
              </div>

              {/* Document Frame */}
              <div
                className="relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#e0e0dc]"
                style={{ height: "min(84vh, 980px)" }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={srcDoc}
                  onLoad={handleIframeLoad}
                  title="invoice-preview-workspace"
                  className="w-full h-full border-0"
                />
              </div>

            </div>

          </section>

        </div>
      </div>

    </main>
  );
}