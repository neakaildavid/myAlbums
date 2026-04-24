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
        accent: '#C4703A',
        warm: {
          50: '#F9F8F6',
          100: '#F2F0EC',
          200: '#E5E2DD',
          300: '#D0CBC4',
          400: '#B5AEA6',
          500: '#7A7570',
          600: '#5A5550',
          700: '#3D3A36',
          800: '#2A2826',
          900: '#1C1A18',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-dm-mono)', '"Courier New"', 'monospace'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
