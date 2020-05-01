const {resolve} = require('path')

const api = require('./api/[server]/[file]')

process.env.VUE_APP_BUILT_AT = String(Date.now())

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
