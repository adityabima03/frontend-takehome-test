"use client";

import Link from "next/link";

export default function UserDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">User</h1>
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
        <p className="font-medium">Terjadi error saat memuat detail user.</p>
        <p className="mt-2 text-xs opacity-80">{error.message}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => reset()}
          >
            Coba lagi
          </button>
          <Link
            href="/users"
            className="underline underline-offset-4 opacity-90 hover:opacity-100"
          >
            Kembali ke list
          </Link>
        </div>
      </div>
    </div>
  );
}

