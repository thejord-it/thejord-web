# THEJORD Web

Full-stack Next.js application for THEJORD.it featuring:
- **Blog** with SSR and SEO optimization
- **11 Developer Tools** (100% client-side processing)
- **Admin Panel** for content management

## Tech Stack

- **Next.js 16.0.3** - React framework with App Router + Turbopack
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Styling
- **Jest + Playwright** - Testing (118 unit tests + 14 E2E tests)
- **PostgreSQL** - Database for blog content
- **Node.js API** - Backend (Express + Prisma)

## Architecture

**Unified Application:**
- **thejord-web** (this repo) - Blog, Tools, and public pages in a single Next.js app
- **thejord-api** - Backend API (Express + Prisma + PostgreSQL)

**Previous Architecture (deprecated):**
- ~~thejord-tools (Vite + React SPA)~~ → Migrated to `/tools` in this repo
- ~~thejord-admin~~ → Integrated in `/admin` in this repo

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

## Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Testing
npm test             # Run unit tests (Jest)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:e2e:ui  # Run E2E tests with Playwright UI
```

## Environment Variables

Create `.env.local`:

```env
API_URL=http://localhost:4000
```

## Features

### Developer Tools (11 Tools)
All tools process data 100% client-side for maximum privacy:

- ✅ **JSON Formatter** - Format, validate, and beautify JSON
- ✅ **Base64 Encoder/Decoder** - Encode/decode text and files
- ✅ **RegEx Tester** - Test regular expressions with highlighting
- ✅ **Hash Generator** - MD5, SHA-1, SHA-256, SHA-512
- ✅ **URL Encoder/Decoder** - URL encode/decode
- ✅ **Markdown Converter** - Markdown to HTML with preview
- ✅ **Color Converter** - HEX ↔ RGB ↔ HSL conversions
- ✅ **Lorem Ipsum Generator** - Placeholder text generation
- ✅ **Diff Checker** - Compare text differences
- ✅ **Cron Builder** - Build and validate cron expressions
- ✅ **JSON Schema Converter** - Generate JSON Schema from JSON

### Public Blog
- ✅ SSR for blog posts with dynamic meta tags
- ✅ SEO optimized (sitemap.xml, robots.txt, meta tags)
- ✅ Schema.org structured data
- ✅ Open Graph & Twitter Cards
- ✅ Responsive image display with WebP optimization
- ✅ Tag-based filtering and search

### Admin Panel (CMS)
- ✅ Complete blog post management (CRUD)
- ✅ Live preview before publishing
- ✅ Dual editor: Markdown & WYSIWYG
- ✅ Image upload with automatic optimization
- ✅ Tag management with autocomplete
- ✅ Bulk actions (publish, unpublish, delete)
- ✅ JWT authentication

### Testing
- ✅ **118 unit tests** with Jest + Testing Library
- ✅ **14 E2E tests** with Playwright
- ✅ Coverage for all major tools and utilities
- ✅ Automated testing in CI/CD pipeline

## License

MIT © Il Giordano
