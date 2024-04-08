/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'brown-900': '#1f110d',
        'brown-700': '#24110a',
        'brown-500': '#2C1914',
        'brown-300': '#40241d',
        
        'white-50%': 'rgba(255,255,255,0.7)' 
      },
      borderColor: {
        'brown-900': '#1f110d',
        'brown-700': '#24110a',
        'brown-500': '#2C1914'
      },
      fontFamily: {
        'fredoka-one': ['Fredoka One', 'sans-serif']
      },
      maxWidth: {
        '500': '500px',
        '768': '768px',
        '900': '900px'
      },
      minWidth: {
        '900': '1000px'
      }
    },
  },
  plugins: [],
}

