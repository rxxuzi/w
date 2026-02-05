# w

Personal portfolio website with file storage integration.

**Live:** [rxxuzi.com](https://rxxuzi.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Content:** MDX (next-mdx-remote)
- **Storage:** Cloudflare R2
- **Hosting:** Vercel

## Features

- `/` — Landing page
- `/about` — About me
- `/dev` — Projects (MDX-based)
- `/files` — Public file browser (R2)
- `/up` — Admin file manager (auth required)
- `/contact` — Contact info
- `/explore` — Explorations

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env.local` with:

```env
# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Admin auth
ADMIN_MAIL=
ADMIN_PASS=
JWT_SECRET=
```

## Adding Projects

Create MDX files in `content/develop/`:

```mdx
---
title: Project Name
description: Short description
year: "2024"
status: active
tech: React, TypeScript
---

Content here...
```

## License

MIT
