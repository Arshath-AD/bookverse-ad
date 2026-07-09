/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        purple: "var(--color-purple)",
        green: "var(--color-green)",
        red: "var(--color-red)",
      },
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
        outfit: ['Outfit', 'sans-serif'],
      },
      borderWidth: {
        'comic': '4px',
      },
      boxShadow: {
        'comic': '6px 6px 0px 0px var(--color-ink)',
        'comic-hover': '10px 10px 0px 0px var(--color-ink)',
        'comic-sm': '4px 4px 0px 0px var(--color-ink)',
      }
    },
  },
  plugins: [],
}
