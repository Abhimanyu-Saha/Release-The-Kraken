ALTER TABLE release_content
  ADD COLUMN IF NOT EXISTS ctas JSONB DEFAULT NULL;

-- Migrate any existing single-CTA data to the new array format
UPDATE release_content
SET ctas = jsonb_build_array(
             jsonb_build_object('label', cta_text, 'url', cta_url)
           )
WHERE cta_text IS NOT NULL
  AND cta_url  IS NOT NULL
  AND ctas     IS NULL;
