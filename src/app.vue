<template>
  <div id="app" class="h-screen p-5 flex flex-col items-center">
    <form class="mb-5 flex" @submit.prevent="generate">
      <select v-model="source" class="flex-0 px-2 py-1 bg-gray-300 border-r border-r-gray-200 mr-px">
        <option value="kedama">Kedama</option>
        <option value="nyaa">Nyaa</option>
      </select>
      <input v-model="input" class="flex-1 px-2 py-1 text-sm font-mono bg-gray-300 rounded-tl rounded-bl">
      <button class="flex-0 px-2 py-1 bg-blue-500 text-white rounded-tr rounded-br">Generate</button>
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

      const {player} = state

      return {
        source,
        input,
        state,
        player,

        generate: async () => {
          const uuid = input.value.trim().toLowerCase()

          if (!/^[0-9a-f]{32}$/.test(uuid)) {
            alert('Only short format of UUID is currently supported.')
            return
          }

          const data = await fetch(`/api/${uuid}?s=${source.value}`).then(res => res.json())
          player.value = data
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
    }
  }
</style>
