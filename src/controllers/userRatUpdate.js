const User = require('../models/user')

const userRatUpdate = async (req, res) => {

  const ratToken = req.body.ratToken

  if (!ratToken) {
    return res.status(400).json({ message: "No 'ratToken' entered." })
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(req.auth.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update the user's ratToken
    user.ratToken = ratToken
    await user.save()
    return res.status(201).json({ message: 'Rat token updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating rat token' })
  }
}

module.exports = { userRatUpdate }