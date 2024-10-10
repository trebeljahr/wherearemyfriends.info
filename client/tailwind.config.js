/* eslint-disable import/no-anonymous-default-export */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  safelist: ["bg-cyan-600", "bg-red-400", "bg-slate-500", "bg-green-500"],
  plugins: [require("@tailwindcss/typography")],
};
