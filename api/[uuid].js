const fetch = require('node-fetch')

module.exports = async function (req, res) {
  const uuid = req.query.uuid
  const remoteUrl = `https://stats.craft.moe/data/${uuid}/stats.json`

  try {
    const data = await fetch(remoteUrl).then(res => res.json())
    console.log(`[api] Requested ${remoteUrl} (${data.data.playername}).`)
    res.json(data)
  } catch (e) {
    console.error(`[api] Requesting ${remoteUrl} failed.`)
    console.error(e)
    res.sendStatus(500)
  }
}
