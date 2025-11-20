/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoDark: "#050816",
        neoCard: "rgba(15, 23, 42, 0.85)",
        neoAccent: "#22d3ee",
      },
      boxShadow: {
        neo: "0 0 25px rgba(34, 211, 238, 0.35)",
      },
    },
  },
  plugins: [],
};
