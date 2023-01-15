ALTER TABLE media
ALTER COLUMN rating TYPE text USING rating::text;