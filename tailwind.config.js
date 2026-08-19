/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          950: "#05070c",
          900: "#080c14",
          850: "#0c1320",
          800: "#101a2c",
          700: "#182742",
          600: "#243b66",
          500: "#3b82f6",
          cyan: "#00f0ff",
          indigo: "#6366f1",
          purple: "#a855f7",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "galaxy-gradient": "linear-gradient(135deg, #05070c 0%, #0c1320 50%, #080c14 100%)",
        "galaxy-glow": "radial-gradient(circle at 50% 20%, rgba(0, 240, 255, 0.15), transparent 70%)",
        "galaxy-card": "linear-gradient(180deg, rgba(24, 39, 66, 0.4) 0%, rgba(16, 26, 44, 0.2) 100%)",
      },
      boxShadow: {
        "galaxy-cyan": "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "galaxy-indigo": "0 0 25px -5px rgba(99, 102, 241, 0.3)",
        "galaxy-purple": "0 0 25px -5px rgba(168, 85, 247, 0.3)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
