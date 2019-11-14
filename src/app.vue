<template>
  <div id="app" class="h-screen p-5 flex flex-col items-center">
    <form class="mb-5 flex relative" @submit.prevent="generate">
      <select v-model="source" class="flex-none px-2 py-1 bg-gray-300 mr-px">
        <option value="kedama">Kedama</option>
        <option value="nyaa">Nyaa</option>
      </select>
      <input v-model="input" :placeholder="players[source] ? 'UUID or Playername' : 'Loading...'" class="flex-1 px-2 py-1 text-sm placeholder-gray-600 font-mono bg-gray-300 rounded-tl rounded-bl">
      <button :disabled="loading" class="flex-none px-2 py-1 text-white rounded-tr rounded-br relative" :class="loading ? 'bg-gray-500 cursor-default' : 'bg-blue-500'">
        <span :class="{invisible: loading}">Generate</span>
        <i v-show="loading" class="bg-white absolute inset-0 m-auto shadow"></i>
      </button>

      <player-list v-show="isSearching" :players="filteredPlayerList" class="absolute w-full mt-px" style="top: 100%;" @click-player="selectPlayer"/>
    </form>

    <h1 v-if="player" class="text-2xl text-center font-bold mb-2">{{ player.data.playername }}</h1>
    <TheGraph/>

    <footer class="mt-auto text-center text-gray-500">Built with ❤︎ by KPCC</footer>
  </div>
</template>

<script>
  import {ref, reactive, computed, watch} from '@vue/composition-api'

  import PlayerList from './components/player-list.vue'
  import TheGraph from './components/the-graph.vue'
  import * as state from './state'

  const players = reactive({
    kedama: null,
    nyaa: null,
  })

  fetch('/api/kedama/players').then(res => res.json()).then(data => players.kedama = data)
  fetch('/api/nyaa/players').then(res => res.json()).then(data => players.nyaa = data)

  export default {
    name: 'app',

    components: {
      PlayerList,
      TheGraph,
    },

    setup () {
      const source = ref('kedama')
      const input = ref(null)
      const selectedPlayer = ref(null)
      const loading = ref(false)
      const isSearching = ref(false)

      const {player} = state

      const filteredPlayerList = computed(() => {
        if (input.value && players[source.value]) {
          const input$ = input.value.replace(/-|\s/g, '').toLowerCase()
          return players[source.value].filter(p => p.playername.toLowerCase().includes(input$) || p.uuid.includes(input$))
        } else {
          return null
        }
      })

      watch(input, (val) => {
        if (val !== (selectedPlayer?.value.playername)) {
          selectedPlayer.value = null
          isSearching.value = true
        }
      })

      return {
        source,
        input,
        loading,
        isSearching,
        selectedPlayer,
        state,
        player,

        players,
        filteredPlayerList,

        selectPlayer: p => {
          input.value = p.playername
          selectedPlayer.value = p
          isSearching.value = false
        },

        generate: async () => {
          const uuid = selectedPlayer.value.uuid || input.value.replace(/-|\s/g, '').toLowerCase()

          isSearching.value = false
          loading.value = true
          try {
            const data = await fetch(`/api/${source.value}/${uuid}`).then(res => res.json())
            player.value = data
          } catch (e) {
            console.error(e)
          }
          loading.value = false
        },
      }
    },
  }
</script>

<style lang="scss">
  @tailwind base;
  @tailwind utilities;

  #app {
    form {
      width: 300px;

      button {
        i {
          width: 10px;
          height: 10px;
          animation: 1s linear infinite spinning;

          @keyframes spinning {
            from {
              transform: rotate(0);
            }

            to {
              transform: rotate(360deg);
            }
          }
        }
      }
    }
  }
</style>
