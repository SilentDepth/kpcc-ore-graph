module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    '@fullhuman/postcss-purgecss': {
      content: [
        './src/**/*.vue',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      whitelist: [
        'html',
        'body',
      ],
    },
  },
}
