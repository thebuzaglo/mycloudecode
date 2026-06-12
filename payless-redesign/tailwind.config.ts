import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
        },
        cyan: {
          DEFAULT: "hsl(var(--cyan))",
        },
        navy: {
          950: "hsl(var(--navy-950))",
          900: "hsl(var(--navy-900))",
          850: "hsl(var(--navy-850))",
          800: "hsl(var(--navy-800))",
        },
      },
      fontFamily: {
        sans: ["Heebo", "Assistant", "system-ui", "sans-serif"],
        display: ["Heebo", "Assistant", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        "glow-gold": "0 0 40px -8px hsl(var(--gold) / 0.45)",
        "glow-cyan": "0 0 40px -8px hsl(var(--cyan) / 0.4)",
        "glow-soft": "0 8px 32px hsl(200 42% 8% / 0.45)",
        "card-deep": "0 18px 50px -18px hsl(200 60% 3% / 0.7)",
        "inner-line": "inset 0 1px 0 0 hsl(0 0% 100% / 0.06)",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, hsl(43 55% 65%) 0%, hsl(40 60% 55%) 100%)",
        "gradient-brand": "linear-gradient(135deg, hsl(200 42% 21%) 0%, hsl(43 55% 65%) 100%)",
        "gradient-hot": "linear-gradient(135deg, hsl(0 84% 60%) 0%, hsl(25 95% 53%) 100%)",
        "gradient-cyber": "linear-gradient(135deg, hsl(270 70% 50%) 0%, hsl(190 100% 50%) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(50%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee 55s linear infinite",
        "pulse-glow": "pulse-glow 3.2s ease-in-out infinite",
        shimmer: "shimmer 5s linear infinite",
        "float-y": "float-y 7s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        ticker: "ticker 45s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
