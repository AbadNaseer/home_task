# Team Tasks

A minimal authenticated task management app built with Next.js, Supabase, Docker, Terraform, and GitHub Actions.

## Architecture Diagram

```
[User] -> [Next.js App (Docker)] -> [Supabase (Auth + DB)]
                        |
                [Deployed via CI/CD]
                        |
                [Provisioned VM (Terraform)]
```

## Setup
- Supabase: configure with schema and RLS in `supabase/schema.sql`.
- Env vars: set in `.env.local` (see example in README).
- Local: `npm install`, `npm run dev`.
- Docker: `docker build .`, `docker run ...`.
- Terraform: see `infra/terraform/`.
- CI/CD: see `.github/workflows/deploy.yml`.

## Trade-offs & Next Steps
- See comments in code and this file.

## Database

Two SQL files will help you set up and seed your database:

- `sql/001_schema_and_policies.sql`: Creates `tasks` table and RLS policies
- `sql/002_seed.sql`: Inserts sample tasks

Run them in Supabase SQL editor or via CLI in order.

## Auth

- Email + password sign in
- Magic link (email OTP) sign-in supported
- Confirm route is `/auth/confirm`

## Pages

- `/login`: Login form and magic link
- `/register`: Create account
- `/tasks`: CRUD UI for personal tasks

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
