import { Router } from 'express'
import * as ctrl from '../controllers/runtime.controller'

export const runtimeRouter = Router()

runtimeRouter.get('/active-release', ctrl.getActive)
runtimeRouter.post('/release/:id/acknowledge', ctrl.acknowledge)
runtimeRouter.post('/release/:id/dismiss', ctrl.dismiss)
