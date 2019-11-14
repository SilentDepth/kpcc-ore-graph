const api = require('./api/[server]/[file]')

module.exports = {
  devServer: {
    before (app) {
      app.use('/api/:server/:file', (req, res) => {
        Object.assign(req.query, req.params)
        api(req, res)
      })
    },
  },
}
