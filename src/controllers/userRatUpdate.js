import { logger } from "../lib/logger.js"
import { encrypt } from "../lib/crypto.js"
import User from "../models/user.js"

export const userRatUpdate = async (req, res) => {

  const ratToken = req.body.ratToken

  if (!ratToken) {
    return res.status(400).json({ message: "No 'ratToken' entered." })
  }

  const encryptedRat = encrypt(ratToken)

  try {
    // Fetch the user from the database
    const user = await User.findById(req.auth.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update the user's ratToken
    user.ratToken = encryptedRat
    await user.save()
    logger.success("RAT Token successfully updated!")
    return res.status(201).json({ message: 'Rat token updated successfully' })
  } catch (err) {
    logger.error("Couldn't update the rat - ", err)
    res.status(500).json({ message: 'Error updating rat token' })
  }
}