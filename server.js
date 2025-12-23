import { createServer } from 'http'
import app from './src/app.js'
import { logger } from './src/lib/logger.js'

app.set('port', process.env.PORT || 10000)
const server = createServer(app)


server.listen(process.env.PORT || 10000, '0.0.0.0', () => {
  logger.success('Server is up!')
})