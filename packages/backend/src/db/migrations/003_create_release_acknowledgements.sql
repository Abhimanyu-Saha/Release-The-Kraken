CREATE TABLE IF NOT EXISTS release_acknowledgements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       VARCHAR(255) NOT NULL,
  release_id      UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  acknowledged    BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed_count SMALLINT NOT NULL DEFAULT 0,
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT release_acknowledgements_client_release_unique UNIQUE (client_id, release_id)
);
