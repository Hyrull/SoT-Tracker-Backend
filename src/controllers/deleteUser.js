import { compare } from 'bcrypt'
import User from '../models/user.js'
import UserData from '../models/userData.js'
import { logger } from '../lib/logger.js'

export const deleteUser = async (req, res) => {

  
  try {
    const deletingUserProfile = await User.findById(req.auth.userId)

    if (!deletingUserProfile) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'You must enter a password for this operation.' });
    }

    const validPassword = await compare(req.body.password, deletingUserProfile.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password!' })
    }


    const deletingUserData = await UserData.findOne({ userId: req.auth.userId })

    if (!deletingUserData) {
      return res.status(404).json({ message: 'User data not found' })
    }

    await deletingUserProfile.deleteOne()
    await deletingUserData.deleteOne()

    res.status(200).json({ message: 'User and user data successfully deleted.' })

  } catch (error) {
    logger.error("Couldn't delete user account: ", error)
    res.status(500).json({ message: `Error deleting user's data: ${error}` })
  }
}