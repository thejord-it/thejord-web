// Google Analytics 4 tracking utilities - Specific events for better insights
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
 * Generic event tracking (internal use)
 */
const sendEvent = (eventName: string, params: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// ============================================
// TOOL-SPECIFIC EVENTS
// ============================================

/**
 * Track tool action with specific parameters
 */
export const trackToolAction = (
  toolName: string,
  actionType: string,
  params?: {
    inputSize?: number
    outputFormat?: string
    result?: 'success' | 'error'
    details?: string
  }
): void => {
  sendEvent('tool_action', {
    tool_name: toolName,
    action_type: actionType,
    input_size: params?.inputSize,
    output_format: params?.outputFormat,
    result: params?.result || 'success',
    details: params?.details
  })
}

/**
 * Track JSON formatting
 */
export const trackJsonFormat = (
  action: 'format' | 'minify' | 'convert',
  inputSize: number,
  outputFormat?: string
): void => {
  sendEvent('json_format', {
    action,
    input_size: inputSize,
    output_format: outputFormat
  })
}

/**
 * Track regex testing
 */
export const trackRegexTest = (
  patternLength: number,
  hasFlags: boolean,
  matchCount: number
): void => {
  sendEvent('regex_test', {
    pattern_length: patternLength,
    has_flags: hasFlags,
    match_count: matchCount
  })
}

/**
 * Track UUID generation
 */
export const trackUuidGenerate = (
  version: string,
  quantity: number
): void => {
  sendEvent('uuid_generate', {
    uuid_version: version,
    quantity
  })
}

/**
 * Track content copy with tool context
 */
export const trackContentCopy = (
  toolName: string,
  contentType: string,
  contentSize?: number
): void => {
  sendEvent('content_copy', {
    tool_name: toolName,
    content_type: contentType,
    content_size: contentSize
  })
}

/**
 * Track tool session complete (user finished using a tool)
 */
export const trackToolSessionComplete = (
  toolName: string,
  actionsCount: number,
  duration?: number
): void => {
  sendEvent('tool_session_complete', {
    tool_name: toolName,
    actions_count: actionsCount,
    session_duration: duration
  })
}

/**
 * Track tool errors with context
 */
export const trackToolError = (
  toolName: string,
  errorType: string,
  errorMessage?: string
): void => {
  sendEvent('tool_error', {
    tool_name: toolName,
    error_type: errorType,
    error_message: errorMessage?.slice(0, 100) // Limit message length
  })
}

/**
 * Track blog read complete (scroll >80%)
 */
export const trackBlogReadComplete = (
  slug: string,
  readTimeMinutes: number
): void => {
  sendEvent('blog_read_complete', {
    article_slug: slug,
    read_time: readTimeMinutes
  })
}

/**
 * Track external link clicks
 */
export const trackExternalLinkClick = (
  destination: string,
  linkText?: string
): void => {
  sendEvent('external_link_click', {
    destination_url: destination,
    link_text: linkText
  })
}

// ============================================
// LEGACY FUNCTIONS (for backward compatibility)
// ============================================

/**
 * @deprecated Use trackToolAction instead
 */
export const trackToolUsage = (
  toolName: string,
  action: string,
  label?: string
): void => {
  trackToolAction(toolName, action, { details: label })
}

/**
 * @deprecated Use trackToolAction instead
 */
export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackToolAction(location || 'unknown', 'button_click', { details: buttonName })
}

/**
 * @deprecated Use trackContentCopy instead
 */
export const trackCopy = (contentType: string, tool?: string): void => {
  trackContentCopy(tool || 'unknown', contentType)
}

/**
 * Track file uploads
 */
export const trackFileUpload = (fileType: string, size: number, tool: string): void => {
  sendEvent('file_upload', {
    tool_name: tool,
    file_type: fileType,
    file_size: size
  })
}

/**
 * @deprecated Use trackToolError instead
 */
export const trackError = (errorType: string, errorMessage: string, tool?: string): void => {
  trackToolError(tool || 'unknown', errorType, errorMessage)
}

// Deprecated function (kept for backward compatibility)
export const initGA = (): void => {
  // GA is initialized via GoogleAnalytics component in layout
  console.warn('initGA() is deprecated. GA4 is initialized automatically via GoogleAnalytics component.')
}
