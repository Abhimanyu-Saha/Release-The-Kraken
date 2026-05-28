import { Request, Response } from 'express'
import * as service from '../services/releases.service'

export async function create(req: Request, res: Response) {
  const release = await service.createRelease(req.body)
  res.status(201).json(release)
}

export async function list(_req: Request, res: Response) {
  const releases = await service.listReleases()
  res.json({ releases })
}

export async function getOne(req: Request, res: Response) {
  const release = await service.getReleaseById(req.params.id as string)
  res.json(release)
}

export async function update(req: Request, res: Response) {
  const release = await service.updateRelease(req.params.id as string, req.body)
  res.json(release)
}

export async function submit(req: Request, res: Response) {
  const release = await service.submitRelease(req.params.id as string)
  res.json(release)
}

export async function approve(req: Request, res: Response) {
  const release = await service.approveRelease(req.params.id as string)
  res.json(release)
}

export async function reject(req: Request, res: Response) {
  const release = await service.rejectRelease(req.params.id as string)
  res.json(release)
}

export async function publish(req: Request, res: Response) {
  const release = await service.publishRelease(req.params.id as string)
  res.json(release)
}

export async function archive(req: Request, res: Response) {
  const release = await service.archiveRelease(req.params.id as string)
  res.json(release)
}

export async function remove(req: Request, res: Response) {
  await service.deleteRelease(req.params.id as string)
  res.status(204).end()
}
