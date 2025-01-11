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
      },
      maxRedirects: 0,
    })

    return response.data
  } catch (err) {
    if (err.response && err.response.status === 302 && err.response.headers.location?.includes('/logout')
    ) {
      console.error('Redirect loop detected! Out of dtae rat token: ', err)
      throw { type: 'InvalidRatToken', message: 'Invalid rat token, please update it.' }
      } else {
      console.error('Error fetching reputation data:', err)
      throw { type: 'FetchError', message: 'Error fetching reputation data.' }
    }
  }
}

module.exports = { fetchReputationData }