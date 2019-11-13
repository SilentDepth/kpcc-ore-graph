import {ref, computed} from '@vue/composition-api'

export const TYPES = ['coal', 'iron', 'gold', 'emerald', 'lapis', 'redstone', 'diamond', 'quartz']
export const KEYS = [
  'minecraft:mined/minecraft:coal_ore',
  'minecraft:mined/minecraft:iron_ore',
  'minecraft:mined/minecraft:gold_ore',
  'minecraft:mined/minecraft:emerald_ore',
  'minecraft:mined/minecraft:lapis_ore',
  'minecraft:mined/minecraft:redstone_ore',
  'minecraft:mined/minecraft:diamond_ore',
  'minecraft:mined/minecraft:nether_quartz_ore',
]

export const player = ref(null)

export const stats = computed(() => {
  return Object.fromEntries(TYPES.map((k, idx) => [k, player.value.stats[KEYS[idx]] || 0]))
})

export const total = computed(() => {
  return Object.values(stats.value).reduce((total, val) => total + val)
})

export const levels = computed(() => {
  return TYPES.map(type => stats.value[type] || 0).reduce((arr, val) => arr.concat(val + arr[arr.length - 1]), [0]).slice(1)
})

export const blockLevels = computed(() => {
  return levels.value.map(val => Math.ceil(val / total.value * 10000))
})
