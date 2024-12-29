const { fetchReputationData } = require('../services/emblemFetch')

// Controller to fetch the reputation data

const emblemUpdate = async (req, res) => {
  const ratToken = req.query.ratToken

  if (!ratToken) {
    return res.status(400).json({ message: "Your 'rat' token is needed to perform this operation." })
  }

  try {
    const data = await fetchReputationData(ratToken)
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reputation data!' })
  }
}

module.exports = { emblemUpdate }