import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (err as any).status ?? 500
  const message = err.message ?? 'Internal server error'
  if (status >= 500) console.error(err)
  res.status(status).json({ error: message })
}
