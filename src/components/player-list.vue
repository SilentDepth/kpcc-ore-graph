<template>
  <div class="bg-white shadow rounded overflow-hidden flex flex-col">
    <ul ref="list" class="h-full overflow-auto" @scroll="onScroll">
      <li
        v-for="p of items"
        :key="p.uuid"
        class="px-4 py-2 border-b last:border-b-0 border-gray-300 cursor-pointer hover:bg-gray-100"
        @click="$emit('click-player', p)"
      >
        <h1 class="font-bold">{{p.playername}}</h1>
        <h2 class="mt-1 font-mono text-sm text-gray-500">{{p.uuid}}</h2>
      </li>
    </ul>
  </div>
</template>

<script>
  import {computed, ref, watch} from 'vue'
  import {throttle} from 'lodash-es'

  export default {
    name: 'PlayerList',

    props: {
      players: {
        type: Array,
        default: () => [],
      },
    },

    setup (props) {
      const start = ref(0)
      const end = ref(20)
      const items = computed(() => props.players?.slice(start.value, end.value))

      const list = ref()
      const onScroll = throttle(({target}) => {
        if (end.value >= props.players.length) return

        if (target.scrollHeight - target.scrollTop < target.offsetHeight * 2) {
          end.value += 20
        }
      }, 1000 / 30)

      watch(() => props.players, () => {
        start.value = 0
        end.value = 20
        list.value.scrollTop = 0
      })

      return {
        items,

        list,
        onScroll,
      }
    },
  }
</script>
