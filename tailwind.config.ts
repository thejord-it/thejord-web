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
        // THEJORD color palette (from existing project)
        primary: {
          DEFAULT: '#00C9FF',
          light: '#4DD8FF',
          dark: '#0099CC',
        },
        secondary: {
          DEFAULT: '#FF00E5',
          light: '#FF4DEB',
          dark: '#CC00B8',
        },
        bg: {
          darkest: '#0A0F1A',
          dark: '#151B2B',
          surface: '#1E2637',
          DEFAULT: '#1E2637',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8C5D6',
          muted: '#6B7A90',
        },
        border: '#2A3447',
      },
    },
  },
  plugins: [],
}

export default config
