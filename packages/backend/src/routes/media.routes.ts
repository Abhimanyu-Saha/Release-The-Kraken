import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { config } from '../config'
import { upload as uploadCtrl } from '../controllers/media.controller'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => cb(null, `tmp_${Date.now()}_${file.originalname}`),
})

const uploader = multer({
  storage,
  limits: { fileSize: config.maxImageSizeMb * 1024 * 1024 + 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/json']
    const ext = path.extname(file.originalname).toLowerCase()
    // Allow image mimes, application/json (Lottie .json), and .lottie extension (dotLottie, any mime)
    const ok = allowedMimes.includes(file.mimetype) || ext === '.lottie'
    cb(null, ok)
  },
})

export const mediaRouter = Router()

mediaRouter.post('/upload', uploader.single('file'), uploadCtrl)
