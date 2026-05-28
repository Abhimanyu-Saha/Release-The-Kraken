-- Remove the NOT NULL constraint on priority.
-- Priority has been removed from the product UI; the column is kept for
-- historical data but is no longer written by the application.
ALTER TABLE releases
  ALTER COLUMN priority DROP NOT NULL;
