<template>
  <form class="p-5 flex flex-col" @submit.prevent="generate">
    <label>
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Server</span>
      <select v-model="server" class="block w-full form-select">
        <option value="kedama">毛玉線圈物語</option>
        <option value="nyaa">喵窝</option>
      </select>
    </label>
    <label class="relative sm:flex-1 mt-4 sm:mt-0 sm:ml-4">
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Player</span>
      <span class="flex">
          <input
            v-model="input"
            :placeholder="players[server] ? 'UUID or Playername' : 'Loading...'"
            class="relative focus:z-10 flex-1 form-input border-r-0 rounded-r-none"
          >
          <button
            :disabled="loading"
            :class="['relative flex-none px-2 py-1 rounded-r text-white', loading ? 'bg-gray-500 cursor-default' : 'bg-blue-500']"
          >
            <span :class="{invisible: loading}">Generate</span>
            <i v-show="loading" class="bg-white absolute inset-0 m-auto shadow"></i>
          </button>
        </span>

      <player-list
        v-show="isSearching"
        :players="filteredPlayerList"
        class="absolute _top-full w-full mt-1"
        @click-player="selectPlayer"
      />
    </label>
  </form>

  <h1 v-if="playername" class="text-2xl text-center font-bold mb-2">{{ playername }}</h1>
  <TheGraph :data="graphData" class="mx-auto" />

  <footer class="mt-auto py-5 text-gray-500 text-center">Built with ❤︎ by KPCC</footer>
</template>

<script>
  import {computed, ref, watch} from 'vue'

  import PlayerList from './components/player-list.vue'
  import TheGraph from './components/the-graph.vue'
  import BarGraph from './components/bar-graph.vue'
  import useApi from './composables/api'

  export default {
    name: 'app',

    components: {
      PlayerList,
      TheGraph,
      BarGraph,
    },

    setup () {
      const {server, players, searchPlayers, fetchPlayer} = useApi()

      const input = ref(process.env.NODE_ENV === 'development' ? '35b273b6cde14447b29b11377f6ab27d' : null)
      const selectedPlayer = ref(null)
      const loading = ref(false)
      const isSearching = ref(false)

      const playername = ref()
      const graphData = ref()

      const filteredPlayerList = computed(() => searchPlayers(input.value))

      watch(input, (val) => {
        if (val !== selectedPlayer.value?.playername) {
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
          const uuid = selectedPlayer.value?.uuid || input.value.replace(/-|\s/g, '').toLowerCase()

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

<style src="./assets/css/base.scss" lang="scss"></style>

<style lang="scss" scoped>
  form {
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

  ._top-full {
    top: 100%;
  }
</style>
