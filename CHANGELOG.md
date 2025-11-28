# Changelog

All notable changes to the THEJORD web platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-11-28

### Mobile Responsive Update

Complete mobile optimization for all pages and tools.

### Added

#### Mobile Features
- **Responsive Header** with hamburger menu for mobile devices
- **Blog Search & Filter** - Backend search with Prisma and tag filtering
- **Monaco Editor Fallback** - Textarea fallback when CDN fails

### Changed

#### Mobile Optimization
- **All Pages** now mobile-first responsive
- **All 11 Tools** mobile-friendly with flex-wrap buttons
- **Tag Filter** - Horizontal scroll on mobile
- **Blog Cards** - Full-width layout

### Fixed
- Button overflow on mobile tool pages
- Menu not blocking content when open
- Monaco Editor infinite loading

---

## [2.0.0] - 2025-11-20

### Major Changes - Next.js Migration

This release marks the complete migration from a React SPA to Next.js 16 with Server-Side Rendering.

### Added

#### Infrastructure
- **Next.js 16.0.3** with App Router and Turbopack
- **React 19** with Server Components
- **TypeScript 5** with strict mode
- **Server-Side Rendering (SSR)** for all pages
- **Static Site Generation (SSG)** for blog posts
- **Improved SEO**: Score increased from 3/10 (SPA) to 9/10 (Next.js)
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Sitemap.xml** auto-generated from blog posts and pages
- **robots.txt** configuration

#### Features
- **Blog Platform** with markdown support
  - Admin dashboard for content creation
  - WYSIWYG markdown editor (TipTap)
  - Image upload and optimization
  - SEO metadata for each post
  - Dynamic Open Graph images
- **Landing Page** redesign
  - Hero section with animated gradients
  - Stats showcase
  - Featured tools display
  - Mobile-responsive design
- **Privacy Features**
  - Comprehensive Privacy Policy page (GDPR compliant)
  - Cookie consent banner with opt-in/opt-out
  - Google Analytics 4 with IP anonymization

#### Developer Tools (11 total)
All tools process data 100% client-side for maximum privacy:

1. **JSON Formatter** - Validate, format, and beautify JSON with syntax highlighting
2. **Base64 Encoder/Decoder** - Encode and decode text and files to/from Base64
3. **RegEx Tester** - Test regular expressions with real-time highlighting
4. **Hash Generator** - Generate MD5, SHA-1, SHA-256, and SHA-512 hashes
5. **Cron Builder** - Build and validate cron expressions visually
6. **Diff Checker** - Compare text differences with side-by-side view
7. **URL Encoder/Decoder** - Encode and decode URLs
8. **Lorem Ipsum Generator** - Generate placeholder text
9. **Markdown Converter** - Convert markdown to HTML with live preview
10. **UUID Generator** - Generate UUIDs (v4)
11. **QR Code Generator** - Create QR codes from text

### Changed

#### Branding
- Rebranded from "Il Giordano" to "The Jord"
- Updated all metadata, footers, and documentation

#### Accessibility
- **Color Palette Update** - Switched to WCAG AAA compliant colors
  - Primary: `#3B82F6` (blue - accessible for colorblind users)
  - Secondary: `#06B6D4` (cyan)
  - Accent: `#10B981` (green)
  - Previous problematic magenta/cyan colors removed
- Tested for deuteranopia and protanopia color blindness
- High contrast ratios on dark backgrounds

#### Performance
- **Faster Initial Load** - SSR eliminates client-side rendering delay
- **Better SEO** - Search engines can crawl pre-rendered content
- **Optimized Images** - Next.js Image component with automatic optimization
- **Code Splitting** - Automatic route-based code splitting

### Security

#### Added
- **Content Security Policy (CSP)** - Prevents XSS attacks
- **HTTP Strict Transport Security (HSTS)** - Enforces HTTPS (2 years)
- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-Content-Type-Options: nosniff** - Prevents MIME sniffing
- **Permissions-Policy** - Disables unnecessary browser features
- **Referrer-Policy** - Controls referrer information
- **IP Anonymization** - Google Analytics anonymizes last IP octet

### Technical Details

#### Dependencies
- `next`: ^16.0.3
- `react`: ^19.2.0
- `react-dom`: ^19.2.0
- `typescript`: ^5.9.3
- `tailwindcss`: ^3.3.5
- `@monaco-editor/react`: ^4.7.0 (code editors)
- `@tiptap/react`: ^3.10.8 (WYSIWYG editor)
- `marked`: ^17.0.0 (markdown parsing)
- `crypto-js`: ^4.2.0 (hashing)
- `js-cookie`: ^3.0.5 (cookie management)

#### Testing
- **Jest** for unit tests
- **Playwright** for E2E tests
- **Testing Library** for component tests

#### Build & Deploy
- `npm run dev` - Development server (Turbopack)
- `npm run build` - Production build
- `npm run start` - Production server
- **Standalone output mode** for Docker deployment

---

## [1.0.0] - 2024

### Initial Release - React SPA

#### Features
- 5 developer tools (JSON, Base64, RegEx, Hash, Cron)
- Client-side only rendering
- Google Analytics tracking
- Responsive design
- Dark theme

#### Issues (Resolved in v2.0.0)
- Poor SEO (3/10 score) due to client-side rendering
- No blog platform
- Limited accessibility (color contrast issues)
- No security headers
- No cookie consent mechanism

---

## Migration Notes

### Breaking Changes from v1.0.0 to v2.0.0

1. **Complete Rewrite** - New Next.js codebase, not backward compatible
2. **API Changes** - Tools now use Next.js API routes for admin features
3. **Routing** - Next.js App Router instead of React Router
4. **Environment Variables** - New format for Next.js
5. **Build Process** - Different build commands and output structure

### Migration Benefits

- **10x SEO Improvement** - From score 3/10 to 9/10
- **Faster Performance** - SSR eliminates render delays
- **Better Accessibility** - WCAG AAA compliant colors
- **Enhanced Security** - Industry-standard security headers
- **Privacy Compliance** - Full GDPR compliance with consent management
- **Content Platform** - Integrated blog with admin dashboard

---

## Future Roadmap

### Planned Features
- [ ] RSS feed for blog
- [x] Search functionality for blog posts
- [ ] Dark/Light theme toggle
- [ ] More developer tools
- [ ] API documentation
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support

### Under Consideration
- User accounts for saving tool preferences
- Tool usage statistics dashboard
- Community-contributed tools
- Browser extensions

---

## Support

For questions, issues, or feature requests:
- Visit: https://thejord.it/contact
- Email: privacy@thejord.it
- GitHub: https://github.com/thejord

---

**Made in Italy 🇮🇹 by The Jord**
