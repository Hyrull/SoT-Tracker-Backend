const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add the decoded user ID to the request object for future use
    req.auth = { userId: decoded.userId }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' })
  }
}