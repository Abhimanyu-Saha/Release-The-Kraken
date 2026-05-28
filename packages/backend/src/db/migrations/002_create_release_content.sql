CREATE TABLE IF NOT EXISTS release_content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id  UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  heading     VARCHAR(500) NOT NULL,
  body        TEXT,
  bullet_list JSONB,
  media_url   TEXT,
  media_type  VARCHAR(10) CHECK (media_type IN ('image', 'youtube', NULL)),
  cta_text    VARCHAR(200),
  cta_url     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT release_content_release_id_unique UNIQUE (release_id)
);
