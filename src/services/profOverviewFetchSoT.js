const axios = require('axios')

const API_URL = 'https://www.seaofthieves.com/api/profilev2/overview'

/**
 * Fetch reputation data from the API
 * @param {string} ratToken - The value for the "rat" cookie
 * @returns {Promise<object>} - The reputation data
 */

const fetchOverviewData = async (ratToken) => {
  console.log('Fetching profile overview data...')
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Cookie': `rat=${ratToken}`,
        'Referer': 'https://www.seaofthieves.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://www.seaofthieves.com/',
        'Connection': 'keep-alive'
      },
      maxRedirects: 0,
    })

    return response.data
  } catch (err) {
    if (err.response && err.response.status === 302 && err.response.headers.location?.includes('/logout')
    ) {
      console.error('Redirect loop detected! Out of date rat token: ', err)
      throw { type: 'InvalidRatToken', message: 'Invalid rat token, please update it.' }
      } else {
      console.error('Error fetching reputation data:', err)
      throw { type: 'FetchError', message: 'Error fetching profile overview data.' }
    }
  }
}

module.exports = { fetchOverviewData }