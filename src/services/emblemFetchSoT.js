const axios = require('axios')

const API_URL = 'https://www.seaofthieves.com/api/profilev2/reputation'

/**
 * Fetch reputation data from the API
 * @param {string} ratToken - The value for the "rat" cookie
 * @returns {Promise<object>} - The reputation data
 */

const fetchReputationData = async (ratToken) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Cookie: `rat=${ratToken}`,
        Referer: 'https://www.seaofthieves.com/'
      }
    })

    return response.data
  } catch (err) {
    console.error('Error fetching reputation data:', err)
    throw new Error('Error fetching reputation data')
  }
}

module.exports = { fetchReputationData }