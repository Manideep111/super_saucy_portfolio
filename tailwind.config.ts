import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0612",
        surface: {
          DEFAULT: "#0d0818",
          elevated: "#140b24",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          hover: "rgba(168,85,247,0.4)",
        },
        primary: {
          DEFAULT: "#a855f7",
          light: "#c084fc",
          dark: "#7c3aed",
        },
        accent: "#c026d3",
        text: {
          primary: "#ffffff",
          secondary: "rgba(255,255,255,0.7)",
          muted: "rgba(255,255,255,0.5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(168,85,247,0.3)",
        "glow-md": "0 0 40px rgba(168,85,247,0.4)",
        "glow-lg": "0 0 80px rgba(168,85,247,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
