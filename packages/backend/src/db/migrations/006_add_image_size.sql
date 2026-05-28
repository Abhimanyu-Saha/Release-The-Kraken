ALTER TABLE releases
  ADD COLUMN IF NOT EXISTS image_size VARCHAR(10)
    CHECK (image_size IN ('small', 'medium', 'large'));
