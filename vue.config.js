const {resolve} = require('path')

const api = require('./api/[server]/[file]')

module.exports = {
  devServer: {
    before (app) {
      app.use('/api/:server/:file', (req, res) => {
        Object.assign(req.query, req.params)
        if (req.query.file === 'players') {
          res.sendFile(resolve(__dirname, './__mock__/players.json'))
        } else {
          api(req, res)
        }
      })
    },
  },
}
