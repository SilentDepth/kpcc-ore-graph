import {ref, computed, reactive, watch, set} from '@vue/composition-api'

const STORAGE_KEY = 'last_server'

const server = computed({
  get () {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return stored
    } else {
      localStorage.setItem(STORAGE_KEY, 'kedama')
      return 'kedama'
    }
  },

  set (val) {
    localStorage.setItem(STORAGE_KEY, val)
  },
})

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
  if (!players[s] && !_playersRequests[s]) {
    _playersRequests[s] = fetch(`/api/${s}/players`).then(res => res.json())
    set(players, s, await _playersRequests[s])
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
