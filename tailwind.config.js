/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
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
        dark: {
          primary: "#033e49",
          secondary: "#c26b32",
          bg: "#121212",
          card: "#1e1e1e",
          text: "#e0e0e0",
        }
      },
      // BELOW IMPORTED THE SIGN IN AND SIGN UP IMAGES;
      backgroundImage: {
        'login-bg-img': "url('/assets/images/bg-image.png')",
        'signup-bg-img': "url('/assets/images/sign-up.png')",
      }      
    },
  },
  plugins: [],
}

