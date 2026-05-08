import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">User not found</h1>
      <p className="text-sm text-muted-foreground">
        The user id is invalid or the data is not available.
      </p>
      <Link
        href="/users"
        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
      >
        Back to users list
      </Link>
    </div>
  );
}

