/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        'monks-primary': '#1C1C1C',
        'secondary-color': '#FFFFFF',
        'button-color': '#E6007E',
        'medium-gray': '#A0A0A0',
      },
    },
  },
  plugins: [],
}
