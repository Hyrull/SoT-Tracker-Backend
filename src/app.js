const express = require('express')
const emblemRoutes = require('./routes/emblemRoutes')

const app = express()

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

module.exports = app