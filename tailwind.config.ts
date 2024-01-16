import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        desktop: "1400px",
      },
      colors: {
        primary: "#635FC7",
        "primary-hover": "#A8A4FF",
        danger: "#EA5555",
        "danger-hover": "#FF9898",
        "light-border": "#E4EBFA",
        "dark-border": "#3E3F4E",
        black: "#000112",
        white: "#FFFFFF",
        "very-dark-grey": "#20212C",
        "dark-grey": "#2B2C37",
        "medium-grey": "#828FA3",
        "light-grey": "#F4F7FD",
        cyan: "#49C4E5",
        green: "#67E2AE",
      },
    },
    boxShadow: {
      "surface-dark": "0px 4px 6px 0px rgba(54, 78, 126, 0.10)",
      "surface-light": "0px 4px 6px 0px rgba(54, 78, 126, 0.10)",
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};

export default config;
