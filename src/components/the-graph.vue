<template>
  <svg v-if="player" width="300" height="300">
    <g v-for="r of 100" :key="r" :transform="`translate(0, ${(r - 1) * 3})`">
      <rect v-for="c of 100" :key="c" width="3" height="3" :x="(c - 1) * 3" y="0" :data-type="blockType((r - 1) * 100 + c)"></rect>
    </g>
  </svg>
</template>

<script>
  import {TYPES, player, blockLevels} from '../state'

  export default {
    name: 'TheGraph',

    setup () {
      return {
        player,

        blockType: blockNo => TYPES[blockLevels.value.findIndex(lvl => lvl >= blockNo)],
      }
    },
  }
</script>

<style lang="scss">
  rect {
    fill: #f0f;

    &[data-type=coal] {
      fill: #343434;
    }

    &[data-type=iron] {
      fill: #af8e77;
    }

    &[data-type=lapis] {
      fill: #16448d;
    }

    &[data-type=gold] {
      fill: #f8af2b;
    }

    &[data-type=diamond] {
      fill: #3de0e5;
    }

    &[data-type=redstone] {
      fill: #8f0303;
    }

    &[data-type=emerald] {
      fill: #007b18;
    }

    &[data-type=quartz] {
      fill: #eae5de;
    }
  }
</style>
