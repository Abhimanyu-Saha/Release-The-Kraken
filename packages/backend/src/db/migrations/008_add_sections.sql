ALTER TABLE release_content
  ADD COLUMN IF NOT EXISTS sections JSONB;
