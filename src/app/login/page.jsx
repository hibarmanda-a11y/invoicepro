"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => {
    if (typeof window === "undefined") return "/userprofile";
    const requestedUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    return requestedUrl?.startsWith("/") ? requestedUrl : "/userprofile";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email address or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-[#f7f7f5] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e8e8e3] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Brand Panel */}
        <div className="bg-[#11110f] p-8 sm:p-10 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#11110f]">
                <FileText size={16} strokeWidth={2.2} />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                Invoice<span className="text-white/40">Pro</span>
              </span>
            </Link>

            <div className="mt-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm mb-4">
                <Sparkles size={12} className="text-emerald-400" />
                <span>Professional Workspace</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white leading-snug">
                Create, customize, and export client invoices in minutes.
              </h2>
              <p className="mt-3 text-xs text-white/60 leading-relaxed">
                Join thousands of freelancers, agencies, and small businesses who trust InvoicePro for their daily billing.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-400" />
            <p className="text-[11px] text-white/60">
              Safe & secure authentication. Your data is always protected.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div>
            <div className="md:hidden flex items-center gap-2 mb-6">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#11110f] text-white">
                <FileText size={14} />
              </div>
              <span className="text-sm font-bold text-[#141413]">InvoicePro</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#141413]">
              Welcome back
            </h1>
            <p className="mt-1 text-xs text-[#777771]">
              Sign in to manage and download your invoices
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#e5e5df] bg-white py-2.5 text-xs font-semibold text-[#141413] shadow-xs hover:bg-[#fafaf8] transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#e8e8e3]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a94]">
              or with email
            </span>
            <span className="h-px flex-1 bg-[#e8e8e3]" />
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#333330] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="saas-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#333330]">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-[11px] text-[#777771] hover:text-[#11110f] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="saas-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a94] hover:text-[#141413]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#11110f] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#252522] transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in to Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#777771]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-semibold text-[#141413] hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
