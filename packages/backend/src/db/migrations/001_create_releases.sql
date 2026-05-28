CREATE TABLE IF NOT EXISTS releases (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(500) NOT NULL,
  template     VARCHAR(10) NOT NULL CHECK (template IN ('A', 'B', 'C')),
  status       VARCHAR(30) NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')),
  priority     SMALLINT NOT NULL DEFAULT 3 CHECK (priority IN (1, 2, 3)),
  submitted_at TIMESTAMPTZ,
  approved_at  TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  archived_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
