import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: {
          50: '#f3f5f7',
          100: '#e2e7ec',
          200: '#c9d2db',
          300: '#a3b1c1',
          400: '#7488a0',
          500: '#526a85',
          600: '#3f536d',
          700: '#33445a',
          800: '#26374a',
          900: '#1a2634',
          950: '#0f1720',
        },
        signal: {
          amber: '#f5a623',
          red: '#ef4444',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};

export default config;