import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // Primary Blue
          700: "#1d4ed8", // Deep Blue
          800: "#1e40af",
          900: "#1e3a8a",
        },
        yellow: {
          bright: "#facc15", // Bright Yellow Accent
          warm: "#fde68a",
          amber: "#f59e0b",
        },
        navy: {
          900: "#0f172a", // Dark Navy Text / Accent
          950: "#0b0f19",
        },
        bg: {
          light: "#f8fafc",
          dark: "#0b0d12",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 20px 50px rgba(15, 23, 42, 0.08)",
        "glass-sm": "0 10px 30px rgba(15, 23, 42, 0.05)",
        "glass-hover": "0 25px 60px rgba(37, 99, 235, 0.12)",
      },
      borderRadius: {
        card: "20px",
        glass: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
