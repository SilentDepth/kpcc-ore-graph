<template>
  <div id="app" class="h-screen p-5 flex flex-col items-center">
    <form class="mb-5 flex" @submit.prevent="generate">
      <select v-model="source" class="flex-0 px-2 py-1 bg-gray-300 border-r border-r-gray-200 mr-px">
        <option value="kedama">Kedama</option>
        <option value="nyaa">Nyaa</option>
      </select>
      <input v-model="input" class="flex-1 px-2 py-1 text-sm font-mono bg-gray-300 rounded-tl rounded-bl">
      <button :disabled="loading" class="flex-0 px-2 py-1 text-white rounded-tr rounded-br relative" :class="loading ? 'bg-gray-500 cursor-default' : 'bg-blue-500'">
        <span :class="{invisible: loading}">Generate</span>
        <i v-show="loading" class="bg-white absolute inset-0 m-auto shadow"></i>
      </button>
    </form>

    <h1 v-if="player" class="text-2xl text-center font-bold mb-2">{{ player.data.playername }}</h1>
    <TheGraph/>

    <footer class="mt-auto text-center text-gray-500">Built with ❤︎ by KPCC</footer>
  </div>
</template>

<script>
  import {ref} from '@vue/composition-api'

  import TheGraph from './components/the-graph.vue'
  import * as state from './state'

  export default {
    name: 'app',

    components: {
      TheGraph,
    },

    setup () {
      const source = ref('kedama')
      const input = ref(null)
      const loading = ref(false)

      const {player} = state

      return {
        source,
        input,
        loading,
        state,
        player,

        generate: async () => {
          const uuid = input.value.replace(/-|\s/g, '').toLowerCase()

          if (!/^[0-9a-f]{32}$/.test(uuid)) {
            alert('Currently only UUID is supported.')
            return
          }

          loading.value = true
          try {
            const data = await fetch(`/api/${uuid}?s=${source.value}`).then(res => res.json())
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
