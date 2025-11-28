// Placeholder image generator with colored gradients

const GRADIENT_COLORS = [
  ['#667eea', '#764ba2'], // Purple
  ['#f093fb', '#f5576c'], // Pink
  ['#4facfe', '#00f2fe'], // Blue
  ['#43e97b', '#38f9d7'], // Green
  ['#fa709a', '#fee140'], // Yellow-Pink
  ['#30cfd0', '#330867'], // Teal-Purple
  ['#a8edea', '#fed6e3'], // Pastel
  ['#ff9a56', '#ff6a88'], // Orange-Pink
  ['#ffecd2', '#fcb69f'], // Peach
  ['#ff6e7f', '#bfe9ff'], // Red-Blue
]

/**
 * Generate a deterministic color gradient based on query string
 */
function getGradientForQuery(query: string): string[] {
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % GRADIENT_COLORS.length
  return GRADIENT_COLORS[index]
}

/**
 * Generate placeholder image URL with SVG gradient
 */
function generatePlaceholderUrl(query: string, width: number, height: number): string {
  const [color1, color2] = getGradientForQuery(query)
  const text = query.slice(0, 20)

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-family="Arial, sans-serif" opacity="0.3">
        ${text}
      </text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Search for placeholder images based on query
 */
export async function searchUnsplashImages(query: string, perPage: number = 10) {
  // Generate multiple placeholder variations with different color schemes
  const placeholders = []

  for (let i = 0; i < Math.min(perPage, 6); i++) {
    const variation = `${query}-${i}`
    placeholders.push({
      id: `placeholder-${i}`,
      urls: {
        regular: generatePlaceholderUrl(variation, 1920, 1080),
        small: generatePlaceholderUrl(variation, 800, 450),
        thumb: generatePlaceholderUrl(variation, 400, 225),
      },
      alt_description: query,
      user: {
        name: 'Generated',
        username: 'placeholder',
      },
      links: {
        download_location: '#',
      }
    })
  }

  return placeholders
}

/**
 * Trigger download tracking (not needed for local placeholders)
 */
export async function trackUnsplashDownload(downloadLocation: string) {
  // No tracking needed for local SVG placeholders
  return
}

/**
 * Generate search query from post tags and title
 */
export function generateSearchQuery(title: string, tags: string[]): string {
  // Use first tag if available, otherwise extract keywords from title
  if (tags.length > 0) {
    return tags[0]
  }

  // Extract meaningful words from title (remove common words)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
  const words = title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 2)

  return words.join(' ') || 'technology'
}
