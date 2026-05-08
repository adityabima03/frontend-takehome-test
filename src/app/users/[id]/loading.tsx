export default function UserDetailsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-12 rounded bg-muted animate-pulse" />
          <div className="h-12 rounded bg-muted animate-pulse" />
          <div className="h-12 rounded bg-muted animate-pulse" />
          <div className="h-12 rounded bg-muted animate-pulse" />
          <div className="h-12 rounded bg-muted animate-pulse sm:col-span-2" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="mt-3 h-12 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-12 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-12 rounded bg-muted animate-pulse" />
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="mt-3 h-10 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-10 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-10 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

