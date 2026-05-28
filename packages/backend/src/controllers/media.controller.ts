import { Request, Response } from 'express'
import { validateAndSaveMedia } from '../services/media.service'

export async function upload(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' })
    return
  }
  const result = validateAndSaveMedia(req.file)
  res.json(result)
}
