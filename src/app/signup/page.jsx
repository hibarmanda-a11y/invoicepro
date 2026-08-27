"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter(); const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [callbackUrl] = useState(() => {
    if (typeof window === "undefined") return "/profile";
    const requestedUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    return requestedUrl?.startsWith("/") ? requestedUrl : "/profile";
  });
  const [show, setShow] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event) {
    event.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to create account."); setLoading(false); return; }
    await signIn("credentials", { email: form.email, password: form.password, callbackUrl });
  }
  return <main className="auth-page"><section className="auth-panel"><p className="auth-kicker">Invoice Pro</p><h1>Get started with Invoice Pro</h1><p className="auth-subtitle">A calmer way to create invoices and keep your work moving.</p><button onClick={() => signIn("google", { callbackUrl })} className="auth-secondary">Continue with Google</button><div className="auth-divider"><span>or use email</span></div><form onSubmit={submit} className="space-y-4"><label>Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} /></label><label>Email<input type="email" required value={form.email} onChange={(event) => update("email", event.target.value)} /></label><label>Password<div className="password-field"><input required minLength={6} type={show ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} /><button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></div></label><label>Confirm password<input required minLength={6} type={show ? "text" : "password"} value={form.confirm} onChange={(event) => update("confirm", event.target.value)} /></label><button className="auth-primary" disabled={loading}>{loading ? "Creating account..." : "Sign up"}</button></form>{error && <p className="auth-error">{error}</p>}<p className="auth-foot">Already have an account? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Log in</Link></p></section></main>;
}
