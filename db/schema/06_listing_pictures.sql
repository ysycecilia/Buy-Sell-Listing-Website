DROP TABLE IF EXISTS listing_pictures CASCADE;
CREATE TABLE listing_pictures (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  description TEXT,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  is_cover_photo BOOLEAN DEFAULT FALSE,
  photo_url VARCHAR(255) NOT NULL
);
