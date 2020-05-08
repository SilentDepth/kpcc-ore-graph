<template>
  <div class="border border-gray-300 bg-white rounded-md overflow-hidden relative">
    <div class="absolute w-full space-y-px bg-white" style="height: 86px;">
      <div class="cursor-pointer" @click="onClickGroup('rocks')">
        <div :class="['flex transition-all duration-300 ease-in-out', activeGroup ? activeGroup === 'rocks' ? 'h-11' : 'h-5 opacity-50' : 'h-7']" :style="{width: totalRocks / maxTotal * 100 + '%'}">
          <template v-for="([rock, count]) of rocks">
            <div v-if="count" :key="count" :data-type="rock" :style="{flex: `${count} ${count} 0%`, minWidth: '1px'}" />
          </template>
        </div>
      </div>
      <div class="cursor-pointer" @click="onClickGroup('dirts')">
        <div :class="['flex transition-all duration-300 ease-in-out', activeGroup ? activeGroup === 'dirts' ? 'h-11' : 'h-5 opacity-50' : 'h-7']" :style="{width: totalDirts / maxTotal * 100 + '%'}">
          <template v-for="([dirt, count]) of dirts">
            <div v-if="count" :key="dirt" :data-type="dirt" :style="{flex: `${count} ${count} 0%`, minWidth: '1px'}" />
          </template>
        </div>
      </div>
      <div class="cursor-pointer" @click="onClickGroup('ores')">
        <div :class="['flex transition-all duration-300 ease-in-out', activeGroup ? activeGroup === 'ores' ? 'h-11' : 'h-5 opacity-50' : 'h-7']" :style="{width: totalOres / maxTotal * 100 + '%'}">
          <template v-for="([ore, count]) of ores">
            <div v-if="count" :key="ore" :data-type="ore" :style="{flex: `${count} ${count} 0%`, minWidth: '1px'}" />
          </template>
        </div>
      </div>
    </div>
    <div style="height: 86px;"></div>

    <transition
      enter-active-class="overflow-hidden transition-all duration-300 ease-in-out"
      leave-active-class="overflow-hidden transition-all duration-300 ease-in-out"
      @before-enter="el => el.style.height = '0px'"
      @enter="el => el.style.height = el.children[0].offsetHeight + 'px'"
      @after-enter="el => el.style.height = null"
      @before-leave="el => el.style.height = el.offsetHeight + 'px'"
      @leave="el => el.style.height = '0px'"
    >
      <div v-if="activeDetail">
        <div class="pt-5 border-t border-gray-300 bg-gray-50">
          <h3 class="mb-2 px-3 text-gray-500 flex items-center">
            <span>方块</span>
            <span class="ml-auto">开采量</span>
          </h3>
          <div class="text-sm space-y-px">
            <div v-for="([type, count], idx) of activeDetail" :key="idx" class="relative">
              <div :data-type="type" class="h-8 transition-all duration-300 ease-in-out" :style="{width: count / activeMax * 100 + '%'}" />
              <div class="absolute inset-0 w-full h-full px-3 flex items-center">
                <span class="px-1 py-0.5 bg-white bg-opacity-75 rounded">{{ TYPE_NAMES[type] }}</span>
                <span class="ml-auto px-1 py-0.5 bg-white bg-opacity-75 rounded font-tnum">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {computed, ref} from 'vue'

  import {DIRTS, ORES, ROCKS} from '../../consts'

  const TYPE_NAMES = {
    coal: '煤矿石',
    iron: '铁矿石',
    lapis: '青金石矿石',
    gold: '金矿石',
    diamond: '钻石矿石',
    redstone: '红石矿石',
    emerald: '绿宝石矿石',
    quartz: '下界石英矿石',
    stone: '石头',
    granite: '花岗岩',
    diorite: '闪长岩',
    andesite: '安山岩',
    dirt: '泥土',
    gravel: '沙砾',
  }

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
      const ores = computed(() => ORES.map(t => [t, props.data?.ores[t] ?? 0]))
      const totalOres = computed(() => ores.value.reduce((total, [, count]) => total + count, 0))
      const rocks = computed(() => ROCKS.map(t => [t, props.data?.rocks[t] ?? 0]))
      const totalRocks = computed(() => rocks.value.reduce((total, [, count]) => total + count, 0))
      const dirts = computed(() => DIRTS.map(t => [t, props.data?.dirts[t] ?? 0]))
      const totalDirts = computed(() => dirts.value.reduce((total, [, count]) => total + count, 0))
      const maxTotal = computed(() => Math.max(totalOres.value, totalRocks.value, totalDirts.value))

      const activeGroup = ref(null)
      const activeDetail = computed(() => {
        return {ores: ores.value, rocks: rocks.value, dirts: dirts.value}[activeGroup.value]?.slice().sort((b, a) => a[1] - b[1])
      })
      const activeMax = computed(() => ({ores: totalOres.value, rocks: totalRocks.value, dirts: totalDirts.value}[activeGroup.value]))

      return {
        ores,
        totalOres,
        rocks,
        totalRocks,
        dirts,
        totalDirts,
        maxTotal,

        activeGroup,
        activeDetail,
        activeMax,
        onClickGroup (group) {
          activeGroup.value = activeGroup.value === group ? null : group
        },
        TYPE_NAMES,
      }
    },
  }
</script>

<style lang="scss" scoped>
  [data-type=coal]     {background-color: #343434;}
  [data-type=iron]     {background-color: #af8e77;}
  [data-type=lapis]    {background-color: #315ec4;}
  [data-type=gold]     {background-color: #fcee4b;}
  [data-type=diamond]  {background-color: #3de0e5;}
  [data-type=redstone] {background-color: #ab0600;}
  [data-type=emerald]  {background-color: #00ab28;}
  [data-type=quartz]   {background-color: #eae5de;}

  [data-type=stone]    {background-color: #8f8f8f;}
  [data-type=granite]  {background-color: #a97764;}
  [data-type=diorite]  {background-color: #cececf;}
  [data-type=andesite] {background-color: #a8aa9a;}

  [data-type=dirt]     {background-color: #79553a;}
  [data-type=gravel]   {background-color: #7c7b7b;}
</style>
