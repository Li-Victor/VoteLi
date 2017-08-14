CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    displayName TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
