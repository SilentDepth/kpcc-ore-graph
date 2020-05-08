<template>
  <form class="p-5 flex flex-col space-y-4" @submit.prevent="generate">
    <div>
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Server</span>
      <select v-model="server" class="block w-full form-select">
        <option value="kedama">毛玉線圈物語</option>
        <option value="nyaa">喵窝</option>
      </select>
    </div>
    <div class="relative z-10">
      <span class="block mb-2 text-sm tracking-wide text-gray-600 uppercase">Player</span>
      <span class="flex">
        <input
          v-model="input"
          :placeholder="players[server] ? 'UUID or Playername' : 'Loading...'"
          class="relative focus:z-10 flex-1 form-input border-r-0 focus:border-r rounded-r-none"
          @focus="$event.target.select()"
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
        style="max-height: 400px;"
        @click-player="selectPlayer"
      />
    </div>
  </form>

  <div ref="container" v-if="playername" class="my-5 py-5">
    <h1 class="mb-2 text-2xl text-center font-black">{{ playername }}</h1>
    <BarGraph v-if="graphData" :data="graphData" class="mx-5 shadow" />
  </div>
  <button v-show="graphData" :disabled="copyState === CopyState.Busy" class="self-center text-blue-600 disabled:opacity-50 flex items-center" @click="capture">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 mr-1 fill-current">
      <path d="M11.993 14.407l-1.552 1.552a4 4 0 1 1-1.418-1.41l1.555-1.556-4.185-4.185 1.415-1.415 4.185 4.185 4.189-4.189 1.414 1.414-4.19 4.19 1.562 1.56a4 4 0 1 1-1.414 1.414l-1.561-1.56zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2-7V5H5v8H3V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v9h-2z" />
    </svg>
    {{ copyStateLabel }}
  </button>

  <footer class="mt-auto py-5 text-gray-500 text-center">
    <p>Built with ❤︎ by KPCC</p>
    <p class="mt-2 text-sm text-gray-400">{{ builtAt }} &middot; <a href="https://github.com/vuejs/vue-next" style="color: #42b983;">Vue {{ version }}</a></p>
  </footer>
</template>

<script>
  import {computed, nextTick, ref, version, watch} from 'vue'
  import html2canvas from 'html2canvas'

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

      const CopyState = createEnum([
        'Idle',
        'Busy',
        'Done',
      ])
      const CopyStateLabel = {
        [CopyState.Idle]: '截图并复制到剪贴板',
        [CopyState.Busy]: '截图中...',
        [CopyState.Done]: '已复制到剪贴板！',
      }
      const container = ref()
      const copyState = ref(CopyState.Idle)
      const copyStateLabel = computed(() => CopyStateLabel[copyState.value])
      const capture = async () => {
        copyState.value = CopyState.Busy
        await new Promise(resolve => setTimeout(resolve, 0))

        const canvas = await html2canvas(container.value)
        const blob = await new Promise(resolve => canvas.toBlob(resolve))
        await navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])

        copyState.value = CopyState.Done
        setTimeout(() => copyState.value = CopyState.Idle, 3000)
      }

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

        container,
        CopyState,
        copyState,
        copyStateLabel,
        capture,

        version,
        builtAt: new Date(+process.env.VUE_APP_BUILT_AT).toLocaleString(),
      }
    },
  }

  function createEnum (arr) {
    return arr.reduce((enumObj, key, idx) => {
      enumObj[key] = idx + 1
      return enumObj
    }, {})
  }
</script>

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
