const User = require('../models/user')
const UserData = require('../models/userData')

const { emblemUpdate } = require('../services/emblemUpdate')
const { ledgersUpdate } = require('../services/ledgersUpdate')
const { profOverviewUpdate } = require('../services/profOverviewUpdate')

const dataUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId)
    if (!user) return res.status(404).json({ message: 'Please log out and log in again.' })

    const ratToken = user.ratToken
    if (!ratToken) return res.status(400).json({ message: 'No RAT token found.' })


      // Calling the services to update it all
    const [commendations, ledgers, overview] = await Promise.all([
      emblemUpdate(ratToken),
      ledgersUpdate(ratToken),
      profOverviewUpdate(ratToken)
    ])

     // Get to the right user data
    const userData = await UserData.findOne({ userId: req.auth.userId })
    if (!userData) return res.status(404).json({ message: 'Your local data was not found' })

    // Updating commendations data
    userData.sotData = commendations

    // Failproof, in case the user has no ledgers or overview yet
    if (!userData.sotLedgers) userData.sotLedgers = new Map()
    if (!userData.overview) userData.overview = new Map()

    // Updating ledgers data
    for (const [faction, data] of Object.entries(ledgers)) {
      userData.sotLedgers.set(faction, data)
    }
    userData.lastUpdated = new Date().toISOString()

    // Updating overview data
    userData.overview = overview

    await userData.save()

    res.status(201).json({ message: 'Data updated successfully!' })
  } catch (err) {
    console.error('Error in dataUpdate:', err)
    if (err.type === 'InvalidRatToken') {
      res.status(401).json({ error: err.message })
    } else if (err.type === 'FetchError') {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' })
    }
  }
}

module.exports = { dataUpdate }
