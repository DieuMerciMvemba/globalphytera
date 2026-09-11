/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500
          dark: '#059669',
          light: '#34D399',
        },
        phytera: {
          bg: '#0B1120', // Very dark blue
          card: '#151F32', // Card background
          border: '#1E293B',
          accent: '#0EA5E9', // Sky blue for tech feel
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
