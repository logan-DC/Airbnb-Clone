/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    extend: {
      boxShadow: {
        "3xl": "-1px 3.5px 5px 1px #CFCFD1",
        "2xl": "0 10px 20px rgba(0, 0, 0, 0.2)",
        /*  "inset-shadow": {
          "-10px-0px-9px-1px": "#EFEFEF",
          "10px-0px-10px-1px": "#EFEFEF",
        }, */
      },
      colors: {
        pink: "#ff385c",
        grey: "#717171;",
        "grey-light": "#B3B3B3",
        "grey-dim": "#DBDBDB",
      },
      gridTemplateColumns: {
        "four-col": "repeat(4, minmax(10rem,18.87rem))",
      },
      backFaceVisibility: ["hidden"],
      keyframes: {
        moveUp: {
          "0%": { transform: "translate(0rem,0rem)" },
          "100%": { transform: "translate(0rem, -5.8rem)" },
        },
        moveUpHouse: {
          "0%": { transform: "translate(0rem,0rem)" },
          "100%": { transform: "translate(0rem, -4.5rem)" },
        },
        moveDown: {
          "0%": { transform: "translate(0rem,0rem)" },
          "100%": { transform: "translate(0rem, 0rem)" },
        },
      },
      animation: {
        moveUp: "moveUp 0.3s forwards ",
        moveDown: "moveDown 0.3s forwards ",
        moveUpHouse: "moveUpHouse 0.3s forwards ",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newStyle = {
        ".border-blur": {
          "border-left-width": "10px",
          "border-right-width": "10px",
          "border-color": "transparent",
          "border-left-style": "inset",
          "border-right-style": "inset",
          "backdrop-filter": "blur(20px)",
          position: "absolute",
          // top: "0",
          // bottom: "0",
          left: "0",
          right: "0",
          /*  "border-image":
            "linear-gradient(to right, rgba(255, 255, 255, 0), #e5e7eb, rgba(255, 255, 255, 0)) 1", */
        },
        ".remove-scrollbar": {
          "::-webkit-scrollbar": {
            display: "none", // Hides the scrollbar in WebKit browsers
          },
        },
      };

      addUtilities(newStyle);
    }),
  ],
};
