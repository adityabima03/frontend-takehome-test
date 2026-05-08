import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPosts, getTodos, getUser } from "@/lib/jsonplaceholder";
import { cn } from "@/lib/utils";

function toInt(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i <= 0) return null;
  return i;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = toInt(id);
  if (!userId) return { title: "User not found" };

  try {
    const user = await getUser(userId, { revalidateSeconds: 60 });
    return {
      title: `${user.name} · User`,
      description: `Detail user ${user.name} (${user.username})`,
    };
  } catch {
    return { title: "User" };
  }
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const revalidateSeconds = 60;

  const { id } = await params;
  const userId = toInt(id);
  if (!userId) notFound();

  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string" && v.length > 0) qs.set(k, v);
  }
  const backHref = `/users${qs.toString() ? `?${qs.toString()}` : ""}`;

  let user;
  try {
    user = await getUser(userId, { revalidateSeconds });
  } catch {
    notFound();
  }

  const [posts, todos] = await Promise.all([
    getPosts({ revalidateSeconds }),
    getTodos({ revalidateSeconds }),
  ]);

  const userPosts = posts.filter((p) => p.userId === userId);
  const userTodos = todos.filter((t) => t.userId === userId);

  const completed = userTodos.filter((t) => t.completed).length;
  const pending = userTodos.length - completed;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <Link
          href={backHref}
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
        >
          Back to list
        </Link>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Email</div>
            <a className="text-sm hover:underline underline-offset-4" href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Phone</div>
            <div className="text-sm">{user.phone}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Website</div>
            <a
              className="text-sm hover:underline underline-offset-4"
              href={`https://${user.website}`}
              target="_blank"
              rel="noreferrer"
            >
              {user.website}
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Company</div>
            <div className="text-sm">
              <div className="font-medium">{user.company.name}</div>
              <div className="text-muted-foreground">{user.company.catchPhrase}</div>
            </div>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <div className="text-xs font-medium text-muted-foreground">Address</div>
            <div className="text-sm text-muted-foreground">
              {user.address.street}, {user.address.suite}, {user.address.city}{" "}
              {user.address.zipcode}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Posts</h2>
            <span className="text-xs text-muted-foreground">
              {userPosts.length} total
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {userPosts.length === 0 ? (
              <div className="text-sm text-muted-foreground">No posts.</div>
            ) : (
              userPosts.slice(0, 6).map((p) => (
                <article key={p.id} className="space-y-1">
                  <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {p.body}
                  </div>
                </article>
              ))
            )}
            {userPosts.length > 6 ? (
              <div className="text-xs text-muted-foreground">
                Showing 6 of {userPosts.length}.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Todos</h2>
            <span className="text-xs text-muted-foreground">
              {completed} done • {pending} pending
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {userTodos.length === 0 ? (
              <div className="text-sm text-muted-foreground">No todos.</div>
            ) : (
              userTodos.slice(0, 10).map((t) => (
                <div key={t.id} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-5 items-center justify-center rounded-full border text-[11px]",
                      t.completed
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
                    )}
                    aria-label={t.completed ? "Completed" : "Pending"}
                    title={t.completed ? "Completed" : "Pending"}
                  >
                    {t.completed ? "✓" : "•"}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-foreground line-clamp-2">
                      {t.title}
                    </div>
                  </div>
                </div>
              ))
            )}
            {userTodos.length > 10 ? (
              <div className="text-xs text-muted-foreground">
                Showing 10 of {userTodos.length}.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

