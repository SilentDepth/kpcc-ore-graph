import {reactive, ref, watch} from 'vue'

const STORAGE_KEY = 'last_server'

const server = ref(localStorage.getItem(STORAGE_KEY) || 'kedama')
const players = reactive({})

function searchPlayers (input) {
  input = input?.replace(/-|\s/g, '').toLowerCase()

  if (!input || !players[server.value]) {
    return null
  }

  return players[server.value].filter(p => p.playername.toLowerCase().includes(input) || p.uuid.includes(input))
}

async function fetchPlayer (uuid) {
  return await fetch(`/api/${server.value}/${uuid}`).then(res => res.json())
}

const _playersRequests = {}
watch(server, async s => {
  localStorage.setItem(STORAGE_KEY, s)

  if (!players[s] && !_playersRequests[s]) {
    _playersRequests[s] = fetch(`/api/${s}/players`).then(res => res.json())
    players[s] = await _playersRequests[s]
    delete _playersRequests[s]
  }
})

export default function useApi () {
  return {
    server,
    players,

    searchPlayers,
    fetchPlayer,
  }
}
