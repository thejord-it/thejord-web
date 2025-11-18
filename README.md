# THEJORD Web

Next.js-based blog and content platform for THEJORD.it with SSR and SEO optimization.

## Tech Stack

- **Next.js 16** - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **THEJORD API** - Backend for blog content

## Architecture

Multi-repo setup:
- **thejord-web** (this repo) - Blog and content pages with SSR
- **thejord-tools** - Interactive developer tools (Vite + React)
- **thejord-api** - Backend API (Express + Prisma + PostgreSQL)
- **thejord-admin** - CMS admin panel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Server runs on [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```env
API_URL=http://localhost:4000
```

## Features

- ✅ SSR for blog posts with dynamic meta tags
- ✅ SEO optimized (title, description, OG tags, keywords)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Schema.org structured data
- ✅ Open Graph & Twitter Cards
- ✅ Tailwind CSS with THEJORD color palette

## License

MIT © Il Giordano
