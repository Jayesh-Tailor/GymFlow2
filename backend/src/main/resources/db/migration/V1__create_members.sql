CREATE TABLE members (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(24) NOT NULL,
    plan VARCHAR(32) NOT NULL,
    joined_at DATE NOT NULL,
    expires_at DATE NOT NULL
);

CREATE INDEX idx_members_gym_joined_id
    ON members (gym_id, joined_at DESC, id ASC);
