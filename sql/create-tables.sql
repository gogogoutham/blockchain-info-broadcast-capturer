CREATE TABLE tx (
    id BIGSERIAL,
    hash CHAR(64),
    tx_index BIGINT,
    relayed_by VARCHAR(50),
    posted_time TIMESTAMP WITH TIME ZONE,
    receipt_time TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY(id));

CREATE INDEX ON tx (hash);
CREATE INDEX ON tx (tx_index);
CREATE INDEX ON tx (posted_time);
CREATE INDEX ON tx (receipt_time);

CREATE TABLE block (
    id BIGSERIAL,
    hash CHAR(64),
    mrkl_root CHAR(64),
    height BIGINT,
    block_index BIGINT,
    prev_block_index BIGINT,
    posted_time TIMESTAMP WITH TIME ZONE,
    receipt_time TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY(id));

CREATE INDEX ON block (hash);
CREATE INDEX ON block (block_index);
CREATE INDEX ON block (posted_time);
CREATE INDEX ON block (receipt_time);