# THEJORD Roadmap

## In Progress

### PDF Tools Enhancement
- [ ] **PDF OCR / Searchable PDF** - Convert image-based PDFs to searchable PDFs
  - Implement OCRmyPDF on thejord-api backend
  - Maintain original visual appearance while adding invisible text layer
  - Support for multiple languages (IT, EN)
  - Output: PDF/A compliant searchable PDF

## Planned

### Developer Tools
- [ ] Additional PDF operations (watermark, password protection)
- [ ] Image optimization tool (WebP conversion, compression)
- [ ] SQL Formatter

### Blog
- [ ] Comments system
- [ ] Newsletter subscription
- [ ] Related posts suggestions

### Infrastructure
- [ ] Redis caching for API responses
- [ ] CDN integration for static assets

## Completed

### v2.2.0 (December 2025)
- [x] XML & WSDL Viewer tool
- [x] E2E tests for all tools (163 tests)
- [x] CI/CD pipeline with automated testing

### v2.1.0
- [x] PDF Tools (Merge, Split, Edit, Convert, Compress)
- [x] JSON Schema Converter
- [x] Cron Builder

### v2.0.0
- [x] Migration from Vite SPA to Next.js unified app
- [x] SSR for blog with SEO optimization
- [x] Admin panel integration

### v1.0.0
- [x] Initial 8 developer tools
- [x] Blog with PostgreSQL backend
- [x] Basic admin functionality
