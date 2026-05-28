import { Router } from 'express'
import * as ctrl from '../controllers/settings.controller'

export const settingsRouter = Router()

settingsRouter.get('/', ctrl.getAll)
settingsRouter.put('/', ctrl.update)
