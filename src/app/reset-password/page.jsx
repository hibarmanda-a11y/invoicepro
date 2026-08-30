"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#f7f7f5] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#e8e8e3] bg-white p-8 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.03)]">
        
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777771] hover:text-[#141413] transition mb-6"
        >
          <ArrowLeft size={13} />
          <span>Back to sign in</span>
        </Link>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11110f] text-white mb-4">
          <Mail size={18} />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#141413]">
          Reset your password
        </h1>
        <p className="mt-1.5 text-xs text-[#777771] leading-relaxed">
          Enter the email address associated with your InvoicePro account, and we will send you a recovery link.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-900 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <p className="text-xs font-semibold">Check your inbox</p>
            </div>
            <p className="mt-1.5 text-[11px] text-emerald-800">
              If an account exists for <span className="font-semibold">{email}</span>, password reset instructions have been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-xs font-semibold text-[#333330] mb-1.5">
                Account Email
              </label>
              <input
                id="resetEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="saas-input"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#11110f] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#252522] transition active:scale-[0.99]"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
