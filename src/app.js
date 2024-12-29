require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const emblemRoutes = require('./routes/emblemRoutes')
const userRoutes = require('./routes/user')

const app = express()

mongoose.connect(process.env.MONGODB_LOGIN)
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.log('Connection to MongoDB failed! Error: ', err))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use((req, res, next) => {
  console.log('Request received')
  next()
})

// ROUTES
app.use('/api/emblems', emblemRoutes)
app.use('/api/auth', userRoutes)

module.exports = app