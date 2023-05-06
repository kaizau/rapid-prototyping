/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{html,ejs,js,ts}"],
  theme: {
    extend: {
      scale: {
        200: "2",
        300: "3",
        400: "4",
        500: "5",
      },
      transitionProperty: {
        text: "font-size",
      },
    },
  },
};
