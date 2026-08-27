"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => {
    if (typeof window === "undefined") return "/profile";
    const requestedUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    return requestedUrl?.startsWith("/") ? requestedUrl : "/profile";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { setError("Email or password is incorrect."); setLoading(false); return; }
    router.push(callbackUrl); router.refresh();
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to continue creating polished invoices.">
    <button onClick={() => signIn("google", { callbackUrl })} className="auth-secondary">Continue with Google</button>
    <div className="auth-divider"><span>or use email</span></div>
    <form onSubmit={submit} className="space-y-4">
      <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Password<div className="password-field"><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></label>
      <Link href="/reset-password" className="block text-right text-xs text-[#777771] underline underline-offset-4">Reset password</Link>
      <button className="auth-primary" disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
    </form>
    {error && <p className="auth-error">{error}</p>}
    <p className="auth-foot">Don&apos;t have an account? <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Sign up</Link></p>
  </AuthShell>;
}

function AuthShell({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-panel"><p className="auth-kicker">Invoice Pro</p><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}</section></main>;
}
