import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // THEJORD accessible color palette
        primary: {
          DEFAULT: '#3B82F6', // Blue - accessible for colorblind users
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#06B6D4', // Cyan
          light: '#22D3EE',
        },
        accent: {
          DEFAULT: '#10B981', // Green
          light: '#34D399',
        },
        bg: {
          darkest: '#0A0F1A',
          dark: '#111827',
          elevated: '#374151',
          surface: '#1F2937',
          DEFAULT: '#1F2937',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#D1D5DB',
          muted: '#9CA3AF',
        },
        border: {
          DEFAULT: '#374151',
          light: '#4B5563',
        },
      },
    },
  },
  plugins: [],
}

export default config
