import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream backgrounds
        cream: {
          50: "#FBF8F1",
          100: "#F6F2E9",
          200: "#EFE8D9",
          300: "#E7DECB",
        },
        // Forest / olive green — primary brand colour
        forest: {
          DEFAULT: "#4B5F27",
          400: "#6E8A3C",
          500: "#5C7431",
          600: "#4B5F27",
          700: "#3D4E20",
          800: "#2F3C18",
        },
        // Coral / salmon accent
        coral: {
          DEFAULT: "#E27A5C",
          400: "#EA8E72",
          500: "#E27A5C",
          600: "#D2694B",
        },
        // Warm amber (Paw It Forward, paw mark)
        amber: {
          DEFAULT: "#E8A33D",
          500: "#E8A33D",
          600: "#D68F2A",
        },
        // Dark bark brown for text
        bark: {
          DEFAULT: "#3D2B22",
          500: "#6B5445",
          600: "#4F3A2E",
          700: "#3D2B22",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-fredoka)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(61, 43, 34, 0.15)",
        soft: "0 4px 20px -8px rgba(61, 43, 34, 0.12)",
        nav: "0 -4px 24px -10px rgba(61, 43, 34, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
