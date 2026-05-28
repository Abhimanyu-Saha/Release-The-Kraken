import { pool } from '../db/pool'
import { ReleasePayload, ReleaseStatus, ReleaseWithContent } from '@release-hub/shared'

function conflict(message: string) {
  const err = new Error(message) as any
  err.status = 409
  return err
}

function notFound(message: string) {
  const err = new Error(message) as any
  err.status = 404
  return err
}

export async function createRelease(payload: ReleasePayload): Promise<ReleaseWithContent> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const releaseRes = await client.query(
      `INSERT INTO releases (title, template, go_live_type, image_size)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [payload.title, payload.template, payload.go_live_type, payload.image_size ?? null]
    )
    const release = releaseRes.rows[0]

    const contentRes = await client.query(
      `INSERT INTO release_content
         (release_id, heading, body, bullet_list, media_url, media_type, chip, sections, ctas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        release.id,
        payload.heading,
        payload.body ?? null,
        payload.bullet_list ? JSON.stringify(payload.bullet_list) : null,
        payload.media_url ?? null,
        payload.media_type ?? null,
        payload.chip ?? null,
        payload.sections ? JSON.stringify(payload.sections) : null,
        payload.ctas ? JSON.stringify(payload.ctas) : null,
      ]
    )
    const content = contentRes.rows[0]

    await client.query('COMMIT')
    return formatReleaseWithContent(release, content)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function updateRelease(
  id: string,
  payload: Partial<ReleasePayload>
): Promise<ReleaseWithContent> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const releaseRes = await client.query(
      `UPDATE releases
       SET title = COALESCE($1, title),
           template = COALESCE($2, template),
           go_live_type = COALESCE($3, go_live_type),
           image_size = COALESCE($4, image_size),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [payload.title ?? null, payload.template ?? null, payload.go_live_type ?? null, payload.image_size ?? null, id]
    )
    if (releaseRes.rows.length === 0) throw notFound('Release not found')
    const release = releaseRes.rows[0]

    const contentRes = await client.query(
      `UPDATE release_content
       SET heading     = COALESCE($1, heading),
           body        = $2,
           bullet_list = $3,
           media_url   = $4,
           media_type  = $5,
           chip        = $6,
           sections    = $7,
           ctas        = $8,
           updated_at  = NOW()
       WHERE release_id = $9
       RETURNING *`,
      [
        payload.heading ?? null,
        payload.body ?? null,
        payload.bullet_list ? JSON.stringify(payload.bullet_list) : null,
        payload.media_url ?? null,
        payload.media_type ?? null,
        payload.chip ?? null,
        payload.sections !== undefined ? JSON.stringify(payload.sections) : null,
        payload.ctas !== undefined ? JSON.stringify(payload.ctas) : null,
        id,
      ]
    )
    const content = contentRes.rows[0]

    await client.query('COMMIT')
    return formatReleaseWithContent(release, content)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function listReleases(): Promise<ReleaseWithContent[]> {
  const res = await pool.query(
    `SELECT r.*, rc.heading, rc.body, rc.bullet_list, rc.media_url, rc.media_type,
            rc.cta_text, rc.cta_url, rc.chip, rc.sections, rc.ctas
     FROM releases r
     LEFT JOIN release_content rc ON rc.release_id = r.id
     ORDER BY r.created_at DESC`
  )
  return res.rows.map((row) => formatReleaseWithContent(row, row))
}

export async function getReleaseById(id: string): Promise<ReleaseWithContent> {
  const res = await pool.query(
    `SELECT r.*, rc.heading, rc.body, rc.bullet_list, rc.media_url, rc.media_type,
            rc.cta_text, rc.cta_url, rc.chip, rc.sections, rc.ctas
     FROM releases r
     LEFT JOIN release_content rc ON rc.release_id = r.id
     WHERE r.id = $1`,
    [id]
  )
  if (res.rows.length === 0) throw notFound('Release not found')
  const row = res.rows[0]
  return formatReleaseWithContent(row, row)
}

const VALID_TRANSITIONS: Record<ReleaseStatus, ReleaseStatus | null> = {
  draft: 'pending_approval',
  pending_approval: 'approved',
  approved: 'published',
  published: 'archived',
  archived: null,
}

async function transition(
  id: string,
  toStatus: ReleaseStatus,
  fromStatus: ReleaseStatus,
  extraFields: Record<string, any> = {}
): Promise<ReleaseWithContent> {
  const current = await getReleaseById(id)
  if (current.status !== fromStatus) {
    throw conflict(`Cannot transition from '${current.status}' to '${toStatus}'`)
  }

  const setClause = Object.keys(extraFields)
    .map((k, i) => `${k} = $${i + 3}`)
    .join(', ')
  const extraValues = Object.values(extraFields)

  const res = await pool.query(
    `UPDATE releases
     SET status = $1, updated_at = NOW() ${setClause ? ', ' + setClause : ''}
     WHERE id = $2
     RETURNING *`,
    [toStatus, id, ...extraValues]
  )
  return getReleaseById(res.rows[0].id)
}

export async function submitRelease(id: string) {
  return transition(id, 'pending_approval', 'draft', { submitted_at: 'NOW()' })
}

export async function approveRelease(id: string) {
  return transition(id, 'approved', 'pending_approval', { approved_at: 'NOW()' })
}

export async function rejectRelease(id: string) {
  // Send back to draft for rework
  const current = await getReleaseById(id)
  if (current.status !== 'pending_approval') {
    throw conflict(`Cannot reject a release with status '${current.status}'`)
  }
  const res = await pool.query(
    `UPDATE releases SET status = 'draft', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  )
  return getReleaseById(res.rows[0].id)
}

export async function publishRelease(id: string) {
  return transition(id, 'published', 'approved', { published_at: 'NOW()' })
}

export async function archiveRelease(id: string) {
  return transition(id, 'archived', 'published', { archived_at: 'NOW()' })
}

export async function deleteRelease(id: string): Promise<void> {
  const res = await pool.query(`DELETE FROM releases WHERE id = $1`, [id])
  if (res.rowCount === 0) throw notFound('Release not found')
}

function formatReleaseWithContent(release: any, content: any): ReleaseWithContent {
  return {
    id: release.id,
    title: release.title,
    template: release.template,
    go_live_type: release.go_live_type,
    image_size: release.image_size ?? null,
    status: release.status,
    submitted_at: release.submitted_at ?? null,
    approved_at: release.approved_at ?? null,
    published_at: release.published_at ?? null,
    archived_at: release.archived_at ?? null,
    created_at: release.created_at,
    updated_at: release.updated_at,
    content: {
      heading: content?.heading ?? '',
      body: content?.body ?? null,
      bullet_list: content?.bullet_list ?? null,
      media_url: content?.media_url ?? null,
      media_type: content?.media_type ?? null,
      // Prefer new ctas column; fall back to legacy cta_text/cta_url for old rows
      ctas: content?.ctas ?? (
        content?.cta_text && content?.cta_url
          ? [{ label: content.cta_text, url: content.cta_url }]
          : null
      ),
      chip: content?.chip ?? null,
      sections: content?.sections ?? null,
    },
  }
}
