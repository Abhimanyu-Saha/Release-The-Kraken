import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config'

const ALLOWED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])

const LOTTIE_EXTS = new Set(['.json', '.lottie'])

const MAX_BYTES = config.maxImageSizeMb * 1024 * 1024

function badRequest(message: string) {
  const err = new Error(message) as any
  err.status = 400
  return err
}

export function validateAndSaveMedia(
  file: Express.Multer.File
): { url: string; media_type: 'image' | 'lottie' } {
  const ext = path.extname(file.originalname).toLowerCase()
  const isLottie = LOTTIE_EXTS.has(ext)
  const isImage = ALLOWED_IMAGE_MIMES.has(file.mimetype)

  if (!isLottie && !isImage) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    throw badRequest(
      `Unsupported file type: ${file.mimetype}. Allowed: png, jpg, webp, gif, json (Lottie), lottie`
    )
  }

  if (file.size > MAX_BYTES) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    throw badRequest(`File too large. Maximum size is ${config.maxImageSizeMb}MB`)
  }

  const filename = `${uuidv4()}${ext}`
  const finalPath = path.join(config.uploadDir, filename)
  fs.renameSync(file.path, finalPath)

  return {
    url: `/api/media/uploads/${filename}`,
    media_type: isLottie ? 'lottie' : 'image',
  }
}

// Backward-compat alias
export const validateAndSaveImage = validateAndSaveMedia
