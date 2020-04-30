<template>
  <div :style="{width: width + 'px'}">
    <label class="mb-4 flex items-center justify-center">
      <input v-model="bigSize" type="checkbox" class="mr-2 form-checkbox">
      <span>Big size</span>
    </label>
    <svg :viewBox="`0 0 ${width} 40`" class="w-full h-10 bg-gray-200 rounded-md">
      <rect v-for="seg of segments" :width="seg.width" height="100%" :x="seg.offset" :fill="seg.fill" :data-type="seg.type" />
    </svg>
  </div>
</template>

<script>
  import {computed, ref, watchEffect} from '@vue/composition-api'

  import {TYPES} from '../../consts'

  export default {
    name: 'BarGraph',

    props: {
      data: {
        type: Object,
        default: null,
      },
    },

    /**
     * @param props {{data: GraphData | null}}
     *
     * @typedef GraphData
     * @prop total_mining {number}
     */
    setup (props) {
      const width = ref(300)

      const totalOre = computed(() => props.data ? [...Object.values(props.data)].reduce((sum, val) => sum + val) - props.data.total_mining : 0)
      const segments = computed(() => !props.data ? [] : TYPES.reduce((segments, type, idx) => {
        const lastSegment = segments[idx - 1]
        const offset = lastSegment ? lastSegment.offset + lastSegment.width : 0
        segments.push({
          type,
          width: Math.max(idx === TYPES.length - 1 ? width.value - offset : Math.round(width.value * props.data[type] / totalOre.value), 1),
          offset,
        })
        return segments
      }, []))

      const bigSize = ref(false)
      watchEffect(() => {
        width.value = bigSize.value ? 500 : 300
      })
      return {
        segments,

        width,
        bigSize,
        log: console.log,
      }
    },
  }
</script>

<style lang="scss" scoped>
  rect {
    &[data-type=coal]     {fill: #343434;}
    &[data-type=iron]     {fill: #af8e77;}
    &[data-type=lapis]    {fill: #315ec4;}
    &[data-type=gold]     {fill: #fcee4b;}
    &[data-type=diamond]  {fill: #3de0e5;}
    &[data-type=redstone] {fill: #ab0600;}
    &[data-type=emerald]  {fill: #00ab28;}
    &[data-type=quartz]   {fill: #eae5de;}
  }
</style>
