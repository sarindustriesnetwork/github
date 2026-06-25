import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f2ff",
          100: "#ebe7ff",
          500: "#6c5cff",
          600: "#5b4def",
          700: "#493bd8",
          950: "#160f45"
        }
      },
      boxShadow: {
        premium: "0 24px 70px rgba(15, 23, 42, 0.12)",
        glow: "0 24px 70px rgba(108, 92, 255, 0.35)"
      },
      borderRadius: {
        premium: "28px"
      }
    }
  },
  plugins: []
};

export default config;
