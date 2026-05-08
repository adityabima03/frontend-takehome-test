"use client";

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
        <p className="font-medium">Failed to load data.</p>
        <p className="mt-2 text-xs opacity-80">{error.message}</p>
        <button
          type="button"
          className="mt-3 underline underline-offset-4"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

