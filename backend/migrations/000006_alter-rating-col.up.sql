ALTER TABLE media
ALTER COLUMN rating TYPE decimal(3,1) USING rating::decimal;