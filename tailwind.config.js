/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'puzzle-primary': '#FF6B6B',
        'puzzle-secondary': '#4ECDC4',
        'puzzle-accent': '#45B7D1',
        'puzzle-success': '#96CEB4',
        'puzzle-warning': '#FFEAA7',
      },
      fontFamily: {
        'playful': ['Comic Sans MS', 'cursive'],
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'slide': 'slide 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 