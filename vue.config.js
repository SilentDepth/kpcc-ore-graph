const fetchPlayer = require('./api/[uuid]')

module.exports = {
  devServer: {
    before (app) {
      app.use('/api/:uuid', (req, res) => {
        Object.assign(req.query, req.params)
        fetchPlayer(req, res)
      })
    },
  },
}
