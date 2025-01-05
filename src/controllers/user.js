const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserData = require('../models/userData.js')

exports.signup = async (req, res) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/

  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).json({ message: 'Password must contain at least one capitalized character, one number and six characters.' })
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // Creating the user object
    const user = new User({
      nickname: req.body.nickname,
      email: req.body.email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    })

    const userData = new UserData({
      userId: user._id,
      lastUpdated: new Date().toISOString(),
    })

    await user.save();
    await userData.save()
    res.status(201).json({ message: 'User created!' });
    } catch (error) { 
      res.status(500).json({ error: error.message || 'Error creating user.' })
    }
  }
    



// LOGIN
exports.login = async (req, res) => {
  try {
    // Find user through email check
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ message: 'User not found!' })
    }    

    // Checking the password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect email and/or password!' });
    }

    // All good? Sending the token
    res.status(200).json({
      userId: user._id,
      token: jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '72h' }
      )
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
}