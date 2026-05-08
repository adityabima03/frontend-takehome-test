export default function UsersLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="mt-3 h-4 w-11/12 rounded bg-muted animate-pulse" />
        <div className="mt-3 h-4 w-10/12 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

