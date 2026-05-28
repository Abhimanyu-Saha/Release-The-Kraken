import { Router } from 'express'
import * as ctrl from '../controllers/releases.controller'

export const releasesRouter = Router()

releasesRouter.get('/', ctrl.list)
releasesRouter.post('/', ctrl.create)
releasesRouter.get('/:id', ctrl.getOne)
releasesRouter.put('/:id', ctrl.update)
releasesRouter.post('/:id/submit', ctrl.submit)
releasesRouter.post('/:id/approve', ctrl.approve)
releasesRouter.post('/:id/reject', ctrl.reject)
releasesRouter.post('/:id/publish', ctrl.publish)
releasesRouter.post('/:id/archive', ctrl.archive)
releasesRouter.delete('/:id', ctrl.remove)
