module.exports = {
  theme: {
    extend: {
      spacing: {
        ui: '600px',
      },
    },
  },
  variants: {
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: [
    './src/**/*.vue',
    './public/index.html',
  ],
}
