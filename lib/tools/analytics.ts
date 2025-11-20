import ReactGA from 'react-ga4';

// Google Analytics Measurement ID
// Replace with your actual GA4 Measurement ID from Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

/**
 * Initialize Google Analytics 4
 */
export const initGA = (): void => {
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true, // GDPR compliance - anonymize IP addresses
      },
    });
    console.log('Google Analytics initialized');
  } else {
    console.warn('Google Analytics not initialized - missing VITE_GA_MEASUREMENT_ID');
  }
};

/**
 * Track page views
 */
export const trackPageView = (path: string): void => {
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (category: string, action: string, label?: string): void => {
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, action: string): void => {
  trackEvent('Tool Usage', action, toolName);
};
