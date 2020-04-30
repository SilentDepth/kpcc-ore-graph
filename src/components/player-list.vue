<template>
  <ul class="bg-white shadow rounded overflow-auto" style="max-height: 400px;">
    <li
        v-for="p of players"
        :key="p.uuid"
        class="px-4 py-2 border-b last:border-b-0 border-gray-300 cursor-pointer hover:bg-gray-100"
        @click="$emit('click-player', p)"
    >
      <h1 class="font-bold">{{p.playername}}</h1>
      <h2 class="font-mono text-sm text-gray-500">{{p.uuid}}</h2>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'PlayerList',

    props: {
      players: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>
