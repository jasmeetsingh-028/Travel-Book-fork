/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"],
    },

    extend: {
      // colors used in this project;
      colors:
      {
        primary:"#05B6D3",
        secondary:"#EF863E",
      },
      // BELOW IMPORTED THE SIGN IN AND SIGN UP IMAGES;
      backgroundImage:{
        'login-bg-img':"url('./src/assets/images/bg-image.png')",
        'signup-bg-img':"url('./src/assets/images/sign-up.png')",
      }
    },
  },
  plugins: [],
}

