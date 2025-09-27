import defaultTheme from "tailwindcss/defaultTheme";
import tailwindScrollbar from "tailwind-scrollbar";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Scan all source files for Tailwind classes
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans], // Extends default sans-serif fonts with Inter
      },
      colors: {
        primary: "#3b82f6", // Primary brand color (blue)
        secondary: "#f3f4f6", // Secondary light color (gray)
      },
    },
  },
  plugins: [
    tailwindScrollbar, // Adds custom scrollbar styling
    forms, // Enhances form element styles
    typography, // Provides typography utilities for rich text formatting
  ],
};
