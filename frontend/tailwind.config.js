/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#faf8ff',
          card: '#ffffff',
          dim: '#ebedff',
          border: '#d0c6ae',
        },
        navy: {
          DEFAULT: '#0d1a3c',
          light: '#242f52',
          muted: '#4d4634',
        },
        yellow: {
          DEFAULT: '#ffd84d',
          fixed: '#ffe07e',
          dark: '#725c00',
        },
        rust: {
          DEFAULT: '#964900',
          container: '#ffd2b7',
        },
        teal: {
          DEFAULT: '#00658b',
          container: '#c5e7ff',
        },
        sky: {
          DEFAULT: '#52c4fd',
        },
        orange: {
          DEFAULT: '#f4801f',
        },
        mustard: {
          DEFAULT: '#e9c339',
        }
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', '"Bricolage Grotesque"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'pop': '4px 4px 0px #0d1a3c',
        'pop-lg': '6px 6px 0px #0d1a3c',
        'pop-sm': '2px 2px 0px #0d1a3c',
        'pop-sky': '4px 4px 0px #52c4fd',
        'pop-orange': '4px 4px 0px #f4801f',
        'pop-yellow': '4px 4px 0px #ffd84d',
      }
    },
  },
  plugins: [],
}
