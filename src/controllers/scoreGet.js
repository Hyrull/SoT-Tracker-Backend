import { logger } from '../lib/logger.js'
import UserData from '../models/userData.js'

export const scoreGet = async (req, res) => {
  const userId = req.auth.userId
  const username = req.auth.nickname
  
  try {
    const userData = await UserData.findOne({ userId })
    
    if (!userData) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }
    
    // If no data yet, return zeros
    if (!userData.sotData || Object.keys(userData.sotData).length === 0) {
      return res.status(200).json({
        username: username,
        success: true,
        currentScore: 0,
        maximumScore: 0,
        percentage: 0
      })
    }

    // if no score calculated, init it
    if (!userData.score) {
      userData.score = { current: 0, maximum: 0 }
      await userData.save
    }
    
    // Return the pre-calculated score
    const currentScore = userData.score.current || 0
    const maximumScore = userData.score.maximum || 0
    const percentage = maximumScore > 0 
      ? ((currentScore / maximumScore) * 100).toFixed(2) 
      : 0
    
    return res.json({
      username: username,
      success: true,
      currentScore,
      maximumScore,
      percentage
    })
    
  } catch (error) {
    logger.error('Error fetching score:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch score'
    })
  }
}