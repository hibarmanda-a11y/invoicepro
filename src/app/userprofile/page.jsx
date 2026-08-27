"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const { data: session } = useSession(); const [user, setUser] = useState(null);
  useEffect(() => { fetch("/api/me").then((response) => response.json()).then(setUser); }, []);
  return <main className="profile-page"><section className="profile-header"><p className="auth-kicker">Your workspace</p><h1>{session?.user?.name || "Your profile"}</h1><p>{session?.user?.email}</p><button className="auth-primary profile-button" onClick={() => signOut({ callbackUrl: "/" })}>Log out</button></section><section className="history"><div><p className="auth-kicker">Activity</p><h2>Download history</h2></div>{user?.downloads?.length ? user.downloads.slice().reverse().map((download) => <article key={`${download.templateId}-${download.downloadedAt}`}><strong>{download.templateName}</strong><span>{download.invoiceNumber || "Invoice"}</span><time>{new Date(download.downloadedAt).toLocaleDateString()}</time></article>) : <p className="empty-state">Your downloaded invoices will appear here.</p>}</section></main>;
}
