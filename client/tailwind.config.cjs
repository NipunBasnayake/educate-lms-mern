// tailwind.config.js
module.exports = {
  content: [
    "./index.html", // ✅ Adjust if needed based on your folder structure
    "./src/**/*.{js,jsx,ts,tsx}", // Keep this to scan your React files
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        slideIn: 'slideIn 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};