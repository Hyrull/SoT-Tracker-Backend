const _ = require('lodash')
const { fetchReputationData } = require('./emblemFetchSoT')
const unlocks = require('../unlocks.json')

const factionOrder = [
  'TallTales',
  'BilgeRats',
  'GoldHoarders',
  'OrderOfSouls',
  'MerchantAlliance',
  'AthenasFortune',
  'ReapersBones',
  'HuntersCall',
  'SeaDogs',
  'CreatorCrew',
  'PirateLord',
  'Flameheart',
]

async function emblemUpdate(ratToken) {
  const data = await fetchReputationData(ratToken)
  if (!data || Object.keys(data).length === 0) {
    throw new Error('No commendation data returned.')
  }

  // Merging with the unlocks
  const mergeEmblems = (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return objValue.map(emblem => {
        const match = srcValue.find(e => e.DisplayName === emblem.DisplayName)
        return match ? { ...emblem, ...match } : emblem
      })
    }
  }

  const mergedData = _.mergeWith({}, data, unlocks, mergeEmblems)

  // Sorting the factions
  const sortedData = Object.fromEntries(
    Object.entries(mergedData).sort(([a], [b]) => {
      const indexA = factionOrder.indexOf(a)
      const indexB = factionOrder.indexOf(b)
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    })
  )

  return sortedData
}

module.exports = { emblemUpdate }
