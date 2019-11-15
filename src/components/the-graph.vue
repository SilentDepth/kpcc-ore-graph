<template>
  <div>
    <div class="bg-gray-200">
      <svg v-if="data" width="300" height="300" :style="svgStyle">
        <g v-for="r of 100" :key="r" :transform="`translate(0, ${(r - 1) * 3})`">
          <rect v-for="c of 100" :key="c" width="3" height="3" :x="(c - 1) * 3" y="0" :data-type="blockType((r - 1) * 100 + c)"></rect>
        </g>
      </svg>
    </div>
    <form class="mt-5 flex items-center justify-center">
      <label class="flex items-center">
        <input v-model="showTotalMining" type="checkbox">
        <span class="ml-2">Show Total Mining</span>
      </label>
    </form>
  </div>
</template>

<script>
  import {ref, computed} from '@vue/composition-api'

  import {TYPES} from '../../consts'

  export default {
    name: 'TheGraph',

    props: {
      data: Object,
    },

    setup (props) {
      const showTotalMining = ref(false)

      const totalOre = computed(() => TYPES.reduce((total, type) => total + props.data[type], 0))
      const blockLevels = computed(() => {
        const data = props.data
        if (data) {
          const levels = TYPES.map(type => data[type] || 0).reduce((arr, val) => arr.concat(val + arr[arr.length - 1]), [0]).slice(1)
          return levels.map(val => Math.ceil(val / totalOre.value * 10000))
        } else {
          return []
        }
      })

      const svgStyle = computed(() =>
        showTotalMining.value
          ? {
            transform: `scale(${totalOre.value / props.data.total_mining})`,
            outline: `${props.data.total_mining / totalOre.value}px solid rgba(255, 0, 255, .5)`,
          }
          : {
            outline: '0 solid rgba(255, 0, 255, 0)',
          }
      )

      return {
        showTotalMining,
        svgStyle,

        blockType: blockNo => TYPES[blockLevels.value.findIndex(lvl => lvl >= blockNo)],
      }
    },
  }
</script>

<style lang="scss" scoped>
  svg {
    transform-origin: left top;
    transition: all 500ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  rect {
    fill: #f0f;

    &[data-type=coal] {
      fill: #343434;
    }

    &[data-type=iron] {
      fill: #af8e77;
    }

    &[data-type=lapis] {
      fill: #315ec4;
    }

    &[data-type=gold] {
      fill: #fcee4b;
    }

    &[data-type=diamond] {
      fill: #3de0e5;
    }

    &[data-type=redstone] {
      fill: #ab0600;
    }

    &[data-type=emerald] {
      fill: #00ab28;
    }

    &[data-type=quartz] {
      fill: #eae5de;
    }
  }
</style>
