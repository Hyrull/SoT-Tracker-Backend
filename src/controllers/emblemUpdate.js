const { fetchReputationData } = require('../services/emblemFetchSoT')
const User = require('../models/user')
const UserData = require('../models/userData.js')
const _ = require('lodash')

const unlocks = require ('../unlocks.json')

// Controller to fetch the reputation data

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

const emblemUpdate = async (req, res) => {

  try {
    // Fetch the user from the database
    const user = await User.findById(req.auth.userId)

    if (!user) {
      return res.status(404).json({ message: 'Please log out and log in again.' })
    }

    const ratToken = user.ratToken
    if (!ratToken) {
      return res.status(400).json({ message: "No RAT token could be found on your account." })
    }


    // Fetching the reputation data from SoT
    const data = await fetchReputationData(ratToken)
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No data returned from the API." });
    }

    // Merge the data with the unlocks.json file (Lodash)
    const mergeEmblems = (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return objValue.map((emblem) => {
          // Find matching emblem in unlocks by DisplayName
          const match = srcValue.find((e) => e.DisplayName === emblem.DisplayName);
          return match ? { ...emblem, ...match } : emblem;
        });
      }
    };

    // Perform deep merge with custom handling for arrays
    const mergedData = _.mergeWith({}, data, unlocks, mergeEmblems);

    console.log('Data fetched. Sorting data.')
    // Convert the data object into an array of [factionName, factionData] pairs so we can sort it
    const factionsArray = Object.entries(mergedData);
    // Sort the array based on the predefined order
    const sortedFactionsArray = factionsArray.sort(([keyA], [keyB]) => {
      const indexA = factionOrder.indexOf(keyA) !== -1 ? factionOrder.indexOf(keyA) : Infinity;
      const indexB = factionOrder.indexOf(keyB) !== -1 ? factionOrder.indexOf(keyB) : Infinity;
      return indexA - indexB;
    });
    // Convert the sorted array back into an object
    const sortedData = Object.fromEntries(sortedFactionsArray);


    // Update the user's data in the database
   const userData = await UserData.findOne({ userId: req.auth.userId })
   if (!userData) {
    return res.status(404).json({ message: 'Your local data was not found' })
  }

  // Updating the data!
  userData.sotData = sortedData
  userData.lastUpdated = new Date().toISOString()
  // TODO - CHANGES SINCE LAST UPDATED

  await userData.save()


  // Send the SORTED data back to the client
  res.status(201).json({ message: 'Data updated successfully!' })

  } catch (err) {
    if (err.type == 'InvalidRatToken') {
      res.status(401).json({ error: err.message})
    } else if (err.type == 'FetchError') {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: "An unknown error occured." })
    }
  }
}

module.exports = { emblemUpdate }