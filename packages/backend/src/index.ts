import { app } from './app'
import { config } from './config'
import { pool } from './db/pool'
import { runMigrations } from './db/migrate'

async function start() {
  await pool.query('SELECT 1')
  console.log('Database connected.')

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`)
  })

  await runMigrations(pool)
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
