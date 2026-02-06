/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f1f7ff",
          100: "#dbe9ff",
          200: "#b5d3ff",
          300: "#86b4ff",
          400: "#5591ff",
          500: "#2c6cff",
          600: "#1b4fd6",
          700: "#163fa8",
          800: "#162f7a",
          900: "#152757"
        }
      },
      boxShadow: {
        card: "0 6px 18px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
