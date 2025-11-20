# Admin Panel Documentation

Complete CMS admin panel for managing blog posts on THEJORD.it

## Access

**URL**: `/admin`

**Authentication**: JWT token required (stored in localStorage)

## Features Overview

### 1. Dashboard (`/admin`)
- Quick overview of blog statistics
- Recent posts list
- Quick actions

### 2. Posts Management (`/admin/posts`)

#### List View
- View all posts (published and drafts)
- Search posts by title
- Filter by tag
- Bulk selection with checkboxes
- Bulk actions:
  - Publish multiple posts
  - Unpublish multiple posts
  - Delete multiple posts
- Individual post actions:
  - Edit
  - Delete
  - Quick publish/unpublish toggle

#### Create New Post (`/admin/posts/new`)

**Basic Information:**
- **Title** - Post title (required)
- **Slug** - URL-friendly identifier (auto-generated from title, editable)
- **Language** - Italian or English
- **Author** - Author name (required)
- **Excerpt** - Brief description shown in blog list (required)
- **Read Time** - Estimated reading time (e.g., "5 min read")
- **Featured Image** - Upload or URL input with preview
- **Tags** - Add tags with autocomplete (shows existing tags)

**Content Editor:**
- **Markdown Editor** - Write in Markdown with syntax highlighting
- **WYSIWYG Editor** - Visual editor with formatting toolbar
- Toggle between editors on-the-fly

**SEO Settings:**
- **Meta Title** - Custom title for search engines (optional, uses post title if empty)
- **Meta Description** - Custom description for search results (optional, uses excerpt if empty)
- **Keywords** - SEO keywords with autocomplete
- **OG Image** - Custom Open Graph image for social sharing
- **Canonical URL** - Canonical URL for SEO

**Actions:**
- **Preview** - Opens preview in new tab (without publishing)
- **Save as Draft** - Saves without publishing
- **Publish** - Publishes the post immediately

#### Edit Post (`/admin/posts/[id]`)
- Same interface as creating a new post
- Pre-filled with existing post data
- Updates existing post instead of creating new one

#### Preview Post (`/admin/posts/preview`)
- Shows how the post will look when published
- Yellow banner indicating "PREVIEW MODE"
- No changes are saved
- Opens in new tab for side-by-side comparison

### 3. Tags Management (`/admin/tags`)

#### Features:
- View all unique tags across all posts
- See post count for each tag
- Preview first 3 posts for each tag
- Search tags
- Click tag to filter posts by that tag

#### Statistics:
- Total number of unique tags
- Most used tag with count
- Average posts per tag

### 4. Image Upload

#### Functionality:
- Drag & drop or click to upload
- Manual URL input option
- Live preview of uploaded/selected image
- Remove button to clear selection

#### Backend Processing (Automatic):
- **Max file size**: 5MB
- **Allowed formats**: JPEG, JPG, PNG, GIF, WebP
- **Auto-resize**: Max 1920x1080 (maintains aspect ratio)
- **Auto-convert**: All images converted to WebP with 85% quality
- **Original file**: Deleted after conversion (only WebP kept)

#### Usage:
```typescript
<ImageUpload
  value={imageUrl}
  onChange={(url) => setImageUrl(url)}
  label="Featured Image"
/>
```

## Component Reference

### ImageUpload Component
**Location**: `components/ImageUpload.tsx`

**Props:**
- `value: string` - Current image URL
- `onChange: (url: string) => void` - Callback when image changes
- `label?: string` - Label text (optional)

**Features:**
- File upload via button
- Manual URL input
- Image preview with fallback
- Remove button
- Error handling

### TagInput Component
**Location**: `components/TagInput.tsx`

**Props:**
- `value: string[]` - Current tags array
- `onChange: (tags: string[]) => void` - Callback when tags change
- `label?: string` - Label text (optional)

**Features:**
- Add tags by typing and pressing Enter
- Remove tags by clicking X or Backspace
- Autocomplete dropdown showing existing tags
- Click autocomplete suggestion to add tag
- Visual chips for each tag

### MarkdownEditor Component
**Location**: `components/MarkdownEditor.tsx`

**Props:**
- `value: string` - Current markdown content
- `onChange: (value: string) => void` - Callback when content changes

**Features:**
- Syntax highlighting for Markdown
- Line numbers
- Auto-indentation
- Tab support

### WysiwygEditor Component
**Location**: `components/WysiwygEditor.tsx`

**Props:**
- `value: string` - Current HTML content
- `onChange: (value: string) => void` - Callback when content changes

**Features:**
- Rich text formatting toolbar
- Bold, italic, underline, strikethrough
- Headings (H1-H6)
- Lists (ordered, unordered)
- Links and images
- Code blocks
- Blockquotes
- Outputs HTML

## API Integration

All admin panel features use the THEJORD API (`thejord-api`).

**API Functions** (from `lib/api.ts`):

```typescript
// Posts
getAllPosts() -> BlogPost[]
getBlogPost(slug, lang) -> BlogPost
getBlogPosts(lang) -> BlogPost[]
createPost(post) -> BlogPost
updatePost(id, post) -> BlogPost
deletePost(id) -> void

// Bulk Actions
bulkDeletePosts(ids) -> void
bulkPublishPosts(ids) -> void
bulkUnpublishPosts(ids) -> void

// Authentication
login(email, password) -> { token, user }
logout() -> void
isAuthenticated() -> boolean
```

## Data Model

### BlogPost Type
```typescript
interface BlogPost {
  id: string
  slug: string
  language: 'it' | 'en'
  title: string
  excerpt: string
  content: string
  author: string
  readTime: string
  tags: string[]
  keywords: string[]
  image?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  canonicalUrl?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  editorType?: 'markdown' | 'wysiwyg'
}
```

## Workflow Example

### Creating a Blog Post:

1. Navigate to `/admin/posts/new`
2. Fill in basic information:
   - Title: "How to Use TypeScript"
   - Slug: auto-generated as "how-to-use-typescript"
   - Author: "Domenico Jordan"
   - Excerpt: "Learn TypeScript basics..."
3. Upload featured image (auto-optimized to WebP)
4. Add tags: "typescript", "tutorial", "programming"
5. Write content in Markdown or WYSIWYG editor
6. Add SEO metadata (optional)
7. Click "Preview" to review
8. Click "Publish" to make live

### Bulk Publishing Draft Posts:

1. Go to `/admin/posts`
2. Check checkboxes for all draft posts
3. Click "Publish" in bulk actions bar
4. All selected posts are published immediately

### Managing Tags:

1. Go to `/admin/tags`
2. View all tags sorted by usage
3. Search for specific tag
4. Click tag to see all posts with that tag
5. Edit posts directly from filtered view

## Best Practices

### Images:
- Upload images directly for automatic optimization
- Use descriptive filenames
- Featured images should be landscape (16:9 recommended)
- OG images should be 1200x630 for best social media display

### Tags:
- Use lowercase for consistency
- Be specific but not too narrow
- Reuse existing tags when possible (autocomplete helps)
- Aim for 3-5 tags per post

### SEO:
- Write unique meta descriptions (150-160 characters)
- Use target keywords naturally
- Fill canonical URL only for republished content
- Custom OG images increase social sharing engagement

### Content:
- Use Markdown for technical posts (better code formatting)
- Use WYSIWYG for content-heavy posts
- Preview before publishing
- Save drafts frequently

## Keyboard Shortcuts

**Tag Input:**
- `Enter` - Add tag
- `Backspace` (empty input) - Remove last tag
- `Click` autocomplete item - Add suggested tag

## Security

- All admin routes require JWT authentication
- Tokens stored in localStorage with key `authToken`
- Expired tokens redirect to login
- Image uploads limited to 5MB
- Only image files allowed for upload
- File type validation on both client and server

## Troubleshooting

**Problem**: Images not showing in blog
**Solution**: Ensure image URLs start with `http://` or `https://`

**Problem**: Tags not saving
**Solution**: Check that tags is an array, not comma-separated string

**Problem**: Preview shows old content
**Solution**: Clear sessionStorage or close and reopen preview

**Problem**: Can't upload image
**Solution**: Check file size (<5MB) and format (JPEG, PNG, GIF, WebP)

**Problem**: Bulk actions not working
**Solution**: Ensure at least one post is selected with checkbox
