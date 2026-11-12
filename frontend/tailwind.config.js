/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#090B10",
        surface: "#171A20",
        surfaceElevated: "#1F242D",
        gold: {
          DEFAULT: "#C9A45C",
          light: "#E4C580",
          dark: "#9E7B36",
        },
        ivory: "#F1E9D8",
      },
      fontFamily: {
        sans: ["'Inter'", "'Cairo'", "system-ui", "sans-serif"],
        display: ["'Cinzel'", "'Cairo'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        goldGlow: "0 0 35px -5px rgba(201, 164, 92, 0.22)",
        goldBorder: "0 0 0 1px rgba(201, 164, 92, 0.35)",
      },
    },
  },
  plugins: [],
};
