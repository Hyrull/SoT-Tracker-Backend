const UserData = require('../models/userData.js')

const emblemListGet = async (req, res) => {
  const userId = req.auth.userId
  try {
    const user = await UserData.findOne({ userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.sotData || Object.keys(user.sotData).length === 0) {
      return res.status(204).end() // No content. Happens when a fresh account didn't import any data. frontend handles this
    }

    return res.status(200).json(user.sotData)
  
  } catch (error) {
    console.error('Error fetching commendations:', error)
    res.status(500).json({ message: 'Error fetching your commendations' })
  }
}

module.exports = { emblemListGet }