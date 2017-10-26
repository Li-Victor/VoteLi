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
    FOREIGN KEY (pollid) REFERENCES poll(pollid) ON DELETE CASCADE
);

CREATE TABLE choices (
    choicesid SERIAL NOT NULL PRIMARY KEY,
    pollid SERIAL NOT NULL,
    option TEXT NOT NULL,
    votes INT NOT NULL DEFAULT 0,
    FOREIGN KEY (pollid) REFERENCES poll(pollid) ON DELETE CASCADE
);
