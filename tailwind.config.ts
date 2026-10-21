import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { cream: "#FBF5EA", clay: "#B5472B", claydark: "#8F3720", ink: "#2B2118", sand: "#EADFC8" },
    fontFamily: { serif: ["Georgia", "serif"] } } },
} satisfies Config;
