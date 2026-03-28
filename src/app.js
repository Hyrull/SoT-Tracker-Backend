import 'dotenv/config'
import express, { json } from 'express'
import cors from 'cors'
import { connect } from 'mongoose'
import { logger } from './lib/logger.js'
import dataRoutes from './routes/dataRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

connect(process.env.MONGODB_LOGIN)
.then(() => logger.success('Connected to MongoDB!'))
.catch((err) => logger.error('Connection to MongoDB failed! Error: ', err))

app.use(json())

+app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'https://sot-tracker.com',
    'http://sot-tracker.com'
  ].filter(Boolean)
}))

// ROUTES
app.use('/api/data', dataRoutes)
app.use('/api/auth', userRoutes)

// HEALTH CHECK PING
app.get('/api/health', (req, res) => {
  res.status(200).send('OK')
})

export default app