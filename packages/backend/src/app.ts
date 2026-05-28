import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { config } from './config'
import { router } from './routes/index'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameSrc: ["'self'", 'https://www.youtube.com'],
      },
    },
  })
)
app.use(cors({ origin: config.corsOrigin }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

// Serve uploaded media files
app.use('/api/media/uploads', express.static(path.resolve(config.uploadDir)))

app.use(errorHandler)
