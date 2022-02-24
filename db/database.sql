CREATE TABLE accounts(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_activated BOOLEAN DEFAULT false,
    activation_link VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tokens(
    user_id BIGINT REFERENCES accounts (id) ON DELETE CASCADE,
    token_value VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id, token_value)
);