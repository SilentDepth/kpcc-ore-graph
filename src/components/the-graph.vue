<template>
  <div>
    <div class="bg-gray-200">
      <canvas ref="canvas" class="block mx-auto" style="width: 300px; height: 342px; image-rendering: crisp-edges;" />
    </div>
    <form class="my-5 flex items-center justify-center">
      <label class="flex items-center">
        <input v-model="showTotalMining" type="checkbox" class="form-checkbox">
        <span class="ml-2">Show Total Mining</span>
      </label>
    </form>
  </div>
</template>

<script>
  import {computed, ref, watchEffect} from 'vue'

  import {TYPES} from '../../consts'

  const BlockColor = {
    coal: [52, 52, 52, 255],
    iron: [175, 142, 119, 255],
    lapis: [49, 94, 196, 255],
    gold: [252, 238, 75, 255],
    diamond: [61, 224, 229, 255],
    redstone: [171, 6, 0, 255],
    emerald: [0, 171, 40, 255],
    quartz: [234, 229, 222, 255],
  }

  function writeValues (arr, start, ...values) {
    values.forEach((val, idx) => {
      arr[start + idx] = val
    })
  }

  export default {
    name: 'TheGraph',

    props: {
      data: Object,
    },

    setup (props) {
      /** @type {{value: HTMLCanvasElement}} */
      const canvas = ref(null)

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

      const blockType = blockNo => TYPES[blockLevels.value.findIndex(lvl => lvl >= blockNo)]

      const draw = () => {
        const width = 100
        const height = 114
        Object.assign(canvas.value, {width, height})

        const imageData = new ImageData(width, height)
        for (let i = 0, end = imageData.data.length; i < end; i += 4) {
          const p = i / 4
          const typeIdx = blockLevels.value.findIndex(lvl => lvl >= p)
          if (typeIdx >= 0) {
            writeValues(imageData.data, (p + typeIdx * width * 2) * 4, ...BlockColor[TYPES[typeIdx]])
          }
        }

        const ctx = canvas.value.getContext('2d')
        ctx.putImageData(imageData, 0, 0)
      }

      watchEffect(() => {
        if (canvas.value && props.data) {
          draw()
        }
      })

      return {
        showTotalMining,
        svgStyle,

        blockLevels,
        blockType,
        blockOffset: blockNo => blockLevels.value.findIndex(lvl => lvl >= blockNo),

        canvas,
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
