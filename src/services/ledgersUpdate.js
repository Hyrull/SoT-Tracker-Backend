const { fetchLedgersData } = require('./ledgersFetchSoT')

const ledgerFactions = [
  'GoldHoarders',
  'OrderOfSouls',
  'MerchantAlliance',
  'AthenasFortune',
  'ReapersBones',
  'HuntersCall',
]

async function ledgersUpdate(ratToken) {

  // Using the promises way to fetch all ledgers at once
  const ledgerPromises = ledgerFactions.map(faction =>
    fetchLedgersData(ratToken, faction)
      .then(data => ({ faction, data }))
      .catch(err => {
        console.warn(`Failed to fetch ledger for ${faction}:`, err.message)
        return null
      })
  )

  const results = await Promise.allSettled(ledgerPromises)

  // constructing the ledgers object we then return
  const ledgers = {}
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const { faction, data } = result.value
      ledgers[faction] = data
    }
  }

  return ledgers
}

module.exports = { ledgersUpdate }
