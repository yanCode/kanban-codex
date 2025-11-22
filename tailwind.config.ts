import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b7d0ff",
          300: "#8bb2ff",
          400: "#5a8aff",
          500: "#416ef5",
          600: "#2f52d4",
          700: "#2740aa",
          800: "#233784",
          900: "#202f68",
        },
        graphite: {
          50: "#f8f9fb",
          100: "#eef1f6",
          200: "#d7dfe8",
          300: "#bcc7d4",
          400: "#93a2b4",
          500: "#6e7f93",
          600: "#586678",
          700: "#46515f",
          800: "#343c45",
          900: "#232930",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
        subtle: "0 1px 2px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
