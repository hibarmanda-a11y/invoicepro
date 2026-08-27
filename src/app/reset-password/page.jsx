"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  return <main className="auth-page"><section className="auth-panel"><p className="auth-kicker">Invoice Pro</p><h1>Reset your password</h1><p className="auth-subtitle">Enter your account email and we&apos;ll help you get back in.</p><form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="space-y-4"><label>Email<input type="email" required /></label><button className="auth-primary">Send reset link</button></form>{sent && <p className="auth-foot">If an account exists for that email, reset instructions are on their way.</p>}</section></main>;
}
