const express = require('express')

const app = express()

app.use((req, res, next) => {
  res.json({ message: 'Your request was successful!' })
  console.log('Request received')
  next()
})

module.exports = app