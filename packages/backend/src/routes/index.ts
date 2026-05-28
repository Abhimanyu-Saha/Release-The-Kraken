import { Router } from 'express'
import { releasesRouter } from './releases.routes'
import { runtimeRouter } from './runtime.routes'
import { mediaRouter } from './media.routes'
import { settingsRouter } from './settings.routes'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/releases', releasesRouter)
router.use('/runtime', runtimeRouter)
router.use('/media', mediaRouter)
router.use('/settings', settingsRouter)
