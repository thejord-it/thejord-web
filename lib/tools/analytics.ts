// Google Analytics 4 tracking utilities
// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Track page views (called automatically by gtag config)
 */
export const trackPageView = (path: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
    })
  }
}

/**
 * Track custom events
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * Track tool usage events
 */
export const trackToolUsage = (
  toolName: string,
  action: string,
  label?: string
): void => {
  trackEvent(action, 'Tool Usage', `${toolName}${label ? ` - ${label}` : ''}`)
}

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackEvent('button_click', 'Engagement', `${buttonName}${location ? ` - ${location}` : ''}`)
}

/**
 * Track copy to clipboard actions
 */
export const trackCopy = (contentType: string, tool?: string): void => {
  trackEvent('copy_to_clipboard', 'Tool Action', `${contentType}${tool ? ` - ${tool}` : ''}`)
}

/**
 * Track file uploads
 */
export const trackFileUpload = (fileType: string, size: number, tool: string): void => {
  trackEvent('file_upload', 'Tool Action', `${tool} - ${fileType}`, size)
}

/**
 * Track errors
 */
export const trackError = (errorType: string, errorMessage: string, tool?: string): void => {
  trackEvent('error', 'Error', `${errorType}${tool ? ` - ${tool}` : ''}: ${errorMessage}`)
}

// Deprecated function (kept for backward compatibility)
export const initGA = (): void => {
  // GA is initialized via GoogleAnalytics component in layout
  console.warn('initGA() is deprecated. GA4 is initialized automatically via GoogleAnalytics component.')
}
