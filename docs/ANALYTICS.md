# Google Analytics 4 Integration Guide

## Overview

THEJORD.it uses Google Analytics 4 for tracking user interactions while maintaining privacy-first principles with IP anonymization.

## Setup

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property (or use existing)
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variables

Add to your `.env.local` (production) or Vercel environment variables:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** The `NEXT_PUBLIC_` prefix makes it available in the browser.

### 3. Verification

Analytics is automatically initialized when the environment variable is set. Check browser console for:
- gtag script loaded successfully
- No errors in Network tab for `google-analytics.com` requests

## Available Tracking Functions

Import from `@/lib/tools/analytics`:

```typescript
import {
  trackEvent,
  trackToolUsage,
  trackButtonClick,
  trackCopy,
  trackFileUpload,
  trackError
} from '@/lib/tools/analytics'
```

### Track Custom Events

```typescript
trackEvent('custom_action', 'Category', 'Label', value)
```

### Track Tool Usage

```typescript
// When user interacts with a tool
trackToolUsage('JSON Formatter', 'format_json', 'success')
trackToolUsage('Base64', 'encode', 'text')
```

### Track Button Clicks

```typescript
trackButtonClick('Copy to Clipboard', 'JSON Formatter')
trackButtonClick('Load Example', 'Regex Tester')
```

### Track Copy Actions

```typescript
trackCopy('JSON', 'JSON Formatter')
trackCopy('Base64', 'Base64 Tool')
```

### Track File Uploads

```typescript
trackFileUpload('image/png', 1024000, 'Base64 Tool') // size in bytes
```

### Track Errors

```typescript
trackError('validation_error', 'Invalid JSON input', 'JSON Formatter')
trackError('network_error', 'Failed to fetch data', 'Blog')
```

## Example Implementation

### In a Tool Component

```typescript
'use client'

import { trackToolUsage, trackCopy, trackError } from '@/lib/tools/analytics'

export default function MyTool() {
  const handleFormat = () => {
    try {
      // ... format logic
      trackToolUsage('MyTool', 'format', 'success')
    } catch (error) {
      trackError('format_error', error.message, 'MyTool')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    trackCopy('formatted_output', 'MyTool')
  }

  return (
    // ... component JSX
  )
}
```

## Privacy Considerations

1. **IP Anonymization**: Automatically enabled via `anonymize_ip: true` in configuration
2. **No PII**: Never track personally identifiable information
3. **Client-side Only**: All tools process data locally, analytics only tracks interactions
4. **Opt-out**: Users can block via browser settings or ad blockers

## Events Reference

### Automatically Tracked

- **page_view**: Tracked automatically on page navigation
- **scroll**: Tracked automatically (GA4 default)
- **click**: Tracked automatically (GA4 enhanced measurement)

### Custom Events

| Event Name | Category | Use Case |
|------------|----------|----------|
| `tool_usage` | Tool Usage | When user performs main tool action |
| `button_click` | Engagement | Button/link clicks |
| `copy_to_clipboard` | Tool Action | Copy operations |
| `file_upload` | Tool Action | File upload operations |
| `error` | Error | Error tracking |

## Debugging

### Local Development

Analytics is **disabled** by default in development (no `NEXT_PUBLIC_GA_MEASUREMENT_ID` set).

To test analytics locally:

1. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to `.env.local`
2. Use a test GA4 property (don't pollute production data)
3. Open browser DevTools → Network tab → Filter by "google-analytics"
4. Trigger events and verify requests are sent

### Production

Use [Google Analytics DebugView](https://support.google.com/analytics/answer/7201382):

1. Install Google Analytics Debugger Chrome extension
2. Enable debug mode
3. View real-time events in GA4 DebugView

## Best Practices

1. **Be Specific**: Use descriptive labels for events
   - ✅ `trackToolUsage('JSON Formatter', 'format', 'large_file_500kb')`
   - ❌ `trackToolUsage('tool', 'action', 'thing')`

2. **Track User Intent**: Focus on valuable interactions
   - Format/validate actions
   - Copy to clipboard
   - File uploads
   - Error conditions

3. **Don't Over-Track**: Avoid tracking every keystroke or mouse move
   - Track completed actions, not intermediate states

4. **Use Consistent Naming**: Follow existing event naming conventions
   - Snake_case for events: `tool_usage`, `button_click`
   - Title Case for categories: "Tool Usage", "Engagement"

## Troubleshooting

### Analytics Not Loading

1. Check environment variable is set correctly
2. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` starts with `G-`
3. Check browser console for script loading errors
4. Disable ad blockers/privacy extensions temporarily

### Events Not Appearing

1. Wait 24-48 hours for data processing (use DebugView for real-time)
2. Check event names match GA4 conventions (lowercase, underscores)
3. Verify gtag is initialized: `console.log(window.gtag)`

## Resources

- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267744)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
