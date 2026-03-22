import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-soft": "var(--surface-soft)",
        "surface-strong": "var(--surface-strong)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        "accent-soft": "var(--accent-soft)",
        success: "var(--success)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(61, 39, 24, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 80% 0%, rgba(176, 124, 71, 0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
