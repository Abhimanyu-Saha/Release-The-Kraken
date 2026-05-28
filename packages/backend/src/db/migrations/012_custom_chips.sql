-- Remove the enum constraint and widen the column so custom chip labels are allowed.
-- The column is kept so existing preset values (feature / update / fix) still work.
ALTER TABLE release_content
  DROP CONSTRAINT IF EXISTS release_content_chip_check;

ALTER TABLE release_content
  ALTER COLUMN chip TYPE VARCHAR(100);
