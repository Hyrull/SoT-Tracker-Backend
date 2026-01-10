import 'dotenv/config'
import express, { json } from 'express'
import { connect } from 'mongoose'
import { logger } from './lib/logger.js'
import dataRoutes from './routes/dataRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

connect(process.env.MONGODB_LOGIN)
.then(() => logger.success('Connected to MongoDB!'))
.catch((err) => logger.error('Connection to MongoDB failed! Error: ', err))

app.use(json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// ROUTES
app.use('/api/data', dataRoutes)
app.use('/api/auth', userRoutes)

// HEALTH CHECK PING | doesn't deserve its own route/controller just for this
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

export default app