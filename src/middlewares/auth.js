import jwt from 'jsonwebtoken'
const { verify } = jwt

export default (req, res, next) => {
  try {

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]
    const decoded = verify(token, process.env.JWT_SECRET)

    req.auth = { 
      userId: decoded.userId,
      nickname: decoded.nickname
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Authentification failed' })
  }
}