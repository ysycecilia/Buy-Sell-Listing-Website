DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  price INTEGER NOT NULL DEFAULT 0,
  quantity INTEGER,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  status VARCHAR(255) CHECK (status IN ('avaliable', 'pending', 'sold')),
  created_at DATE,
  cover_picture_url VARCHAR(255) NOT NULL
);
