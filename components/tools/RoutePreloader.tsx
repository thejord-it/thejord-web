import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * RoutePreloader component
 * Preloads likely next routes based on current location to improve perceived performance
 */
export function RoutePreloader() {
  const location = useLocation()

  useEffect(() => {
    // Preload likely routes based on current page
    const preloadRoutes = () => {
      // If on homepage, preload most popular tools
      if (location.pathname === '/') {
        import('../pages/JsonFormatter')
        import('../pages/Base64Tool')
        import('../pages/RegexTester')
      }

      // If on a tool page, preload other commonly used tools
      if (location.pathname.includes('/json-formatter')) {
        import('../pages/Base64Tool')
        import('../pages/JsonSchemaConverter')
      }

      if (location.pathname.includes('/cron-builder')) {
        import('../pages/JsonSchemaConverter')
      }

      // Always preload About and Blog pages (lightweight)
      if (location.pathname === '/') {
        setTimeout(() => {
          import('../pages/About')
          import('../pages/Blog')
        }, 2000) // Delay 2s to not interfere with critical resources
      }
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRoutes)
    } else {
      setTimeout(preloadRoutes, 1)
    }
  }, [location.pathname])

  return null
}
