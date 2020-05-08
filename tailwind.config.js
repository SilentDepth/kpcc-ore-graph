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
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: [
    './src/**/*.vue',
    './public/index.html',
  ],
}
