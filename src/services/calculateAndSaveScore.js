const SCORE_LEVELS = {
  0: 0,
  1: 5,
  2: 10,
  3: 25,
  4: 50,
  5: 75,
  6: 100
}

const calculateEmblemScore = (emblem) => {
  const scoreLevel = emblem['scoreLevel']
  if (!scoreLevel || !SCORE_LEVELS[scoreLevel]) {
    return { current: 0, maximum: 0 }
  }
  
  const Grade = emblem.Grade || 0
  const maxGrade = emblem.MaxGrade || emblem.reward_graded?.length || 0
  const pointsPerGrade = SCORE_LEVELS[scoreLevel]
  
  let completedGrades = 0
  
  // Non-graded emblems: MaxGrade is always one but even when completed=true, Grade stays at 0. So we really just look at maxGrade for the multiplier
  // points only when Completed = true
  if (maxGrade === 1) {
    completedGrades = emblem.Completed ? 1 : 0
  }
    // Specific Rare issue here. emblem.Grade actually is the one being worked TOWARDS. Meaning if it's 4, you completed 3
    // except if you completed the max grade e.g. 5, emblem.Grade will remain at 5.
    // meaning we have to do -1 on the current Grade to get which one you completed, except if you completed the whole emblem
  else {
    // If we're at max grade AND completed, count all grades
    if (Grade === maxGrade && emblem.Completed) {
      completedGrades = maxGrade
    } 
    // Otherwise, Grade is what we're working towards, so we take Grade - 1
    else {
      completedGrades = Math.max(Grade - 1, 0)
    }
  }
  
  return {
    current: pointsPerGrade * completedGrades,
    maximum: pointsPerGrade * maxGrade
  }
}

// general function for how to calculate the score for normal factions
const processFactionEmblems = (emblems) => {
  let currentScore = 0
  let maximumScore = 0
  
  if (!emblems || !Array.isArray(emblems)) {
    return { currentScore, maximumScore }
  }
  
  for (const emblem of emblems) {
    const { current, maximum } = calculateEmblemScore(emblem)
    currentScore += current
    maximumScore += maximum
  }
  
  return { currentScore, maximumScore }
}

// Same, but for nested campaigns
const processCampaignEmblems = (campaigns) => {
  let currentScore = 0
  let maximumScore = 0
  
  // supposedly typeof campaigns can never be anything else than an object. but who knows with Rare
  if (!campaigns || typeof campaigns !== 'object') {
    return { currentScore, maximumScore }
  }
  
  for (const campaignKey in campaigns) {
    const campaign = campaigns[campaignKey]
    
    if (campaign.Emblems && Array.isArray(campaign.Emblems)) {
      const result = processFactionEmblems(campaign.Emblems)
      currentScore += result.currentScore
      maximumScore += result.maximumScore
    }
  }
  
  return { currentScore, maximumScore }
}

// Main function calling the right above function depending on the structure etc
const calculateScore = (factionData) => {
  let currentScore = 0
  let maximumScore = 0
  
  // browse factions
  for (const factionKey in factionData) {
    const faction = factionData[factionKey]
    
    // handling if it has a "compaign" sturcture (hunters, tall tales, bilge rats)
    if (faction.Campaigns) {
      const result = processCampaignEmblems(faction.Campaigns)
      currentScore += result.currentScore
      maximumScore += result.maximumScore
    }
    // Standard Emblems structure
    else if (faction.Emblems && faction.Emblems.Emblems) {
      const result = processFactionEmblems(faction.Emblems.Emblems)
      currentScore += result.currentScore
      maximumScore += result.maximumScore
    }
  }
  
  return { currentScore, maximumScore }
}

const calculateAndSaveScore = async (userData) => {
  if (!userData.sotData) {
    userData.score = { current: 0, maximum: 0 }
    return
  }
  
  // Convert Map to plain object
  const factionData = userData.sotData instanceof Map 
    ? Object.fromEntries(userData.sotData) 
    : userData.sotData
  
  const { currentScore, maximumScore } = calculateScore(factionData)
  
  userData.score = {
    current: currentScore,
    maximum: maximumScore
  }
}

module.exports = { calculateAndSaveScore }