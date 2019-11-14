import {ref, computed} from '@vue/composition-api'

export const TYPES = ['coal', 'iron', 'gold', 'emerald', 'lapis', 'redstone', 'diamond', 'quartz']
const KEYS_MODERN = [
  'minecraft:mined/minecraft:coal_ore',
  'minecraft:mined/minecraft:iron_ore',
  'minecraft:mined/minecraft:gold_ore',
  'minecraft:mined/minecraft:emerald_ore',
  'minecraft:mined/minecraft:lapis_ore',
  'minecraft:mined/minecraft:redstone_ore',
  'minecraft:mined/minecraft:diamond_ore',
  'minecraft:mined/minecraft:nether_quartz_ore',
]
const KEYS_LEGACY = [
  'stat.mineBlock.minecraft.coal_ore',
  'stat.mineBlock.minecraft.iron_ore',
  'stat.mineBlock.minecraft.gold_ore',
  'stat.mineBlock.minecraft.emerald_ore',
  'stat.mineBlock.minecraft.lapis_ore',
  'stat.mineBlock.minecraft.redstone_ore',
  'stat.mineBlock.minecraft.diamond_ore',
  'stat.mineBlock.minecraft.nether_quartz_ore',
]

export const player = ref(null)

export const isLegacy = computed(() => (
  Object.keys(player.value.stats)[0].startsWith('stat')
))

export const KEYS = computed(() => (
  isLegacy.value ? KEYS_LEGACY : KEYS_MODERN
))

export const stats = computed(() => (
  Object.fromEntries(TYPES.map((k, idx) => [k, player.value.stats[KEYS.value[idx]] || 0]))
))

export const total = computed(() => (
  Object.values(stats.value).reduce((total, val) => total + val)
))

export const levels = computed(() => (
  TYPES.map(type => stats.value[type] || 0).reduce((arr, val) => arr.concat(val + arr[arr.length - 1]), [0]).slice(1)
))

export const blockLevels = computed(() => (
  levels.value.map(val => Math.ceil(val / total.value * 10000))
))
