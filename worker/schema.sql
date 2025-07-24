-- members 表
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- transactions 表
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    note TEXT,
    paid_by INTEGER NOT NULL,
    participants TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- reserve_fund 表
CREATE TABLE IF NOT EXISTS reserve_fund (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
