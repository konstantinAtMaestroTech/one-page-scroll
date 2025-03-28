/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        transitionProperty: {
          'transform': 'transform',
        },
        transitionDuration: {
          '1000': '1000ms',
        },
        transitionTimingFunction: {
          'in-out': 'cubic-bezier(0.86, 0, 0.07, 1)',
        },
      },
    },
    plugins: [],
  }