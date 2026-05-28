import { Request, Response } from 'express'
import * as service from '../services/settings.service'

export async function getAll(_req: Request, res: Response) {
  const settings = await service.getAllSettings()
  res.json({
    sidebar_enabled: settings['sidebar_enabled'] !== 'false',
  })
}

export async function update(req: Request, res: Response) {
  const { sidebar_enabled } = req.body
  if (typeof sidebar_enabled !== 'boolean') {
    res.status(400).json({ error: 'sidebar_enabled must be a boolean' })
    return
  }
  await service.setSetting('sidebar_enabled', String(sidebar_enabled))
  res.json({ sidebar_enabled })
}
