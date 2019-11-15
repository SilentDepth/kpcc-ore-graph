const prodPlugins = process.env.NODE_ENV === 'production'
  ? {
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
  }
  : {}

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...prodPlugins,
  },
}
