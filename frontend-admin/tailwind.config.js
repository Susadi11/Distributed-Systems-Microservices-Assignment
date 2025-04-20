/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Fixed path to include subfolders
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: "#a5d8ff",
          green: "#b2f2bb",
          yellow: "#fff3bf",
          pink: "#ffdeeb",
          purple: "#d0bfff",
          red: "#ffc9c9",
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        deeper: "0 6px 30px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
