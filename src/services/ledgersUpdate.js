import { logger } from '../lib/logger.js'
import { fetchLedgersData } from './ledgersFetchSoT.js'

const ledgerFactions = [
  'GoldHoarders',
  'OrderOfSouls',
  'MerchantAlliance',
  'AthenasFortune',
  'ReapersBones',
  'HuntersCall',
]

// --- Retry helper with jitter ---
async function withRetry(fn, faction, retries = 3) {
  let lastErr
  for (let i = 0; i < retries; i++) {
    logger.info(`Attempt ${i + 1} for faction ${faction}`)
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i === retries - 1) break

      const jitter = 200 + Math.random() * 400   // 200–600ms
      await new Promise(res => setTimeout(res, jitter))
    }
  }
  throw lastErr
}

export async function ledgersUpdate(ratToken) {

  // Using the promises way to fetch all ledgers at once
  const ledgerPromises = ledgerFactions.map(faction =>
    withRetry(() => fetchLedgersData(ratToken, faction), faction, 3)
      .then(data => ({ faction, data }))
      .catch(err => {
        logger.warn(`Failed to fetch ledger for ${faction}:`, err.message)
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
