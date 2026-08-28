"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && !data.error) setUser(data);
      })
      .catch(() => { });
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
              Account
            </p>

            <h1 className="text-[32px] font-semibold tracking-[-1.5px] text-neutral-900 sm:text-[42px]">
              User Dashboard
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Manage your account and view your recent downloads.
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full shrink-0 rounded-[9px] border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto"
          >
            Log out
          </button>
        </section>

        {/* Profile Card */}
        <section className="mb-5 overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.025)]">
          <div className="p-6 sm:p-7">

            {/* Card heading */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                Your Profile
              </p>

              <h2 className="text-[21px] font-semibold tracking-[-0.4px] text-neutral-900">
                Account details
              </h2>
            </div>

            {/* Details */}
            <div className="mt-6 border-t border-neutral-100 pt-6">

              <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">

                {/* Avatar */}
                <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[27px] font-semibold text-neutral-700">
                  {(session?.user?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                {/* User information */}
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-10">

                  <div className="min-w-0">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                      Full name
                    </p>

                    <p className="break-words text-sm font-medium text-neutral-800">
                      {session?.user?.name || "Your profile"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                      Email address
                    </p>

                    <p className="break-all text-sm font-medium text-neutral-800">
                      {session?.user?.email || "—"}
                    </p>
                  </div>

                </div>

                {/* Account status */}
                <div className="border-t border-neutral-100 pt-4 md:min-w-[130px] md:border-t-0 md:pt-0">

                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                    Account
                  </p>

                  <p className="text-sm font-medium text-neutral-800">
                    Active
                  </p>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Recent Downloads */}
        <section className="overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.025)]">

          {/* Downloads heading */}
          <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                Activity
              </p>

              <h2 className="text-[21px] font-semibold tracking-[-0.4px] text-neutral-900">
                Recent downloads
              </h2>
            </div>

            {user?.downloads?.length > 0 && (
              <span className="w-fit rounded-[7px] border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-500">
                {user.downloads.length} downloads
              </span>
            )}

          </div>

          {/* Download list */}
          <div>
            {user?.downloads?.length ? (

              user.downloads
                .slice()
                .reverse()
                .map((download) => (

                  <article
                    key={`${download.templateId}-${download.downloadedAt}`}
                    className="grid min-h-[76px] grid-cols-[38px_1fr] items-center gap-4 border-b border-neutral-100 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-neutral-50 sm:grid-cols-[38px_1fr_auto] sm:px-7"
                  >

                    {/* PDF Icon */}
                    <div className="flex h-[43px] w-[37px] items-center justify-center rounded-[5px] border border-red-200 bg-red-50 text-[8px] font-extrabold text-red-600">
                      PDF
                    </div>

                    {/* File details */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {download.templateName}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {download.invoiceNumber || "Invoice"}
                      </p>
                    </div>

                    {/* Date */}
                    <time className="col-start-2 text-xs text-neutral-500 sm:col-auto">
                      {new Date(
                        download.downloadedAt
                      ).toLocaleDateString()}
                    </time>

                  </article>

                ))

            ) : (

              /* Empty state */
              <div className="flex min-h-[210px] flex-col items-center justify-center px-5 py-10 text-center">

                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-lg text-neutral-500">
                  ↓
                </div>

                <p className="text-sm font-semibold text-neutral-700">
                  No downloads yet
                </p>

                <p className="mt-1.5 text-xs text-neutral-400">
                  Your downloaded invoices will appear here.
                </p>

              </div>

            )}
          </div>
        </section>

      </div>
    </main>
  );
}