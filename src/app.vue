<template>
  <div id="app" class="h-screen p-5 flex flex-col items-center">
    <form class="mb-5 flex relative" @submit.prevent="generate">
      <select v-model="server" class="flex-none px-2 py-1 bg-gray-300 mr-px">
        <option value="kedama">Kedama</option>
        <option value="nyaa">Nyaa</option>
      </select>
      <input
          v-model="input"
          :placeholder="players[server] ? 'UUID or Playername' : 'Loading...'"
          class="flex-1 px-2 py-1 text-sm placeholder-gray-600 font-mono bg-gray-300 rounded-tl rounded-bl"
      >
      <button
          :disabled="loading"
          class="flex-none px-2 py-1 text-white rounded-tr rounded-br relative"
          :class="loading ? 'bg-gray-500 cursor-default' : 'bg-blue-500'"
      >
        <span :class="{invisible: loading}">Generate</span>
        <i v-show="loading" class="bg-white absolute inset-0 m-auto shadow"></i>
      </button>

      <player-list
          v-show="isSearching"
          :players="filteredPlayerList"
          class="absolute w-full mt-px"
          style="top: 100%;"
          @click-player="selectPlayer"
      />
    </form>

    <h1 v-if="playername" class="text-2xl text-center font-bold mb-2">{{ playername }}</h1>
    <TheGraph :data="graphData"/>

    <footer class="mt-auto text-center text-gray-500">Built with ❤︎ by KPCC</footer>
  </div>
</template>

<script>
  import {ref, reactive, computed, watch} from '@vue/composition-api'

  import PlayerList from './components/player-list.vue'
  import TheGraph from './components/the-graph.vue'
  import useApi from './composables/api'

  export default {
    name: 'app',

    components: {
      PlayerList,
      TheGraph,
    },

    setup () {
      const {server, players, searchPlayers, fetchPlayer} = useApi()

      const input = ref(null)
      const selectedPlayer = ref(null)
      const loading = ref(false)
      const isSearching = ref(false)

      const playername = ref()
      const graphData = ref()

      const filteredPlayerList = computed(() => searchPlayers(input.value))

      watch(input, (val) => {
        if (val !== (selectedPlayer.value?.playername)) {
          selectedPlayer.value = null
          isSearching.value = true
        }
      })

      return {
        server,
        input,
        loading,
        isSearching,
        selectedPlayer,

        playername,
        graphData,

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
            const data = await fetchPlayer(uuid)
            playername.value = data.playername
            graphData.value = data.stats
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
