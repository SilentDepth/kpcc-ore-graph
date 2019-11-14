module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    '@fullhuman/postcss-purgecss': {
      content: [
        './src/**/*.vue',
      ],
      whitelist: [
        'html',
        'body',
      ],
    },
  },
}
