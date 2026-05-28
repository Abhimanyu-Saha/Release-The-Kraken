ALTER TABLE release_content
  ADD COLUMN IF NOT EXISTS chip VARCHAR(20) CHECK (chip IN ('feature', 'update', 'fix', NULL));
