import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05080C",
          900: "#0C1118",
          850: "#111821",
          800: "#151E2A",
          700: "#253143"
        },
        tech: {
          blue: "#38BDF8",
          sky: "#2BB9F1",
          green: "#22C55E",
          yellow: "#FACC15",
          red: "#EF4444",
          violet: "#8B5CF6"
        }
      },
      boxShadow: {
        panel: "0 18px 60px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.025)"
      }
    }
  },
  plugins: []
};

export default config;
