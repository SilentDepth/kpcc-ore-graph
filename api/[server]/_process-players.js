export default function processPlayers (players) {
  return players.map(p => ({
    uuid: p.uuid,
    playername: p.playername,
  }))
}
