/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff7e8",
        "cream-soft": "#fffbf2",
        primary: "#0b4f45",
        teal: "#11715f",
        leaf: "#1d9448",
        gold: "#f6aa2d",
        orange: "#ef7d20",
        charcoal: "#17221f",
        muted: "#68736e",
      },
      boxShadow: {
        soft: "0 8px 20px rgba(11, 79, 69, 0.08)",
        card: "0 10px 28px rgba(40, 31, 16, 0.09)",
      },
    },
  },
  plugins: [],
};
