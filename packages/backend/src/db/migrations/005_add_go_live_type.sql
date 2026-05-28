ALTER TABLE releases
  ADD COLUMN IF NOT EXISTS go_live_type VARCHAR(10) NOT NULL DEFAULT 'single'
    CHECK (go_live_type IN ('single', 'multiple'));
