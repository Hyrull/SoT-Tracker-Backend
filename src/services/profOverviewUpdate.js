import { fetchOverviewData } from './profOverviewFetchSoT.js'

export async function profOverviewUpdate(ratToken) {
  const overview = fetchOverviewData(ratToken)
  return overview
}