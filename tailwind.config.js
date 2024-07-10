/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#DCBFFF",
        // primary: "#F2E8FF",
        // "primary-hover": "#51258F",
        // secondary: "#482579",
        // posPurple: "#5B2676",
        warning: "#ffba08",
        pinkRed: "#eb3b5a",
        primaryLight: "#e2f2ff",
        light: "#F7F8FC",
        black: {
          DEFAULT: "#070f22",
          special: "#2D2E2E",
        },
      },
      dropShadow: {
        primary: "0 6px 12px rgba(229, 212, 255, 0.6)",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "custom-image":
          "url('https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1670309928/mh6hpcqrlb4ts68ia1gg.jpg')",
        "blue-gradient": `linear-gradient(46.87deg, #5576ED 0%, #6FFD96 96.94%)`,
        "red-gradient": `linear-gradient(221deg, rgba(159,13,0,1) 24%, rgba(207,0,0,1) 58%, rgba(153,23,0,1) 100%)`,
        // wave: `url('/src/assets/images/wave.svg')`,
      },
    },
  },
  plugins: [],
};
