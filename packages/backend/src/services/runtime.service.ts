import { pool } from '../db/pool'
import { ActiveReleaseItem } from '@release-hub/shared'

export async function getActiveReleases(clientId: string): Promise<ActiveReleaseItem[]> {
  const res = await pool.query(
    `SELECT
       r.id, r.title, r.template, r.go_live_type, r.image_size, r.published_at,
       r.submitted_at, r.approved_at, r.archived_at, r.created_at, r.updated_at,
       r.status,
       rc.heading, rc.body, rc.bullet_list, rc.media_url, rc.media_type,
       rc.cta_text, rc.cta_url, rc.chip, rc.sections, rc.ctas,
       COALESCE(ra.acknowledged, FALSE) AS acknowledged,
       COALESCE(ra.dismissed_count, 0)  AS dismissed_count
     FROM releases r
     JOIN release_content rc ON rc.release_id = r.id
     LEFT JOIN release_acknowledgements ra
       ON ra.release_id = r.id AND ra.client_id = $1
     WHERE r.status = 'published'
       AND (ra.acknowledged IS NULL OR ra.acknowledged = FALSE)
       AND COALESCE(ra.dismissed_count, 0) < 2
     ORDER BY r.published_at DESC`,
    [clientId]
  )

  return res.rows.map((row) => ({
    id: row.id,
    title: row.title,
    template: row.template,
    go_live_type: row.go_live_type,
    image_size: row.image_size ?? null,
    status: row.status,
    submitted_at: row.submitted_at ?? null,
    approved_at: row.approved_at ?? null,
    published_at: row.published_at ?? null,
    archived_at: row.archived_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    acknowledged: row.acknowledged,
    dismissed_count: Number(row.dismissed_count),
    content: {
      heading: row.heading,
      body: row.body ?? null,
      bullet_list: row.bullet_list ?? null,
      media_url: row.media_url ?? null,
      media_type: row.media_type ?? null,
      ctas: row.ctas ?? (
        row.cta_text && row.cta_url
          ? [{ label: row.cta_text, url: row.cta_url }]
          : null
      ),
      chip: row.chip ?? null,
      sections: row.sections ?? null,
    },
  }))
}

export async function acknowledgeRelease(clientId: string, releaseId: string): Promise<void> {
  await pool.query(
    `INSERT INTO release_acknowledgements (client_id, release_id, acknowledged, last_seen_at)
     VALUES ($1, $2, TRUE, NOW())
     ON CONFLICT (client_id, release_id) DO UPDATE
       SET acknowledged = TRUE, last_seen_at = NOW(), updated_at = NOW()`,
    [clientId, releaseId]
  )
}

export async function dismissRelease(
  clientId: string,
  releaseId: string
): Promise<{ dismissed_count: number }> {
  const res = await pool.query(
    `INSERT INTO release_acknowledgements (client_id, release_id, dismissed_count, last_seen_at)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (client_id, release_id) DO UPDATE
       SET dismissed_count = release_acknowledgements.dismissed_count + 1,
           last_seen_at = NOW(),
           updated_at = NOW()
     RETURNING dismissed_count`,
    [clientId, releaseId]
  )
  return { dismissed_count: Number(res.rows[0].dismissed_count) }
}
