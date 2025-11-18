const UserData = require('../../models/userData')

// fetching pins
exports.getPinned = async (req, res) => {
  try {
    const user = await UserData.findOne({ userId: req.auth.userId })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // for existing users where pinned doesn't exist yet
    if (!user.pinned) {
      user.pinned = []
      await user.save()
    }

    // Pinned section found but it's empty.
    if (user.pinned.length === 0) {
      return res.status(204).send() // No content
    }
    
    res.status(200).json({ pinned: user.pinned })
  } catch (error) {
    console.error('Error fetching pinned:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}






exports.addPinned = async (req, res) => {
  try {
    const { faction, emblem, campaign } = req.body

    // Checking the req has all the required fields
    if (!faction || !emblem) {
      return res.status(400).json({ 
          error: 'Missing required fields!' 
      })
    }
    const user = await UserData.findOne({ userId: req.auth.userId })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Creating the pinned section if there's none
    if (!user.pinned) {
      user.pinned = []
    }
    
    const exists = user.pinned.some(p =>
      p.faction === faction &&
      p.emblem === emblem &&
      p.campaign === campaign
    )

    if (exists) {
      return res.status(409).json({ 
        error: 'This commendation is already pinned',
        pinned: user.pinned 
      })
    }

    user.pinned.push({ faction, emblem, campaign })
    await user.save()
    
    
    // 201 = Created
    res.status(201).json({ 
      message: 'Commendation pinned successfully',
      pinned: user.pinned 
    })
  } catch(error) {
    console.error('Error adding pinned:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}




exports.removePinned = async (req, res) => {
  try {
    const { faction, emblem, campaign } = req.body

    // Validate required fields - now requires the name
    if (!emblem) {
      return res.status(400).json({ 
        error: 'Missing required field: emblem is required' 
      })
    }

    const user = await UserData.findOne({ userId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // failproof if user has no pinned section (even if empty)
    if (!user.pinned) {
      user.pinned = []
    }

    // this'll come in handy - we'll check the before/after length to verify
    const initialLength = user.pinned.length

    // If faction/campaign provided, match exactly (backward compatibility)
    // Otherwise, match only by emblem name
    if (faction) {
      user.pinned = user.pinned.filter(p =>
        !(p.faction === faction &&
          p.emblem === emblem &&
          p.campaign === campaign)
      )
    } else {
      // Match only by emblem name
      user.pinned = user.pinned.filter(p => p.emblem !== emblem)
    }

    // Check if anything was actually removed
    if (user.pinned.length === initialLength) {
          // 404: Not found - item didn't exist
      return res.status(404).json({ 
        error: 'Pinned commendation not found',
        pinned: user.pinned 
      })
    }

    await user.save()

    res.status(200).json({ 
      message: 'Commendation unpinned successfully',
      pinned: user.pinned 
    })
    } catch(error) {
      console.error("Error removing pinned: " + error)
    res.status(500).json({ error: 'Internal server error' })
  }
}