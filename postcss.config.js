module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.vue',
        ],
        defaultExtractor: content => content.match(/[\w-/:.]+(?<!:)/g) || [],
      },
    } : null,
  },
}
