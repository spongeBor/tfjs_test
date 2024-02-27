/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-whiteNoise": "linear-gradient(-90deg, #E1E6EC 2%, #F0F4F7 96%), radial-gradient(at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.5) 200%)" 
      },
      animation: {
        "home-shrink": "2s forwards 2s home-shrink",
        "home-text-blend": "3s forwards 0.2s home-text-blend",
      },
      keyframes: {
        "home-shrink": {
          "100%": {height: "20em"},
        },
        "home-text-blend": {
          "100%": {"letter-spacing": "20px", filter: "blur(1px)"}
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
  daisyui: {
    logs: false,
    themes: true,
    themes: ["light", "dark"]
  }
};
