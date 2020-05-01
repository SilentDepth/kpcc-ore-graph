<template>
  <form class="p-5 flex flex-col space-y-4" @submit.prevent="generate">
    <label>
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Server</span>
      <select v-model="server" class="block w-full form-select">
        <option value="kedama">毛玉線圈物語</option>
        <option value="nyaa">喵窝</option>
      </select>
    </label>
    <label class="relative">
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Player</span>
      <span class="flex">
        <input
          v-model="input"
          :placeholder="players[server] ? 'UUID or Playername' : 'Loading...'"
          class="relative focus:z-10 flex-1 form-input border-r-0 rounded-r-none"
        >
        <button
          :disabled="loading"
          :class="['relative flex-none px-3 py-1 border border-l-0 border-gray-300 bg-white rounded-r-md text-blue-500', {'cursor-default': loading}]"
        >
          <span :class="{invisible: loading}">Generate</span>
          <i v-show="loading" class="bg-gray-400 absolute inset-0 m-auto"></i>
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

  <div v-if="playername" :class="['my-10', {'invisible': isSearching}]">
    <h1 class="mb-2 text-2xl text-center font-black">{{ playername }}</h1>
    <BarGraph v-if="graphData" :data="graphData" class="mx-5 shadow" />
  </div>

  <footer class="mt-auto py-5 text-gray-500 text-center">
    <p>Built with ❤︎ by KPCC</p>
    <p class="mt-2 text-sm text-gray-400">{{ builtAt }} &middot; <a href="https://github.com/vuejs/vue-next" style="color: #42b983;">Vue {{ version }}</a></p>
  </footer>
</template>

<script>
  import {computed, ref, watch, watchEffect, version} from 'vue'

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
      const {server, players, serverPlayers, searchPlayers, fetchPlayer} = useApi()

      const input = ref(process.env.NODE_ENV === 'development' ? '7ddb7f90d38447529cfb26d3e6ce4e15' : null)
      const selectedPlayer = ref(null)
      const loading = ref(false)
      const isSearching = ref(false)

      const playername = ref()
      const graphData = ref()

      const filteredPlayerList = computed(() => searchPlayers(input.value))

      function findUuidWithName (name) {
        return serverPlayers.value.find(p => p.playername === name)?.uuid
      }

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
          const uuid = selectedPlayer.value?.uuid ?? findUuidWithName(input.value) ?? input.value.replace(/-|\s/g, '').toLowerCase()

          isSearching.value = false
          loading.value = true
          try {
            const data = await fetchPlayer(uuid)
            playername.value = data.playername
            graphData.value = data
          } catch (e) {
            console.error(e)
          }
          loading.value = false
        },

        version,
        builtAt: new Date(+process.env.VUE_APP_BUILT_AT).toLocaleString(),
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
