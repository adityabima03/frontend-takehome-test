import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:py-14">
      <header className="space-y-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          Next.js Users Workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Jelajahi data users dengan cepat dan rapi.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Halaman <span className="font-medium text-foreground">Users</span>{" "}
          menyediakan pencarian, filter, sort, pagination, dan ringkasan aktivitas
          (posts/todos) dalam tampilan datatable yang responsif.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link href="/users" className={buttonVariants({ variant: "default" })}>
            Buka Users
          </Link>
          <Link
            href="/users?sort=pending-desc"
            className={cn(buttonVariants({ variant: "outline" }), "text-center")}
          >
            Lihat yang paling banyak pending
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold">Cari</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter by name/email dengan hasil instan.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold">Filter</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Fokus ke user yang masih punya pending todos.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold">Sort</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Urutkan berdasarkan nama atau pending terbanyak.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold">Pagination</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Navigasi halaman dengan angka + chevron, dan atur jumlah baris.
          </p>
        </div>
      </section>
    </div>
  );
}
