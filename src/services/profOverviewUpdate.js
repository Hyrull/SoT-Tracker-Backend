const { fetchOverviewData } = require('./profOverviewFetchSoT')

async function profOverviewUpdate(ratToken) {
  const overview = fetchOverviewData(ratToken)
  return overview
}

module.exports = { profOverviewUpdate }
