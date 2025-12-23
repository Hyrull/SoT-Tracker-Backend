import { logger } from '../lib/logger.js'
import UserData from '../models/userData.js'

export const overviewDataGet = async (req, res) => {
  const userId = req.auth.userId
  try {
    const user = await UserData.findOne({ userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user.overview)
  
  } catch (error) {
    logger.error("Error fetching profile overview: ", error)
    res.status(500).json({ message: 'Error fetching your profile overview' })
  }
}