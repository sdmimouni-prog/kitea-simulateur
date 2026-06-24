import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kitea: {
          red: "#e30613",
          deep: "#a80912",
          ink: "#101012",
          sand: "#f6efe6",
          sky: "#68c7e9",
          leaf: "#2c7a55"
        }
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"]
      },
      boxShadow: {
        touch: "0 18px 48px rgba(16, 16, 18, 0.18)",
        red: "0 16px 36px rgba(227, 6, 19, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
