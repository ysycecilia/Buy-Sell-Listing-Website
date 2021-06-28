-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number TEXT,
  city VARCHAR(255) NOT NULL,
  post_code VARCHAR(255) NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 0,
  member_since DATE,
  avatar_url VARCHAR(255)
);
