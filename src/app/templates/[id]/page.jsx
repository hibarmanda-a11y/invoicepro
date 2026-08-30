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
  RefreshCw,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Sparkles,
  Coins,
  Check,
  AlertTriangle
} from "lucide-react";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "BDT", symbol: "৳", label: "BDT (৳)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
];

const SAMPLE_INVOICE_DATA = {
  companyName: "Nexus Digital Agency LLC",
  from: "Nexus Digital Agency\n742 Evergreen Terrace, Suite 300\ncontact@nexusagency.io\n+1 (555) 234-5678",
  billTo: "Acme Global Technologies Inc.\nAttn: Accounts Payable\n100 Enterprise Way, Floor 12\nbilling@acmeglobal.com",
  items: [
    { id: 1, description: "Brand Identity Design & Visual Guidelines", qty: 1, price: 1800 },
    { id: 2, description: "Frontend Next.js Application Development", qty: 40, price: 95 },
    { id: 3, description: "Cloud Infrastructure & CDN Setup", qty: 1, price: 650 },
  ],
  taxEnabled: true,
  taxPercent: 10,
  discountEnabled: true,
  discountPercent: 5,
};

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit"); // "edit" or "preview"

  // Toast / Notification state
  const [toast, setToast] = useState({ show: false, type: "success", title: "", message: "" });
  
  // In-app Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    confirmLabel: "",
    isDestructive: false,
    onConfirm: null,
  });

  const iframeRef = useRef(null);
  const iframeDocRef = useRef(null);
  const itemRowTemplateRef = useRef(null);

  // Currency
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

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

  const triggerToast = useCallback((type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  }, []);

  /* ============================================================
     DRAFT PERSISTENCE (localStorage)
  ============================================================ */

  const draftKey = `invoicepro_draft_${id}`;

  const saveDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const draftPayload = {
        formData,
        items,
        taxEnabled,
        taxPercent,
        discountEnabled,
        discountPercent,
        selectedCurrency,
        savedAt: Date.now(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftPayload));
    } catch {
      // Ignore quota errors
    }
  }, [formData, items, taxEnabled, taxPercent, discountEnabled, discountPercent, selectedCurrency, draftKey]);

  // Auto-save draft on state change (debounced via effect)
  useEffect(() => {
    if (!loading && template) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, template, saveDraft]);

  const restoreDraft = useCallback((savedDraft) => {
    if (!savedDraft) return false;
    try {
      if (savedDraft.formData) setFormData((prev) => ({ ...prev, ...savedDraft.formData }));
      if (Array.isArray(savedDraft.items) && savedDraft.items.length > 0) setItems(savedDraft.items);
      if (typeof savedDraft.taxEnabled === "boolean") setTaxEnabled(savedDraft.taxEnabled);
      if (typeof savedDraft.taxPercent === "number") setTaxPercent(savedDraft.taxPercent);
      if (typeof savedDraft.discountEnabled === "boolean") setDiscountEnabled(savedDraft.discountEnabled);
      if (typeof savedDraft.discountPercent === "number") setDiscountPercent(savedDraft.discountPercent);
      if (savedDraft.selectedCurrency) setSelectedCurrency(savedDraft.selectedCurrency);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleClearDraft = () => {
    setConfirmModal({
      show: true,
      title: "Clear Invoice Draft?",
      message: "This will reset all invoice fields, items, and uploaded assets to a clean blank state. This action cannot be undone.",
      confirmLabel: "Clear Draft",
      isDestructive: true,
      onConfirm: async () => {
        localStorage.removeItem(draftKey);
        setFormData({
          companyName: "",
          from: "",
          billTo: "",
          invoiceNumber: "",
          date: new Date().toISOString().slice(0, 10),
          logoUrl: "",
          signatureUrl: "",
        });
        setItems([{ id: Date.now(), description: "", qty: 1, price: 0 }]);
        setTaxEnabled(false);
        setTaxPercent(10);
        setDiscountEnabled(false);
        setDiscountPercent(5);
        setSelectedCurrency(CURRENCIES[0]);
        await fetchInvoiceNumber();
        setConfirmModal((prev) => ({ ...prev, show: false }));
        triggerToast("info", "Draft Cleared", "The invoice workspace has been reset.");
      },
    });
  };

  /* ============================================================
     POPULATE SAMPLE INVOICE DATA
  ============================================================ */

  const handleUseSampleData = () => {
    const isDirty = formData.companyName || formData.from || formData.billTo || items[0]?.description;
    
    const applySample = () => {
      setFormData((prev) => ({
        ...prev,
        companyName: SAMPLE_INVOICE_DATA.companyName,
        from: SAMPLE_INVOICE_DATA.from,
        billTo: SAMPLE_INVOICE_DATA.billTo,
      }));
      setItems(SAMPLE_INVOICE_DATA.items.map((i) => ({ ...i, id: Date.now() + Math.random() })));
      setTaxEnabled(SAMPLE_INVOICE_DATA.taxEnabled);
      setTaxPercent(SAMPLE_INVOICE_DATA.taxPercent);
      setDiscountEnabled(SAMPLE_INVOICE_DATA.discountEnabled);
      setDiscountPercent(SAMPLE_INVOICE_DATA.discountPercent);
      setConfirmModal((prev) => ({ ...prev, show: false }));
      triggerToast("success", "Sample Invoice Loaded", "Realistic client deliverables and tax data populated.");
    };

    if (isDirty) {
      setConfirmModal({
        show: true,
        title: "Populate Sample Data?",
        message: "This will replace your current invoice fields with demonstration data. Any unsaved custom text will be overwritten.",
        confirmLabel: "Load Sample Data",
        isDestructive: false,
        onConfirm: applySample,
      });
    } else {
      applySample();
    }
  };

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

        // Check for local draft
        let hasRestoredDraft = false;
        if (typeof window !== "undefined") {
          try {
            const rawDraft = localStorage.getItem(draftKey);
            if (rawDraft) {
              const parsed = JSON.parse(rawDraft);
              hasRestoredDraft = restoreDraft(parsed);
            }
          } catch {
            // Ignore
          }
        }

        if (!hasRestoredDraft) {
          await fetchInvoiceNumber();
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load template:", error);
        setLoading(false);
      }
    }

    load();
  }, [id, draftKey, restoreDraft, fetchInvoiceNumber]);

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
     LIVE PREVIEW SYNCHRONIZATION
  ============================================================ */

  const currencySymbol = selectedCurrency.symbol;

  const updatePreview = useCallback(() => {
    const doc = iframeDocRef.current;
    if (!doc) return;

    setText(doc, "company-name", formData.companyName || "Your Company");
    setText(doc, "from", formData.from || "Sender details & contact");
    setText(doc, "bill-to", formData.billTo || "Client details & address");
    setText(doc, "invoice-number", formData.invoiceNumber || "INV-0001");
    setText(doc, "invoice-date", formData.date);
    setText(doc, "currency", currencySymbol);

    setImage(doc, "logo", formData.logoUrl);
    setImage(doc, "signature", formData.signatureUrl);

    // Items
    const tbody = doc.querySelector('[data-field="items-body"]');
    if (tbody && itemRowTemplateRef.current) {
      tbody.innerHTML = "";

      items.forEach((item) => {
        const row = itemRowTemplateRef.current.cloneNode(true);
        const validQty = Math.max(1, Number(item.qty) || 1);
        const validPrice = Math.max(0, Number(item.price) || 0);
        const total = validQty * validPrice;

        const descEl = row.querySelector('[data-field="item-desc"]');
        const qtyEl = row.querySelector('[data-field="item-qty"]');
        const priceEl = row.querySelector('[data-field="item-price"]');
        const totalEl = row.querySelector('[data-field="item-total"]');

        if (descEl) descEl.textContent = item.description || "Item description";
        if (qtyEl) qtyEl.textContent = validQty;
        if (priceEl) priceEl.textContent = `${currencySymbol}${validPrice.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `${currencySymbol}${total.toFixed(2)}`;

        tbody.appendChild(row);
      });
    }

    // Validated Calculations
    const subtotal = items.reduce((sum, item) => {
      const q = Math.max(1, Number(item.qty) || 1);
      const p = Math.max(0, Number(item.price) || 0);
      return sum + q * p;
    }, 0);

    const safeTaxPercent = Math.min(100, Math.max(0, Number(taxPercent) || 0));
    const safeDiscountPercent = Math.min(100, Math.max(0, Number(discountPercent) || 0));

    const taxAmount = taxEnabled ? subtotal * (safeTaxPercent / 100) : 0;
    const discountAmount = discountEnabled ? subtotal * (safeDiscountPercent / 100) : 0;
    const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

    setText(doc, "subtotal", `${currencySymbol}${subtotal.toFixed(2)}`);
    setText(doc, "tax-percent", `${safeTaxPercent}%`);
    setText(doc, "tax-amount", `${currencySymbol}${taxAmount.toFixed(2)}`);
    setText(doc, "discount-percent", `${safeDiscountPercent}%`);
    setText(doc, "discount-amount", `-${currencySymbol}${discountAmount.toFixed(2)}`);
    setText(doc, "grand-total", `${currencySymbol}${grandTotal.toFixed(2)}`);

    const taxRow = doc.querySelector('[data-field="tax-row"]');
    if (taxRow) taxRow.style.display = taxEnabled ? "" : "none";

    const discountRow = doc.querySelector('[data-field="discount-row"]');
    if (discountRow) discountRow.style.display = discountEnabled ? "" : "none";
  }, [formData, items, taxEnabled, taxPercent, discountEnabled, discountPercent, currencySymbol]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  /* ============================================================
     VALIDATED ITEM HANDLERS
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
    if (items.length <= 1) {
      triggerToast("warning", "Item Required", "An invoice must have at least one line item.");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function updateItem(itemId, field, value) {
    let sanitizedValue = value;
    if (field === "qty") {
      const num = parseInt(value, 10);
      sanitizedValue = isNaN(num) || num < 1 ? 1 : Math.min(99999, num);
    } else if (field === "price") {
      const num = parseFloat(value);
      sanitizedValue = isNaN(num) || num < 0 ? 0 : Math.min(99999999, num);
    }

    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: sanitizedValue } : item))
    );
  }

  /* ============================================================
     LOGO / SIGNATURE UPLOADER
  ============================================================ */

  async function handleFileUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      triggerToast("error", "File Too Large", "Maximum image upload size is 5MB.");
      return;
    }

    // Client-side MIME check
    if (!file.type.startsWith("image/")) {
      triggerToast("error", "Invalid File", "Please choose a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

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
        triggerToast("success", "Asset Uploaded", `${field === "logo" ? "Logo" : "Signature"} added to invoice.`);
      } else {
        triggerToast("error", "Upload Failed", data.error || "Could not upload image.");
      }
    } catch {
      triggerToast("error", "Upload Error", "Network error while uploading asset.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  }

  function removeFile(field) {
    setFormData((prev) => ({
      ...prev,
      [field === "logo" ? "logoUrl" : "signatureUrl"]: "",
    }));
    triggerToast("info", "Asset Removed", `${field === "logo" ? "Logo" : "Signature"} removed.`);
  }

  /* ============================================================
     RESILIENT PDF DOWNLOAD
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
        throw new Error("Invoice preview is not initialized yet.");
      }

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      if (doc.fonts?.ready) {
        await doc.fonts.ready;
      }

      // Safe image preloader with Promise.allSettled and 3s timeout
      const imagePromises = Array.from(doc.images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          const timeout = setTimeout(resolve, 3000);
          image.addEventListener("load", () => { clearTimeout(timeout); resolve(); }, { once: true });
          image.addEventListener("error", () => { clearTimeout(timeout); resolve(); }, { once: true });
        });
      });
      await Promise.allSettled(imagePromises);

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

      if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight) || canvasWidth <= 0 || canvasHeight <= 0) {
        throw new Error("Invalid canvas rendering dimensions.");
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
        "PNG",
        (pageWidth - imageWidth) / 2,
        (pageHeight - imageHeight) / 2,
        imageWidth,
        imageHeight
      );

      const fileName = `${(formData.invoiceNumber || "invoice").trim().replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
      pdf.save(fileName);

      // Record download in user profile database
      fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, invoiceNumber: formData.invoiceNumber }),
      }).catch(() => { });

      triggerToast("success", "PDF Exported", `Saved ${fileName} to your device.`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      triggerToast("error", "PDF Generation Failed", err.message || "Please check your browser permissions and try again.");
    } finally {
      setDownloading(false);
    }
  }

  /* ============================================================
     CALCULATED TOTALS
  ============================================================ */

  const subtotal = items.reduce((sum, item) => {
    const q = Math.max(1, Number(item.qty) || 1);
    const p = Math.max(0, Number(item.price) || 0);
    return sum + q * p;
  }, 0);

  const safeTaxPercent = Math.min(100, Math.max(0, Number(taxPercent) || 0));
  const safeDiscountPercent = Math.min(100, Math.max(0, Number(discountPercent) || 0));

  const taxAmount = taxEnabled ? subtotal * (safeTaxPercent / 100) : 0;
  const discountAmount = discountEnabled ? subtotal * (safeDiscountPercent / 100) : 0;
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

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
    <main className="min-h-screen bg-[#f7f7f5] pb-24">
      
      {/* Toast Notification Container */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : toast.type === "error"
                  ? "border-red-200 bg-red-50/95 text-red-900"
                  : toast.type === "warning"
                    ? "border-amber-200 bg-amber-50/95 text-amber-900"
                    : "border-[#e8e8e3] bg-white text-[#141413]"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />}
            {toast.type === "error" && <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />}
            {toast.type === "warning" && <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />}
            {toast.type === "info" && <Sparkles size={18} className="shrink-0 text-[#526b5b] mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-none">{toast.title}</p>
              <p className="text-[11px] opacity-90 mt-1">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="text-current opacity-60 hover:opacity-100 p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#e8e8e3] bg-white p-6 sm:p-7 shadow-2xl">
            <h3 className="text-base font-bold text-[#141413]">{confirmModal.title}</h3>
            <p className="mt-2 text-xs text-[#777771] leading-relaxed">{confirmModal.message}</p>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
                className="rounded-xl border border-[#e5e5df] bg-white px-4 py-2 text-xs font-semibold text-[#555550] hover:bg-[#f5f5f2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
                  confirmModal.isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-[#11110f] hover:bg-[#252522]"
                }`}
              >
                {confirmModal.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Sticky Workspace Header */}
      <div className="sticky top-[57px] z-40 border-b border-[#e8e8e3] bg-[#fafaf8]/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Left Breadcrumb & Actions */}
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
                Auto-saving draft locally
              </span>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseSampleData}
              title="Populate demo data to preview template"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[#e8e8e3] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] shadow-xs hover:bg-[#f5f5f2] transition"
            >
              <Sparkles size={12} className="text-[#526b5b]" />
              <span>Use Sample Data</span>
            </button>

            <button
              type="button"
              onClick={handleClearDraft}
              title="Reset all fields"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[#e8e8e3] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#8c8c87] hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
            >
              <RotateCcw size={12} />
              <span>Clear Draft</span>
            </button>

            {/* Mobile View Switcher */}
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

            {/* Primary Download Button */}
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

      {/* Main Studio Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* ========================================================
              LEFT COLUMN — INVOICE FORM
          ========================================================= */}
          <section className={`space-y-6 ${mobileTab === "preview" ? "hidden xl:block" : "block"}`}>
            
            {/* Quick Helper Tools (Mobile/Tablet visible) */}
            <div className="flex md:hidden items-center justify-between gap-2 p-2 rounded-2xl bg-[#eeeee9] border border-[#e2e2dc]">
              <button
                type="button"
                onClick={handleUseSampleData}
                className="flex-1 rounded-xl bg-white py-1.5 text-xs font-semibold text-[#141413] shadow-xs text-center"
              >
                Load Sample Data
              </button>
              <button
                type="button"
                onClick={handleClearDraft}
                className="flex-1 rounded-xl py-1.5 text-xs font-semibold text-[#8c8c87] text-center"
              >
                Clear Fields
              </button>
            </div>

            {/* Step 1: Currency & Invoice Metadata */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                    <Building2 size={15} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#141413]">1. General & Currency</h2>
                    <p className="text-[11px] text-[#8c8c87]">Identifiers, date, and billing currency</p>
                  </div>
                </div>

                {/* Currency Dropdown Pill */}
                <div className="flex items-center gap-1.5">
                  <Coins size={13} className="text-[#8c8c87]" />
                  <select
                    value={selectedCurrency.code}
                    onChange={(e) => {
                      const found = CURRENCIES.find((c) => c.code === e.target.value);
                      if (found) {
                        setSelectedCurrency(found);
                        triggerToast("info", "Currency Changed", `All amounts updated to ${found.label}.`);
                      }
                    }}
                    className="rounded-lg border border-[#e5e5df] bg-[#fafaf8] px-2.5 py-1 text-xs font-semibold text-[#141413] focus:border-[#11110f] focus:outline-none cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
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
                    maxLength={120}
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
                    maxLength={40}
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

            {/* Step 2: Parties Details */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <Users size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">2. Parties & Contact Details</h2>
                  <p className="text-[11px] text-[#8c8c87]">Sender and recipient billing addresses</p>
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
                    maxLength={500}
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
                    maxLength={500}
                    value={formData.billTo}
                    onChange={(e) => setFormData({ ...formData, billTo: e.target.value })}
                    placeholder="Client Name / Corporation&#10;Attn: Accounts Payable&#10;456 Enterprise Way&#10;billing@client.com"
                    className="w-full resize-none rounded-xl border border-[#e5e5df] bg-[#fafaf8] p-3 text-xs leading-5 text-[#1a1a19] placeholder:text-[#9a9a94] focus:bg-white focus:border-[#11110f] focus:outline-none focus:ring-2 focus:ring-[#11110f]/5 transition"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Line Items with Strong Validations */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                    <Receipt size={15} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#141413]">3. Line Items & Deliverables</h2>
                    <p className="text-[11px] text-[#8c8c87]">Itemized breakdown with automatic calculations</p>
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

              <div className="mt-5 space-y-3">
                {items.map((item) => {
                  const safeQty = Math.max(1, Number(item.qty) || 1);
                  const safePrice = Math.max(0, Number(item.price) || 0);
                  const lineTotal = safeQty * safePrice;

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
                            maxLength={200}
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="e.g. Brand Identity Design & Strategy"
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-3 text-xs text-[#1a1a19] placeholder:text-[#9a9a94] focus:border-[#11110f] focus:outline-none"
                          />
                        </div>

                        {/* Quantity (min 1, integer) */}
                        <div className="col-span-4 sm:col-span-2">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="99999"
                            step="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none font-mono"
                          />
                        </div>

                        {/* Price (min 0) */}
                        <div className="col-span-5 sm:col-span-2">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1">
                            Price ({currencySymbol})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="9999999"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", e.target.value)}
                            className="w-full h-9 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none font-mono"
                          />
                        </div>

                        {/* Total & Trash */}
                        <div className="col-span-3 sm:col-span-2 flex items-center justify-between pt-5 sm:pt-0">
                          <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8c87] mb-1 sm:hidden">
                              Total
                            </span>
                            <span className="text-xs font-semibold font-mono text-[#141413]">
                              {currencySymbol}{lineTotal.toFixed(2)}
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

            {/* Step 4: Tax & Discount Adjustments with Range Limits */}
            <div className="rounded-2xl border border-[#e8e8e3] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f0ec]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f5f2] text-[#141413]">
                  <Percent size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#141413]">4. Adjustments & Taxes</h2>
                  <p className="text-[11px] text-[#8c8c87]">Percentage-based adjustments (0% – 100%)</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Tax */}
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
                        Tax Rate Percentage (0% to 100%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxPercent}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setTaxPercent(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                        }}
                        className="w-full h-8 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Discount */}
                <div className={`rounded-xl border p-4 transition ${discountEnabled ? "border-[#11110f]/20 bg-[#fafaf8]" : "border-[#e8e8e3] bg-white"}`}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-xs font-semibold text-[#141413]">Apply Client Discount</span>
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
                        Discount Rate Percentage (0% to 100%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discountPercent}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDiscountPercent(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                        }}
                        className="w-full h-8 rounded-lg border border-[#e5e5df] bg-white px-2.5 text-xs text-[#1a1a19] focus:border-[#11110f] focus:outline-none font-mono"
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
                  <p className="text-[11px] text-[#8c8c87]">Upload company logo and signature (Max 5MB)</p>
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
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d8d8d2] bg-white py-3 text-xs font-semibold text-[#141413] hover:bg-[#f5f5f2] transition shadow-xs">
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
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d8d8d2] bg-white py-3 text-xs font-semibold text-[#141413] hover:bg-[#f5f5f2] transition shadow-xs">
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
                Invoice Breakdown ({selectedCurrency.code})
              </span>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span className="font-mono text-sm font-medium text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>

                {taxEnabled && (
                  <div className="flex justify-between text-white/70">
                    <span>Tax ({safeTaxPercent}%)</span>
                    <span className="font-mono text-sm font-medium text-white">+{currencySymbol}{taxAmount.toFixed(2)}</span>
                  </div>
                )}

                {discountEnabled && (
                  <div className="flex justify-between text-white/70">
                    <span>Discount ({safeDiscountPercent}%)</span>
                    <span className="font-mono text-sm font-medium text-emerald-400">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="my-3 border-t border-white/10" />

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-semibold text-white">Grand Total</span>
                  <span className="font-mono text-2xl font-bold tracking-tight text-white">
                    {currencySymbol}{grandTotal.toFixed(2)}
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
                    Live Output Preview ({selectedCurrency.code})
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