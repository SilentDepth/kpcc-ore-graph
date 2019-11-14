const fetch = require('node-fetch')

module.exports = async function ({query: {server, file}}, res) {
  let remoteUrl = {
    kedama: `https://stats.craft.moe/data/`,
    nyaa: `https://i.nyaa.cat/data/`,
  }[server]

  if (/^[0-9a-f]{32}$/.test(file)) {
    // player stats json

    const uuid = file
    remoteUrl += `${uuid}/stats.json`

    try {
      const data = await fetch(remoteUrl).then(res => res.json())
      console.log(`[api] Requested ${remoteUrl} (${data.data.playername}).`)
      res.json(data)
    } catch (e) {
      console.error(`[api] Requesting ${remoteUrl} failed.`)
      console.error(e)
      res.sendStatus(500)
    }
  } else {
    // player list json

    remoteUrl += {
      players: `players.json`,
    }[file]

    if (!remoteUrl.endsWith('.json')) {
      return res.sendStatus(404)
    }

    try {
      const data = await fetch(remoteUrl).then(res => res.json())
      console.log(`[api] Requested ${remoteUrl}.`)
      res.json(data)
    } catch (e) {
      console.error(`[api] Requesting ${remoteUrl} failed.`)
      console.error(e)
      res.sendStatus(500)
    }
  }
}
