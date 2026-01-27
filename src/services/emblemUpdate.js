import lodash from 'lodash'
const { mergeWith } = lodash
import { fetchReputationData } from './emblemFetchSoT.js'
import unlocks from './../unlocks.json' with { type: 'json' }

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

export async function emblemUpdate(ratToken) {
  let data

  // using try/catch now because their api is sometimes down (would you believe that)
  try {
    data = await fetchReputationData(ratToken)
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      console.warn('Sea of Thieves API is down (5xx).')
      
      const sotError = new Error('SoT API Down')
      sotError.statusCode = 503
      throw sotError
    }
    // throwing other errors (like 401 Auth) to be handled normally
    throw error
  }

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

  const mergedData = mergeWith({}, data, unlocks, mergeEmblems)

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