/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink:       '#E8547A',
        'pink-light':'#F9D0DC',
        'pink-deep': '#C23060',
        cream:      '#FFF8F9',
        dark:       '#1A0A10',
        dark2:      '#2A1020',
        muted:      '#9E7080',
        sushi: {
          green:    '#2ECC71',
          orange:   '#F39C12',
          red:      '#E74C3C',
          blue:     '#3498DB',
        }
      },
      fontFamily: {
        serif: ['Noto Serif JP', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
