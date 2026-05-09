## Next.js Users Workspace

Aplikasi Next.js (App Router) + TypeScript untuk menampilkan dan mengeksplor data users.

## Tech Stack

- Next.js (App Router) + TypeScript
- Styling: Tailwind CSS + shadcn/ui (Base UI style)
- Data fetching: Next `fetch` (Server Component) dengan ISR
- Testing (unit): Jest + React Testing Library

## Getting Started

Project ini memakai **pnpm**.

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # development server (hot reload)
pnpm build        # production build
pnpm start        # production server — jalankan setelah `pnpm build`, port default 3000
pnpm test
pnpm test:e2e
```

## E2E (Playwright)

Install browser dependency 

```bash
pnpm dlx playwright install
```

## Routes

- `/`: halaman awal (template)
- `/users`: users list + activity signals + filter/sort + pagination

## Fitur `/users`

- Fetch users dari `https://jsonplaceholder.typicode.com/users`
- Enrich activity signals dari:
  - `https://jsonplaceholder.typicode.com/posts`
  - `https://jsonplaceholder.typicode.com/todos`
- Setiap row user menampilkan activity signals (derived): total posts, completed todos, dan pending todos.
- Search (client-side) by name/email
- Filter tambahan: hanya user dengan pending todos (`filter=has-pending`)
- Sort:
  - by name (`sort=name-asc` / `sort=name-desc`)
  - by most pending (`sort=pending-desc`)
- Pagination + page size:
  - `page` (1-based)
  - `pageSize` (5/10/20/50)
- State disimpan di query string supaya tidak “hilang” saat refresh / back-forward.

## Caching (ISR)

Data `/users` menggunakan `fetch({ next: { revalidate: 60 } })` sehingga cache revalidate setiap **60 detik**.

## Font

Project ini memakai font bawaan template Next (`Geist` via `next/font`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
