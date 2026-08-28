"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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
      description: "",
      qty: 1,
      price: 0,
    },
  ]);

  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState(0);

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [uploading, setUploading] = useState({
    logo: false,
    signature: false,
  });

  /* ============================================================
     LOAD TEMPLATE + AUTO INVOICE NUMBER
  ============================================================ */

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/templates/${id}`);
        const data = await res.json();

        setTemplate(data);

        setTaxEnabled(!!data.defaultTaxEnabled);
        setDiscountEnabled(!!data.defaultDiscountEnabled);

        const numRes = await fetch("/api/invoice-number");
        const numData = await numRes.json();

        setFormData((prev) => ({
          ...prev,
          invoiceNumber: numData.invoiceNumber,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Failed to load template:", error);
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* ============================================================
     PREPARE IFRAME
  ============================================================ */

  function handleIframeLoad() {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const doc = iframe.contentDocument;

    if (!doc) return;

    iframeDocRef.current = doc;

    const templateRow = doc.querySelector(
      '[data-field="item-row-template"]'
    );

    if (templateRow) {
      itemRowTemplateRef.current = templateRow.cloneNode(true);

      itemRowTemplateRef.current.removeAttribute(
        "data-field"
      );

      itemRowTemplateRef.current.style.display = "";

      templateRow.remove();
    }

    updatePreview();
  }

  /* ============================================================
     IFRAME HELPERS
  ============================================================ */

  function setText(doc, field, value) {
    doc
      .querySelectorAll(`[data-field="${field}"]`)
      .forEach((el) => {
        el.textContent = value ?? "";
      });
  }

  function setImage(doc, field, url) {
    const el = doc.querySelector(
      `[data-field="${field}"]`
    );

    if (el && url) {
      el.src = url;
      el.crossOrigin = "anonymous";
    }
  }

  /* ============================================================
     LIVE PREVIEW
  ============================================================ */

  const updatePreview = useCallback(() => {
    const doc = iframeDocRef.current;

    if (!doc) return;

    setText(
      doc,
      "company-name",
      formData.companyName || "Company Name"
    );

    setText(
      doc,
      "from",
      formData.from || "Sender details"
    );

    setText(
      doc,
      "bill-to",
      formData.billTo || "Client details"
    );

    setText(
      doc,
      "invoice-number",
      formData.invoiceNumber
    );

    setText(
      doc,
      "invoice-date",
      formData.date
    );

    setImage(
      doc,
      "logo",
      formData.logoUrl
    );

    setImage(
      doc,
      "signature",
      formData.signatureUrl
    );

    /* ========================================================
       ITEMS
    ======================================================== */

    const tbody = doc.querySelector(
      '[data-field="items-body"]'
    );

    if (
      tbody &&
      itemRowTemplateRef.current
    ) {
      tbody.innerHTML = "";

      items.forEach((item) => {
        const row =
          itemRowTemplateRef.current.cloneNode(true);

        const total =
          (Number(item.qty) || 0) *
          (Number(item.price) || 0);

        const description =
          row.querySelector(
            '[data-field="item-desc"]'
          );

        const qty =
          row.querySelector(
            '[data-field="item-qty"]'
          );

        const price =
          row.querySelector(
            '[data-field="item-price"]'
          );

        const itemTotal =
          row.querySelector(
            '[data-field="item-total"]'
          );

        if (description) {
          description.textContent =
            item.description || "-";
        }

        if (qty) {
          qty.textContent = item.qty;
        }

        if (price) {
          price.textContent =
            Number(item.price).toFixed(2);
        }

        if (itemTotal) {
          itemTotal.textContent =
            total.toFixed(2);
        }

        tbody.appendChild(row);
      });
    }

    /* ========================================================
       CALCULATIONS
    ======================================================== */

    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        (Number(item.qty) || 0) *
          (Number(item.price) || 0),
      0
    );

    const taxAmount = taxEnabled
      ? subtotal *
        (Number(taxPercent) / 100)
      : 0;

    const discountAmount = discountEnabled
      ? subtotal *
        (Number(discountPercent) / 100)
      : 0;

    const grandTotal =
      subtotal +
      taxAmount -
      discountAmount;

    setText(
      doc,
      "subtotal",
      subtotal.toFixed(2)
    );

    setText(
      doc,
      "tax-percent",
      taxPercent
    );

    setText(
      doc,
      "tax-amount",
      taxAmount.toFixed(2)
    );

    setText(
      doc,
      "discount-percent",
      discountPercent
    );

    setText(
      doc,
      "discount-amount",
      discountAmount.toFixed(2)
    );

    setText(
      doc,
      "grand-total",
      grandTotal.toFixed(2)
    );

    /* ========================================================
       TAX ROW
    ======================================================== */

    const taxRow = doc.querySelector(
      '[data-field="tax-row"]'
    );

    if (taxRow) {
      taxRow.style.display =
        taxEnabled ? "" : "none";
    }

    /* ========================================================
       DISCOUNT ROW
    ======================================================== */

    const discountRow = doc.querySelector(
      '[data-field="discount-row"]'
    );

    if (discountRow) {
      discountRow.style.display =
        discountEnabled ? "" : "none";
    }
  }, [
    formData,
    items,
    taxEnabled,
    taxPercent,
    discountEnabled,
    discountPercent,
  ]);

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
    setItems((prev) =>
      prev.filter(
        (item) => item.id !== itemId
      )
    );
  }

  function updateItem(
    itemId,
    field,
    value
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  /* ============================================================
     LOGO / SIGNATURE UPLOAD
  ============================================================ */

  async function handleFileUpload(
    e,
    field
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setUploading((prev) => ({
      ...prev,
      [field]: true,
    }));

    const fd = new FormData();

    fd.append("file", file);

    fd.append(
      "folder",
      `invoicepro/${field}`
    );

    try {
      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          [field === "logo"
            ? "logoUrl"
            : "signatureUrl"]:
            data.url,
        }));
      }
    } catch (error) {
      console.error(
        `${field} upload failed:`,
        error
      );
    } finally {
      setUploading((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  }

  /* ============================================================
     PDF DOWNLOAD
  ============================================================ */

  async function handleDownloadPDF() {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    setDownloading(true);

    try {
      const html2canvas =
        (
          await import(
            "html2canvas"
          )
        ).default;

      const { jsPDF } =
        await import("jspdf");

      const doc =
        iframeDocRef.current;

      if (!doc?.body) {
        throw new Error("Invoice preview is not ready");
      }

      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );

      if (doc.fonts?.ready) {
        await doc.fonts.ready;
      }

      await Promise.all(
        Array.from(doc.images).map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener(
                  "load",
                  resolve,
                  { once: true }
                );
                image.addEventListener(
                  "error",
                  resolve,
                  { once: true }
                );
              })
        )
      );

      const target =
        doc.body.firstElementChild ||
        doc.body;

      const targetRect =
        target.getBoundingClientRect();
      const targetWidth = Math.ceil(
        Math.max(
          targetRect.width,
          target.scrollWidth,
          doc.body.scrollWidth
        )
      );
      const targetHeight = Math.ceil(
        Math.max(
          targetRect.height,
          target.scrollHeight,
          doc.body.scrollHeight
        )
      );

      if (targetWidth <= 0 || targetHeight <= 0) {
        throw new Error("Invoice preview has invalid dimensions");
      }

      const canvas =
        await html2canvas(target, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: targetWidth,
          height: targetHeight,
          windowWidth: Math.max(
            doc.documentElement.clientWidth,
            targetWidth
          ),
          windowHeight: Math.max(
            doc.documentElement.clientHeight,
            targetHeight
          ),
        });

      const imgData =
        canvas.toDataURL("image/jpeg", 0.95);

      const canvasWidth = Number(canvas.width);
      const canvasHeight = Number(canvas.height);
      if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight) || canvasWidth <= 0 || canvasHeight <= 0) {
        throw new Error("Invoice preview has invalid dimensions");
      }

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
        "JPEG",
        (pageWidth - imageWidth) / 2,
        (pageHeight - imageHeight) / 2,
        imageWidth,
        imageHeight
      );

      pdf.save(
        `${
          formData.invoiceNumber ||
          "invoice"
        }.pdf`
      );
      fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, invoiceNumber: formData.invoiceNumber }),
      }).catch(() => {});
    } catch (err) {
      console.error(
        "PDF generation failed:",
        err
      );

      alert(
        "PDF generation failed. Check console."
      );
    } finally {
      setDownloading(false);
    }
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f6f3] px-5 py-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
            <p className="text-sm text-black/45">
              Loading template...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen bg-[#f6f6f3] px-5 py-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
            <p className="text-sm text-black/45">
              Template not found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     TEMPLATE HTML
  ============================================================ */

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          ${template.css}
        </style>
      </head>

      <body>
        ${template.html}
      </body>
    </html>
  `;

  /* ============================================================
     TOTALS
  ============================================================ */

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.qty) || 0) *
        (Number(item.price) || 0),
    0
  );

  const taxAmount = taxEnabled
    ? subtotal *
      (Number(taxPercent) / 100)
    : 0;

  const discountAmount =
    discountEnabled
      ? subtotal *
        (Number(discountPercent) / 100)
      : 0;

  const grandTotal =
    subtotal +
    taxAmount -
    discountAmount;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#f6f6f3] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

      <div className="mx-auto max-w-[1380px]">

        {/* ======================================================
            TOP BAR
        ======================================================= */}

        <div className="mb-6 flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              router.push("/user")
            }
            className="group inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-4 py-2 text-xs font-medium text-black/55 shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition-all duration-200 hover:-translate-x-0.5 hover:text-black"
          >
            <span className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>

            Back to templates
          </button>

          <div className="hidden rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs text-black/35 sm:block">
            Invoice Pro
          </div>

        </div>

        {/* ======================================================
            EDITOR GRID
        ======================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:gap-8">

          {/* ==================================================
              LEFT — FORM
          =================================================== */}

          <section className="h-fit rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.035)] sm:p-6 xl:sticky xl:top-6">

            {/* Header */}

            <div className="mb-7">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                    Invoice editor
                  </p>

                  <h1 className="text-xl font-semibold tracking-[-0.04em] text-black/90 sm:text-2xl">
                    Edit Invoice
                  </h1>

                  <p className="mt-1 text-xs text-black/35">
                    {template.name}
                  </p>
                </div>

                <div className="rounded-full bg-[#f2f3ef] px-3 py-1.5 text-[10px] font-medium text-black/45">
                  Live
                </div>

              </div>

            </div>

            {/* ==================================================
                BASIC INFORMATION
            =================================================== */}

            <div className="space-y-5">

              {/* Company Name */}

              <div>
                <label
                  htmlFor="company-name"
                  className="mb-2 block text-xs font-semibold text-black/65"
                >
                  Company name
                </label>

                <input
                  id="company-name"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Sunset Resort & Spa"
                  className="w-full rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-3 text-sm text-black/80 outline-none transition-all placeholder:text-black/25 focus:border-black/[0.16] focus:bg-white focus:ring-4 focus:ring-black/[0.025]"
                />
              </div>

              {/* From */}

              <div>
                <label
                  htmlFor="from"
                  className="mb-2 block text-xs font-semibold text-black/65"
                >
                  From
                </label>

                <textarea
                  id="from"
                  rows={3}
                  value={formData.from}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      from: e.target.value,
                    })
                  }
                  placeholder="Your business name, address, phone and email"
                  className="w-full resize-none rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-3 text-sm leading-6 text-black/80 outline-none transition-all placeholder:text-black/25 focus:border-black/[0.16] focus:bg-white focus:ring-4 focus:ring-black/[0.025]"
                />
              </div>

              {/* Bill To */}

              <div>
                <label
                  htmlFor="bill-to"
                  className="mb-2 block text-xs font-semibold text-black/65"
                >
                  Bill to
                </label>

                <textarea
                  id="bill-to"
                  rows={3}
                  value={formData.billTo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: e.target.value,
                    })
                  }
                  placeholder="Client name, company, address and contact details"
                  className="w-full resize-none rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-3 text-sm leading-6 text-black/80 outline-none transition-all placeholder:text-black/25 focus:border-black/[0.16] focus:bg-white focus:ring-4 focus:ring-black/[0.025]"
                />
              </div>

              {/* Invoice Number + Date */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="invoice-number"
                    className="mb-2 block text-xs font-semibold text-black/65"
                  >
                    Invoice number
                  </label>

                  <input
                    id="invoice-number"
                    type="text"
                    value={
                      formData.invoiceNumber
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invoiceNumber:
                          e.target.value,
                      })
                    }
                    placeholder="INV-0001"
                    className="w-full rounded-xl border border-black/[0.06] bg-[#f5f5f2] px-3.5 py-3 text-sm text-black/55 outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:bg-white focus:ring-4 focus:ring-black/[0.025]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invoice-date"
                    className="mb-2 block text-xs font-semibold text-black/65"
                  >
                    Invoice date
                  </label>

                  <input
                    id="invoice-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-3 text-sm text-black/70 outline-none transition-all focus:border-black/[0.16] focus:bg-white focus:ring-4 focus:ring-black/[0.025]"
                  />
                </div>

              </div>

            </div>

            {/* ==================================================
                BRANDING
            =================================================== */}

            <div className="mt-8 border-t border-black/[0.06] pt-7">

              <div className="mb-4">
                <h2 className="text-sm font-semibold text-black/75">
                  Branding
                </h2>

                <p className="mt-1 text-xs text-black/35">
                  Add your logo and signature to personalize the invoice.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {/* LOGO UPLOAD */}

                <div className="group rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3.5 transition-all duration-200 hover:border-black/[0.11] hover:bg-white">

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-black/65">
                      Logo
                    </p>

                    <p className="mt-0.5 text-[11px] text-black/30">
                      PNG, JPG or SVG
                    </p>
                  </div>

                  <label
                    htmlFor="logo-upload"
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-black/[0.07] bg-white px-3 py-2.5 text-xs font-medium text-black/55 shadow-[0_2px_8px_rgba(0,0,0,0.025)] transition-all duration-200 hover:border-black/[0.13] hover:bg-[#f5f5f2] hover:text-black active:scale-[0.99]"
                  >
                    {uploading.logo
                      ? "Uploading..."
                      : "Choose logo"}

                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          "logo"
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  {formData.logoUrl &&
                    !uploading.logo && (
                      <p className="mt-2 truncate text-[10px] text-[#526b5b]">
                        ✓ Logo uploaded
                      </p>
                    )}

                </div>

                {/* SIGNATURE UPLOAD */}

                <div className="group rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3.5 transition-all duration-200 hover:border-black/[0.11] hover:bg-white">

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-black/65">
                      Signature
                    </p>

                    <p className="mt-0.5 text-[11px] text-black/30">
                      PNG, JPG or SVG
                    </p>
                  </div>

                  <label
                    htmlFor="signature-upload"
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-black/[0.07] bg-white px-3 py-2.5 text-xs font-medium text-black/55 shadow-[0_2px_8px_rgba(0,0,0,0.025)] transition-all duration-200 hover:border-black/[0.13] hover:bg-[#f5f5f2] hover:text-black active:scale-[0.99]"
                  >
                    {uploading.signature
                      ? "Uploading..."
                      : "Choose signature"}

                    <input
                      id="signature-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          "signature"
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  {formData.signatureUrl &&
                    !uploading.signature && (
                      <p className="mt-2 truncate text-[10px] text-[#526b5b]">
                        ✓ Signature uploaded
                      </p>
                    )}

                </div>

              </div>

            </div>

            {/* ==================================================
                ITEMS
            =================================================== */}

            <div className="mt-8 border-t border-black/[0.06] pt-7">

              <div className="mb-4 flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-sm font-semibold text-black/75">
                    Items
                  </h2>

                  <p className="mt-1 text-xs text-black/35">
                    Add the products or services on this invoice.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="shrink-0 rounded-full bg-[#111] px-3.5 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-black/80 active:scale-[0.98]"
                >
                  + Add item
                </button>

              </div>

              <div className="space-y-2.5">

                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-2.5"
                  >

                    {/* Item number */}

                    <div className="mb-2 flex items-center justify-between px-1">

                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/25">
                        Item {index + 1}
                      </span>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id
                            )
                          }
                          className="text-[11px] font-medium text-black/30 transition-colors hover:text-red-500"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">

                      {/* Description */}

                      <div className="sm:col-span-5">
                        <label className="mb-1.5 block px-0.5 text-[10px] font-medium text-black/35">
                          Description
                        </label>

                        <input
                          type="text"
                          value={
                            item.description
                          }
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Website design"
                          className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2.5 text-sm text-black/75 outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:ring-4 focus:ring-black/[0.02]"
                        />
                      </div>

                      {/* Quantity */}

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block px-0.5 text-[10px] font-medium text-black/35">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "qty",
                              e.target.value
                            )
                          }
                          placeholder="1"
                          className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2.5 text-sm text-black/75 outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:ring-4 focus:ring-black/[0.02]"
                        />
                      </div>

                      {/* Price */}

                      <div className="sm:col-span-3">
                        <label className="mb-1.5 block px-0.5 text-[10px] font-medium text-black/35">
                          Unit price
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2.5 text-sm text-black/75 outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:ring-4 focus:ring-black/[0.02]"
                        />
                      </div>

                      {/* Total */}

                      <div className="flex items-end sm:col-span-2">

                        <div className="w-full rounded-lg bg-[#f0f0ec] px-3 py-2.5 text-right">

                          <p className="mb-0.5 text-[9px] uppercase tracking-[0.12em] text-black/25">
                            Total
                          </p>

                          <p className="text-sm font-semibold text-black/65">
                            {(
                              (Number(
                                item.qty
                              ) || 0) *
                              (Number(
                                item.price
                              ) || 0)
                            ).toFixed(2)}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* ==================================================
                TAX / DISCOUNT
            =================================================== */}

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-black/[0.06] pt-7 sm:grid-cols-2">

              {/* Tax */}

              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={taxEnabled}
                    onChange={(e) =>
                      setTaxEnabled(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#111]"
                  />

                  <span className="text-xs font-semibold text-black/65">
                    Add tax
                  </span>

                </label>

                {taxEnabled && (
                  <div className="mt-3">

                    <label className="mb-1.5 block text-[10px] font-medium text-black/35">
                      Tax percentage
                    </label>

                    <input
                      type="number"
                      value={taxPercent}
                      onChange={(e) =>
                        setTaxPercent(
                          e.target.value
                        )
                      }
                      placeholder="e.g. 10"
                      className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:ring-4 focus:ring-black/[0.02]"
                    />

                  </div>
                )}

              </div>

              {/* Discount */}

              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      discountEnabled
                    }
                    onChange={(e) =>
                      setDiscountEnabled(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#111]"
                  />

                  <span className="text-xs font-semibold text-black/65">
                    Add discount
                  </span>

                </label>

                {discountEnabled && (
                  <div className="mt-3">

                    <label className="mb-1.5 block text-[10px] font-medium text-black/35">
                      Discount percentage
                    </label>

                    <input
                      type="number"
                      value={
                        discountPercent
                      }
                      onChange={(e) =>
                        setDiscountPercent(
                          e.target.value
                        )
                      }
                      placeholder="e.g. 10"
                      className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-black/20 focus:border-black/[0.14] focus:ring-4 focus:ring-black/[0.02]"
                    />

                  </div>
                )}

              </div>

            </div>

            {/* ==================================================
                SUMMARY
            =================================================== */}

            <div className="mt-8 border-t border-black/[0.06] pt-6">

              <div className="rounded-xl bg-[#f5f5f2] p-4">

                <div className="space-y-2.5 text-sm">

                  <div className="flex items-center justify-between">
                    <span className="text-black/40">
                      Subtotal
                    </span>

                    <span className="font-medium text-black/65">
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {taxEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-black/40">
                        Tax
                      </span>

                      <span className="font-medium text-black/65">
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {discountEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-black/40">
                        Discount
                      </span>

                      <span className="font-medium text-black/65">
                        -{discountAmount.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}

                  <div className="my-3 border-t border-black/[0.07]" />

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-semibold text-black/70">
                      Grand total
                    </span>

                    <span className="text-xl font-semibold tracking-[-0.04em] text-black">
                      {grandTotal.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                DOWNLOAD
            =================================================== */}

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading || sessionStatus === "loading"}
              className="mt-5 w-full rounded-xl bg-[#111] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/85 hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading
                ? "Generating PDF..."
                : session
                  ? "Download PDF"
                  : "Log in to download"}
            </button>

          </section>

          {/* ==================================================
              RIGHT — LIVE PREVIEW
          =================================================== */}

          <section className="h-fit rounded-2xl border border-black/[0.06] bg-[#e9e9e5] p-3 shadow-[0_8px_35px_rgba(0,0,0,0.035)] sm:p-4 xl:sticky xl:top-6">

            {/* Preview Header */}

            <div className="mb-3 flex items-center justify-between px-1">

              <div>
                <p className="text-xs font-semibold text-black/55">
                  Live preview
                </p>

                <p className="mt-0.5 text-[10px] text-black/30">
                  Updates automatically as you edit
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2.5 py-1.5">

                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#526b5b] opacity-40" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#526b5b]" />
                </span>

                <span className="text-[9px] font-medium text-black/35">
                  Live
                </span>

              </div>

            </div>

            {/* Preview */}

            <div
              className="overflow-hidden rounded-xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
              style={{
                height:
                  "min(82vh, 1050px)",
              }}
            >

              <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                onLoad={handleIframeLoad}
                title="invoice-preview"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}