module.exports = {
  variants: {
    borderWidth: ['last'],
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: [
    './src/**/*.vue',
  ],
}
