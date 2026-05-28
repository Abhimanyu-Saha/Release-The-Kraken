import { Request, Response } from 'express'
import * as service from '../services/runtime.service'
import * as settings from '../services/settings.service'

export async function getActive(req: Request, res: Response) {
  const clientId = req.query.clientId as string
  if (!clientId) {
    res.status(400).json({ error: 'clientId query param required' })
    return
  }
  const [releases, allSettings] = await Promise.all([
    service.getActiveReleases(clientId),
    settings.getAllSettings(),
  ])
  res.json({
    releases,
    sidebar_enabled: allSettings['sidebar_enabled'] !== 'false',
  })
}

export async function acknowledge(req: Request, res: Response) {
  const { clientId } = req.body
  if (!clientId) {
    res.status(400).json({ error: 'clientId required in body' })
    return
  }
  await service.acknowledgeRelease(clientId, req.params.id as string)
  res.json({ ok: true })
}

export async function dismiss(req: Request, res: Response) {
  const { clientId } = req.body
  if (!clientId) {
    res.status(400).json({ error: 'clientId required in body' })
    return
  }
  const result = await service.dismissRelease(clientId, req.params.id as string)
  res.json(result)
}
