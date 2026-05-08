import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12 sm:col-span-2" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-12" />
          <Skeleton className="mt-2 h-12" />
          <Skeleton className="mt-2 h-12" />
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-10" />
          <Skeleton className="mt-2 h-10" />
          <Skeleton className="mt-2 h-10" />
        </div>
      </div>
    </div>
  );
}

