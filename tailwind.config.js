module.exports = {
  theme: {
    extend: {
      spacing: {
        ui: '600px',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'focus'],
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: [
    './src/**/*.vue',
    './public/index.html',
  ],
}
