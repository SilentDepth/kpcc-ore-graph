const {TYPES} = require('../../consts')

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

module.exports = function processPlayer (player) {
  const isLegacy = Object.keys(player.stats)[0].startsWith('stat')
  const keys = isLegacy ? KEYS_LEGACY : KEYS_MODERN
  return {
    playername: player.data.playername,
    stats: TYPES.map((k, idx) => [k, player.stats[keys[idx]] || 0]).reduce((obj, [k, v]) => ({...obj, [k]: v}), {}),
  }
}
