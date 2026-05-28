import { pool } from '../db/pool'

export async function getAllSettings(): Promise<Record<string, string>> {
  const res = await pool.query('SELECT key, value FROM settings')
  return Object.fromEntries(res.rows.map((r) => [r.key, r.value]))
}

export async function setSetting(key: string, value: string): Promise<void> {
  await pool.query(
    `INSERT INTO settings (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value]
  )
}
