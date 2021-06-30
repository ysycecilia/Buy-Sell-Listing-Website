DROP TABLE IF EXISTS favourites CASCADE;
CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  unique (listing_id, user_id)
);
