CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    displayName TEXT NOT NULL
);

CREATE TABLE poll (
    pollid SERIAL NOT NULL PRIMARY KEY,
    userid BIGSERIAL NOT NULL,
    topic TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE log (
    logid SERIAL NOT NULL PRIMARY KEY,
    pollid SERIAL NOT NULL,
    userip TEXT NOT NULL,
    userid TEXT,
    FOREIGN KEY (pollid) REFERENCES poll(pollid) ON DELETE CASCADE
);

CREATE TABLE choices (
    choicesid SERIAL NOT NULL PRIMARY KEY,
    pollid SERIAL NOT NULL,
    option TEXT NOT NULL,
    votes INT NOT NULL DEFAULT 0,
    FOREIGN KEY (pollid) REFERENCES poll(pollid) ON DELETE CASCADE
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
