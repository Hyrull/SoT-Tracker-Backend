const { fetchReputationData } = require('../services/emblemFetch')
const User = require('../models/user')

// Controller to fetch the reputation data

const factionOrder = [
  'TallTales',
  'BilgeRats',
  'GoldHoarders',
  'OrderOfSouls',
  'MerchantAlliance',
  'AthenasFortune',
  'HuntersCall',
  'SeaDogs',
  'CreatorCrew',
  'PirateLord',
  'Flameheart',
]

const emblemUpdate = async (req, res) => {

  try {
    // Fetch the user from the database
    const user = await User.findById(req.auth.userId)

    if (!user) {
      return res.status(404).json({ message: 'Please log out and log in again.' })
    }

    // Fetch the ratToken from the user
    const ratToken = user.ratToken

    // Check if the ratToken is present
    if (!ratToken) {
      return res.status(400).json({ message: "No RAT token could be found on your account." })
    }

    // Fetching the reputation data
    const data = await fetchReputationData(ratToken)

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No data returned from the API." });
    }

    // Convert the data object into an array of [factionName, factionData] pairs so we can sort it
    const factionsArray = Object.entries(data);

    // Sort the array based on the predefined order
    const sortedFactionsArray = factionsArray.sort(([keyA], [keyB]) => {
      const indexA = factionOrder.indexOf(keyA) !== -1 ? factionOrder.indexOf(keyA) : Infinity;
      const indexB = factionOrder.indexOf(keyB) !== -1 ? factionOrder.indexOf(keyB) : Infinity;
      return indexA - indexB;
    });

    // Convert the sorted array back into an object
    const sortedData = Object.fromEntries(sortedFactionsArray);

    // Send the SORTED data back to the client
    res.json(sortedData)

  } catch (err) {
    res.status(500).json({ message: 'Error fetching reputation data!' })
  }
}

module.exports = { emblemUpdate }